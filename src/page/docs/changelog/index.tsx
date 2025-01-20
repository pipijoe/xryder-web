/**
 * @license MIT
 * Created by: joetao
 * Created on: 2024/12/11
 * Project: xryder
 * Description: This is a rapid development template for middle and backend UI based on vite, react, tailwindcss and shadcn.
 */
import React from "react";
import ReactMarkdown from "react-markdown";
import {getTheme} from "@/components/theme-provider";
import {SidebarTrigger} from "@/components/ui/sidebar";
import {Separator} from "@/components/ui/separator";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import {Helmet} from "react-helmet-async";
import {Prism as SyntaxHighlighter} from "react-syntax-highlighter";
import {vscDarkPlus} from "react-syntax-highlighter/dist/cjs/styles/prism";

const markdownContent = `
# 更新日志

## 2025/1/20
- 增加智能监控
- 侧边栏优化

## 2025/1/6
- 增加个性化设置
- 增加中英文切换
- 一些bug的修复

## 2025之前
- 系统管理功能
- 智能对话功能
- 个人设置
- 登录登出
- 全局错误提示
- token无感刷新
- 修复智能助手中，切换页面导致sse连接断开等bug

`;

const ChangeLog = () => {
    const theme = getTheme(); // 获取当前主题
    return (
        <div className={`${theme === "dark" ? "prose-dark" : ""}`}>
            <Helmet>
                <title>更新日志</title>
            </Helmet>
            <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4">
                <div className="flex flex-1 items-center gap-2 px-3">
                    <SidebarTrigger className="-ml-1"/>
                    <Separator orientation="vertical" className="mr-2 h-4"/>
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbLink href="/">
                                    首页
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block"/>
                            <BreadcrumbItem className="hidden md:block">
                                文档
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block"/>
                            <BreadcrumbItem className="hidden md:block">
                                更新日志
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>
            <div className="prose max-w-4xl mx-auto mt-2 pb-2">
                <ReactMarkdown
                    components={{
                        code({ inline, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || ""); // 获取语言类型
                            return !inline && match ? (
                                <SyntaxHighlighter
                                    style={vscDarkPlus} // 根据主题切换高亮样式
                                    language={match[1]}
                                    PreTag="div"
                                    {...props}
                                >
                                    {String(children).replace(/\n$/, "")}
                                </SyntaxHighlighter>
                            ) : (
                                <code className={className} {...props}>
                                    {children}
                                </code>
                            );
                        },
                    }}
                >
                    {markdownContent}
                </ReactMarkdown>
            </div>
        </div>
    );
};

export default ChangeLog;
