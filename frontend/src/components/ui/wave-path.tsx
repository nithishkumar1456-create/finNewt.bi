import { motion } from 'motion/react';

interface WavePathProps {
  className?: string;
  color?: string;
  height?: number;
}

export const WavePath = ({ className, color = "currentColor", height = 40 }: WavePathProps) => {
  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      <svg
        viewBox={`0 0 1440 ${height * 2}`}
        className="w-full"
        preserveAspectRatio="none"
        style={{ height: height * 2 }}
      >
        <motion.path
          initial={{ d: "M0,64L80,74.7C160,85,320,107,480,112C640,117,800,107,960,101.3C1120,96,1280,96,1360,96L1440,96L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z" }}
          animate={{
            d: [
              "M0,64L80,74.3C160,85,320,107,480,112C640,117,800,107,960,101.3C1120,96,1280,96,1360,96L1440,96L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z",
              "M0,96L80,90.7C160,85,320,75,480,85.3C640,96,800,128,960,138.7C1120,149,1280,139,1360,133.3L1440,128L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z",
              "M0,64L80,74.3C160,85,320,107,480,112C640,117,800,107,960,101.3C1120,96,1280,96,1360,96L1440,96L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
            ]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          fill={color}
        />
      </svg>
    </div>
  );
};
