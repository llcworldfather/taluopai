# 神秘塔罗占卜 - Next.js 应用

一个使用 Next.js、Tailwind CSS 和 Framer Motion 构建的塔罗牌占卜应用。

## 功能特点

- 🎴 **经典圣三角牌阵**: 过去、现在、未来三张牌解读
- ✨ **精美动画效果**: 洗牌、抽牌、翻转动画
- 🔮 **AI 智能解读**: 使用 OpenAI API 生成个性化解读
- 🌙 **暗黑主题**: 神秘优雅的视觉设计
- 📱 **响应式设计**: 支持各种设备尺寸

## 技术栈

- **Next.js 14** - React 全栈框架
- **TypeScript** - 类型安全
- **Tailwind CSS** - 快速样式开发
- **Framer Motion** - 流畅动画
- **OpenAI API** - AI 解读

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 环境配置

创建 `.env.local` 文件：

```env
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. 运行开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 项目结构

```
src/
├── app/                    # App Router
│   ├── api/tarot/route.ts  # AI 占卜 API
│   ├── globals.css         # 全局样式
│   └── page.tsx           # 主页面
├── components/             # 组件
│   └── TarotCard.tsx      # 卡牌组件
├── data/                   # 数据
│   └── tarot.ts           # 塔罗牌数据
└── utils/                  # 工具函数
    └── tarotLogic.ts      # 抽牌逻辑
```

## 使用说明

1. 在输入框中输入你的问题
2. 点击"开始占卜"按钮
3. 等待洗牌动画完成
4. 点击"揭示命运"查看 AI 解读

## 自定义配置

### 添加卡牌图片

将卡牌图片放入 `public/cards/` 目录，命名格式：
- 大阿卡纳: `m00.jpg`, `m01.jpg`, ..., `m21.jpg`
- 小阿卡纳: `w01.jpg`, `c01.jpg`, `s01.jpg`, `p01.jpg`, ...

### 修改 AI 提示词

编辑 `src/app/api/tarot/route.ts` 中的 `prompt` 变量来自定义 AI 的解读风格。

## 部署

### Vercel 部署

1. 推送代码到 GitHub 仓库
2. 在 Vercel 中连接仓库
3. 设置环境变量 `OPENAI_API_KEY`
4. 部署完成！

### 其他平台

```bash
# 构建
npm run build

# 启动生产服务器
npm run start
```

## 许可证

MIT License
