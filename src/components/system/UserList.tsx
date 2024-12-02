/**
 * @license MIT
 * Created by: joetao
 * Created on: 2024/12/2
 * Project: xryder
 * Description: This is a rapid development template for middle and backend UI based on vite, react, tailwindcss and shadcn.
 */
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"
import {
    BadgeX,
    ChevronDown, ChevronRight,
    MoreHorizontal, OctagonAlert,
    Settings, Shapes, ShieldBan, ShieldCheck, Trash, Undo2
} from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Form,
    FormControl, FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {Button} from "@/components/ui/button"
import {Badge} from "@/components/ui/badge"
import {Input} from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import React, {useEffect, useRef, useState} from "react";
import {useDialog} from "@/components/use-dialog.tsx"

import {ReloadIcon} from "@radix-ui/react-icons";
import {Checkbox} from "@/components/ui/checkbox";
import {Separator} from "@/components/ui/separator";
import {Label} from "@/components/ui/label";
import {Folder, Tree} from "@/components/magicui/department-tree";
import {Select, SelectValue} from "@radix-ui/react-select";
import {SelectContent, SelectItem, SelectTrigger} from "@/components/ui/select";

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Skeleton} from "@/components/ui/skeleton";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet";
import {findDepartmentPathById, formatPath} from '@/utils'
import RichEmpty from "@/components/RichEmpty";

const DistributeRoleFormSchema = z.object({
    roles: z.array(z.number()).min(1, {message: '至少需要选择一个角色'})
})

const SettingFormSchema = z.object({
    department: z.string().min(1, {message: '请选择部门'}),
    position: z.string().min(1, {message: '请选择职位'})
})

