import {Input} from "@/components/ui/input";
import React, {useCallback} from "react";
import {Search} from "lucide-react";
import {debounce} from 'lodash';

const LoginLogToolBar = ({
                             search, params,
                         }) => {

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
        debouncedSearch(value)
    }
    return (
        <div className="flex flex-row gap-2 pt-2">
            <div className="relative flex-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
                <Input
                    type="search"
                    placeholder="搜索用户名..."
                    onChange={handleSearch}
                    className="w-full appearance-none bg-background pl-8 shadow-none w-64"
                />
            </div>

        </div>
    )
}

export default LoginLogToolBar