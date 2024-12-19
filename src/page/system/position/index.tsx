/**
 * @license MIT
 * Created by: joetao
 * Created on: 2024/11/29
 * Project: xryder
 * Description: This is a rapid development template for middle and backend UI based on vite, react, tailwindcss and shadcn.
 */
"use client"

import React, {useCallback, useEffect, useRef, useState} from "react"
import {Plus, MoreVertical, Pencil, Trash2, Search, ChevronDown, ChevronRight, BadgeX, CirclePlus} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Textarea} from "@/components/ui/textarea"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {
    Dialog,
    DialogContent, DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {debounce} from 'lodash';
import useSystemStore, {PositionState} from "@/store/systemStore";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {Helmet} from "react-helmet-async";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useDialog} from "@/components/use-dialog";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {ReloadIcon} from "@radix-ui/react-icons";
import {Folder, Tree} from "@/components/magicui/department-tree";
import {toast} from "sonner";
import Pager from "@/components/common/Pager";
import {Separator} from "@/components/ui/separator";
import {Skeleton} from "@/components/ui/skeleton";
import {SidebarTrigger} from "@/components/ui/sidebar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList, BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

const FormSchema = z.object({
    name: z.string().min(2, {
        message: "名称最少2个字",
    }).max(10, {message: "名称最长10字"}),
    description: z.string().max(100, "最大长度不能超过100")
        .nullable(), // 允许 null 值，也可以用 .optional() 允许 undefined 值
    deptName: z.string({message: '选择部门'})
})
export default function Component() {
    const {
        page,
        total,
        rows,
        saving,
        positionLoading,
        department,
        positions,
        addPosition,
        queryPositions,
        deleting,
        deletePosition,
        updatingPosition
    } = useSystemStore()
    const [params, setParams] = useState({
        page: 1,
        pageSize: 8
    })
    const [deptId, setDeptId] = useState<number>()
    const [query, setQuery] = useState("")
    const [visible, setVisible] = useState(false);
    const [activePosition, setActivePosition] = useState<PositionState>()
    const [mode, setMode] = useState('add')
    const dropdownRef = useRef(null); // 用于存储下拉菜单的引用
    // 监听部门树下拉点击事件，点击外部区域时关闭下拉菜单
    useEffect(() => {
        const h = window.innerHeight
        const pageSize = Math.floor((h - 160) / 130) * 4 - 1 //根据窗口大小计算查询返回行数
        const newParams = {...params, pageSize}
        setParams(newParams)
        queryPositions(newParams)
        const handleClickOutside = (event) => {
            // 如果点击区域不在下拉菜单中，关闭下拉菜单
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setVisible(false);
            }
        };

        // 添加全局点击事件监听器
        document.addEventListener('mousedown', handleClickOutside);

        // 清理事件监听器
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
            description: "",
            deptName: "",
        }
    })
    const addDialog = useDialog(form)

    function onSubmit(data: z.infer<typeof FormSchema>) {
        if (mode == 'add') {
            addPosition({...data, deptId}).then(
                (res: any) => {
                    if (res.code === 200) {
                        toast.success("保存成功！")
                        queryPositions(params)
                    } else {
                        toast.error("保存失败！", {
                            description: res.data
                        })
                    }
                    addDialog.dismiss()
                }
            );
        } else if (mode == 'edit') {
            updatingPosition({...data, id: activePosition?.id, deptId: deptId || activePosition?.deptId}).then(
                (res: any) => {
                    if (res.code === 200) {
                        toast.success("保存成功！")
                        queryPositions(params)
                    } else {
                        toast.error("保存失败！", {
                            description: res.data
                        })
                    }
                    addDialog.dismiss()
                }
            )
        }
        setDeptId(undefined)
    }

    const onAddClick = () => {
        setMode("add")
        addDialog.trigger()
        form.reset({
            name: "",
            description: "",
            deptName: "",
        })
        setActivePosition(null)
    }
    const onEditClick = (position: PositionState) => {
        setMode("edit")
        setActivePosition(position)
        form.reset({
            name: position.name,
            deptName: position.deptName,
            description: position.description
        })
        addDialog.trigger()
        setDeptId(undefined)
    }

    // 删除
    const deleteDialog = useDialog(null);

    const handlePositionDelete = async () => {
        await deletePosition(activePosition?.id).then(
            ((res: any) => {
                    if (res.code === 200) {
                        toast.success("删除成功！")
                        queryPositions(params)
                    } else {
                        toast.error("删除失败！", {
                            description: res.data
                        })
                    }
                }
            ));
        deleteDialog.dismiss()
    }

    const onDeleteClick = (position: PositionState) => {
        deleteDialog.trigger()
        setActivePosition(position)
    }

    const handleFocus = () => {
        setVisible(true)
    }

    const handleSelect = (id: number, name: string) => {
        form.setValue('deptName', name, {shouldValidate: true})
        setVisible(false)
        setDeptId(id)
    }

    const TreeNode = ({node}) => {
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
    };


    // 创建防抖的搜索函数
    const debouncedSearch = useCallback(
        debounce((value) => {
            queryPositions({...params, q: value})
        }, 500), // 500ms 防抖时间
        [params]
    );

    // 处理输入框的变化
    const handleSearch = (e) => {
        const value = e.target.value;
        setQuery(value)
        debouncedSearch(value)
    }

    const handlePageChange = (page) => {
        const newParams = {...params, page}
        setParams(newParams)
        queryPositions(newParams)
    }

    const pageProps = {
        page,
        pageSize: params.pageSize,
        rows,
        total,
        onPageChange: handlePageChange,
    }

    return (
        <div className="grid gap-2">
            <Helmet>
                <title>职位管理</title>
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
                                <BreadcrumbPage>职位管理</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>

            <div className={'pl-4 pt-2 pr-4 container grid gap-2'}>
                <div className="flex flex-col sm:flex-row justify-between items-center pt-2 gap-2">
                    <h1 className="text-2xl font-bold">职位管理</h1>
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
                        <Input
                            type="search"
                            placeholder="搜索职位..."
                            className="w-full appearance-none bg-background pl-8 shadow-none w-64"
                            value={query}
                            onChange={handleSearch}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
                    <Card
                        className="flex items-center justify-center h-36 cursor-pointer
                                    transition-all duration-300 ease-in-out
                                    bg-primary/25 hover:bg-primary/50
                                    dark:bg-primary/50 hover:dark:bg-primary/75
                                    border-0 hover:shadow-lg"
                        onClick={onAddClick}
                    >
                        <CardHeader className={'flex items-center justify-center'}>
                            <CirclePlus strokeWidth={0.75} className={'w-8 h-8'}/>
                            <CardTitle className="text-lg ">
                                添加职位
                            </CardTitle>
                            <CardDescription>点击添加新的职位</CardDescription>
                        </CardHeader>
                    </Card>
                    {
                        positionLoading ?
                            [1, 2, 3].map(i => (
                                <Card key={i} className="flex items-center justify-center h-36">
                                    <div>
                                        <div className="flex items-center space-x-4">
                                            <Skeleton className="h-6 w-[160px] rounded-[2px]"/>
                                            <Skeleton className="h-4 w-4 rounded-full"/>
                                        </div>
                                        <div className="space-y-2 mt-4">
                                            <Skeleton className="h-4 w-[60px]"/>
                                            <Skeleton className="h-4 w-[200px]"/>
                                        </div>
                                    </div>
                                </Card>
                            )) : (
                                positions.map((position) => (
                                    <Card key={position.id} className="relative h-36 w-full">
                                        <CardHeader className="pb-2">
                                            <div className="flex justify-between items-start">
                                                <CardTitle className="text-lg">{position.name}</CardTitle>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <MoreVertical className="h-4 w-4"/>
                                                            <span className="sr-only">打开菜单</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => onEditClick(position)}>
                                                            <Pencil className="mr-2 h-4 w-4"/>
                                                            <span>编辑</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => onDeleteClick(position)}>
                                                            <Trash2 className="mr-2 h-4 w-4"/>
                                                            <span>删除</span>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-muted-foreground mb-1">{position.deptName}</p>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <p className="text-sm truncate">{position.description}</p>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p className="max-w-xs">{position.description}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </CardContent>
                                    </Card>
                                ))
                            )
                    }

                </div>
                <Separator className="my-2"/>
                <Pager {...pageProps}/>
            </div>
            <Dialog {...addDialog.dialogProps}>
                <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
                    <DialogHeader>
                        <DialogTitle>{mode == 'add' ? '添加职位' : '编辑职位'}</DialogTitle>
                        <DialogDescription>
                            编辑角色描述信息和分配角色权限
                        </DialogDescription>
                    </DialogHeader>
                    <div>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>职位名称</FormLabel>
                                            <FormControl>
                                                <Input placeholder="输入职位名称，如：软件开发工程师" {...field}
                                                       autoComplete={"off"} className='w-2/3'/>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name={'deptName'}
                                    control={form.control}
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>选择部门</FormLabel>
                                            <FormControl>
                                                <div>
                                                    <Input placeholder="点击选择部门"
                                                           {...field}
                                                           autoComplete={"off"}
                                                           className='w-2/3'
                                                           onFocus={handleFocus}
                                                    />
                                                    <div className='relative z-10' ref={dropdownRef}>
                                                        <div
                                                            className={`${visible ? ' ' : 'hidden'} 
                                                                 rounded-lg border bg-card text-card-foreground shadow-2xl
                                                                    absolute -bottom-18 left-0 w-3/4
                                                                    `}>
                                                            <Tree
                                                                className="p-4 overflow-hidden rounded-md bg-background h-72"
                                                                initialSelectedId="1"
                                                                initialExpandedItems={[
                                                                    "1"
                                                                ]}
                                                                openIcon={<ChevronDown className="size-4"/>}
                                                                closeIcon={<ChevronRight className="size-4"/>}
                                                            >
                                                                <TreeNode node={department}/>
                                                            </Tree>
                                                        </div>
                                                    </div>
                                                </div>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>职位描述</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="输入职位描述信息" {...field}
                                                          autoComplete={"off"} className='w-2/3'/>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                {
                                    saving ?
                                        <Button disabled>
                                            <ReloadIcon className="mr-2 h-4 w-4 animate-spin"/>
                                            正在保存...
                                        </Button> :
                                        <Button type="submit">保存</Button>
                                }
                            </form>
                        </Form>
                    </div>
                </DialogContent>
            </Dialog>
            <Dialog {...deleteDialog.dialogProps} >
                <DialogContent>
                    <DialogHeader>
                        <DialogDescription><BadgeX
                            className='text-red-500 inline mr-2 mb-1'/>确定删除职位 <strong>{activePosition && activePosition.name}</strong> 吗？</DialogDescription>
                    </DialogHeader>
                    <div className='grid place-items-end'>
                        {
                            deleting ?
                                <Button disabled variant="destructive">
                                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin"/>
                                    正在删除...
                                </Button> :
                                <Button variant="destructive" onClick={handlePositionDelete}>确定</Button>
                        }

                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}