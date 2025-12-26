// src/utils/tarotLogic.ts
import { TAROT_DECK, TarotCard } from '@/data/tarot';

export interface DrawnCard extends TarotCard {
  isReversed: boolean; // 增加一个正逆位属性
}

export function drawCards(count: number = 3): DrawnCard[] {
  // 1. 复制一份牌库以免修改原数组
  const deck = [...TAROT_DECK];
  
  // 2. 洗牌 (Fisher-Yates Shuffle)
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  
  // 3. 抽取并决定正逆位
  return deck.slice(0, count).map(card => ({
    ...card,
    isReversed: Math.random() > 0.5
  }));
}

export function formatCardForAI(card: DrawnCard): string {
  const position = card.isReversed ? '逆位' : '正位';
  return `${card.name_cn} (${position})`;
}

// 生成 AI 提示词的辅助函数
export function generateAIPrompt(userQuestion: string, drawnCards: DrawnCard[]): string {
  const promptCardsInfo = drawnCards.map((card, index) => {
    const position = ["过去", "现在", "未来"][index];
    const status = card.isReversed ? "逆位 (Reversed)" : "正位 (Upright)";
    // AI 读取英文名通常更准确，加上中文名和关键词辅助
    return `${position}: ${card.name_en} (${card.name_cn}) - ${status}. 关键词参考: ${card.keywords.join(',')}`;
  }).join('\n');

  return `用户问题: "${userQuestion}"\n\n抽牌结果:\n${promptCardsInfo}\n\n请根据以上牌面进行解读`;
}
