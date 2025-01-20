/**
 * Created by: joetao
 * Created on: 2025/1/10
 * Project: my-app
 * Description: This is a rapid development template for middle and backend UI based on vite, react, tailwindcss and shadcn.
 */
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; // 引入remark-gfm插件
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import React from "react";
import MySingleValueChart from "@/page/monitor/components/MySingleValueChart";
import ChatLineChart from "@/page/monitor/components/ChatLineChart";
import ChatBarChart from "@/page/monitor/components/ChatBarChart";

const ChartContainer = ({data}) => {
    return (
        <Tabs defaultValue="chart" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="chart">图表</TabsTrigger>
                <TabsTrigger value="sql">SQL</TabsTrigger>
            </TabsList>
            <TabsContent value="chart">
                {data.data.length === 1 ? <MySingleValueChart data={data}/> : (
                    <>
                        {data.chartType === 'Line' && <ChatLineChart data={data}/>}
                        {data.chartType === 'Bar' && <ChatBarChart data={data}/>}
                    </>)}
            </TabsContent>
            <TabsContent value="sql">
                <ReactMarkdown
                    className="markdown-body"
                    remarkPlugins={[remarkGfm]} // 使用remark-gfm插件
                    components={{
                        code({inline, className, children, ...props}) {
                            const match = /language-(\w+)/.exec(className || "");
                            return !inline && match ? (
                                <SyntaxHighlighter
                                    style={darcula} // 选择高亮样式
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
                    {data.sql}
                </ReactMarkdown>
            </TabsContent>
        </Tabs>
    )
}

export default ChartContainer