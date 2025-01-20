/**
 * @license MIT
 * Created by: joetao
 * Created on: 2024/12/3
 * Project: xryder
 * Description: This is a rapid development template for middle and backend UI based on vite, react, tailwindcss and shadcn.
 */
import {useVisitorStore} from "@/store/visitorStore";
import React, {useEffect, useRef, useState} from "react";
import VisitorChart from "@/page/monitor/uv/VisitorChart";
import {SidebarTrigger} from "@/components/ui/sidebar";
import {Separator} from "@/components/ui/separator";
import {Input} from "@/components/ui/input";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import {Helmet} from "react-helmet-async";
import AiAgentAvatar from "@/components/AiAgentAvatar";
import {AiOutlineEnter} from "react-icons/ai";
import {Skeleton} from "@/components/ui/skeleton";
import ChartContainer from "@/page/monitor/components/ChartContainer";
import {toast} from "sonner";


const Monitor = () => {
    const {uv, count, monitors, chat, thinking} = useVisitorStore()
    const messagesEndRef = useRef(null);

    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    useEffect(() => {
        uv();
    }, [])

    const handleSend = () => {
        const newMessages = [
            ...messages,
            input
        ];
        chat(input).then((message) => {
            if (message) {
                toast.warning(message)
            }
        })
        setMessages(newMessages);
        setInput('');
    }
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            // 这里可以添加提交逻辑
            handleSend()
        }
    };

    useEffect(() => {
        const scrollToBottom = () => {
            messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
        };

        scrollToBottom();
    }, [messages]);

    return (
        <div>
            <Helmet>
                <title>监控</title>
            </Helmet>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
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
                                <BreadcrumbLink>
                                    系统
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block"/>
                            <BreadcrumbItem>
                                <BreadcrumbPage>监控</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>
            <div className={'p-4'}>
                {monitors.length == 0 && !thinking && (
                    <div className={'flex flex-col items-center justify-center'} style={{ height: 'calc(100vh - 128px)' }}>
                        <h2 className={'font-bold text-3xl'}>智能系统监控</h2>
                        <p className={'text-muted-foreground'}>请试试通过点击右下角的小图标跟我进行交互</p>
                    </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

                    {monitors.filter(m => m.message.length === 0).map(m => (
                        <div className="w-full rounded">
                            <ChartContainer data={m} />
                        </div>
                    ))}
                    {thinking &&
                        <div className="w-full p-4 rounded h-60">
                            <div className="flex flex-col space-y-3 w-full">
                                <div className="space-y-2">
                                    <Skeleton className="h-8 w-full"/>
                                    <Skeleton className="h-24 w-3/4"/>
                                </div>
                                <div className="flex flex-row gap-2 justify-between">
                                    <Skeleton className="h-4 w-full"/>
                                    <Skeleton className="h-4 w-full"/>
                                    <Skeleton className="h-4 w-3/4"/>
                                </div>
                                <div className="flex flex-row gap-2 justify-between">
                                    <Skeleton className="h-4 w-full"/>
                                    <Skeleton className="h-4 w-3/4"/>
                                </div>
                            </div>
                        </div>
                    }
                </div>

            </div>
            <div className="fixed bottom-24 right-20 w-[400px] h-[200px]">
                <div
                    className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-background to-transparent z-10 mr-6"/>
                {/* 显示消息列表 */}
                <div className="absolute inset-0 flex justify-end items-end p-4">
                    <div className="space-y-2 max-h-[180px] overflow-y-auto w-full text-right pr-4">
                        {messages.map((message, index) => (
                            <>
                                <div key={index}
                                     className="shadow-sm bg-opacity-60 bg-muted/50 rounded-3xl border p-1 pr-4 pl-4 inline-block">
                                    <p className="text-sm font-medium whitespace-nowrap">{message}</p>
                                </div>
                                <br/>
                            </>
                        ))}
                        <div ref={messagesEndRef}/>
                    </div>
                </div>
            </div>
            <div className={'fixed bottom-4 right-4'}>
                {/* AiAgentAvatar 触发按钮 */}
                <AiAgentAvatar onClick={() => setIsOpen(!isOpen)} status={thinking ? 'working' : 'ready'}/>

                {/* 滑动输入框 */}
                <div
                    className={`absolute bottom-1 right-0 transform transition-transform duration-300 ${
                        isOpen ? "-translate-x-16" : "translate-x-full"
                    }`}
                >
                    <div className="border border-gray-300 rounded-lg shadow-md px-4 py-2 mt-2">
                        <Input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="试试这样问：最近7天，每天的访客数是多少？"
                            className="w-[400px] border-0 shadow-none focus-visible:ring-0"
                        />
                        <div className="absolute right-6 top-[60%] transform -translate-y-1/2 cursor-pointer">
                            <AiOutlineEnter size={20}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Monitor