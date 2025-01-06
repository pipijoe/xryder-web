import {Input} from "@/components/ui/input";
import React, {useCallback, useState} from "react";
import {debounce} from 'lodash';
import { Search, Send} from "lucide-react";
import {Button} from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';


const MailSendToolBar = ({ search, params}) => {
    const navigate = useNavigate();

    const [query, setQuery] = useState("")
    // 创建防抖的搜索函数
    const debouncedSearch = useCallback(
        debounce((value) => {
            search({...params, q: value})
        }, 500), // 500ms 防抖时间
        [params]
    );

    // 处理输入框的变化
    const handleSearch = (e) => {
        const value = e.target.value;
        setQuery(value)
        debouncedSearch(value)
    }

    const sender = () => {
        const url = `/sys/mail/send`
        navigate(url)
    }

    return (
        <div className="flex flex-row gap-2 pt-2">
            <div className="relative flex-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
                <Input
                    type="search"
                    placeholder="搜索已发送的信息..."
                    className="w-full appearance-none bg-background pl-8 shadow-none w-64"
                    value={query}
                    onChange={handleSearch}
                />
            </div>
            <div className='flex gap-2 place-items-end'>
                <Button size="sm" className="h-7 gap-1" onClick={sender}>
                    <Send className="h-3.5 w-3.5"/>
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">发送站内信</span>
                </Button>
            </div>
        </div>
    )
}

export default MailSendToolBar