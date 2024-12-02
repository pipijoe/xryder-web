/**
 * @license MIT
 * Created by: joetao
 * Created on: 2024/12/2
 * Project: xryder
 * Description: This is a rapid development template for middle and backend UI based on vite, react, tailwindcss and shadcn.
 */
import {Input} from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {ReloadIcon} from "@radix-ui/react-icons";
import {useForm} from "react-hook-form";
import {z} from "zod";
import validator from "validator";
import {zodResolver} from "@hookform/resolvers/zod";
import {debounce} from 'lodash';
import {findDepartmentPathById, formatPath} from '@/utils'
import {
    ChevronDown,
    ChevronRight,
    CloudUpload,
    ListFilter,
    ListTree,
    PlusCircle,
    RotateCcw,
    Search
} from "lucide-react";
import {Folder, Tree} from "@/components/magicui/department-tree";
import {useDialog} from "@/components/use-dialog";
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {ScrollArea} from "@/components/ui/scroll-area";
import RichEmpty from "@/components/RichEmpty";
import {TooltipContent} from "@/components/ui/tooltip";
import {Tooltip, TooltipProvider, TooltipTrigger} from "@radix-ui/react-tooltip";
import {toast} from "sonner";
import api from "@/axiosInstance";
import {Progress} from "@/components/ui/progress";


