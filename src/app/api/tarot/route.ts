// src/app/api/tarot/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { drawCards, generateAIPrompt } from '@/utils/tarotLogic';

// 创建 DeepSeek OpenAI 客户端
const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: 'sk-2317cc6c1c7e44f8ad8e29f1632391b9',
});

async function getTarotReading(question: string, cards: any[]) {
  const prompt = `
你是一位神秘、富有同理心且直觉敏锐的塔罗牌占卜师。
你的任务是根据用户的问题和抽出的三张牌（包含正逆位）进行解读。

牌阵：圣三角（过去、现在、未来）。

请按以下格式输出（支持 Markdown）：
1. **整体启示**：一句话总结。
2. **牌面解析**：
   - **过去** [牌名]: 解读...
   - **现在** [牌名]: 解读...
   - **未来** [牌名]: 解读...
3. **给求问者的建议**：温馨且有指导意义的建议。

语气要求：神秘、优雅，避免过于迷信，多给心理层面的指引。

${generateAIPrompt(question, cards)}
`;

  try {
    const response = await openai.chat.completions.create({
      model: 'deepseek-chat',
      messages: [{ role: 'system', content: prompt }],
      stream: true,
    });

    return response;
  } catch (error) {
    console.error('Error calling DeepSeek API:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { question } = await request.json();
    
    if (!question) {
      return NextResponse.json({ error: '问题不能为空' }, { status: 400 });
    }

    // 抽牌
    const cards = drawCards(3);

    // 调用 AI
    const aiResponse = await getTarotReading(question, cards);

    // 返回流式响应
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of aiResponse) {
          if (chunk.choices && chunk.choices[0]?.delta?.content) {
            const text = chunk.choices[0].delta.content;
            controller.enqueue(encoder.encode(text));
          }
        }
        controller.close();
      }
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  } catch (error) {
    console.error('Error in tarot API:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
