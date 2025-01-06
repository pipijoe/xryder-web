/**
 * @license MIT
 * Created by: joetao
 * Created on: 2024/12/2
 * Project: xryder
 * Description: This is a rapid development template for middle and backend UI based on vite, react, tailwindcss and shadcn.
 */
import {Helmet} from 'react-helmet-async';
import MailSendToolBar from "@/components/system/MailSendToolBar";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import Pager from "@/components/common/Pager";
import React, {useEffect, useState} from "react";
import useSystemStore from "@/store/systemStore";
import MailSendList from "@/components/system/MailSendList";
import {SidebarTrigger} from "@/components/ui/sidebar";
import {Separator} from "@/components/ui/separator";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList, BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

const SendingMails = () => {
    const {
        total,
        page,
        rows,
        isLoading,
        queryNotifications,
        notifications
    } = useSystemStore()
    const [params, setParams] = useState({
        page: 1,
        pageSize: 8
    })

    useEffect(() => {
        const h = window.innerHeight
        const pageSize = Math.floor((h - 200) / 60 - 1) //根据窗口大小计算查询返回行数
        const newParams = {...params, pageSize}
        setParams(newParams)
        queryNotifications(newParams)

    }, [])
    const handlePageChange = (page) => {
        const newParams = {...params, page}
        queryNotifications(newParams)
    }
    const pageProps = {
        page,
        pageSize: params.pageSize,
        rows,
        total,
        onPageChange: handlePageChange,
    }


    const notificationsListProps = {
        isLoading,
        notifications
    }

    const handleSearch = async (params: any) => {
        setParams(params)
        queryNotifications(params)
    }

    const toolBarProps = {
        params,
        search: handleSearch
    }
    return (
        <div>
            <Helmet>
                <title>邮件通知</title>
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
                                    系统管理
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block"/>
                            <BreadcrumbItem>
                                <BreadcrumbPage>站内信</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>
            <div className={'pl-4 pt-2 pr-4 container grid gap-2'}>
                <MailSendToolBar {...toolBarProps}/>
                <Card>
                    <CardHeader>
                        <CardTitle>已发信息</CardTitle>
                        <CardDescription>
                            查询我发送的信息
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <MailSendList {...notificationsListProps}/>
                    </CardContent>
                    <CardFooter>
                        <Pager {...pageProps}/>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}

export default SendingMails