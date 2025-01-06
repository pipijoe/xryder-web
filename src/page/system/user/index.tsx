/**
 * @license MIT
 * Created by: joetao
 * Created on: 2024/11/29
 * Project: xryder
 * Description: This is a rapid development template for middle and backend UI based on vite, react, tailwindcss and shadcn.
 */
import {Helmet} from "react-helmet-async";
import {SidebarTrigger} from "@/components/ui/sidebar";
import {Separator} from "@/components/ui/separator";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList, BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import {toast} from "sonner";

import UserList from "@/components/system/UserList";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import UserToolBar from "@/components/system/UserBarTool";
import Pager from "@/components/common/Pager";
import useSystemStore from "@/store/systemStore";
import {useEffect, useState} from "react";

const User = () => {
    const {
        userInfo,
        users,
        allRoles,
        department,
        total,
        page,
        rows,
        isLoading,
        deleting,
        saving,
        updating,
        userInfoQuerying,
        addUser,
        queryUsers,
        queryUserById,
        deleteUserById,
        distributeRole,
        queryAllRoles,
        toggleEnabled,
        resetPwd,
        positions,
        queryPositions,
        setupUser
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
        queryUsers(newParams)
    }, [])

    useEffect(() => {
        queryAllRoles()
    }, [])

    const reloadUsers = () => {
        const newParams = {...params, page: 1}
        setParams(newParams)
        queryUsers(newParams)
    }

    const handlePageChange = (page) => {
        const newParams = {...params, page}
        setParams(newParams)
        queryUsers(newParams)
    }

    const handleUserAdd = async (data) => {
        await addUser(data).then(
            ((res: any) => {
                    if (res.code === 200) {
                        toast.success("添加成功！")
                        reloadUsers()
                    } else {
                        toast.error("添加失败！", {
                            description: res.data
                        })
                    }
                }
            ));
    }

    const handleRoleDistribute = async (data) => {
        await distributeRole(data).then(
            ((res: any) => {
                    if (res.code === 200) {
                        toast.success("保存成功！")
                        queryUsers(params)
                    } else {
                        toast.error("保存失败！", {
                            description: res.data
                        })
                    }
                }
            ));
    }

    const handleUserDelete = async (username: string) => {
        await deleteUserById(username).then(
            (res: any) => {
                if (res.code === 200) {
                    toast.success("已删除！")
                    queryUsers(params)
                } else {
                    toast.error("删除失败！", {
                        description: res.data
                    })
                }
            }
        )
    }

    const handleUserStatusChange = async (username: string) => {
        await toggleEnabled(username).then(
            (res: any) => {
                if (res.code === 200) {
                    toast.success("已修改！")
                    queryUsers(params)
                } else {
                    toast.error("操作失败！", {
                        description: res.data
                    })
                }
            }
        )
    }

    const handlePwdReset = async (username: string) => {
        await resetPwd(username).then(
            (res: any) => {
                if (res.code === 200) {
                    toast.success("已重置！")
                    queryUsers(params)
                } else {
                    toast.error("操作失败！", {
                        description: res.data
                    })
                }
            }
        )
    }

    const handleUserSet = async (data: any) => {
        await setupUser(data).then(
            (res: any) => {
                if (res.code === 200) {
                    toast.success("设置成功！")
                    queryUsers(params)
                } else {
                    toast.error("操作失败！", {
                        description: res.data
                    })
                }
            }
        )
    }

    const handleSearch = async (params: any) => {
        setParams(params)
        queryUsers(params)
    }
    const userProps = {
        setupUser: handleUserSet,
        distributeRole: handleRoleDistribute,
        deleteUserById: handleUserDelete,
        toggleEnabled: handleUserStatusChange,
        resetPwd: handlePwdReset,
        queryUserById,
        users,
        saving,
        isLoading,
        updating,
        deleting,
        userInfo,
        userInfoQuerying,
        allRoles,
        department,
        positions,
        queryPositions,
    }

    const pageProps = {
        page,
        pageSize: params.pageSize,
        rows,
        total,
        onPageChange: handlePageChange,
    }

    const userToolBarProps = {
        saving,
        department,
        params,
        addUser: handleUserAdd,
        search: handleSearch
    }
    return (
        <div>
            <Helmet>
                <title>用户管理</title>
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
                                <BreadcrumbPage>用户管理</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>
            <div className={'pl-4 pt-2 pr-4 container grid gap-2 '}>
                <UserToolBar {...userToolBarProps}/>
                <Card>
                    <CardHeader>
                        <CardTitle>用户列表</CardTitle>
                        <CardDescription>
                            管理系统用户，对用户信息进行查看、编辑和删除
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <UserList {...userProps}/>
                    </CardContent>
                    <CardFooter>
                        <Pager {...pageProps}/>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}

export default User