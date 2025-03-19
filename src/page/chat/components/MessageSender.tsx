import TypingAnimation from "@/components/ui/typing-animation";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { TooltipContent } from "@/components/ui/tooltip";
import { TiDelete } from "react-icons/ti";
import { Textarea } from "@/components/ui/textarea";
import { BiCircle } from "react-icons/bi";
import React, { useEffect, useRef, useState } from "react";
import { BookCheck, Code, CornerDownLeft, Mail, Paperclip } from "lucide-react";
import { toast } from "sonner";
import api from "@/axiosInstance";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { useAccountStore } from "@/store/accountStore";
import { agentImg, fileImg, generateRandomString, imageImg } from "@/utils";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
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

interface MessageSenderProps {
  messages: string[];
  botState: string;
  setMessages: (messages: string[]) => void;
  setBotState: (state: string) => void;
}

const MessageSender: React.FC<MessageSenderProps> = ({
  messages,
  botState,
  setMessages,
  setBotState,
}) => {
  const { account } = useAccountStore();
  const [conversationId, setConversationId] = useState("");
  const [files, setFiles] = useState([]);
  const [images, setImages] = useState([]);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [input, setInput] = useState("");
  const [aiToken, setAiToken] = useState("");

  const textareaRef = useRef(null);

  useEffect(() => {
    const generatedString = generateRandomString(8);
    setConversationId(generatedString);
    getAiToken().then(() => setBotState("ready"));
  }, []);

  const handleSend = async (question?: string | undefined) => {
    if (botState != "ready") {
      toast.warning("我还没准备好，请稍等！");
      return;
    }
    question = question || input.trim();
    if (question) {
      const newMessages = [
        ...messages,
        {
          text: question,
          sender: "user",
          docs: files,
          images: images,
          avatar: (
            <img
              src={"data:image/png;base64," + account.avatar}
              alt="avatar"
              className="w-10 h-10 rounded-full ml-2"
            />
          ),
        },
      ];
      setMessages(newMessages);
      setInput("");
      setFiles([]);
      setImages([]);
      setBotState("thinking"); // 机器人进入思考状态
      const botMessage = {
        text: "",
        sender: "bot",
        avatar: (
          <img
            src={agentImg}
            alt="ChatGPT"
            className="w-10 h-10 rounded-full mt-2 mr-4 bg-card shadow-lg"
          />
        ),
        docs: [],
        images: [],
      };
      setMessages([...newMessages, botMessage]);
      await fetchFromOpenAI(question, (msg) => {
        setBotState("typing"); // 机器人进入输入状态
        botMessage.text += msg.data.slice(1);
        setMessages([...newMessages, { ...botMessage }]);
      });
      setBotState("ready"); // 机器人完成输出状态
    }
  };

  const getAiToken = async () => {
    const rsp: any = await api.get("/v1/ai/token", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    if (rsp.code == 200) {
      setAiToken(rsp.data);
    }
  };

  const createParams = (question: string) => {
    return new URLSearchParams({
      message: question,
      conversationId,
      files: files.length > 0 ? JSON.stringify(files) : "",
    });
  };

  const fetchFromOpenAI = async (userInput, onMessage) => {
    const params = createParams(userInput);
    const url = `/api/v1/ai/stream?${params.toString()}`;
    await fetchEventSource(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + aiToken,
      },
      onopen(response) {
        console.log("Connection open");
      },
      onmessage(msg) {
        onMessage(msg);
      },
      onerror(err) {
        console.error("Connection error:", err);
        // 处理其他错误逻辑
      },
      openWhenHidden: true,
    });
  };

  const maxFileSize = 5 * 1024 * 1024; // 5MB 文件大小限制
  // 支持的图片类型
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.size > maxFileSize) {
      toast.warning("文件大小超过5MB限制！");
      return;
    }
    setFiles([...files, selectedFile.name]);
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
    formData.append("file", file);
    formData.append("conversationId", conversationId);
    try {
      await api.post("/v1/ai/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadPercentage(percentCompleted);
        },
      });
      setUploadPercentage(100);
      setUploading(false);
    } catch (err) {
      setUploadPercentage(0);
      setUploading(false);
    }
  };

  const deleteFile = (f: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file !== f));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      // 这里可以添加提交逻辑
      handleSend();
    } else if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault();
      setInput((prevText) => prevText + "\n");
    }
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight + 8}px`;
      if (textarea.scrollHeight > textarea.clientHeight) {
        textarea.style.overflowY = "auto";
      } else {
        textarea.style.overflowY = "hidden";
      }
    }
  }, [input]);

  const Suggestion = ({ message, icon }) => {
    return (
      <Button
        variant="outline"
        size="sm"
        className="h-8 text-xs text-muted-foreground"
        onClick={() => handleSend(message)}
      >
        {icon}
        {message}
      </Button>
    );
  };
  const getSuggestions: any = () => {
    return [
      {
        message: "今天有什么新邮件？",
        icon: <Mail className="mr-2 h-4 w-4 text-green-500" />,
      },
      {
        message: "告诉我一个React的小知识",
        icon: <BookCheck className="mr-2 h-4 w-4 text-amber-500" />,
      },
      {
        message: "如何写出优秀的Java代码？",
        icon: <Code className="mr-2 h-4 w-4 text-cyan-500" />,
      },
    ];
  };
  return (
    <div
      className={`${
        messages.length == 0
          ? "absolute top-[40%] w-full"
          : "sticky bottom-0 w-full mx-auto z-10 bg-background"
      }`}
    >
      {messages.length == 0 && (
        <div className={"flex flex-col items-center text-muted-foreground"}>
          <TypingAnimation
            className="text-xl font-semibold text-center"
            text="有什么可以帮忙的？"
            duration={100}
          />
          <div className={"mb-2 mt-2 flex gap-2 animate-fade-up"}>
            {getSuggestions().map(
              (suggestion: { message: string; icon: unknown }) => (
                <Suggestion
                  message={suggestion.message}
                  icon={suggestion.icon}
                />
              )
            )}
          </div>
        </div>
      )}
      <div
        className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring w-full md:w-[900px] mx-auto"
        x-chunk="dashboard-03-chunk-1"
      >
        <ScrollArea className={"w-full"}>
          <div className="overflow-auto whitespace-nowrap w-full flex">
            {files.map((f: string, index) => (
              <div
                className="relative p-2 m-4 bg-foreground/10 rounded-xl"
                key={index}
              >
                <div className="flex gap-2 overflow-hidden">
                  <div className="flex-none relative">
                    {["png", "jpeg", "jpg"].includes(f.split(".").pop()) ? (
                      <img
                        src={imageImg}
                        alt="file"
                        className={`w-12 h-12 rounded-xl ${
                          uploading && files.length == index + 1
                            ? "bg-opacity-60"
                            : ""
                        }`}
                      />
                    ) : (
                      <img
                        src={fileImg}
                        alt="file"
                        className={`w-12 h-12 rounded-xl ${
                          uploading && files.length == index + 1
                            ? "bg-opacity-60"
                            : ""
                        }`}
                      />
                    )}
                    {uploading && files.length == index + 1 && (
                      <div className="w-8 h-8 absolute top-2 left-2">
                        <CircularProgressbar
                          value={uploadPercentage}
                          strokeWidth={24}
                          styles={buildStyles({
                            pathColor: `rgba(62, 152, 199, ${
                              uploadPercentage / 100
                            })`,
                            trailColor: "#d6d6d6",
                          })}
                        />
                      </div>
                    )}
                  </div>
                  <div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="w-64 whitespace-nowrap text-ellipsis font-semibold">
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
                <div className="absolute -top-3 -right-3 group-hover:block">
                  <button
                    className="text-foreground/50 hover:text-accent-foreground"
                    onClick={() => deleteFile(f)}
                  >
                    <TiDelete className="w-8 h-8" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <div className={"p-1"}>
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
                  <Paperclip className="size-6" />
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
          {botState == "typing" ? (
            <BiCircle className="ml-auto gap-1.5 size-6" />
          ) : (
            <Button
              type="submit"
              size="sm"
              className="ml-auto gap-1.5"
              disabled={botState != "ready"}
              onClick={() => handleSend()}
            >
              发送信息
              <CornerDownLeft className="size-3.5" />
            </Button>
          )}
        </div>
      </div>
      <p className={"text-center text-muted-foreground text-sm"}>
        内容由AI生成，请仔细甄别！
      </p>
    </div>
  );
};

export default MessageSender;
