import { z } from 'zod';

function cfResponse<T extends z.Schema>(resultSchema: T) {
  return z.object({
    errors: z.array(z.object({
      code: z.number().int(),
      message: z.string(),
    })).optional().nullable(),
    messages: z.array(z.object({
      code: z.number().int(),
      message: z.string(),
    })).optional().nullable(),
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

export type ListImagesPaginatedInput = z.infer<typeof listImagesPaginatedInputSchema>;

export const listImagesPaginatedResultSchema = cfResponse(z.object({
  continuationToken: z.string().optional().nullable(),
  images: z.array(z.object({
    filename: z.string(),
    id: z.string(),
    meta: z.map(z.any(), z.any()).optional().nullable(),
    requireSignedURLs: z.boolean(),
    uploaded: z.string().datetime(),
    variants: z.array(z.string()),
  })),
}));

export type ListImagesPaginatedResult = z.infer<typeof listImagesPaginatedResultSchema>;

export default class CloudflareImages {
  public readonly accountID: string;
  public readonly apiToken: string;

  constructor(opts?: { accountID: string | undefined, apiToken: string | undefined }) {
    if (opts && opts.accountID) {
      this.accountID = opts.accountID;
    } else {
      this.accountID = process.env.CLOUDFLARE_ACCOUNT_ID;
    }
    if (opts && opts.apiToken) {
      this.apiToken = opts.apiToken;
    } else {
      this.apiToken = process.env.CLOUDFLARE_API_TOKEN;
    }
  }

  async listImagesPaginated(params: ListImagesPaginatedInput = {}): Promise<ListImagesPaginatedResult> {
    let queryParams = new URLSearchParams();
    if (params.continuationToken) {
      queryParams.set('continuation_token', params.continuationToken);
    }
    if (params.perPage) {
      queryParams.set('per_page', params.perPage.toString());
    }
    if (params.sortOrder) {
      queryParams.set('sort_order', params.sortOrder);
    }
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${this.accountID}/images/v2?${queryParams.toString()}`,
      { headers: { 'Authorization': `Bearer ${this.apiToken}` } },
    );
    const json = await response.json();
    json.statusCode = response.status;
    if (json.result) {
      json.result['continuationToken'] = json.result['continuation_token'];
      delete json.result['continuation_token'];
    }
    return await listImagesPaginatedResultSchema.parseAsync(json);
  }
}
