import { motion } from 'framer-motion'

const Loader = () => {
  return (
    <div className="flex justify-center items-center min-h-[400px]">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 360, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="w-12 h-12 border-4 border-plum-200 border-t-plum-600 rounded-full"
      />
    </div>
  )
}

export default Loader