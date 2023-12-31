import { Dialog } from '@headlessui/react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import useKeypress from 'react-use-keypress'
import type { ImageProps } from '../utils/types'
import SharedModal from './SharedModal'

export default function Modal({
  images,
  onClose,
}: {
  images: ImageProps[]
  onClose?: () => void
}) {
  let overlayRef = useRef()
  const router = useRouter()

  const { filename } = router.query
  const currentImage = images.find((image) => image.filename === filename);

  const [direction, setDirection] = useState(0)
  const [curIndex, setCurIndex] = useState(currentImage.index)

  function handleClose() {
    router.push('/', undefined, { shallow: true })
    onClose()
  }

  function changePhotoIndex(newIndex: number) {
    if (newIndex > currentImage.index) {
      setDirection(1)
    } else {
      setDirection(-1)
    }
    setCurIndex(newIndex);
    const newFilename = images[newIndex].filename;
    router.push(
      {
        query: { filename: newFilename },
      },
      `/p/${newFilename}`,
      { shallow: true }
    )
  }

  useKeypress('ArrowRight', () => {
    if (currentImage.index + 1 < images.length) {
      changePhotoIndex(currentImage.index + 1)
    }
  })

  useKeypress('ArrowLeft', () => {
    if (currentImage.index > 0) {
      changePhotoIndex(currentImage.index - 1)
    }
  })

  return (
    <Dialog
      static
      open={true}
      onClose={handleClose}
      initialFocus={overlayRef}
      className="fixed inset-0 z-10 flex items-center justify-center"
    >
      <Dialog.Overlay
        ref={overlayRef}
        as={motion.div}
        key="backdrop"
        className="fixed inset-0 z-30 bg-black/70 backdrop-blur-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />
      <SharedModal
        index={curIndex}
        direction={direction}
        images={images}
        changePhotoIndex={changePhotoIndex}
        closeModal={handleClose}
        navigation={true}
      />
    </Dialog>
  )
}
