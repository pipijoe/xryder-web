/**
 * @license MIT
 * Created by: joetao
 * Created on: 2024/11/29
 * Project: xryder
 * Description: This is a rapid development template for middle and backend UI based on vite, react, tailwindcss and shadcn.
 */
import React, {useEffect, useState} from "react";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Helmet} from 'react-helmet-async';
import Pager from "@/components/common/Pager";
import {useSystemStore} from "@/store/systemStore";
import OperationLogToolBar from "@/components/system/OperationLogToolBar";
import OperationLogList from "@/components/system/OperationLogList";
import {SidebarTrigger} from "@/components/ui/sidebar";
import {Separator} from "@/components/ui/separator";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList, BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

const Operation = () => {
    const {
        operationLogs,
        total,
        page,
        rows,
        isLoading,
        queryOperationLogs
    } = useSystemStore()

    const [params, setParams] = useState({
        page: 1,
        pageSize: 8
    })

    useEffect(() => {
        const h = window.innerHeight
        const pageSize = Math.floor((h - 200) / 50 - 1) //根据窗口大小计算查询返回行数
        const newParams = {...params, pageSize}
        setParams(newParams)
        queryOperationLogs(newParams)
    }, [])

    const handlePageChange = (page) => {
        const newParams = {...params, page}
        setParams(newParams)
        queryOperationLogs(newParams)
    }

    const handleSearch = async (params: any) => {
        setParams(params)
        queryOperationLogs(params)
    }

    const operationLogToolBarProps = {
        search: handleSearch,
        params
    }
    const operationLogListProps = {
        isLoading,
        operationLogs
    }
    const pageProps = {
        page,
        pageSize: params.pageSize,
        rows,
        total,
        onPageChange: handlePageChange,
    }
    return (
        <div className='grid gap-2'>
            <Helmet>
                <title>操作日志</title>
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
                                <BreadcrumbPage>操作日志</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>
            <div className={'pl-4 pr-4 container grid gap-2'}>
                <OperationLogToolBar {...operationLogToolBarProps}/>
                <Card>
                    <CardHeader>
                        <CardTitle>操作日志</CardTitle>
                        <CardDescription>
                            查看系统用户对资源的增、删、改等操作信息。
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <OperationLogList {...operationLogListProps}/>
                    </CardContent>
                    <CardFooter>
                        <Pager {...pageProps}/>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}

export default Operation