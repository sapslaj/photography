/* eslint-disable no-unused-vars */
export type ImageFilename = string;
export type ImageID = string;
export type ImageIndex = number;

export interface ImageVariants {
  blurplaceholder: string;
  large: string;
  preview: string;
  thumbnail: string;
}

export interface ImageProps {
  id: ImageID;
  index: ImageIndex;
  filename: ImageFilename;
  blurDataUrl?: string;
  variants: ImageVariants;
}
