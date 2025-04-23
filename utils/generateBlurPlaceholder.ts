import type { ImageProps } from "./types";

const cache = new Map<ImageProps, string>();

export default async function getBase64ImageUrl(
  image: ImageProps,
): Promise<string> {
  let url = cache.get(image);
  if (url) {
    return url;
  }
  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      const response = await fetch(image.variants.blurplaceholder);
      const buffer = await response.arrayBuffer();
      const b64 = Buffer.from(buffer).toString("base64");

      url = `data:image/jpeg;base64,${b64}`;
      cache.set(image, url);
      return url;
    } catch (e) {
      console.warn(
        `failed to generate base64 image URL for image ${image.filename}: ${e} (attempt ${attempt})`,
      );
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
      if (attempt == 5) {
        console.info("image: ", JSON.stringify(image));
        throw e;
      }
    }
  }
}
