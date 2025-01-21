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
                                     from-sky-400 to-gray-500
                                     dark:from-sky-400 dark:to-white
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
                    <span className="text-4xl font-semibold bg-clip-text">
                    免费 & 开源
                    </span>
                <p className={'text-muted-foreground font-medium text-lg'}>X.Ryder基于MIT许可，并将始终保持免费和开源</p>
            </div>
        </div>

    )
}

export default LandingContent