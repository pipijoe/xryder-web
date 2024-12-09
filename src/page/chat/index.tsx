/**
 * @license MIT
 * Created by: joetao
 * mail: cutesimba@163.com
 * Created on: 2024/12/3
 * Project: xryder
 * Description: This is a rapid development template for middle and backend UI based on vite, react, tailwindcss and shadcn.
 */
import {fetchEventSource} from '@microsoft/fetch-event-source';
import {Helmet} from 'react-helmet-async';
import ReactMarkdown from 'react-markdown';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import remarkGfm from 'remark-gfm'; // 引入remark-gfm插件
import {Light as SyntaxHighlighter} from 'react-syntax-highlighter';
import {atomOneDark} from 'react-syntax-highlighter/dist/esm/styles/hljs';
import React, {useEffect, useRef, useState} from "react";
import {agentImg, fileImg, imageImg, generateRandomString} from '@/utils'
import {FaCheck, FaCopy} from "react-icons/fa";
import './index.css'
import {buildStyles, CircularProgressbar} from 'react-circular-progressbar';
import {BookOpenText, CalendarCheck2, CornerDownLeft, Mail, Paperclip, SendHorizontal} from "lucide-react";
import {Button} from "@/components/ui/button";
import {TooltipContent} from "@/components/ui/tooltip";
import {Tooltip, TooltipProvider, TooltipTrigger} from "@radix-ui/react-tooltip";
import {Textarea} from "@/components/ui/textarea";
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";
import {useAccountStore} from "@/store/accountStore";
import {BiCircle} from "react-icons/bi";
import api from '../../axiosInstance';
import {TiDelete} from "react-icons/ti";
import {toast} from "sonner";
import {SidebarTrigger} from "@/components/ui/sidebar";
import {Separator} from "@/components/ui/separator";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList, BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import CodeCopyButton from "@/components/common/CodeCopyButton";

