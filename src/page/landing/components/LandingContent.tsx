/**
 * @license MIT
 * Created by: joetao
 * Created on: 2025/1/21
 * Project: xryder
 * Description: This is a rapid development template for middle and backend UI based on vite, react, tailwindcss and shadcn.
 */
import {Button} from "@/components/ui/button";
import {FaGithub} from "react-icons/fa";
import * as React from "react";
import {RainbowButton} from "@/components/ui/rainbow-button";
import {useNavigate} from "react-router-dom";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import { AuroraText } from "@/components/ui/aurora-text";
import {cn} from "@/lib/utils";
import Marquee from "@/components/ui/marquee";
const reviews = [
    {
        name: "Java",
        version: "21",
        body: "长期支持版本，支持Spring Ai",
        img: "https://avatar.vercel.sh/jack",
    },
    {
        name: "Spring Boot",
        version: "3.4.0",
        body: "集成Spring Data Jpa和Spring Security",
        img: "https://avatar.vercel.sh/jill",
    },
    {
        name: "Spring AI",
        version: "1.0.0",
        body: "一个面向 AI 工程的应用框架，其目标是将 Spring 生态系统应用到 AI 领域",
        img: "https://avatar.vercel.sh/john",
    },
    {
        name: "Vite",
        version: "6.0.x",
        body: "Vite 是一个超快速的前端构建工具，推动着下一代网络应用的发展",
        img: "https://avatar.vercel.sh/james",
    },
    {
        name: "React",
        version: "18.3.1",
        body: "用于构建 Web 和原生交互界面的库",
        img: "https://avatar.vercel.sh/jane",
    },
    {
        name: "react-router-dom",
        version: "7.0.1",
        body: "React 生态系统中最常用的路由库之一，用于在单页应用程序 (SPA) 中实现客户端路由功能。",
        img: "https://avatar.vercel.sh/jenny",
    },
    {
        name: "zustand",
        version: "5.0.1",
        body: "一个轻量、高效的 React 状态管理库，采用简单的 API 和无样板代码的方式管理全局和局部状态",
        img: "https://avatar.vercel.sh/james",
    },
    {
        name: "zod",
        version: "3.23.8",
        body: "一个 TypeScript 优化的模式声明与验证库，用于安全地解析和验证数据结构",
        img: "https://avatar.vercel.sh/jack",
    },
    {
        name: "axios",
        version: "1.7.8",
        body: "一个基于 Promise 的 JavaScript HTTP 客户端，用于在浏览器和 Node.js 中发送请求和处理响应",
        img: "https://avatar.vercel.sh/john",
    },
    {
        name: "tailwindcss",
        version: "3.4.15",
        body: "一个实用优先的 CSS 框架，内置了诸如 flex、pt-4、text-center 和 rotate-90 等类，可以直接在标记中组合使用，构建任何设计。",
        img: "https://avatar.vercel.sh/jane",
    },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
                        img,
                        name,
                        version,
                        body,
                    }: {
    img: string;
    name: string;
    version: string;
    body: string;
}) => {
    return (
        <figure
            className={cn(
                "relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
                // light styles
                "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
                // dark styles
                "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
            )}
        >
            <div className="flex flex-row items-center gap-2">
                <img className="rounded-full" width="32" height="32" alt="" src={img} />
                <div className="flex flex-col">
                    <figcaption className="text-sm font-medium dark:text-white">
                        {name}
                    </figcaption>
                    <p className="text-xs font-medium dark:text-white/40">{version}</p>
                </div>
            </div>
            <blockquote className="mt-2 text-sm">{body}</blockquote>
        </figure>
    );
};
function LandingContent() {
    const navigate = useNavigate();
    return (
        <div>
            <div className="relative flex
                            h-[500px] w-full
                            flex-col items-center
                            justify-center overflow-hidden
                            rounded-lg bg-background
                            gap-6">
              <span className="w-[400px] leading-normal
                              pointer-events-none whitespace-pre-wrap
                              bg-gradient-to-b from-black
                              to-gray-300/80 bg-clip-text
                              text-center text-6xl
                              font-semibold leading-none
                              text-transparent dark:from-white
                              dark:to-slate-900/10">
                AI时代的WEB开发模板
              </span>
                <div className={'w-[320px] text-muted-foreground text-lg mt-4'}>
                    X.Ryder（莱德）是一个轻量、灵活、具备AI功能的WEB开发模板
                </div>
                <div className={'flex gap-4'}>
                    <RainbowButton className={'font-semibold'} onClick={() => navigate('/login')}>
                        Demo
                    </RainbowButton>
                    <Button variant={"outline"} className={'gap-2 font-semibold'}
                            onClick={() => window.open("https://github.com/pipijoe/xryder-web", "_blank")}>
                        <FaGithub/>
                        GitHub
                    </Button>
                </div>
            </div>
            <div>
                <div className="relative flex
                                mb-8 w-full
                                flex-col items-center
                                justify-center overflow-hidden
                                rounded-lg bg-background
                                gap-6">
                    <span className="text-4xl font-semibold
                                     bg-gradient-to-br
                                     from-sky-400 to-gray-500
                                     dark:from-sky-400 dark:to-white
                                     text-transparent bg-clip-text">
                    让你的系统别具一格
                    </span>
                    <p className={'text-muted-foreground font-medium text-lg'}>告别千篇一律，我要与众不同</p>
                </div>
                <div className={'flex gap-4 max-w-4xl mx-auto mb-4'}>
                    <div className="flex-2 basis-2/3">
                        <Card className={'h-64'}>
                            <CardContent>
                                <p>这是内容</p>
                                <p>这是内容</p>
                                <p>这是内容</p>
                                <p>这是内容</p>
                            </CardContent>
                            <CardHeader>
                                <CardTitle>高可定制</CardTitle>
                                <CardDescription>基于 shadcn/ui 和 TailwindCSS，提供可访问、可定制的高质量组件，用于快速构建优雅的 React 用户界面。</CardDescription>
                            </CardHeader>
                        </Card>
                    </div>
                    <div className="flex-1 basis-1/3">
                        <Card className={'h-64'}>
                            <CardHeader>
                                <CardTitle>自带AI</CardTitle>
                                <CardDescription>内置大模型对话功能</CardDescription>
                            </CardHeader>
                        </Card>
                    </div>

                </div>
                <div className={'flex gap-4 max-w-4xl mx-auto'}>
                    <div className="flex-1 basis-1/3">
                        <Card className={'h-64'}>
                            <CardHeader>
                                <CardTitle>丰富动效</CardTitle>
                                <CardDescription>通过 Framer Motion 实现流畅交互动画，结合 Lottie 渲染精美的矢量动画，为应用提供丰富多样且高性能的动效体验</CardDescription>
                            </CardHeader>
                        </Card>
                    </div>
                    <div className="flex-2 basis-2/3">
                        <Card className={'h-64'}>
                            <CardContent>
                                <p>这是内容</p>
                                <p>这是内容</p>
                                <p>这是内容</p>
                                <p>这是内容</p>
                            </CardContent>
                            <CardHeader>
                                <CardTitle>智能监控</CardTitle>
                                <CardDescription>基于text2sql技术实现灵活的可视化监控信息展示</CardDescription>
                            </CardHeader>
                        </Card>
                    </div>

                </div>
            </div>
            <div>
                <div className="relative flex
                                mb-8 w-full
                                flex-col items-center
                                justify-center overflow-hidden
                                rounded-lg bg-background
                                gap-6 mt-24">
                    <span className="text-4xl font-semibold
                                     bg-gradient-to-br
                                     from-lime-400 to-gray-500
                                     dark:from-lime-400 dark:to-white
                                     text-transparent bg-clip-text">
                    用X.Ryder做开发
                    </span>
                    <p className={'text-muted-foreground font-medium text-lg'}>开心愉快</p>
                </div>
                <div className={'flex gap-4 max-w-4xl mx-auto mb-4'}>
                    <div className="flex-1 basis-1/3">
                        <Card className={'h-64'}>
                            <CardHeader>
                                <CardTitle>轻量</CardTitle>
                                <CardDescription>启动快，开发快，部署快，更易上手</CardDescription>
                            </CardHeader>
                        </Card>
                    </div>
                    <div className="flex-2 basis-2/3">
                        <Card className={'h-64'}>
                            <CardContent>
                                <p>这是内容</p>
                                <p>这是内容</p>
                                <p>这是内容</p>
                                <p>这是内容</p>
                            </CardContent>
                            <CardHeader>
                                <CardTitle>前卫</CardTitle>
                                <CardDescription>使用国内大厂、国际流行的技术栈</CardDescription>
                            </CardHeader>
                        </Card>
                    </div>
                </div>
                <div className={'flex gap-4 max-w-4xl mx-auto'}>
                    <div className="flex-2 basis-2/3">
                        <Card className={'h-64'}>
                            <CardContent>
                                <p>这是内容</p>
                                <p>这是内容</p>
                                <p>这是内容</p>
                                <p>这是内容</p>
                            </CardContent>
                            <CardHeader>
                                <CardTitle>大模型友好</CardTitle>
                                <CardDescription>使用最流行的技术，大模型可以有更好的回答</CardDescription>
                            </CardHeader>
                        </Card>
                    </div>
                    <div className="flex-1 basis-1/3">
                        <Card className={'h-64'}>
                            <CardHeader>
                                <CardTitle>为全栈而生</CardTitle>
                                <CardDescription>在AI时代，你就是10x程序员</CardDescription>
                            </CardHeader>
                        </Card>
                    </div>
                </div>
            </div>
            <div className="relative flex
                            mb-8 w-full
                            flex-col items-center
                            justify-center overflow-hidden
                            rounded-lg bg-background
                            gap-6 mt-24">
                <div className={'text-4xl font-bold tracking-tighter'}>
                    <AuroraText>流行和可靠的技术路线</AuroraText>
                </div>
                <p className={'text-muted-foreground font-medium text-lg'}>用于构建该项目的工具、框架、编程语言和技术</p>
                <div>
                    <Marquee pauseOnHover className="[--duration:20s]">
                        {firstRow.map((review) => (
                            <ReviewCard key={review.version} {...review} />
                        ))}
                    </Marquee>
                    <Marquee reverse pauseOnHover className="[--duration:20s]">
                        {secondRow.map((review) => (
                            <ReviewCard key={review.version} {...review} />
                        ))}
                    </Marquee>
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"></div>
                    <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"></div>
                </div>
            </div>
            <div className="relative flex
                            mb-8 w-full
                            flex-col items-center
                            justify-center overflow-hidden
                            rounded-lg bg-background
                            gap-6 mt-24">
                    <span className="text-4xl font-semibold bg-clip-text">
                    免费 & 开源
                    </span>
                <p className={'text-muted-foreground font-medium text-lg'}>X.Ryder基于MIT许可，并将始终保持免费和开源</p>
                <div className={'flex gap-4'}>
                    <RainbowButton className={'font-semibold'} onClick={() => navigate('/login')}>
                        Demo
                    </RainbowButton>
                    <Button variant={"outline"} className={'gap-2 font-semibold'}
                            onClick={() => window.open("https://github.com/pipijoe/xryder-web", "_blank")}>
                        <FaGithub/>
                        GitHub
                    </Button>
                </div>
            </div>
        </div>

    )
}

export default LandingContent
