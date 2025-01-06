/**
 * @license MIT
 * Created by: joetao
 * Created on: 2024/11/29
 * Project: xryder
 * Description: This is a rapid development template for middle and backend UI based on vite, react, tailwindcss and shadcn.
 */
'use client'

import React, {memo, useEffect, useState} from 'react'
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Textarea} from "@/components/ui/textarea"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Helmet} from "react-helmet-async";
import {ChevronDown, ChevronLeft, ChevronRight, Send} from "lucide-react";
import {useNavigate} from 'react-router-dom';
import useSystemStore from "@/store/systemStore";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Tabs} from "@radix-ui/react-tabs";
import {Folder, Tree} from "@/components/magicui/department-tree";
import {findDepartmentPathById, formatPath, findParentIds} from '@/utils'
import TagWithDelete from "@/components/common/TagWithDelete";
import {ScrollArea} from "@/components/ui/scroll-area";
import RichEmpty from "@/components/RichEmpty";
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

const FormSchema = z.object({
    title: z.string().min(2, {
        message: "标题最少2个字",
    }).max(48, {message: "名称最长48字"}),
    content: z.string().min(2, {
        message: "内容最少10个字",
    }).max(200, {message: "内容最长2000字"})
})
const MailSender = () => {
    const {department, queryDepartment, saving, sendNotification} = useSystemStore()
    const [selectDepartments, setSelectDepartments] = useState([])
    const [fullPaths, setFullPaths] = useState([])
    const [type, setType] = useState(1)
    const navigate = useNavigate();
    useEffect(() => {
        queryDepartment({})
    }, [])
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            title: "",
            content: ""
        }
    })

    const back = () => {
        const url = `/sys/mail`
        navigate(url)
    }

    const getLastSegment = (str) => {
        str = str.endsWith('/') ? str.slice(0, -1) : str;
        const segments = str.split('/'); // 按照 '/' 分割字符串
        return segments[segments.length - 1]; // 返回最后一个部分
    }
    const handleSelect = (id: any, name: string) => {
        const parentIds = findParentIds(department, parseInt(id));
        // 顶级部门不能被选中，如果选中，效果跟所有人没有区别
        if (parentIds.length == 0) {
            return
        }
        const fullPath = parentIds.join('/') + "/" + id + "/";
        // 如果已选部门存在父级部门被选中，则该部门不会被选中
        if (fullPaths.some(selectFullPath => fullPath.startsWith(selectFullPath))) {
            return
        }
        // 如果先选中了子部门，再选择父部门，则子部门被删除
        const filter = fullPaths.filter(selectFullPath => selectFullPath.startsWith(fullPath));
        const selectFullPaths = fullPaths.filter(selectFullPath => !selectFullPath.startsWith(fullPath));
        setFullPaths(selectFullPaths)
        const deptIds = filter.map(f => getLastSegment(f));
        const selectedDepartments = selectDepartments.filter(departmentId => !deptIds.includes(departmentId))
        setSelectDepartments([...selectedDepartments, id])
        setFullPaths([...fullPaths, fullPath])
    }

    const handleDeleteSelectDept = (id: number) => {
        const parentIds = findParentIds(department, parseInt(String(id)));
        const fullPath = parentIds.join('/') + "/" + id + "/";
        const selectFullPaths = fullPaths.filter(selectFullPath => !selectFullPath.startsWith(fullPath));
        setFullPaths(selectFullPaths)
        const selectedDepartments = selectDepartments.filter(departmentId => departmentId !== id)
        setSelectDepartments(selectedDepartments)
    }

    const TreeNode = memo(({node}) => {
        if (node) {
            return (
                <Folder element={node.name} value={node.id.toString()}
                        onClick={() => handleSelect(node.id.toString(), node.name)}>
                    {node.children.map((child) => (
                        <TreeNode key={child.id} node={child}/>
                    ))}
                </Folder>
            );
        }
        return null
    });

    function onSubmit(data: z.infer<typeof FormSchema>) {
        const params = {...data, type, deptIds: selectDepartments}
        if (type == 2 && selectDepartments.length == 0) {
            toast.warning("请选择至少一个部门进行通知！")
            return
        }
        sendNotification(params).then(
            (res) => {
                if (res.code === 200) {
                    toast.success("发送成功！")
                    form.reset({
                        title: "",
                        content: ""
                    })
                    setFullPaths([])
                    setSelectDepartments([])
                } else {
                    toast.error("发送失败！", {
                        description: res.data
                    })
                }

            }
        );
    }

    const handleTabChange = (value) => {
        if (value === 'dept') {
            setType(2)
        } else {
            setType(1)
        }
    }

    return (
        <div>
            <Helmet>
                <title>发送站内信</title>
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
                                <BreadcrumbPage>发送站内信</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>
            <div className={'pl-4 pt-2 pr-4 container grid gap-2 mt-2'}>
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" className="h-7 w-7" onClick={back}>
                        <ChevronLeft className="h-4 w-4"/>
                        <span className="sr-only">Back</span>
                    </Button>
                    <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                        编辑和发送信息
                    </h1>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>新信息</CardTitle>
                        <CardDescription>创建并发送新的信息给指定部门或者所有人</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>标题</FormLabel>
                                            <FormControl>
                                                <Input placeholder="输入标题" {...field}
                                                       autoComplete={"off"} className='w-2/3'/>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="content"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>内容</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    {...field}
                                                    placeholder="输入内容"
                                                    rows={5}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <Tabs defaultValue="all" onValueChange={handleTabChange}>
                                    <TabsList className='w-36'>
                                        <TabsTrigger value="all">所有人</TabsTrigger>
                                        <TabsTrigger value="dept">按部门</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="dept">
                                        <div className={'grid grid-cols-2 gap-1'}>
                                            <Tree
                                                className="p-4 overflow-hidden rounded-md bg-background h-64"
                                                initialSelectedId="1"
                                                initialExpandedItems={[
                                                    "1"
                                                ]}
                                                openIcon={<ChevronDown className="size-4"/>}
                                                closeIcon={<ChevronRight className="size-4"/>}
                                            >
                                                <TreeNode node={department}/>
                                            </Tree>
                                            <div className={'relative h-64'}>
                                                <ScrollArea className={'p-4 h-full'}>
                                                    {selectDepartments.length == 0 &&
                                                        <RichEmpty description={"还没有添加部门"}/>}
                                                    {selectDepartments.map((departmentId) => (
                                                        <div key={departmentId} className={'mb-1'}>
                                                            <TagWithDelete
                                                                id={departmentId}
                                                                text={formatPath(findDepartmentPathById(department, parseInt(departmentId)))}
                                                                handleDelete={handleDeleteSelectDept}/>
                                                        </div>
                                                    ))}
                                                </ScrollArea>
                                                <div
                                                    className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-background to-transparent"/>
                                            </div>
                                        </div>
                                    </TabsContent>
                                </Tabs>
                                <Button type="submit" disabled={saving}>
                                    <Send className="h-4 w-4 mr-2"/>
                                    {saving ? '发送中...' : '发送'}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default MailSender