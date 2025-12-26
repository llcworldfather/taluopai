// src/app/page.tsx
'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TarotCard from '@/components/TarotCard';
import { drawCards, DrawnCard } from '@/utils/tarotLogic';

export default function Home() {
  const [step, setStep] = useState<'input' | 'shuffle' | 'reveal' | 'reading'>('input');
  const [question, setQuestion] = useState('');
  const [cards, setCards] = useState<DrawnCard[] | null>(null);
  const [reading, setReading] = useState('');
  const [isReadingLoading, setIsReadingLoading] = useState(false);
  const readingRef = useRef<HTMLDivElement>(null);

  const handleShuffle = async () => {
    setStep('shuffle');
    
    // 模拟洗牌动画
    setTimeout(() => {
      const drawnCards = drawCards(3);
      setCards(drawnCards);
      setStep('reveal');
    }, 2000);
  };

  const handleReveal = async () => {
    setStep('reading');
    setIsReadingLoading(true);
    setReading('');

    try {
      const response = await fetch('/api/tarot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        throw new Error('API 调用失败');
      }

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
                if (json.choices && json.choices[0]?.delta?.content) {
                  setReading(prev => prev + json.choices[0].delta.content);
                }
              } catch (e) {
                // 忽略解析错误
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setReading('抱歉，占卜过程中出现了问题。请稍后再试。');
    } finally {
      setIsReadingLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-black text-white">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-pink-400 rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 left-1/3 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
      </div>

      <div className="relative container mx-auto px-4 py-8">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            神秘塔罗占卜
          </h1>
          <p className="text-gray-300 mt-2">倾听内心的声音，探寻命运的指引</p>
        </motion.div>

        {/* 主要内容区域 */}
        <div className="max-w-4xl mx-auto">
          {/* 输入阶段 */}
          <AnimatePresence mode="wait">
            {step === 'input' && (
              <motion.div
                key="input"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center"
              >
                <h2 className="text-2xl font-semibold mb-6">静心默念你的问题</h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="例如：我最近的事业运势如何？"
                    className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                  <button
                    onClick={handleShuffle}
                    disabled={!question.trim()}
                    className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold text-white hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                  >
                    开始占卜
                  </button>
                </div>
              </motion.div>
            )}

            {/* 洗牌阶段 */}
            {step === 'shuffle' && (
              <motion.div
                key="shuffle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
                  <h2 className="text-2xl font-semibold mb-6">正在洗牌...</h2>
                  <div className="flex justify-center space-x-4">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-16 h-28 bg-gradient-to-br from-purple-900 to-indigo-900 border-2 border-gold-400 rounded-lg"
                        animate={{
                          y: [0, -20, 0],
                          rotate: [0, 10, -10, 0]
                        }}
                        transition={{
                          duration: 0.5,
                          delay: i * 0.1,
                          repeat: Infinity,
                          repeatType: "reverse"
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-gray-300 mt-4">命运的齿轮正在转动...</p>
                </div>
              </motion.div>
            )}

            {/* 揭示阶段 */}
            {step === 'reveal' && cards && (
              <motion.div
                key="reveal"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
                  <h2 className="text-2xl font-semibold mb-6">三张牌已抽出</h2>
                  <div className="flex justify-center space-x-8">
                    <TarotCard card={cards[0]} isRevealed={false} position="past" />
                    <TarotCard card={cards[1]} isRevealed={false} position="present" />
                    <TarotCard card={cards[2]} isRevealed={false} position="future" />
                  </div>
                  <button
                    onClick={handleReveal}
                    className="mt-8 py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold text-white hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105"
                  >
                    揭示命运
                  </button>
                </div>
              </motion.div>
            )}

            {/* 阅读阶段 */}
            {step === 'reading' && (
              <motion.div
                key="reading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {/* 占卜结果 */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
                  <h2 className="text-2xl font-semibold mb-6">占卜结果</h2>
                  {cards && (
                    <div className="flex justify-center space-x-8 mb-6">
                      <TarotCard card={cards[0]} isRevealed={true} position="past" />
                      <TarotCard card={cards[1]} isRevealed={true} position="present" />
                      <TarotCard card={cards[2]} isRevealed={true} position="future" />
                    </div>
                  )}
                </div>

                {/* AI 解读 */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
                  <h3 className="text-xl font-semibold mb-4">AI 解读</h3>
                  <div 
                    ref={readingRef}
                    className="prose prose-invert max-w-none text-gray-200 leading-relaxed"
                    style={{ whiteSpace: 'pre-wrap' }}
                  >
                    {reading || (isReadingLoading ? '正在生成解读...' : '')}
                  </div>
                  {isReadingLoading && (
                    <div className="flex justify-center mt-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
