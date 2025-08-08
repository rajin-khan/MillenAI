// /millen-ai/src/components/AnimatedBackground.jsx

import { motion } from 'framer-motion';

const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-[#0D1117]">
      <div className="relative w-full h-full">
        {/* Large, slow-moving gradient blobs */}
        <motion.div
          animate={{
            x: ['-20%', '30%', '-20%'],
            y: ['-20%', '40%', '-20%'],
            rotate: [0, 180, 0],
          }}
          transition={{
            duration: 50,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatType: 'mirror',
          }}
          className="absolute top-0 left-0 w-[40rem] h-[40rem] bg-emerald-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: ['80%', '50%', '80%'],
            y: ['70%', '10%', '70%'],
            rotate: [0, -180, 0],
          }}
          transition={{
            duration: 60,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatType: 'mirror',
          }}
          className="absolute bottom-0 right-0 w-[35rem] h-[35rem] bg-cyan-500/10 rounded-full blur-3xl"
        />
      </div>
    </div>
  );
};

export default AnimatedBackground;