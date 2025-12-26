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
    onClick?: () => void;
}

export default function TarotCard({ card, isRevealed, position, onClick }: TarotCardProps) {
    const positionLabels = {
        past: 'Past / 过去',
        present: 'Present / 现在',
        future: 'Future / 未来'
    };

    return (
        <div className="flex flex-col items-center gap-4 group cursor-pointer" onClick={onClick}>
            <div className="relative w-48 h-80 md:w-56 md:h-96 perspective-1000">
                <motion.div
                    className="w-full h-full relative preserve-3d"
                    animate={{ rotateY: isRevealed ? 180 : 0 }}
                    transition={{ duration: 0.8, type: "spring", stiffness: 60, damping: 15 }}
                    whileHover={{ scale: 1.05, y: -10 }}
                >
                    {/* === 卡背设计 (未揭开状态) === */}
                    <div className="absolute w-full h-full backface-hidden rounded-xl overflow-hidden border border-white/10 shadow-2xl">
                        {/* 深色底纹 */}
                        <div className="absolute inset-0 bg-slate-900 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900 via-slate-950 to-black"></div>

                        {/* 神秘几何纹理 (纯CSS绘制) */}
                        <div className="absolute inset-2 border border-amber-500/30 rounded-lg opacity-80"></div>
                        <div className="absolute inset-4 border border-amber-500/10 rounded-lg opacity-60"></div>

                        {/* 中央图案 */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="relative w-24 h-24 rounded-full border border-amber-400/20 flex items-center justify-center animate-pulse-slow">
                                <div className="w-16 h-16 rounded-full border border-amber-400/40 rotate-45 transform"></div>
                                <span className="absolute text-4xl text-amber-500/50 filter blur-[1px]">✧</span>
                            </div>
                        </div>

                        {/* 悬停光效 */}
                        <div className="absolute inset-0 bg-purple-500/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>

                    {/* === 卡面设计 (已揭开状态) === */}
                    <div className="absolute w-full h-full backface-hidden rotate-y-180 rounded-xl overflow-hidden bg-black border border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
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
                                    {/* 卡面暗角遮罩，增加质感 */}
                                    <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] pointer-events-none"></div>
                                </div>

                                {/* 底部卡名标签 */}
                                <div className="absolute bottom-0 w-full bg-gradient-to-t from-black via-black/90 to-transparent pt-8 pb-4 px-2 text-center">
                                    <h3 className="text-lg font-serif tracking-widest text-amber-100 text-glow">{card.name_cn}</h3>
                                </div>
                            </>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-900 text-gray-500">
                                Loading...
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* 位置标签 */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs md:text-sm font-light tracking-[0.2em] text-purple-200/60 uppercase"
            >
                {positionLabels[position]}
            </motion.div>
        </div>
    );
}