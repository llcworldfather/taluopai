'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TarotCard from '@/components/TarotCard';
// ✅ 修复 Import 路径
import { DrawnCard } from '@/utils/tarotLogic';
import { TAROT_DECK } from '@/data/tarot';

// --- 组件：极光背景 ---
const AuroraBackground = () => (
    <div className="fixed inset-0 z-0 overflow-hidden bg-[#050510]">
        <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-purple-900/20 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-[4000ms]" />
        <div className="absolute top-[20%] -right-[10%] w-[60%] h-[60%] bg-indigo-900/20 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-[7000ms]" />
        <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[60%] bg-blue-900/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="noise-overlay" /> {/* 引用全局噪点 */}
    </div>
);

export default function Home() {
    const [step, setStep] = useState<'input' | 'shuffle' | 'pick' | 'reading'>('input');
    const [question, setQuestion] = useState('');
    const [selectedCards, setSelectedCards] = useState<DrawnCard[]>([]);
    const [deck, setDeck] = useState<any[]>([]);
    const [reading, setReading] = useState('');
    const [isReadingLoading, setIsReadingLoading] = useState(false);

    // 生成视觉上的牌堆
    useEffect(() => {
        setDeck(Array.from({ length: 22 }, (_, i) => ({ id: i })));
    }, []);

    const handleStart = () => {
        if (!question.trim()) return;
        setStep('shuffle');
        setTimeout(() => setStep('pick'), 2500);
    };

    const handlePick = (index: number) => {
        if (selectedCards.length >= 3) return;

        // 抽牌逻辑
        const randomIdx = Math.floor(Math.random() * TAROT_DECK.length);
        const cardData = TAROT_DECK[randomIdx];

        // 简单去重
        if (selectedCards.some(c => c.id === cardData.id)) {
            handlePick(index);
            return;
        }

        const newCard: DrawnCard = {
            ...cardData,
            isReversed: Math.random() > 0.5,
        };

        const newSelected = [...selectedCards, newCard];
        setSelectedCards(newSelected);

        if (newSelected.length === 3) {
            setTimeout(() => startReading(newSelected), 1500);
        }
    };

    const startReading = async (cards: DrawnCard[]) => {
        setStep('reading');
        setIsReadingLoading(true);
        try {
            const res = await fetch('/api/tarot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question }), // 实际生产环境建议把抽到的牌也发给后端
            });

            const reader = res.body?.getReader();
            const decoder = new TextDecoder();
            if (!reader) return;

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');
                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        if (data === '[DONE]') continue;
                        try {
                            const json = JSON.parse(data);
                            if (json.choices?.[0]?.delta?.content) {
                                setReading(prev => prev + json.choices[0].delta.content);
                            }
                        } catch (e) {}
                    }
                }
            }
        } catch (e) {
            setReading("连接灵界失败，请重试...");
        } finally {
            setIsReadingLoading(false);
        }
    };

    const reset = () => {
        setStep('input');
        setQuestion('');
        setSelectedCards([]);
        setReading('');
    };

    return (
        <div className="relative min-h-screen text-slate-200 font-sans selection:bg-purple-500/30">
            <AuroraBackground />

            <main className="relative z-10 container mx-auto px-4 min-h-screen flex flex-col items-center justify-center py-10">

                {/* Header - 始终显示，但根据状态改变大小 */}
                <motion.header
                    layout
                    className={`text-center mb-8 ${step === 'reading' ? 'scale-75' : 'scale-100'}`}
                >
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block"
                    >
                        <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-[#fff5d1] to-[#c6a665] drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]">
                            ARCANA
                        </h1>
                        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-amber-500/50 to-transparent mt-4 mb-2" />
                        <p className="text-purple-200/40 text-xs tracking-[0.5em] uppercase font-heading">The Mystic Oracle</p>
                    </motion.div>
                </motion.header>

                <AnimatePresence mode="wait">

                    {/* 1. 输入阶段 */}
                    {step === 'input' && (
                        <motion.div
                            key="input"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                            className="w-full max-w-lg"
                        >
                            <div className="glass-panel p-12 rounded-2xl text-center relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50" />

                                <h2 className="text-2xl text-purple-100 font-heading mb-8 font-light">What seeks an answer?</h2>

                                <input
                                    type="text"
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                    placeholder="Ask the cards..."
                                    className="w-full bg-transparent border-b border-white/10 px-4 py-3 text-2xl text-center text-amber-50 placeholder-white/10 focus:outline-none focus:border-amber-500/50 transition-colors font-serif italic"
                                />

                                <motion.button
                                    whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(168,85,247,0.4)" }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleStart}
                                    disabled={!question.trim()}
                                    className="mt-12 px-10 py-4 bg-gradient-to-r from-[#2a2442] to-[#1e1b2e] border border-white/10 rounded-full text-amber-100/80 font-heading tracking-widest text-sm uppercase hover:text-white transition-all disabled:opacity-50"
                                >
                                    Reveal Destiny
                                </motion.button>
                            </div>
                        </motion.div>
                    )}

                    {/* 2. 洗牌动画 */}
                    {step === 'shuffle' && (
                        <motion.div
                            key="shuffle"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center"
                        >
                            <div className="relative w-40 h-60">
                                {[...Array(5)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="absolute inset-0 rounded-xl border border-amber-500/30 bg-[#151025]"
                                        animate={{
                                            rotate: [0, i * 15 - 30, 0],
                                            x: [0, i * 20 - 40, 0],
                                            scale: [1, 1.1, 1]
                                        }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                    />
                                ))}
                            </div>
                            <p className="mt-12 text-purple-300/50 font-heading tracking-widest animate-pulse">Shuffling Fate...</p>
                        </motion.div>
                    )}

                    {/* 3. 选牌阶段 */}
                    {step === 'pick' && (
                        <motion.div
                            key="pick"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full max-w-6xl flex flex-col items-center"
                        >
                            <h2 className="text-xl text-purple-200/60 font-heading tracking-widest mb-12">
                                Select Three Cards ({selectedCards.length}/3)
                            </h2>

                            {/* 扇形牌阵 */}
                            <div className="relative h-[400px] w-full flex justify-center items-end perspective-[1200px] overflow-visible">
                                {deck.map((card, i) => {
                                    // 计算扇形布局
                                    const total = deck.length;
                                    const angle = (i - total / 2) * 5; // 角度分布
                                    const yOffset = Math.abs(i - total / 2) * 5; // 拱形分布

                                    return (
                                        <motion.div
                                            key={i}
                                            initial={{ y: 500, opacity: 0 }}
                                            animate={{
                                                y: yOffset,
                                                rotate: angle,
                                                x: (i - total / 2) * 20
                                            }}
                                            whileHover={{
                                                y: -100,
                                                scale: 1.2,
                                                zIndex: 100,
                                                transition: { duration: 0.2 }
                                            }}
                                            onClick={() => handlePick(i)}
                                            className="absolute w-24 h-40 md:w-32 md:h-52 bg-[#1a1528] border border-white/10 rounded-lg shadow-2xl cursor-pointer transform-gpu origin-bottom hover:border-amber-500/50"
                                            style={{
                                                boxShadow: '0 4px 6px rgba(0,0,0,0.5)',
                                                backgroundImage: `url("https://www.transparenttextures.com/patterns/stardust.png")`
                                            }}
                                        >
                                            <div className="w-full h-full opacity-30 bg-gradient-to-b from-purple-500/20 to-transparent" />
                                            <div className="absolute inset-2 border border-white/5 rounded opacity-50" />
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {/* 已选卡槽 */}
                            <div className="fixed bottom-10 flex gap-4 pointer-events-none">
                                {[0, 1, 2].map((idx) => (
                                    <div
                                        key={idx}
                                        className={`w-16 h-24 border border-white/10 rounded-md transition-colors ${selectedCards[idx] ? 'bg-amber-500/20 border-amber-500/50' : 'bg-transparent'}`}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* 4. 解读结果 */}
                    {step === 'reading' && (
                        <motion.div
                            key="reading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="w-full max-w-7xl flex flex-col items-center"
                        >
                            {/* 牌阵展示区 */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 mb-16 w-full justify-items-center">
                                {selectedCards.map((card, idx) => (
                                    <motion.div
                                        key={card.id}
                                        initial={{ opacity: 0, y: 50 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.2 }}
                                    >
                                        <TarotCard
                                            card={card}
                                            isRevealed={true}
                                            position={idx === 0 ? 'past' : idx === 1 ? 'present' : 'future'}
                                        />
                                    </motion.div>
                                ))}
                            </div>

                            {/* 解读文字区 */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8 }}
                                className="glass-panel w-full max-w-4xl p-8 md:p-12 rounded-2xl relative"
                            >
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-[#050510] border border-white/10 rounded-full flex items-center justify-center z-20">
                                    <span className="text-xl">✦</span>
                                </div>

                                <div className="prose prose-invert prose-lg max-w-none font-serif leading-loose text-slate-300">
                                    {reading ? (
                                        <div className="whitespace-pre-wrap">{reading}</div>
                                    ) : (
                                        <div className="text-center py-10 text-purple-200/50 animate-pulse">
                                            Invoking the spirits...
                                        </div>
                                    )}
                                </div>

                                {!isReadingLoading && (
                                    <div className="text-center mt-12">
                                        <button
                                            onClick={reset}
                                            className="text-xs text-purple-300/50 hover:text-purple-300 tracking-[0.2em] uppercase transition-colors border-b border-transparent hover:border-purple-300 pb-1"
                                        >
                                            Start New Reading
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </main>
        </div>
    );
}