const FormSchema = z.object({
    username: z.string().min(4, {
        message: "登录账户最短4个字",
    }).max(36, {message: "登录账户最长36个字"}),
    nickname: z.string().min(2, {
        message: "用户名最短2个字",
    }).max(16, {message: "用户名最长16个字"}),
    mobile: z
        .string()
        .optional()
        .refine(
            (value) => !value || validator.isMobilePhone(value),
            {message: "无效的手机号"}
        ),
    email: z
        .string()
        .optional()  // 允许空值
        .refine(
            (value) => !value || validator.isEmail(value),
            {message: "无效的邮箱"}
        ), // 自定义校验：为空或者是有效的邮箱
})
const UserToolBar = ({
                         addUser, saving, search, department, params
                     }) => {
    const [open, setOpen] = useState(false);
    const [type, setType] = useState("2")
    const [query, setQuery] = useState("")
    const [visible, setVisible] = useState(false);
    const dropdownRef = useRef(null); // 用于存储下拉菜单的引用
    const [departmentName, setDepartmentName] = useState('')
    const [users, setUsers] = useState<any>([])
    // 监听部门树下拉点击事件，点击外部区域时关闭下拉菜单
    useEffect(() => {
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

    // 添加用户
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            username: "",
            nickname: "",
            email: "",
            mobile: ""
        },
    })

    const onOpenChange = (open: boolean) => {
        setOpen(open)
        if (!open) {
            form.reset()
        }
    }

    function onSubmit(data: z.infer<typeof FormSchema>) {
        addUser(data).then(
            () => {
                setOpen(false)
                form.reset()
            }
        );
    }

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

    const handleTypeChange = (type: string) => {
        search({...params, type})
        setType(type)
    }

    // 根据部门搜索
    const handleSelect = (id: string) => {
        search({...params, deptId: id})
        setVisible(false)
        const result = findDepartmentPathById(department, parseInt(id));
        setDepartmentName(formatPath(result))
    }

    const TreeNode = ({node}) => {
        if (node) {
            return (
                <Folder element={node.name} value={node.id.toString()}
                        onClick={() => handleSelect(node.id.toString())}>
                    {node.children.map((child) => (
                        <TreeNode key={child.id} node={child}/>
                    ))}
                </Folder>
            );
        }
        return null
    };

    // 重置搜索
    const resetSearch = () => {
        setType("2")
        setDepartmentName("")
        setQuery("")
        search({page: 1, pageSize: params.pageSize})
    }

    const smartImportDialog = useDialog(null);
    const maxFileSize = 10 * 1024 * 1024; // 10MB 文件大小限制
    const [uploadPercentage, setUploadPercentage] = useState(0);
    const [uploading, setUploading] = useState(false);
    const uploadUserFile = async (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.size > maxFileSize) {
            toast.warning("文件大小超过10MB限制！")
            return;
        }
        setUploadPercentage(0);
        setUploading(true);
        const formData = new FormData();
        formData.append('file', selectedFile);
        try {
            const data = await api.post('/v1/agent/users/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setUploadPercentage(percentCompleted);
                },
            });
            setUploadPercentage(100)
            setUploading(false);
            setUsers(data)
        } catch (err) {
            setUploadPercentage(0);
            setUploading(false);
            console.log(err)
        }
        document.getElementById("fileInput").value = null;
    }
    return (
        <div className="flex flex-row gap-2 pt-2">
            <div className="relative flex-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
                <Input
                    type="search"
                    placeholder="搜索用户..."
                    className="w-full appearance-none bg-background pl-8 shadow-none w-64"
                    value={query}
                    onChange={handleSearch}
                />
            </div>
            <div className='flex gap-2 place-items-end'>
                <div>
                    <Button variant="outline" size="sm" className="h-7 gap-1" onClick={() => setVisible(true)}>
                        <ListTree className="h-3.5 w-3.5"/>
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">选择部门</span>
                    </Button>
                    <div className='relative z-10' ref={dropdownRef}>
                        <div
                            className={`${visible ? ' ' : 'hidden'} 
                                          rounded-lg border bg-card text-card-foreground shadow-2xl
                                          absolute -bottom-18 left-0 w-96`}>
                            <div className='pt-1 pl-2 text-sm'><span className='grow'>已选部门：{departmentName}</span>
                            </div>
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
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-7 gap-1">
                            <ListFilter className="h-3.5 w-3.5"/>
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">状态筛选</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>通过账户状态筛选</DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        <DropdownMenuRadioGroup value={type} onValueChange={handleTypeChange}>
                            <DropdownMenuRadioItem value="2">全部</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="1">启用</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="0">禁用</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
                <div>
                    <Button variant="outline" size="sm" className="h-7 gap-1" onClick={() => resetSearch()}>
                        <RotateCcw className="h-3.5 w-3.5"/>
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">重置</span>
                    </Button>
                </div>
                <div>
                    <Button variant="outline" size="sm" className="h-7 gap-1" {...smartImportDialog.triggerProps}>
                        <CloudUpload className="h-3.5 w-3.5"/>
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">智能导入</span>
                    </Button>
                </div>
                <Dialog open={open} onOpenChange={onOpenChange}>
                    <DialogTrigger asChild>
                        <Button size="sm" className="h-7 gap-1">
                            <PlusCircle className="h-3.5 w-3.5"/>
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">添加用户</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[485px]">
                        <DialogHeader>
                            <DialogTitle>添加用户</DialogTitle>
                            <DialogDescription>
                                输入用户信息，包括账号、姓名、电子邮件、手机号等，点击保存按钮完成操作。
                            </DialogDescription>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                                <FormField
                                    control={form.control}
                                    name="nickname"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>姓名</FormLabel>
                                            <FormControl>
                                                <Input placeholder="输入用户姓名" {...field} autoComplete={"off"}
                                                       className='w-2/3'/>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>用户名</FormLabel>
                                            <FormControl>
                                                <Input placeholder="abc@123.com" {...field} autoComplete={"off"}
                                                       className='w-2/3'/>
                                            </FormControl>
                                            <FormDescription>
                                                用户名系统唯一,可以是字符串、邮箱或者手机号
                                            </FormDescription>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>邮箱</FormLabel>
                                            <FormControl>
                                                <Input placeholder="输入邮箱地址" {...field} autoComplete={"off"}
                                                       className='w-2/3'/>
                                            </FormControl>
                                            <FormDescription>
                                                非必填
                                            </FormDescription>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="mobile"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>手机号</FormLabel>
                                            <FormControl>
                                                <Input placeholder="输入11位手机号" {...field} autoComplete={"off"}
                                                       className='w-2/3'/>
                                            </FormControl>
                                            <FormDescription>
                                                非必填
                                            </FormDescription>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                {
                                    saving ?
                                        <Button disabled>
                                            <ReloadIcon className="mr-2 h-4 w-4 animate-spin"/>
                                            正在添加...
                                        </Button> :
                                        <Button type="submit">添加</Button>
                                }
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>
            <Dialog {...smartImportDialog.dialogProps} >
                <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
                    <DialogHeader>
                        <DialogTitle>待上传用户列表</DialogTitle>
                        <DialogDescription>
                            通过Excel表格上传、大模型解析并建立系统用户账户。
                            表格中尽量只包含姓名、账户、性别和电话这些字段。
                            多余字段会对大模型解构数据产生影响。
                            一次效果不佳可以尝试多次，直到满意为止。
                        </DialogDescription>
                    </DialogHeader>
                    <div className={'pl-1 pr-1'}>
                        <Table>
                            <TableHeader >
                                <TableRow>
                                    <TableHead className="w-[100px]">姓名</TableHead>
                                    <TableHead className="w-[120px]">用户名</TableHead>
                                    <TableHead >性别</TableHead>
                                    <TableHead className="w-[100px] text-right">电话</TableHead>
                                </TableRow>
                            </TableHeader>
                        </Table>
                    </div>
                    <ScrollArea className="h-72 rounded-md pr-1 pl-1">
                        <div className={'w-full'}>
                            <Table>
                                <TableBody>
                                    {users.length == 0 && <RichEmpty title={'还没有用户数据'} description={'请先导入用户文件'}/>}
                                    {
                                        users.map(u => (
                                            <TableRow>
                                                <TableCell className="w-[100px] font-medium">{u.name}</TableCell>
                                                <TableCell className={'w-[120px]'}>{u.username}</TableCell>
                                                <TableCell>{u.sex}</TableCell>
                                                <TableCell className="w-[100px] text-right">{u.phone}</TableCell>
                                            </TableRow>
                                        ))
                                    }
                                </TableBody>
                            </Table>
                        </div>
                    </ScrollArea>
                    <Table>
                        <TableCaption>导入前请确认用户信息是否有误！</TableCaption>
                    </Table>
                    <DialogFooter>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <label className="flex items-center cursor-pointer border p-2 rounded-md h-10 items-center justify-center">
                                        <CloudUpload className="mr-2 h-4 w-4" /> 上传文件
                                        <input
                                            id="fileInput"
                                            type="file"
                                            onChange={uploadUserFile}
                                            className="hidden"
                                            accept=".xls, .xlsx"
                                        />
                                    </label>
                                </TooltipTrigger>
                                <TooltipContent side="top">上传excel文件</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <Button type="submit" disabled={users.length == 0 }>确认导入</Button>
                    </DialogFooter>
                    <div>
                        {uploading && <Progress value={uploadPercentage} className={'w-full h-2'}/> }
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default UserToolBar