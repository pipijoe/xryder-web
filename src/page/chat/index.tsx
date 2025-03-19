/**
 * @license MIT
 * Created by: joetao
 * mail: cutesimba@163.com
 * Created on: 2024/12/3
 * Project: xryder
 * Description: This is a rapid development template for middle and backend UI based on vite, react, tailwindcss and shadcn.
 */
import { Helmet } from "react-helmet-async";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import MessageRender from "./components/MessageRender";
import MessageSender from "./components/MessageSender";

export function AiChat() {
  const [messages, setMessages] = useState<string[]>([]);
  const [botState, setBotState] = useState<string>("idle"); // 状态：idle, ready, typing, thinking
  const messageSenderProps = {
    messages,
    botState,
    setMessages,
    setBotState,
  };

  return (
    <div>
      <Helmet>
        <title>智能助手</title>
      </Helmet>
      <header className="flex h-16 sticky top-0 shrink-0 items-center gap-2 border-b px-4 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex flex-1 items-center gap-2 px-3 ">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/">首页</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink>playground</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>对话</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="min-h-[calc(100vh-140px)] absolute top-0 left-0 right-0 bottom-0 overflow-y-auto">
        <div className="flex flex-col h-full">
          <MessageRender messages={messages} botState={botState} />
          <MessageSender {...messageSenderProps} />
        </div>
      </div>
    </div>
  );
}
