// src/components/TarotCard.tsx
'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface TarotCardProps {
  card: {
    image: string;
    name_cn: string;
  } | null;
  isRevealed: boolean;
  position: 'past' | 'present' | 'future';
}

export default function TarotCard({ card, isRevealed, position }: TarotCardProps) {
  const positionLabels = {
    past: '过去',
    present: '现在',
    future: '未来'
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="relative w-24 h-40 perspective-1000">
        <motion.div
          className="w-full h-full relative preserve-3d"
          animate={{ rotateY: isRevealed ? 180 : 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {/* 卡背 */}
          <div className="absolute w-full h-full backface-hidden bg-gradient-to-br from-purple-900 to-indigo-900 border-2 border-gold-400 rounded-lg flex items-center justify-center shadow-lg">
            <div className="text-2xl">🔮</div>
          </div>

          {/* 卡面 */}
          <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-white rounded-lg shadow-lg overflow-hidden">
            {card ? (
              <>
                <div className="p-2 bg-gradient-to-b from-purple-100 to-transparent">
                  <h3 className="text-xs font-bold text-center text-gray-800">{card.name_cn}</h3>
                </div>
                <div className="relative w-full h-28">
                  <Image
                    src={card.image}
                    alt={card.name_cn}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                加载中...
              </div>
            )}
          </div>
        </motion.div>
      </div>
      <span className="text-sm font-medium text-gray-600">{positionLabels[position]}</span>
    </div>
  );
}
