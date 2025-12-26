'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TarotCard from '@/components/TarotCard';
import { drawCards, DrawnCard } from '@/utils/tarotLogic';

// 星空背景组件 - 使用 fixed 定位，完全脱离文档流
const StarryBackground = () => {
    const [stars, setStars] = useState<React.CSSProperties[]>([]);

    useEffect(() => {
        const generatedStars = [...Array(30)].map(() => ({
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
            '--duration': `${Math.random() * 3 + 2}s`
        } as React.CSSProperties));
        setStars(generatedStars);
    }, []);

    return (
        <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
            <div className="bg-noise absolute inset-0 z-10"></div>
            {stars.map((style, i) => (
                <div key={i} className="star opacity-60" style={style}></div>
            ))}
        </div>
    );
};

export default function Home() {
    const [step, setStep] = useState<'input' | 'shuffling' | 'draw' | 'reading'>('input');
    const [question, setQuestion] = useState('');
    const [cards, setCards] = useState<DrawnCard[] | null>(null);
    const [reading, setReading] = useState('');
    const [isReadingLoading, setIsReadingLoading] = useState(false);
    const readingRef = useRef<HTMLDivElement>(null);

    const startDivination = () => {
        if (!question.trim()) return;
        setStep('shuffling');
        setTimeout(() => {
            const drawn = drawCards(3);
            setCards(drawn);
            setStep('draw');
            setRevealedCards([false, false, false]);
        }, 2500);
    };

    const handleCardClick = (index: number) => {
        if (step !== 'draw' || !cards) return;
        if (revealedCards[index]) return;

        const newRevealed = [...revealedCards];
        newRevealed[index] = true;
        setRevealedCards(newRevealed);

        if (newRevealed.filter(Boolean).length === 3) {
            setTimeout(() => {
                setStep('reading');
                fetchReading();
            }, 1000);
        }
    };

    const [revealedCards, setRevealedCards] = useState([false, false, false]);

    const fetchReading = async () => {
        setIsReadingLoading(true);
        try {
            const response = await fetch('/api/tarot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question }),
            });

            if (!response.ok) throw new Error('Failed');

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            if (reader) {
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
            }
        } catch (error) {
            setReading("星辰的低语有些模糊...请稍后再试。");
        } finally {
            setIsReadingLoading(false);
        }
    };

    const reset = () => {
        setStep('input');
        setQuestion('');
        setCards(null);
        setReading('');
        setRevealedCards([false, false, false]);
    };

    return (
        // 修改点：使用 min-h-screen + flex + justify-center + items-center 确保绝对居中
        <div className="relative min-h-screen w-full flex flex-col items-center justify-center font-sans overflow-hidden p-4">
            <StarryBackground />

            {/* 核心内容容器 */}
            <div className="relative z-10 w-full max-w-6xl flex flex-col items-center justify-center space-y-8 md:space-y-12">

                {/* 顶部标题 */}
                <motion.header
                    className="text-center w-full px-4"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-4xl md:text-7xl font-thin tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-amber-100 to-purple-200 uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] mb-2">
                        Mystic Tarot
                    </h1>
                    <p className="text-purple-300/50 text-xs md:text-sm tracking-[0.4em] uppercase">
                        Connect with your inner guidance
                    </p>
                </motion.header>

                <main className="w-full flex flex-col items-center justify-center">
                    <AnimatePresence mode="wait">

                        {/* === 阶段 1: 输入问题 === */}
                        {step === 'input' && (
                            <motion.div
                                key="input"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                                className="w-full max-w-xl px-4"
                            >
                                <div className="glass-panel w-full rounded-3xl p-8 md:p-12 text-center relative overflow-hidden flex flex-col items-center justify-center shadow-2xl backdrop-blur-xl">
                                    {/* 装饰线条 */}
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>

                                    <h2 className="text-2xl md:text-3xl text-purple-100 font-light mb-8">
                                        What do you seek?
                                    </h2>

                                    <div className="relative group mb-8 w-full">
                                        <input
                                            type="text"
                                            value={question}
                                            onChange={(e) => setQuestion(e.target.value)}
                                            placeholder="Meditate on your question..."
                                            className="w-full bg-black/20 border-b border-purple-300/30 px-4 py-4 text-center text-lg text-purple-100 placeholder-purple-300/20 focus:outline-none focus:border-purple-400 focus:bg-purple-900/10 transition-all duration-500 rounded-t-lg"
                                            onKeyDown={(e) => e.key === 'Enter' && startDivination()}
                                        />
                                        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-purple-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                                    </div>

                                    <motion.button
                                        onClick={startDivination}
                                        disabled={!question.trim()}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="px-12 py-3 rounded-full bg-gradient-to-r from-indigo-900 to-purple-900 border border-purple-500/30 text-purple-100 tracking-widest uppercase hover:border-purple-400 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
                                    >
                                        Consult the Cards
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}

                        {/* === 阶段 2: 洗牌动画 === */}
                        {step === 'shuffling' && (
                            <motion.div
                                key="shuffling"
                                className="relative flex items-center justify-center h-80 w-full"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                {[0, 1, 2, 3, 4].map((i) => (
                                    <motion.div
                                        key={i}
                                        className="absolute w-32 h-56 md:w-40 md:h-64 bg-gradient-to-br from-indigo-950 to-black border border-amber-500/20 rounded-xl"
                                        animate={{
                                            x: [0, (i - 2) * 60, 0],
                                            y: [0, (i % 2 === 0 ? -30 : 30), 0],
                                            rotate: [0, (i - 2) * 10, 0],
                                            scale: [1, 1.1, 1]
                                        }}
                                        transition={{
                                            duration: 2,
                                            ease: "easeInOut",
                                            times: [0, 0.5, 1]
                                        }}
                                    >
                                        <div className="w-full h-full flex items-center justify-center">
                                            <span className="text-2xl opacity-20">🔮</span>
                                        </div>
                                    </motion.div>
                                ))}
                                <p className="absolute -bottom-16 text-purple-300/50 tracking-widest animate-pulse">
                                    The cards are aligning...
                                </p>
                            </motion.div>
                        )}

                        {/* === 阶段 3: 抽牌/揭牌 === */}
                        {step === 'draw' && cards && (
                            <motion.div
                                key="draw"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="w-full flex flex-col items-center justify-center"
                            >
                                <div className="flex flex-col md:flex-row gap-8 md:gap-16 justify-center items-center">
                                    {cards.map((card, idx) => {
                                        const positions = ['past', 'present', 'future'] as const;
                                        return (
                                            <motion.div
                                                key={card.id}
                                                initial={{ opacity: 0, y: 50 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                            >
                                                <TarotCard
                                                    card={card}
                                                    isRevealed={revealedCards[idx]}
                                                    position={positions[idx]}
                                                    onClick={() => handleCardClick(idx)}
                                                />
                                            </motion.div>
                                        );
                                    })}
                                </div>

                                <h3 className="mt-12 text-xl text-purple-200/70 font-light tracking-wide animate-pulse">
                                    Tap each card to reveal your destiny
                                </h3>
                            </motion.div>
                        )}

                        {/* === 阶段 4: 解读结果 === */}
                        {step === 'reading' && cards && (
                            <motion.div
                                key="reading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="w-full flex flex-col lg:flex-row gap-8 lg:gap-12 items-start justify-center"
                            >
                                {/* 左侧：牌阵展示 */}
                                <div className="w-full lg:w-1/3 flex lg:flex-col gap-4 justify-center items-center">
                                    {cards.map((card, idx) => {
                                        const positions = ['past', 'present', 'future'] as const;
                                        return (
                                            <div key={card.id} className="transform scale-75 lg:scale-90 origin-center hover:scale-100 transition-transform duration-300">
                                                <TarotCard card={card} isRevealed={true} position={positions[idx]} />
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* 右侧：解读区域 */}
                                <div className="w-full lg:w-2/3 max-w-3xl mx-auto">
                                    <div className="glass-panel rounded-2xl p-8 md:p-12 relative min-h-[400px] w-full">
                                        <div className="absolute top-6 right-6 z-10">
                                            <button onClick={reset} className="text-xs text-purple-400/50 hover:text-purple-300 uppercase tracking-widest border border-purple-500/20 px-4 py-2 rounded-full hover:bg-purple-500/10 transition-all">
                                                New Reading
                                            </button>
                                        </div>

                                        <h3 className="text-xl font-serif text-amber-100/80 mb-8 border-b border-white/5 pb-4 text-center">
                                            {question}
                                        </h3>

                                        <div
                                            ref={readingRef}
                                            className="prose prose-invert max-w-none font-serif text-lg leading-loose"
                                            style={{ whiteSpace: 'pre-wrap' }}
                                        >
                                            {reading}
                                            {isReadingLoading && (
                                                <span className="inline-block w-2 h-4 bg-purple-400 ml-1 animate-pulse"></span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </main>

                {/* 底部版权 */}
                <footer className="text-purple-900/50 text-xs uppercase tracking-widest mt-8">
                    &copy; Mystic Tarot
                </footer>
            </div>
        </div>
    );
}