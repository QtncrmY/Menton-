export const pageTransition = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: { duration: 0.2, ease: 'easeInOut' },
}

export const cardEntrance = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.25, ease: 'easeOut' },
}

export const listStagger = {
  animate: { transition: { staggerChildren: 0.06 } },
}

export const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.2, ease: 'easeOut' },
  },
  exit: {
    opacity: 0, x: -20,
    transition: { duration: 0.15 },
  },
}

export const bottomSheetVariants = {
  hidden: { y: '100%' },
  visible: {
    y: 0,
    transition: { type: 'spring', damping: 30, stiffness: 300 },
  },
  exit: {
    y: '100%',
    transition: { duration: 0.2, ease: 'easeIn' },
  },
}
