import CloudflareImages, { ListImagesPaginatedResult } from "./CloudflareImages";
import getBase64ImageUrl from "./generateBlurPlaceholder";
import { ImageProps } from "./types";

let cachedResults: ListImagesPaginatedResult;
let cachedImageProps: ImageProps[];

export async function getCachedResults(): Promise<ListImagesPaginatedResult> {
  if (cachedResults !== undefined) {
    return cachedResults;
  }

  const client = new CloudflareImages();
  const fetchedResults = await client.listImagesPaginated();
  cachedResults = fetchedResults;

  return cachedResults;
}

export async function getCachedImageProps(): Promise<ImageProps[]> {
  if (cachedImageProps !== undefined) {
    return cachedImageProps;
  }

  const results = await getCachedResults();

  if (results.errors && results.errors.length > 0) {
    throw `errors getting images: ${JSON.stringify(results.errors, null, 2)}`;
  }

  if (!results.success || !results.result.images) {
    throw `errors getting images: ${JSON.stringify(results, null, 2)}`;
  }

  const images: ImageProps[] = results.result.images.map((resultImage, index) => ({
    index,
    id: resultImage.id || "",
    filename: resultImage.filename || "",
    variants: {
      blurplaceholder: resultImage.variants.filter((variant) => variant.endsWith("blurplaceholder"))[0],
      large: resultImage.variants.filter((variant) => variant.endsWith("large"))[0],
      preview: resultImage.variants.filter((variant) => variant.endsWith("preview"))[0],
      thumbnail: resultImage.variants.filter((variant) => variant.endsWith("thumbnail"))[0],
    },
  }));

  const blurImagePromises = images.map((image: ImageProps) => {
    return getBase64ImageUrl(image);
  });
  const imagesWithBlurDataUrls = await Promise.all(blurImagePromises);

  for (let i = 0; i < images.length; i++) {
    images[i].blurDataUrl = imagesWithBlurDataUrls[i];
  }

  cachedImageProps = images;
  return cachedImageProps;
}
