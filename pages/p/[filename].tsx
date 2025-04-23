import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

import Carousel from "../../components/Carousel";
import { getCachedImageProps, getCachedResults } from "../../utils/cachedImages";
import { one } from "../../utils/one";
import type { ImageProps } from "../../utils/types";
import { useLastViewedPhoto } from "../../utils/useLastViewedPhoto";

const Home: NextPage = ({ currentPhoto }: { currentPhoto: ImageProps }) => {
  const router = useRouter();
  const { filename } = router.query;
  const [, setLastViewedPhoto] = useLastViewedPhoto();

  useEffect(() => {
    setLastViewedPhoto(one(filename));
  });

  return (
    <>
      <Head>
        <title>sapslaj photography | {currentPhoto.filename}</title>
        <meta property="og:image" content={currentPhoto.variants.thumbnail} />
        <meta name="twitter:image" content={currentPhoto.variants.thumbnail} />
      </Head>
      <main className="mx-auto max-w-[1960px] p-4">
        <Carousel currentPhoto={currentPhoto} />
      </main>
    </>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async (context) => {
  const images = await getCachedImageProps();

  const currentPhoto = images.find((img) => img.filename === context.params.filename);

  return {
    props: {
      currentPhoto,
    },
  };
};

export async function getStaticPaths() {
  const results = await getCachedResults();
  const paths = results.result.images.map((image) => ({
    params: {
      filename: image.filename,
    },
  }));

  return {
    paths,
    fallback: false,
  };
}
