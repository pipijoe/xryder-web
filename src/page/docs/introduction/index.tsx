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
# 简介
----
这是一个前后端分离的开源WEB项目，英文叫**X.Ryder**，对应中文叫“**莱德**”。项目基于流行的前后端技术进行搭建，集成了AI功能，可以通过这个基础项目快速搭建出一个中后台管理系统的开发框架。

## 技术栈
前端：React、Vite、Aixos、Zustand、react-router-dom、tailwindcss、shadcn/ui、framer-motion...

后端：Java 21、Spring Boot、Spring Jpa、Spring AI、Spring Security、MYSQL

## 设计理念
本框架的核心聚焦于**系统管理**、**大模型**以及**安全及监控**的实现，致力于最大限度地减少非必要依赖，确保其具备高度的灵活性、精巧的设计、易用性及安全性。

## 生态赋能
我们采用全球范围内最受欢迎的组件进行构建，依托于蓬勃发展的生态系统，为项目后续的开发与迭代提供了源源不断的社区支持，保障了项目持续进步与创新。

## 主要功能
1. 登录、token刷新、多次登录失败锁定
2. 深色模式
3. AI对话
4. 系统管理
    - 用户管理
    - 角色管理、权限校验
    - 部门管理
    - 操作日志
    - 登录日志
    - 职位管理
    - 通知公告
5. 个人账户
    - 密码重置
    - 头像修改
    - 账户管理
6. 其他
    * 403 和 500 页面
    * 400异常处理
 
## 📬 联系方式

你可以通过这些方式跟我联系💫：

- Email:  cutesimba@163.com

----

更新时间: 2024/12/12

`;

const Introduction = () => {
    const theme = getTheme(); // 获取当前主题
    return (
        <div className={`${theme === "dark" ? "prose-dark" : ""}`}>
            <Helmet>
                <title>简介</title>
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
                                简介
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

export default Introduction;
