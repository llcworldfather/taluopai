// src/data/tarot.ts

export interface TarotCard {
  id: string;      // 唯一标识，如 "m00", "w01"
  name_cn: string; // 中文名
  name_en: string; // 英文名
  suit: 'major' | 'wands' | 'cups' | 'swords' | 'pentacles'; // 花色
  image: string;   // 图片路径，对应 public/cards/ 下的文件
  keywords: string[]; // 关键词，用于传给 AI 辅助解读
}

// ---------------------------------------------------------
// 1. 大阿卡纳 (Major Arcana) - 22张
// ---------------------------------------------------------
const majorArcanaData = [
  { idx: '00', en: "The Fool", cn: "愚者", keywords: ["新的开始", "冒险", "纯真", "无畏"] },
  { idx: '01', en: "The Magician", cn: "魔术师", keywords: ["创造力", "技能", "意志力", "表现"] },
  { idx: '02', en: "The High Priestess", cn: "女祭司", keywords: ["直觉", "神秘", "潜意识", "内在声音"] },
  { idx: '03', en: "The Empress", cn: "皇后", keywords: ["丰饶", "母性", "自然", "感官享受"] },
  { idx: '04', en: "The Emperor", cn: "皇帝", keywords: ["权威", "结构", "控制", "父性"] },
  { idx: '05', en: "The Hierophant", cn: "教皇", keywords: ["传统", "精神指引", "信仰", "体制"] },
  { idx: '06', en: "The Lovers", cn: "恋人", keywords: ["爱", "和谐", "关系", "价值观抉择"] },
  { idx: '07', en: "The Chariot", cn: "战车", keywords: ["胜利", "意志力", "自律", "决心"] },
  { idx: '08', en: "Strength", cn: "力量", keywords: ["勇气", "耐心", "控制", "同情心"] },
  { idx: '09', en: "The Hermit", cn: "隐士", keywords: ["内省", "孤独", "寻求真理", "指引"] },
  { idx: '10', en: "Wheel of Fortune", cn: "命运之轮", keywords: ["改变", "周期", "不可避免的命运", "转折点"] },
  { idx: '11', en: "Justice", cn: "正义", keywords: ["公平", "真理", "法律", "因果"] },
  { idx: '12', en: "The Hanged Man", cn: "倒吊人", keywords: ["牺牲", "放手", "新视角", "等待"] },
  { idx: '13', en: "Death", cn: "死神", keywords: ["结束", "转变", "重生", "放下过去"] },
  { idx: '14', en: "Temperance", cn: "节制", keywords: ["平衡", "适度", "耐心", "目的"] },
  { idx: '15', en: "The Devil", cn: "恶魔", keywords: ["束缚", "物质主义", "上瘾", "阴影自我"] },
  { idx: '16', en: "The Tower", cn: "高塔", keywords: ["突变", "混乱", "启示", "觉醒"] },
  { idx: '17', en: "The Star", cn: "星星", keywords: ["希望", "灵感", "平静", "更新"] },
  { idx: '18', en: "The Moon", cn: "月亮", keywords: ["幻觉", "恐惧", "焦虑", "潜意识"] },
  { idx: '19', en: "The Sun", cn: "太阳", keywords: ["快乐", "成功", "活力", "积极"] },
  { idx: '20', en: "Judgement", cn: "审判", keywords: ["重生", "内心召唤", "宽恕", "决断"] },
  { idx: '21', en: "The World", cn: "世界", keywords: ["完成", "整合", "成就", "旅行"] },
];

// ---------------------------------------------------------
// 2. 小阿卡纳配置 (Minor Arcana) - 56张
// ---------------------------------------------------------
const suits = [
  { id: 'wands', name_en: 'Wands', name_cn: '权杖', prefix: 'w' },
  { id: 'cups', name_en: 'Cups', name_cn: '圣杯', prefix: 'c' },
  { id: 'swords', name_en: 'Swords', name_cn: '宝剑', prefix: 's' },
  { id: 'pentacles', name_en: 'Pentacles', name_cn: '星币', prefix: 'p' },
] as const;

const ranks = [
  { val: 1, name_en: 'Ace', name_cn: '王牌' },
  { val: 2, name_en: 'Two', name_cn: '二' },
  { val: 3, name_en: 'Three', name_cn: '三' },
  { val: 4, name_en: 'Four', name_cn: '四' },
  { val: 5, name_en: 'Five', name_cn: '五' },
  { val: 6, name_en: 'Six', name_cn: '六' },
  { val: 7, name_en: 'Seven', name_cn: '七' },
  { val: 8, name_en: 'Eight', name_cn: '八' },
  { val: 9, name_en: 'Nine', name_cn: '九' },
  { val: 10, name_en: 'Ten', name_cn: '十' },
  { val: 11, name_en: 'Page', name_cn: '侍从' },
  { val: 12, name_en: 'Knight', name_cn: '骑士' },
  { val: 13, name_en: 'Queen', name_cn: '王后' },
  { val: 14, name_en: 'King', name_cn: '国王' },
];

// ---------------------------------------------------------
// 3. 生成完整牌库的函数
// ---------------------------------------------------------
export const getTarotDeck = (): TarotCard[] => {
  const deck: TarotCard[] = [];

  // 添加大阿卡纳
  majorArcanaData.forEach((card) => {
    deck.push({
      id: `m${card.idx}`,
      name_cn: card.cn,
      name_en: card.en,
      suit: 'major',
      image: `/cards/m${card.idx}.jpg`, // 假设图片名为 m00.jpg, m01.jpg...
      keywords: card.keywords,
    });
  });

  // 添加小阿卡纳
  suits.forEach((suit) => {
    ranks.forEach((rank) => {
      // 格式化 ID，例如 w01, w14
      const idNum = rank.val.toString().padStart(2, '0');
      const id = `${suit.prefix}${idNum}`;
      
      deck.push({
        id: id,
        name_cn: `${suit.name_cn}${rank.name_cn}`, // e.g., 权杖王牌
        name_en: `${rank.name_en} of ${suit.name_en}`, // e.g., Ace of Wands
        suit: suit.id,
        image: `/cards/${id}.jpg`, // e.g., /cards/w01.jpg
        keywords: [suit.name_cn, rank.name_cn], // 简化版关键词，具体解读交给AI
      });
    });
  });

  return deck;
};

// 导出完整的牌库数组
export const TAROT_DECK = getTarotDeck();