const UserList = ({
                      saving,
                      isLoading,
                      deleting,
                      updating,
                      userInfoQuerying,
                      users,
                      distributeRole,
                      deleteUserById,
                      queryUserById,
                      toggleEnabled,
                      resetPwd,
                      userInfo,
                      allRoles,
                      department,
                      positions,
                      queryPositions,
                      setupUser
                  }) => {
    const [visible, setVisible] = useState(false);
    const dropdownRef = useRef(null); // 用于存储下拉菜单的引用
    const [departmentId, setDepartmentId] = useState('')
    const [currentUsername, setCurrentUsername] = useState('')

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

    // 角色分配
    const distributeRoleForm = useForm<z.infer<typeof DistributeRoleFormSchema>>({
        resolver: zodResolver(DistributeRoleFormSchema),
        defaultValues: {
            roles: []
        },
    })

    const roleDialog = useDialog(distributeRoleForm);

    const onDistributeRoleSubmit = (data: z.infer<typeof DistributeRoleFormSchema>) => {
        distributeRole(data).then(
            () => {
                roleDialog.dismiss()
                distributeRoleForm.reset()
            }
        );
    }

    // 用户设置
    const settingForm = useForm<z.infer<typeof SettingFormSchema>>({
        resolver: zodResolver(SettingFormSchema),
        defaultValues: {
            department: '',
            position: ''
        },
    })
    const commonSetDialog = useDialog(settingForm);

    const handleSelect = (id: string, name: string) => {
        settingForm.setValue('department', name, {shouldValidate: true})
        settingForm.setValue('position', '', {shouldValidate: false})
        setVisible(false)
        setDepartmentId(id)
        queryPositions({deptId: id, page: 1, pageSize: 100})
    }

    const handleFocus = () => {
        setVisible(true)
    }

    const onSettingSubmit = (data: z.infer<typeof SettingFormSchema>) => {
        const deptId = departmentId
        const position = positions.find(p => p.name === data.position)
        setupUser({deptId, positionId: position.id, username: currentUsername}).then(() => {
            commonSetDialog.dismiss()
            settingForm.reset({
                department: '',
                position: ''
            })
            setDepartmentId('')
        })
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

    // 删除用户
    const deleteDialog = useDialog(null);

    const handleUserDelete = async () => {
        await deleteUserById(currentUsername)
        deleteDialog.dismiss()
    }

    // 重置用户密码
    const resetPwdDialog = useDialog(null);

    const handleResetPwd = async () => {
        await resetPwd(currentUsername)
        resetPwdDialog.dismiss()
    }

    const handleUserClick = (username: string) => {
        setCurrentUsername(username)
        queryUserById(username)
    }

    return (
        <div className="relative min-h-60">
            {isLoading && (
                <div
                    className="absolute top-0 left-0 right-0 bottom-0 bg-muted/50 bg-opacity-70 flex justify-center items-center z-50">
                    <div
                        className="w-10 h-10 border-4 border-t-4 border-gray-200 border-t-sky-500 rounded-full animate-spin"></div>
                </div>
            )}
            {(users.length == 0 && !isLoading) ? <RichEmpty description={'暂无用户数据'}/> : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>姓名</TableHead>
                            <TableHead>用户名</TableHead>
                            <TableHead>状态</TableHead>
                            <TableHead>
                                <span className="sr-only">Actions</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            users.map((u, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-semibold">
                                        <Sheet onOpenChange={() => handleUserClick(u.username)}>
                                            <SheetTrigger>{u.nickname}</SheetTrigger>
                                            <SheetContent>
                                                {userInfoQuerying ?
                                                    <div className="flex flex-col space-y-3">
                                                        <Skeleton className="h-[125px] w-[300px] rounded-xl"/>
                                                        <div className="space-y-2">
                                                            <Skeleton className="h-6 w-[250px]"/>
                                                            <Skeleton className="h-4 w-[150px]"/>
                                                            <Skeleton className="h-4 w-[150px]"/>
                                                            <Skeleton className="h-6 w-[200px]"/>
                                                            <Skeleton className="h-6 w-[200px]"/>
                                                            <Skeleton className="h-6 w-[200px]"/>
                                                        </div>
                                                    </div> :
                                                    <Card
                                                        className="overflow-hidden border-0 shadow-none"
                                                        x-chunk="dashboard-05-chunk-4"
                                                    >
                                                        <CardHeader className="flex flex-row items-start bg-muted/50">
                                                            <div className="grid gap-0.5">
                                                                <CardTitle
                                                                    className="group flex items-center gap-2 text-lg">
                                                                    <Avatar
                                                                        className='w-9 h-9 rounded-full cursor-pointer'>
                                                                        <AvatarImage
                                                                            src={'data:image/png;base64,' + userInfo.avatar}
                                                                            alt="avatar"/>
                                                                        <AvatarFallback>{userInfo.name}</AvatarFallback>
                                                                    </Avatar>
                                                                    {userInfo.nickname}
                                                                </CardTitle>
                                                                <CardDescription>{userInfo.username}</CardDescription>
                                                            </div>
                                                        </CardHeader>
                                                        <CardContent className="p-6 text-sm">
                                                            <div className="grid gap-3">
                                                                <div className="font-semibold">基本信息</div>
                                                                <ul className="grid gap-3">
                                                                    <li className="flex items-center justify-between">
                                                                    <span className="text-muted-foreground flex-none">
                                                                        角色
                                                                    </span>
                                                                        <span>{userInfo.roles ? userInfo.roles.map(role => role.name).join(",") : ''}</span>
                                                                    </li>
                                                                    <li className="flex items-center justify-between">
                                                                    <span className="text-muted-foreground flex-none">
                                                                        部门
                                                                    </span>
                                                                        <span className='ml-6'>
                                                                        {formatPath(findDepartmentPathById(department, parseInt(userInfo.departmentId)))}
                                                                    </span>
                                                                    </li>
                                                                    <li className="flex items-center justify-between">
                                                                        <span className="text-muted-foreground  flex-none">
                                                                            职位
                                                                        </span>
                                                                        <span>{userInfo.position}</span>
                                                                    </li>
                                                                    <li className="flex items-center justify-between">
                                                                    <span className="text-muted-foreground  flex-none">
                                                                        邮箱
                                                                    </span>
                                                                        <span>{userInfo.email}</span>
                                                                    </li>
                                                                    <li className="flex items-center justify-between">
                                                                    <span className="text-muted-foreground  flex-none">
                                                                        电话
                                                                    </span>
                                                                        <span>{userInfo.mobile}</span>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                            <Separator className="my-4"/>
                                                            <div className="grid gap-3">
                                                                <div className="font-semibold">登录信息</div>
                                                                <ul className="grid gap-3">
                                                                    <li className="flex items-center justify-between">
                                                                    <span className="text-muted-foreground">
                                                                        登录时间
                                                                    </span>
                                                                        <span>{userInfo.loginDate}</span>
                                                                    </li>
                                                                    <li className="flex items-center justify-between">
                                                                    <span className="text-muted-foreground">
                                                                        登录ip
                                                                    </span>
                                                                        <span>{userInfo.loginIp}</span>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </CardContent>
                                                    </Card>}
                                            </SheetContent>
                                        </Sheet>
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {u.username}
                                    </TableCell>
                                    <TableCell>
                                        {
                                            u.enabled ? <Badge>启用</Badge> :
                                                <Badge variant="outline">禁用</Badge>
                                        }
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild
                                                                 onPointerDown={() => handleUserClick(u.username)}>
                                                <Button
                                                    aria-haspopup="true"
                                                    size="icon"
                                                    variant="ghost"
                                                >
                                                    <MoreHorizontal className="h-4 w-4"/>
                                                    <span className="sr-only">Toggle menu</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-36">
                                                <DropdownMenuLabel>更多操作</DropdownMenuLabel>
                                                <DropdownMenuItem {...commonSetDialog.triggerProps}>
                                                    用户设置
                                                    <DropdownMenuShortcut><Settings
                                                        className={'size-4'}/></DropdownMenuShortcut>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem {...roleDialog.triggerProps}>
                                                    角色分配
                                                    <DropdownMenuShortcut><Shapes
                                                        className={'size-4'}/></DropdownMenuShortcut>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem {...resetPwdDialog.triggerProps}>
                                                    重置密码
                                                    <DropdownMenuShortcut><Undo2
                                                        className={'size-4'}/></DropdownMenuShortcut>
                                                </DropdownMenuItem>
                                                {
                                                    u.enabled ?
                                                        <DropdownMenuItem
                                                            onClick={() => toggleEnabled(currentUsername)}>
                                                            禁用
                                                            <DropdownMenuShortcut>
                                                                <ShieldBan className={'size-4'}/></DropdownMenuShortcut>
                                                        </DropdownMenuItem> :
                                                        <DropdownMenuItem
                                                            onClick={() => toggleEnabled(currentUsername)}>
                                                            启用
                                                            <DropdownMenuShortcut>
                                                                <ShieldCheck
                                                                    className={'size-4'}/></DropdownMenuShortcut>
                                                        </DropdownMenuItem>
                                                }

                                                <DropdownMenuItem {...deleteDialog.triggerProps}>
                                                    删除
                                                    <DropdownMenuShortcut><Trash
                                                        className={'size-4'}/></DropdownMenuShortcut>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>)}
            <Dialog {...roleDialog.dialogProps} >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>角色分配</DialogTitle>
                        <DialogDescription>
                            请从下面列出的角色中选择要分配给该用户的角色
                        </DialogDescription>
                    </DialogHeader>
                    <div>
                        <div className="font-semibold my-2">用户信息</div>
                        <div className='flex items-center space-x-4 h-10'>
                            <div className='w-24 flex-none'>
                                <Label htmlFor="name">姓名</Label>
                                <p className='font-semibold'>{userInfo.nickname}</p>
                            </div>
                            <Separator orientation="vertical"/>
                            <div className='flex-grow'>
                                <Label htmlFor="name">用户名</Label>
                                <p className='font-semibold'>{userInfo.username}</p>
                            </div>
                            <Separator orientation="vertical"/>
                            <div className='flex-grow'>
                                <Label htmlFor="name">角色</Label>
                                <p className='font-semibold'>{userInfo.roles ? userInfo.roles.map(role => role.name).join(",") : ''}</p>
                            </div>
                        </div>
                        <Separator className="my-4"/>
                    </div>
                    <Form {...distributeRoleForm}>
                        <form onSubmit={distributeRoleForm.handleSubmit(onDistributeRoleSubmit)} className="space-y-4">
                            <FormField
                                control={distributeRoleForm.control}
                                name="roles"
                                render={() => (
                                    <FormItem>
                                        <div className="mb-4">
                                            <FormLabel className="text-base">分配新角色</FormLabel>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4">
                                            {allRoles.map((item) => (
                                                <FormField
                                                    key={item.id}
                                                    control={distributeRoleForm.control}
                                                    name="roles"
                                                    render={({field}) => {
                                                        return (
                                                            <FormItem
                                                                key={item.id}
                                                                className="flex flex-row items-start space-x-3 space-y-0"
                                                            >
                                                                <FormControl>
                                                                    <Checkbox
                                                                        checked={field.value?.includes(item.id)}
                                                                        onCheckedChange={(checked) => {
                                                                            return checked
                                                                                ? field.onChange([...field.value, item.id])
                                                                                : field.onChange(
                                                                                    field.value?.filter(
                                                                                        (value) => value !== item.id
                                                                                    )
                                                                                )
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                                <FormLabel className="text-sm font-normal">
                                                                    {item.name}
                                                                </FormLabel>
                                                            </FormItem>
                                                        )
                                                    }}
                                                />
                                            ))}
                                        </div>
                                        <FormMessage/>
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
                </DialogContent>
            </Dialog>
            <Dialog {...commonSetDialog.dialogProps} >
                <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
                    <DialogHeader>
                        <DialogTitle>用户设置</DialogTitle>
                        <DialogDescription>
                            设置用户的部门和岗位
                        </DialogDescription>
                    </DialogHeader>
                    <div>
                        <Form {...settingForm}>
                            <form onSubmit={settingForm.handleSubmit(onSettingSubmit)} className="w-full space-y-6">
                                <FormField
                                    name={'department'}
                                    control={settingForm.control}
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>部门</FormLabel>
                                            <FormControl>
                                                <div>
                                                    <Input placeholder="点击选择部门"
                                                           {...field}
                                                           autoComplete={"off"}
                                                           className='w-3/4'
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
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={settingForm.control}
                                    name="position"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>职位</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger autoComplete={"off"}
                                                                   className='w-3/4'>
                                                        <SelectValue placeholder="选择职位"/>
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {positions.map(p => (
                                                        <SelectItem value={p.name}>{p.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormDescription>
                                                先选择部门，再设置职位。
                                            </FormDescription>
                                            <FormMessage/>
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
                            className='text-red-500 inline mr-2 mb-1'/>确定删除用户 <strong>{userInfo.nickname}</strong>吗？</DialogDescription>
                    </DialogHeader>
                    <div className='grid place-items-end'>
                        {
                            deleting ?
                                <Button disabled variant="destructive">
                                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin"/>
                                    正在删除...
                                </Button> :
                                <Button variant="destructive" onClick={handleUserDelete}>确定</Button>
                        }

                    </div>
                </DialogContent>
            </Dialog>
            <Dialog {...resetPwdDialog.dialogProps} >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle><OctagonAlert
                            className='text-orange-500 inline mr-2 mb-1'/>确定重置密码吗？</DialogTitle>
                        <DialogDescription>
                            重置用户 <strong>{userInfo.nickname}</strong> 的密码为系统默认密码！
                        </DialogDescription>
                    </DialogHeader>
                    <div className='grid place-items-end'>
                        {
                            updating ?
                                <Button disabled>
                                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin"/>
                                    正在重置...
                                </Button> :
                                <Button onClick={handleResetPwd}>重置</Button>
                        }

                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default UserList