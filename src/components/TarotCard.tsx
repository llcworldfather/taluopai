'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface TarotCardProps {
    card: { image: string; name_cn: string; name_en: string; isReversed?: boolean } | null;
    isRevealed: boolean;
    position: 'past' | 'present' | 'future';
    onClick?: () => void;
}

export default function TarotCard({ card, isRevealed, position, onClick }: TarotCardProps) {
    const positionMap = { past: 'THE PAST', present: 'THE PRESENT', future: 'THE FUTURE' };
    const positionCn = { past: '过往', present: '当下', future: '未来' };

    return (
        <div className="flex flex-col items-center gap-6 group perspective-1000 z-10" onClick={onClick}>

            {/* 卡片主体容器 */}
            <div className="relative w-48 h-80 md:w-56 md:h-96 transition-all duration-500 ease-out transform-gpu group-hover:-translate-y-4 group-hover:shadow-[0_0_50px_rgba(139,92,246,0.5)] rounded-xl">
                <motion.div
                    className="w-full h-full relative preserve-3d"
                    animate={{ rotateY: isRevealed ? 180 : 0 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} // 电影级缓动
                >

                    {/* === 卡背 (The Back) === */}
                    <div className="absolute inset-0 backface-hidden rounded-xl overflow-hidden border border-[#ffffff10] bg-[#0a0518] shadow-2xl">
                        {/* 复杂纹理层 */}
                        <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay" />

                        {/* 魔法阵图案 */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-30">
                            <div className="w-32 h-32 border border-purple-500/30 rounded-full flex items-center justify-center">
                                <div className="w-24 h-24 border border-gold-500/20 rotate-45 flex items-center justify-center">
                                    <div className="w-16 h-16 border border-purple-400/30 rounded-full" />
                                </div>
                            </div>
                        </div>

                        {/* 边框装饰 */}
                        <div className="absolute inset-3 border border-double border-amber-500/20 rounded-lg" />
                        <div className="absolute bottom-6 w-full text-center text-amber-500/40 text-[10px] tracking-[0.4em] font-heading">DESTINY</div>
                    </div>

                    {/* === 卡面 (The Front) === */}
                    <div
                        className="absolute inset-0 backface-hidden rotate-y-180 bg-[#1e1b2e] rounded-xl overflow-hidden border-[3px] border-[#2a2442] shadow-2xl"
                        style={{ transform: card?.isReversed ? 'rotateY(180deg) rotate(180deg)' : 'rotateY(180deg)' }}
                    >
                        {card ? (
                            <>
                                <div className="relative w-full h-full">
                                    <Image
                                        src={card.image}
                                        alt={card.name_cn}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 200px, 300px"
                                        priority
                                    />
                                    {/* 顶部暗角 */}
                                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90 mix-blend-multiply pointer-events-none" />
                                </div>

                                {/* 文字信息区域 */}
                                <div className="absolute bottom-0 inset-x-0 p-4 text-center">
                                    <h3 className="text-xl text-amber-100 font-heading tracking-wider drop-shadow-lg mb-1">{card.name_cn}</h3>
                                    <p className="text-[10px] text-amber-100/60 uppercase tracking-widest font-serif">{card.name_en}</p>
                                    {card.isReversed && (
                                        <div className="mt-2 inline-block px-2 py-[2px] border border-red-500/30 bg-red-900/40 rounded text-[10px] text-red-200 tracking-widest uppercase">
                                            Reversed
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : null}

                        {/* 全息流光特效 (Holographic Sheen) */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none mix-blend-overlay" />
                    </div>

                </motion.div>
            </div>

            {/* 底部位置标签 */}
            <div className="text-center">
                <div className="text-[10px] text-purple-300/40 tracking-[0.5em] font-heading mb-1 uppercase">{positionMap[position]}</div>
                <div className="text-lg text-purple-100 font-serif italic opacity-80">{positionCn[position]}</div>
            </div>
        </div>
    );
}