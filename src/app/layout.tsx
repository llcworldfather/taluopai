import type { Metadata } from "next";
// 引入全局样式（非常重要，否则 Tailwind 和背景样式可能失效）
import "./globals.css";

export const metadata: Metadata = {
    title: "神秘塔罗占卜",
    description: "倾听内心的声音，探寻命运的指引",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="zh-CN">
        {/* body 标签是必须的 */}
        <body>{children}</body>
        </html>
    );
}