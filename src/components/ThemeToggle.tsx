/**
 * @license MIT
 * Created by: joetao
 * Created on: 2024/12/30
 * Project: xryder
 * Description: This is a rapid development template for middle and backend UI based on vite, react, tailwindcss and shadcn.
 */
import React from 'react';
import { useTheme } from "@/components/theme-provider"
import { Switch } from "@/components/ui/switch"; // 引入 shadcn/ui 的 Switch 组件

function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    const isDarkMode = theme === "dark";

    const handleToggle = (checked) => {
        setTheme(checked ? "dark" : "light");
    };

    return (
        <div className="flex items-center space-x-2">
            <span className="text-sm">{isDarkMode ? '开' : '关'}</span>
            <Switch
                checked={isDarkMode}
                onCheckedChange={handleToggle}
                className="transition-transform duration-300"
            />
        </div>
    );
}

export default ThemeToggle
