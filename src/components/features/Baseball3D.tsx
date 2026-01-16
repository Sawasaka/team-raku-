'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface Baseball3DProps {
  className?: string;
  size?: number;
}

// CSSのみで作成した3D風野球ボール
export function Baseball3D({ className = '', size = 100 }: Baseball3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [50, 0, -50]);

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      style={{
        width: size,
        height: size,
        y,
      }}
    >
      <motion.div
        className="relative w-full h-full"
        style={{
          rotateZ: rotate,
          rotateY: rotate,
        }}
        animate={{
          rotateZ: [0, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {/* 野球ボール本体 */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle at 30% 30%, #ffffff, #f5f5f5, #e5e5e5)',
            boxShadow: `
              inset -10px -10px 20px rgba(0,0,0,0.1),
              inset 5px 5px 10px rgba(255,255,255,0.8),
              0 10px 30px rgba(0,0,0,0.2)
            `,
          }}
        />
        
        {/* 縫い目 - 左側 */}
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full"
          style={{ transform: 'rotate(-20deg)' }}
        >
          <path
            d="M 30 20 Q 20 50 30 80"
            fill="none"
            stroke="#c2410c"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* 縫い目のステッチ */}
          {[25, 35, 45, 55, 65, 75].map((y, i) => (
            <g key={i}>
              <line
                x1="28"
                y1={y}
                x2="22"
                y2={y - 3}
                stroke="#c2410c"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <line
                x1="32"
                y1={y}
                x2="38"
                y2={y - 3}
                stroke="#c2410c"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </g>
          ))}
        </svg>

        {/* 縫い目 - 右側 */}
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full"
          style={{ transform: 'rotate(20deg)' }}
        >
          <path
            d="M 70 20 Q 80 50 70 80"
            fill="none"
            stroke="#c2410c"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* 縫い目のステッチ */}
          {[25, 35, 45, 55, 65, 75].map((y, i) => (
            <g key={i}>
              <line
                x1="68"
                y1={y}
                x2="62"
                y2={y - 3}
                stroke="#c2410c"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <line
                x1="72"
                y1={y}
                x2="78"
                y2={y - 3}
                stroke="#c2410c"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </g>
          ))}
        </svg>
      </motion.div>
    </motion.div>
  );
}

// 浮遊する野球ボール（ローディングやヒーローセクション用）
export function FloatingBaseball({ size = 80 }: { size?: number }) {
  return (
    <motion.div
      className="fixed bottom-4 left-4 z-50 opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
      style={{ width: size, height: size }}
      animate={{
        y: [-5, 5, -5],
        rotate: [0, 5, -5, 0],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      whileHover={{ scale: 1.1 }}
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle at 30% 30%, #ffffff, #f5f5f5, #e5e5e5)',
          boxShadow: `
            inset -8px -8px 16px rgba(0,0,0,0.1),
            inset 4px 4px 8px rgba(255,255,255,0.8),
            0 8px 24px rgba(0,0,0,0.15)
          `,
        }}
      />
      
      {/* シンプルな縫い目 */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
        {/* 左カーブ */}
        <path
          d="M 25 15 Q 15 50 25 85"
          fill="none"
          stroke="#dc2626"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* 右カーブ */}
        <path
          d="M 75 15 Q 85 50 75 85"
          fill="none"
          stroke="#dc2626"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* 左ステッチ */}
        {[20, 32, 44, 56, 68, 80].map((y, i) => (
          <g key={`left-${i}`}>
            <line x1="23" y1={y} x2="17" y2={y - 4} stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
            <line x1="27" y1={y} x2="33" y2={y - 4} stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
          </g>
        ))}
        {/* 右ステッチ */}
        {[20, 32, 44, 56, 68, 80].map((y, i) => (
          <g key={`right-${i}`}>
            <line x1="73" y1={y} x2="67" y2={y - 4} stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
            <line x1="77" y1={y} x2="83" y2={y - 4} stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
          </g>
        ))}
      </svg>
    </motion.div>
  );
}

// ローディングスピナー（野球ボール）
export function BaseballSpinner({ size = 40 }: { size?: number }) {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'linear',
      }}
      className="relative"
      style={{ width: size, height: size }}
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle at 30% 30%, #ffffff, #f5f5f5, #e5e5e5)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        }}
      />
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
        <path d="M 30 20 Q 20 50 30 80" fill="none" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" />
        <path d="M 70 20 Q 80 50 70 80" fill="none" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </motion.div>
  );
}





