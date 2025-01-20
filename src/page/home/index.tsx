import {getTheme} from "@/components/theme-provider";
import React from "react";
import {Helmet} from "react-helmet-async";
import {Prism as SyntaxHighlighter} from "react-syntax-highlighter";
import {vscDarkPlus} from "react-syntax-highlighter/dist/cjs/styles/prism";
import ReactMarkdown from "react-markdown";
import {SidebarTrigger} from "@/components/ui/sidebar";
import {Separator} from "@/components/ui/separator";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
} from "@/components/ui/breadcrumb";
import {NavActions} from "@/components/nav-actions";
import { alipayImg } from "@/utils"

/**
 * @license MIT
 * Created by: joetao
 * Created on: 2024/12/30
 * Project: xryder
 * Description: This is a rapid development template for middle and backend UI based on vite, react, tailwindcss and shadcn.
 */
const markdownContent = `
# 欢迎 🎉🎉🎉
----
这是一个前后端分离的开源WEB项目，英文叫**X.Ryder**，对应中文叫“**莱德**”。项目基于流行的前后端技术进行搭建，集成了AI功能，可以通过这个基础项目快速搭建出一个中后台管理系统的开发框架。

## 为什么会有这个项目？
我所在的团队之前没有统一的开发框架， 有使用若依的、芋道的，还有使用umi、react+antd自行搭建的，各种框架都在用。技术栈不统一，沟通和人员协调都成为问题，技术无法聚焦。借此机会，酝酿出了这个WEB模版。
采用了时下大厂和国外流行的技术栈进行构建，对大模型友好。使用大模型进行辅助编程时，提供的代码的可靠性更高。

同时，我认为未来的项目都会有AI功能，所以在这个模板中引入了AI相关的功能。可以说用这个模板作为开发框架，出生就带AI。

系统使用Java 21进行开发，主要是考虑到要引入Spring AI开发AI功能，Spring AI也正好发布了1.0.0的版本。Spring AI最低支持Java 17，索性一步到位，直接使用Java 21。但目前来看，Spring AI的版本在快速迭代中（几乎每周都有更新），这会导致有时候打包项目的时候发现找不到符号的情况。

## ChatGPT助力 ✨
实不相瞒，这个项目的大部分代码都是使用ChatGPT生成的。在ChatGPT的加持下，这个WEB模版可以在两个月内完成。除了在实现了系统管理相关功能的时候，补充了RBAC权限设计相关的理论知识。其他大部分时间都是跟ChatGPT进行你问我答。

## shadcn/ui
> Beautifully designed components that you can copy and paste into your apps. Made with Tailwind CSS. Open source.

这是shadcn的官网介绍，它的组件直接以源码的方式安装到你的项目中，这意味着你可以直接修改源码来改变组件的形态。对比AntD和ElementUI，shadcn牺牲了便利性，换来了灵活性。
这可以让我们创造的项目不在千篇一律，使用这个模板开发的系统会让人耳目一新，这估计也是吸引你们来到这里的原因之一吧。

## Spring Data JPA
在使用Spring Data JPA之前，我使用过很多数据库持久化框架，用的最多最久的是MyBatis。但现在我用上了Spring Data JPA之后，我不想再用其他的框架了。

JPA可以让我不写SQL，或者写很少很简单的SQL。这会提高工作效率，增强SQL的可读性。

## 技术栈 🔨
前端：React、Vite、Aixos、Zustand、react-router-dom、tailwindcss、shadcn/ui、framer-motion...

后端：Java 21、Spring Boot、Spring Jpa、Spring AI、Spring Security、MYSQL

## 设计理念
本框架的核心聚焦于**系统管理**、**大模型**，**安全及监控**的实现，致力于最大限度地减少非必要依赖，确保其具备高度的灵活性、精巧的设计、易用性及安全性。

## 生态赋能
我们采用全球范围内最受欢迎的组件进行构建，依托于蓬勃发展的生态系统，为项目后续的开发与迭代提供了源源不断的社区支持，保障了项目持续进步与创新。
 
## 联系方式 📬

你可以通过这些方式跟我联系💫：

- Email:  cutesimba@163.com

----

更新时间: 2024/12/12

`;
const Home = () => {
    const theme = getTheme(); // 获取当前主题
    return (
        <div className={`${theme === "dark" ? "prose-dark" : ""}`}>
            <Helmet>
                <title>欢迎</title>
            </Helmet>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                <div className="flex flex-1 items-center gap-2 px-3">
                    <SidebarTrigger className="-ml-1"/>
                    <Separator orientation="vertical" className="mr-2 h-4"/>
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbLink href="/">
                                    欢迎
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
                <div className="ml-auto px-3">
                    <NavActions/>
                </div>
            </header>
            <div className="prose max-w-4xl mx-auto mt-2 pb-2">
                <ReactMarkdown
                    components={{
                        code({inline, className, children, ...props}) {
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
                <h3 className={'text-xl'}>支持开源，共同进步! 🌱💡</h3>
                <p>
                    如果你觉得这个项目对你有帮助，欢迎通过捐赠支持我们继续改进和创新，共同打造更好的开源生态！
                </p>
                <img src={alipayImg} alt={'payment code'} width={300}/>
                <h3 className={'text-xl mt-16'}>🎉One More Thing！</h3>

                <p>云澜AI知识库，帮助团队沉淀知识，提供基于文档的AI问答功能，编辑时的文本润色，提供私有化部署方案。</p>
                <p className={'text-sm text-secondary-foreground'}>感兴趣可以通过邮件联系：cutesimba@163.com</p>
                <p>以下是视频演示：</p>
                <div className="relative w-full h-0 pb-[56.25%]">
                    <iframe
                        src="//player.bilibili.com/player.html?isOutside=true&aid=113718788621794&bvid=BV19VCzYUEBa&cid=27544126703&p=1"
                        scrolling="no" border="0" frameBorder="no" framespacing="0" allowFullScreen="true"
                        class="absolute top-0 left-0 w-full h-full"
                    >

                    </iframe>
                </div>
            </div>
        </div>
    )
}

export default Home