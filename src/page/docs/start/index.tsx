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
import {darcula} from "react-syntax-highlighter/dist/cjs/styles/prism";

const markdownContent = `
# 开始
----
本项目是一个前后端分离项目，前端基于Vite和React，后端基于Java 21、Spring Boot和MySQL。

先从github上将项目拉取到本地。这是[前端地址](https://github.com/pipijoe/xryder-web)和[后端地址](https://github.com/pipijoe/xryder-server)。

## 前端
进入项目目录后，执行如下命令进行依赖的安装和本地开发运行。
\`\`\`bash
npm install

npm run dev
\`\`\`

打包
\`\`\`bash
npm run build
\`\`\`

## 后端
**1. 数据库**  
首先安装MYSQL 8.x，创建名为ryder的数据库，你也可以创建其他名称的数据库，只需要修改对应的application中关于数据库连接信息。将项目中sql文件下的脚本执行一遍，创建并插入相关数据。  

**2. JDK**  
本项目因为引入了Spring AI作为大模型的开发框架，Spring AI最低支持Java17，所以项目中直接使用了Java21的版本，Java17的版本本项目没有进行测试，不知道是否适配。所以需要安装JDK21，并配置相关的开发环境。

**3. 申请大模型App-Key**  
项目中引入的Open AI的开发框架，使用的是智普AI的免费大模型。建议可以去智普大模型官网进行APPKey的申请。并将key配置到环境变量中或者直接写入application.yml中。

可以考虑使用国产大模型**智普AI**，效果不错，接入方便，还有免费模型可以使用。支持OpenAPI格式。
\`\`\`yaml
spring:
      ai:
    openai:
      api-key: ZHIPU_AI_API_KEY
      base-url: https://open.bigmodel.cn/api/paas/
      chat:
        api-key: ZHIPU_AI_API_KEY
        base-url: https://open.bigmodel.cn/api/paas/
        completions-path: /v4/chat/completions
        options:
          model: GLM-4-flash
\`\`\`
如果是直接使用的openai的key，则只需要配置api-key。  
如果是使用的代理地址，则更换base-url和completions。

**4. 安装依赖**  
**5. 修改application.yml的数据库连接信息**  
**6. 启动项目**  
项目启动后，会自动初始化管理员账号。cn.xryder.base.config.DataInitializer为账户初始化类，可以查看管理员账号及密码。
**7. 登录系统**  
打开系统页面，默认是5173端口，输入管理员账号密码进行登录。

## 📬 联系方式

你可以通过这些方式跟我联系💫：

- Email:  cutesimba@163.com

----

更新时间: 2024/12/12

`;

const Start = () => {
    const theme = getTheme(); // 获取当前主题
    return (
        <div className={`${theme === "dark" ? "prose-dark" : ""}`}>
            <Helmet>
                <title>开始</title>
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
                                开始
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>
            <div className="prose max-w-4xl mx-auto mt-2 pb-2">
                <ReactMarkdown
                    components={{
                        code({inline, className, children, ...props}) {
                            const match = /language-(\w+)/.exec(className || ""); // 获取语言类型
                            return !inline && match ? (
                                <SyntaxHighlighter
                                    style={darcula} // 根据主题切换高亮样式
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

export default Start;
