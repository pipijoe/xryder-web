/**
 * @license MIT
 * Created by: joetao
 * Created on: 2024/11/29
 * Project: xryder
 * Description: This is a rapid development template for middle and backend UI based on vite, react, tailwindcss and shadcn.
 */
import RoleList from "@/components/system/RoleList";
import useSystemStore from "@/store/systemStore";
import React, {useEffect, useState} from "react";
import {toast} from "sonner";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import Pager from "@/components/common/Pager";
import RoleToolBar from "@/components/system/RoleToolBar";
import { Helmet } from 'react-helmet-async';
import {SidebarTrigger} from "@/components/ui/sidebar";
import {Separator} from "@/components/ui/separator";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList, BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

const Role = () => {
    const {
        roles,
        permissions,
        total,
        page,
        rows,
        isLoading,
        saving,
        updating,
        deleting,
        addRole,
        queryRoles,
        queryPermissions,
        deleteRoleById,
        updateRole
    } = useSystemStore()

    const [params, setParams] = useState({
        page: 1,
        pageSize: 8
    })

    useEffect(() => {
        const h = window.innerHeight
        const pageSize = Math.floor((h - 360) / 60 - 1) //根据窗口大小计算查询返回行数
        const newParams = {...params, pageSize}
        setParams(newParams)
        queryRoles(newParams)
    }, [])

    useEffect(() => {
        queryPermissions()
    }, [])

    const reloadRoles = () => {
        const newParams = {...params, page: 1}
        setParams(newParams)
        queryRoles(newParams)
    }

    const handlePageChange = (page) => {
        const newParams = {...params, page}
        setParams(newParams)
        queryRoles(newParams)
    }

    const handleRoleAdd = async (data) => {
        await addRole(data).then(
            (res: any) =>  {
                if (res.code === 200) {
                    toast.success("添加成功！")
                    reloadRoles()
                } else {
                    toast.error("添加失败！", {
                        description: res.data
                    })
                }
            }
        );
    }

    const handleSearch = async (params: any) => {
        setParams(params)
        queryRoles(params)
    }

    const handleRoleDelete = async (id: number) => {
        await deleteRoleById(id).then(
            (res: any) => {
                if (res.code === 200) {
                    toast.success("已删除！")
                    queryRoles(params)
                } else {
                    toast.error("删除失败！", {
                        description: res.data
                    })
                }
            }
        )
    }

    const handleRoleUpdate = async (data: any) => {
        await updateRole(data).then(
            (res: any) => {
                if (res.code === 200) {
                    toast.success("更新成功！")
                    queryRoles(params)
                } else {
                    toast.error("更新失败！", {
                        description: res.data
                    })
                }
            }
        )
    }

    const pageProps = {
        page,
        pageSize: params.pageSize,
        rows,
        total,
        onPageChange: handlePageChange,
    }

    const roleProps = {
        updating,
        isLoading,
        permissions,
        roles,
        deleting,
        deleteRoleById: handleRoleDelete,
        updateRole: handleRoleUpdate
    }
    return (
        <div>
            <Helmet>
                <title>角色管理</title>
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
                                <BreadcrumbPage>角色管理</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>
            <div className={'pl-4 pt-2 pr-4 container grid gap-2'}>
                <RoleToolBar addRole={handleRoleAdd}
                             saving={saving}
                             permissions={permissions}
                             total={total}
                             rows={rows}
                             page={page}
                             params={params}
                             handlePageChange={handlePageChange}
                             reloadRoles={reloadRoles}
                             search={handleSearch}
                />
                <Card>
                    <CardHeader>
                        <CardTitle>角色列表</CardTitle>
                        <CardDescription>
                            管理系统角色，对角色进行查询、定义、修改和删除
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RoleList {...roleProps}/>
                    </CardContent>
                    <CardFooter>
                        <Pager {...pageProps}/>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
export default Role