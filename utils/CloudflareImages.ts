import { z } from "zod";

function cfResponse<T extends z.Schema>(resultSchema: T) {
  return z.object({
    errors: z
      .array(
        z.object({
          code: z.number().int(),
          message: z.string(),
        }),
      )
      .optional()
      .nullable(),
    messages: z
      .array(
        z.object({
          code: z.number().int(),
          message: z.string(),
        }),
      )
      .optional()
      .nullable(),
    result: resultSchema.optional().nullable(),
    success: z.boolean(),
    statusCode: z.number(),
  });
}

export const listImagesPaginatedInputSchema = z.object({
  continuationToken: z.string().optional(),
  perPage: z.number().int().optional(),
  sortOrder: z.string().optional(),
});

export type ListImagesPaginatedInput = z.infer<
  typeof listImagesPaginatedInputSchema
>;

export const listImagesPaginatedResultSchema = cfResponse(
  z.object({
    continuationToken: z.string().optional().nullable(),
    images: z.array(
      z.object({
        filename: z.string(),
        id: z.string(),
        meta: z.map(z.any(), z.any()).optional().nullable(),
        requireSignedURLs: z.boolean(),
        uploaded: z.string().datetime(),
        variants: z.array(z.string()),
      }),
    ),
  }),
);

export type ListImagesPaginatedResult = z.infer<
  typeof listImagesPaginatedResultSchema
>;

export default class CloudflareImages {
  accountID: string;
  authHeaders: Record<string, string>;

  constructor(opts?: {
    accountID?: string;
    apiToken?: string;
    email?: string;
  }) {
    if (opts === undefined) {
      opts = {};
    }
    this.accountID = opts.accountID ?? process.env.CLOUDFLARE_ACCOUNT_ID;
    if (!this.accountID) {
      throw new Error("No Cloudflare account ID provided");
    }
    const email = opts.email ?? process.env.CLOUDFLARE_EMAIL;
    const apiToken = opts.apiToken
      ?? process.env.CLOUDFLARE_API_TOKEN
      ?? process.env.CLOUDFLARE_API_KEY;
    if (!apiToken) {
      throw new Error("No Cloudflare API token provided");
    }
    if (email) {
      this.authHeaders = {
        "X-Auth-Email": email,
        "X-Auth-Key": apiToken,
      };
    } else {
      this.authHeaders = {
        Authorization: `Bearer ${apiToken}`,
      };
    }
  }

  async listImagesPaginated(
    params: ListImagesPaginatedInput = {},
  ): Promise<ListImagesPaginatedResult> {
    let queryParams = new URLSearchParams();
    if (params.continuationToken) {
      queryParams.set("continuation_token", params.continuationToken);
    }
    if (params.perPage) {
      queryParams.set("per_page", params.perPage.toString());
    }
    if (params.sortOrder) {
      queryParams.set("sort_order", params.sortOrder);
    }
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${this.accountID}/images/v2?${queryParams.toString()}`,
      {
        headers: this.authHeaders,
      },
    );
    const json = await response.json();
    json.statusCode = response.status;
    if (json.success === false) {
      if (Array.isArray(json.errors) && json.errors.length > 0) {
        throw new Error(
          `Error occurred while querying Cloudflare: (${json.errors[0].code}) ${json.errors[0].message}`,
          {
            cause: JSON.stringify(json),
          },
        );
      } else {
        throw new Error(`Unknown error occurred while querying Cloudflare`, {
          cause: JSON.stringify(json),
        });
      }
    }
    if (json.result) {
      json.result["continuationToken"] = json.result["continuation_token"];
      delete json.result["continuation_token"];
    }
    return await listImagesPaginatedResultSchema.parseAsync(json);
  }
}
