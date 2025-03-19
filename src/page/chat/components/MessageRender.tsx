import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; // 引入remark-gfm插件
import { TooltipContent } from "@/components/ui/tooltip";
import { useEffect, useRef } from "react";
import { fileImg } from "@/utils";
import CodeCopyButton from "@/components/common/CodeCopyButton";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";

/**
 * Created by: joetao
 * Created on: 2025/1/13
 * Project: my-app
 * Description: This is a rapid development template for middle and backend UI based on vite, react, tailwindcss and shadcn.
 */

interface Message {
  sender: string;
  avatar?: React.ReactNode;
  text?: string;
  docs?: string[];
  images?: string[];
}

interface MessageRenderProps {
  messages: Message[];
  botState: string;
}

const MessageRender: React.FC<MessageRenderProps> = ({
  messages,
  botState,
}) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    scrollToBottom();
  }, [messages]);

  const renderers = {
    ul: ({ children }) => <ul className="list-disc list-inside">{children}</ul>,
    ol: ({ children, ...props }) => {
      const start = props.start || 1; // 如果 Markdown 中未指定，默认为 1
      return (
        <ol start={start} className="list-decimal list-inside">
          {children}
        </ol>
      );
    },
    li: ({ children }) => <li className="my-2">{children}</li>,
    a: ({ href, children }) => {
      const isExternal = href?.startsWith("http");
      return (
        <a
          href={href}
          target={isExternal ? "_blank" : "_self"}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="text-blue-500 underline hover:text-blue-700"
        >
          {isExternal && <span className="ml-1 text-sm">🔗</span>}
          {children}
        </a>
      );
    },
    code: ({ node, inline, className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <div className="relative rounded-md ">
          <SyntaxHighlighter
            style={darcula}
            language={match[1]}
            PreTag="div"
            children={String(children).replace(/\n$/, "")}
            {...props}
          />
          <div className={"absolute top-2 right-2"}>
            <CodeCopyButton text={String(children).replace(/\n$/, "")} />
          </div>
        </div>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  };

  return (
    <div className="w-full rounded-xl p-16 pb-16 flex flex-grow items-center justify-center">
      <div className={"w-full md:w-[900px] flex flex-col"}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start select-text ${
              msg.sender === "user"
                ? "my-2 py-4 rounded-xl self-end"
                : "pr-4 self-start"
            }`}
          >
            {msg.sender === "bot" && msg.avatar}
            {msg.sender === "bot" &&
              messages.length == index + 1 &&
              botState == "thinking" && (
                <div className={"mt-3"}>
                  <span className="relative flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-200 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-lime-400"></span>
                  </span>
                </div>
              )}
            <div>
              {msg.sender === "user" ? (
                <div>
                  {msg.docs
                    .filter(
                      (f) =>
                        !["png", "jpeg", "jpg"].includes(f.split(".").pop())
                    )
                    .map((f: string, index) => (
                      <div
                        className="relative p-2 mb-2 mr-2 bg-foreground/25 rounded-xl"
                        key={index}
                      >
                        <div className="flex  gap-2">
                          <div className="flex-none relative">
                            <img
                              src={fileImg}
                              alt="file"
                              className={`w-12 h-12 rounded-xl`}
                            />
                          </div>
                          <div>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="w-64 overflow-hidden whitespace-nowrap text-ellipsis font-semibold">
                                    {f}
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>{f}</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <div className="text-token-text-tertiary">
                              {f.split(".").pop()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  {msg.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt="Uploaded Preview"
                      style={{ maxWidth: "360px", height: "auto" }}
                      className="mb-1"
                    />
                  ))}
                  <div className={"flex relative justify-end items-center"}>
                    <div className="whitespace-pre-wrap bg-card p-2 px-4 rounded-3xl border">
                      {msg.text}
                    </div>
                    {msg.avatar}
                  </div>
                </div>
              ) : (
                <div>
                  {msg.text && (
                    <ReactMarkdown
                      className="markdown-body"
                      remarkPlugins={[remarkGfm]} // 使用remark-gfm插件
                      components={renderers}
                    >
                      {msg.text}
                    </ReactMarkdown>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageRender;
