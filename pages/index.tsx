import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'
import Modal from '../components/Modal'
import { getCachedImageProps } from '../utils/cachedImages'
import type { ImageProps } from '../utils/types'
import { useLastViewedPhoto } from '../utils/useLastViewedPhoto'
import { one } from '../utils/one';

const Home: NextPage = ({ images }: { images: ImageProps[] }) => {
  const router = useRouter()
  const { filename } = router.query
  const [lastViewedPhoto, setLastViewedPhoto] = useLastViewedPhoto()

  const lastViewedPhotoRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    // This effect keeps track of the last viewed photo in the modal to keep the index page in sync when the user navigates back
    if (lastViewedPhoto && !filename) {
      lastViewedPhotoRef.current.scrollIntoView({ block: 'center' })
      setLastViewedPhoto(null)
    }
  }, [filename, lastViewedPhoto, setLastViewedPhoto])

  return (
    <>
      <Head>
        <title>sapslaj photography</title>
        <meta
          property="og:image"
          content={images[0].variants.thumbnail}
        />
        <meta
          name="twitter:image"
          content={images[0].variants.thumbnail}
        />
      </Head>
      <main className="mx-auto max-w-[1960px] p-4">
        {filename && (
          <Modal
            images={images}
            onClose={() => {
              setLastViewedPhoto(one(filename))
            }}
          />
        )}
        <div className="columns-1 gap-4 sm:columns-2 xl:columns-3 2xl:columns-4">
          <div className="after:content relative mb-5 flex h-[200px] flex-col items-center justify-end gap-4 overflow-hidden rounded-lg bg-white/10 px-6 pb-16 pt-64 text-center text-white shadow-highlight after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight lg:pt-0">
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
            </div>
            <h1 className="mt-8 mb-4 text-base font-bold uppercase tracking-widest">
              photography
            </h1>
            <p className="max-w-[40ch] text-white/75 sm:max-w-[32ch]">
              sometimes i take pictures of things
            </p>
          </div>
          {images.map(({ id, filename, variants, blurDataUrl }) => (
            <Link
              key={id}
              href={`/?filename=${filename}`}
              as={`/p/${filename}`}
              ref={filename === lastViewedPhoto ? lastViewedPhotoRef : null}
              shallow
              className="after:content group relative mb-5 block w-full cursor-zoom-in after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight"
            >
              <Image
                alt="photo"
                className="transform rounded-lg brightness-90 transition will-change-auto group-hover:brightness-110"
                style={{ transform: 'translate3d(0, 0, 0)' }}
                placeholder="blur"
                blurDataURL={blurDataUrl}
                src={variants.preview}
                width={720}
                height={480}
                sizes="(max-width: 640px) 100vw,
                  (max-width: 1280px) 50vw,
                  (max-width: 1536px) 33vw,
                  25vw"
              />
            </Link>
          ))}
        </div>
      </main>
      <footer className="p-6 text-center text-white/80 sm:p-12">
        &copy; 2024 Justin Roberson, et al.
        | Images:{' '}
        <a
          href="https://creativecommons.org/licenses/by/4.0/"
          target="_blank"
          className="font-semibold hover:text-white"
          rel="noreferrer"
        >
          CC-BY-4.0
        </a>
        | Code:{' '}
        <a
          href="https://github.com/sapslaj/photography/blob/main/LICENSE"
          target="_blank"
          className="font-semibold hover:text-white"
          rel="noreferrer"
        >
          MIT
        </a>
      </footer>
    </>
  )
}

export default Home

export async function getStaticProps() {
  const images = await getCachedImageProps();

  return {
    props: {
      images,
    },
  }
}