export function AiChat() {
    const {account} = useAccountStore();
    const [conversationId, setConversationId] = useState('');
    const [files, setFiles] = useState([]);
    const [images, setImages] = useState([]);
    const [uploadPercentage, setUploadPercentage] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [input, setInput] = useState('');
    const [copied, setCopied] = useState(false); // 跟踪是否已拷贝
    const [messages, setMessages] = useState([{
        text: '你好，请问有什么可以帮您的吗？',
        sender: 'bot',
        avatar: <img src={agentImg} alt="ChatGPT" className="w-6 h-6 rounded-full mt-1 mr-2"/>,
        docs: [],
        images: []
    }]);
    const textareaRef = useRef(null);
    const messagesEndRef = useRef(null);
    const [botState, setBotState] = useState('idle'); // 状态：idle, ready, typing, thinking
    const [aiToken, setAiToken] = useState('')
    useEffect(() => {
        getAiToken().then(r => setBotState('ready'));
    }, [])

    const getAiToken = async () => {
        const rsp: any = await api.get('/v1/ai/token', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
        });
        if (rsp.code == 200) {
            setAiToken(rsp.data)
        }
    }
    const maxFileSize = 5 * 1024 * 1024; // 5MB 文件大小限制
    // 支持的图片类型
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.size > maxFileSize) {
            toast.warning("文件大小超过5MB限制！")
            return;
        }
        setFiles([...files, selectedFile.name])
        setUploadPercentage(0);
        setUploading(true);
        uploadFile(selectedFile);
        if (allowedTypes.includes(selectedFile.type)) {
            const reader = new FileReader();
            // 当文件读取完成时触发
            reader.onloadend = () => {
                // 设置读取的图片为Base64格式，并存储在state中
                setImages([...images, reader.result]);
            };
            // 读取文件为Data URL（Base64）
            reader.readAsDataURL(selectedFile);
        }
    };

    const uploadFile = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('conversationId', conversationId);

        try {
            await api.post('/v1/ai/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setUploadPercentage(percentCompleted);
                },
            });
            setUploadPercentage(100)
            setUploading(false);
        } catch (err) {
            setUploadPercentage(0);
            setUploading(false);
        }
    };

    const deleteFile = (f: string) => {
        setFiles((prevFiles) => prevFiles.filter((file) => file !== f));
    }

    const handleSend = async (question?) => {
        if (botState != 'ready') {
            toast.warning("我还没准备好，请稍等！")
            return
        }
        question = question || input.trim()
        if (question) {
            const newMessages = [
                ...messages,
                {
                    text: question,
                    sender: 'user',
                    docs: files,
                    images: images,
                    avatar: <img src={'data:image/png;base64,' + account.avatar} alt="avatar"
                                 className="w-8 h-8 rounded-full ml-2"/>
                }
            ];
            setMessages(newMessages);
            setInput('');
            setFiles([])
            setImages([])
            setBotState('thinking'); // 机器人进入思考状态
            const botMessage = {
                text: '',
                sender: 'bot',
                avatar: <img src={agentImg} alt="ChatGPT" className="w-8 h-8 rounded-full mt-1 mr-2"/>,
                docs: [],
                images: []
            };
            setMessages([...newMessages, botMessage]);
            await fetchFromOpenAI(question, (msg) => {
                setBotState('typing'); // 机器人进入输入状态
                botMessage.text += msg.data.slice(1);
                setMessages([...newMessages, {...botMessage}]);
            });
            setBotState('ready'); // 机器人完成输出状态
        }
    };

    const fetchFromOpenAI = async (userInput, onMessage) => {
        const params = new URLSearchParams({
            message: userInput,
            conversationId,
            files: files.length > 0 ? JSON.stringify(files) : ''
        });
        const url = `/api/v1/ai/stream?${params.toString()}`;
        await fetchEventSource(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + aiToken
            },
            onopen(response) {
                console.log('Connection open');
            },
            onmessage(msg) {
                onMessage(msg);
            },
            onerror(err) {
                console.error('Connection error:', err);
                // 处理其他错误逻辑
            }
        });
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            // 这里可以添加提交逻辑
            handleSend()
        } else if (e.key === 'Enter' && e.shiftKey) {
            e.preventDefault();
            setInput((prevText) => prevText + '\n');
        }
    };

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight + 8}px`;
            if (textarea.scrollHeight > textarea.clientHeight) {
                textarea.style.overflowY = 'auto';
            } else {
                textarea.style.overflowY = 'hidden';
            }
        }
    }, [input]);

    useEffect(() => {
        const scrollToBottom = () => {
            messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
        };

        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const generatedString = generateRandomString(8);
        setConversationId(generatedString)
    }, [])

    const renderers = {
        ul: ({children}) => <ul className="list-disc list-inside">{children}</ul>,
        ol: ({children, ...props}) => {
            const start = props.start || 1; // 如果 Markdown 中未指定，默认为 1
            return (
                <ol start={start} className="list-decimal list-inside">
                    {children}
                </ol>
            );
        },
        li: ({children}) => <li className="my-2">{children}</li>,
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
        code: ({node, inline, className, children, ...props}) => {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
                <div className="relative rounded-md">
                    <SyntaxHighlighter
                        style={atomOneDark}
                        language={match[1]}
                        PreTag="div"
                        children={String(children).replace(/\n$/, '')}
                        {...props}
                    />
                    <div className={'absolute top-0 right-0'}>
                        <CodeCopyButton text={String(children).replace(/\n$/, '')} />
                    </div>
                </div>
            ) : (
                <code className={className} {...props}>
                    {children}
                </code>
            );
        }
    };

    return (
        <div>
            <Helmet>
                <title>智能助手</title>
            </Helmet>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4" >
                <div className="flex flex-1 items-center gap-2 px-3 ">
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
                                    playground
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block"/>
                            <BreadcrumbItem>
                                <BreadcrumbPage>对话</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>
            <div className="flex justify-center">
                <div className="w-full max-w-4xl flex flex-col h-[calc(100vh_-_theme(spacing.20))]">
                    <ScrollArea className={'flex-1'}>
                        <div className="flex w-full flex-col rounded-xl p-2">
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`max-w-3xl flex items-start select-text ${
                                        msg.sender === 'user'
                                            ? 'my-2 px-8 py-4 rounded-3xl self-end'
                                            : 'my-2 p-2 self-start'
                                    }`}
                                >
                                    {msg.sender === 'bot' && msg.avatar}
                                    {msg.sender === 'bot' && messages.length == index + 1 && botState == 'thinking' &&
                                        <div className={'mt-3'}>
                                            <span className="relative flex h-4 w-4">
                                              <span
                                                  className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-200 opacity-75"></span>
                                              <span
                                                  className="relative inline-flex rounded-full h-4 w-4 bg-lime-400"></span>
                                            </span>
                                        </div>
                                    }
                                    <div>
                                        {msg.sender === 'user' ? (
                                                <div>
                                                    {
                                                        msg.docs.filter(f => !['png', 'jpeg', 'jpg'].includes(f.split('.').pop())).map((f: string, index) => (
                                                            <div
                                                                className='relative p-2 mb-2 mr-2 bg-foreground/25 rounded-xl'
                                                                key={index}>
                                                                <div className="flex  gap-2">
                                                                    <div className='flex-none relative'>
                                                                        <img src={fileImg} alt="file"
                                                                             className={`w-12 h-12 rounded-xl`}
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <TooltipProvider>
                                                                            <Tooltip>
                                                                                <TooltipTrigger asChild>
                                                                                    <div
                                                                                        className="w-64 overflow-hidden whitespace-nowrap text-ellipsis font-semibold">{f}</div>
                                                                                </TooltipTrigger>
                                                                                <TooltipContent>
                                                                                    {f}
                                                                                </TooltipContent>
                                                                            </Tooltip>
                                                                        </TooltipProvider>
                                                                        <div
                                                                            className="text-token-text-tertiary">{f.split('.').pop()}</div>
                                                                    </div>
                                                                </div>
                                                            </div>)
                                                        )}
                                                    {
                                                        msg.images.map((image, index) => (
                                                            <img key={index} src={image} alt="Uploaded Preview"
                                                                 style={{maxWidth: "360px", height: "auto"}}
                                                                 className='mb-1'/>
                                                        ))
                                                    }
                                                    <div className={'flex relative justify-end items-center'}>
                                                        <div className='whitespace-pre-wrap'>{msg.text}</div>
                                                        {msg.avatar}
                                                    </div>
                                                </div>) :
                                            <div>
                                                <ReactMarkdown
                                                    className="markdown-body"
                                                    remarkPlugins={[remarkGfm]} // 使用remark-gfm插件
                                                    components={renderers}
                                                >
                                                    {msg.text}
                                                </ReactMarkdown>
                                            </div>
                                        }
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef}/>
                        </div>
                    </ScrollArea>
                    {messages.length == 1 &&
                        <div className={'hidden md:block'}>
                            <div className={'text-muted-foreground opacity-0 animate-fade-in'}>
                                <p>今天想从哪开始？</p>
                            </div>
                            <div className={'mb-2 mt-2 flex gap-2 animate-fade-up'}>
                                <Button variant="outline" size="sm" className="h-8 text-xs text-muted-foreground"
                                        onClick={() => handleSend("今天有什么新邮件？")}>
                                    <Mail className="mr-2 h-4 w-4 "/>
                                    今天有什么新邮件？
                                </Button>
                                <Button variant="outline" size="sm" className="h-8 text-xs text-muted-foreground"
                                        onClick={() => handleSend("最近有哪些任务要做？")}>
                                    <CalendarCheck2 className='mr-2 h-4 w-4'/>
                                    最近有哪些任务要做？
                                </Button>
                                <Button variant="outline" size="sm" className="h-8 text-xs text-muted-foreground"
                                        onClick={() => handleSend("发送邮件")}>
                                    <SendHorizontal className="mr-2 h-4 w-4 -rotate-45"/>
                                    发送邮件
                                </Button>
                            </div>
                        </div>}
                    <div
                        className="mb-1 relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
                        x-chunk="dashboard-03-chunk-1"
                    >
                        <ScrollArea className={'w-full'}>
                            <div className="overflow-auto whitespace-nowrap w-full flex">
                                {
                                    files.map((f: string, index) => (
                                        <div className='relative p-2 m-4 bg-foreground/10 rounded-xl' key={index}>
                                            <div className="flex gap-2 overflow-hidden">
                                                <div className='flex-none relative'>
                                                    {['png', 'jpeg', 'jpg'].includes(f.split(".").pop())
                                                        ? <img src={imageImg} alt="file"
                                                               className={`w-12 h-12 rounded-xl ${uploading && files.length == index + 1 ? 'bg-opacity-60' : ''}`}
                                                        /> :
                                                        <img src={fileImg} alt="file"
                                                             className={`w-12 h-12 rounded-xl ${uploading && files.length == index + 1 ? 'bg-opacity-60' : ''}`}
                                                        />}
                                                    {uploading && files.length == index + 1 && (
                                                        <div className='w-8 h-8 absolute top-2 left-2'>
                                                            <CircularProgressbar
                                                                value={uploadPercentage}
                                                                strokeWidth={24}
                                                                styles={buildStyles({
                                                                    pathColor: `rgba(62, 152, 199, ${uploadPercentage / 100})`,
                                                                    trailColor: '#d6d6d6',
                                                                })}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <div
                                                                    className="w-64 whitespace-nowrap text-ellipsis font-semibold">{f}</div>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                {f}
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                    <div className="text-token-text-tertiary">{f.split('.').pop()}</div>
                                                </div>
                                            </div>
                                            <div className="absolute -top-3 -right-3 group-hover:block">
                                                <button className="text-foreground/50 hover:text-accent-foreground"
                                                        onClick={() => deleteFile(f)}
                                                >
                                                    <TiDelete className='w-8 h-8'/>
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                            <ScrollBar orientation="horizontal"/>
                        </ScrollArea>
                        <div className={'p-1'}>
                            <Textarea
                                id="message"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="在这里输入你的问题跟智能助手对话..."
                                className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0 custom-scrollbar"
                            />
                        </div>
                        <div className="flex items-center p-3 pt-0 h-10 mt-2">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <label className="flex items-center cursor-pointer">
                                            <Paperclip className="size-6"/>
                                            <input
                                                type="file"
                                                onChange={handleFileChange}
                                                className="hidden"
                                                accept=".doc, .docx, .csv, .txt, .pdf, .xls, .xlsx"
                                            />
                                        </label>
                                    </TooltipTrigger>
                                    <TooltipContent side="top">上传文件</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            {
                                botState == 'typing' ?
                                    <BiCircle className='ml-auto gap-1.5 size-6'/> :
                                    <Button type="submit" size="sm" className="ml-auto gap-1.5"
                                            disabled={botState != 'ready'}
                                            onClick={() => handleSend()}>
                                        发送信息
                                        <CornerDownLeft className="size-3.5"/>
                                    </Button>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
