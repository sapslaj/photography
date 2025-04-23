import { createGlobalState } from "react-hooks-global-state";
import { ImageFilename } from "./types";

const initialState: { photoToScrollTo: ImageFilename | null } = { photoToScrollTo: null };
const { useGlobalState } = createGlobalState(initialState);

export type UseLastViewedPhoto = [ImageFilename, (filename: ImageFilename) => void];

export const useLastViewedPhoto = (): UseLastViewedPhoto => {
  return useGlobalState("photoToScrollTo") as UseLastViewedPhoto;
};
