/**
 * @license MIT
 * Created by: joetao
 * Created on: 2025/1/6
 * Project: xryder
 * Description: This is a rapid development template for middle and backend UI based on vite, react, tailwindcss and shadcn.
 */
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {SidebarTrigger} from "@/components/ui/sidebar";
import {Separator} from "@/components/ui/separator";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import React from "react";
import {Helmet} from "react-helmet-async";
import ThemeToggle from "@/components/ThemeToggle";
import {Moon, Sun} from "lucide-react";
import {RiTranslate} from "react-icons/ri";
import {useTranslation} from "react-i18next";
import {Switch} from "@/components/ui/switch";

const PersonalSetting = () => {
    const {i18n} = useTranslation();
    const toggleLanguage = () => {
        const newLanguage = i18n.language === 'en' ? 'zh' : 'en';
        i18n.changeLanguage(newLanguage);
    };
    return (
        <div>
            <Helmet>
                <title>个性化设置</title>
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
                                个性化设置
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>
            <div className="container grid gap-2 p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>个性化设置</CardTitle>
                        <CardDescription>
                            设置系统的显示模式、显示语言等等
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className={'flex justify-between hover:bg-muted/50 p-4 rounded-md'}>
                            <div className={'relative flex items-center gap-4'}>
                                <div className="relative h-[1.2rem] w-[1.2rem]">
                                    <Sun className="absolute inset-0 h-full w-full rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                    <Moon className="absolute inset-0 h-full w-full rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                </div>
                                <div>
                                    <p>暗黑模式</p>
                                    <p className={'text-muted-foreground text-sm'}>更改系统显示的颜色为深色</p>
                                </div>
                            </div>
                            <ThemeToggle/>
                        </div>
                        <p></p>
                        <div className={'flex justify-between hover:bg-muted/50 p-4 rounded-md'}>
                            <div className={'flex items-center gap-4'}>
                                <RiTranslate />
                                <div>
                                    <p>中英文切换</p>
                                    <p className={'text-muted-foreground text-sm'}>更改系统显示的语言</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-sm">{i18n.language === 'en' ? '英文' : '中文'}</span>
                                <Switch
                                    checked={i18n.language === 'en'}
                                    onCheckedChange={toggleLanguage}
                                    className="transition-transform duration-300"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default PersonalSetting