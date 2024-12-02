import {
    BadgeX,
    MoreHorizontal, Pencil, Trash
} from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Button} from "@/components/ui/button"

import React, {useState} from "react";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import {Badge} from "@/components/ui/badge";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {ReloadIcon} from "@radix-ui/react-icons";
import {useDialog} from "@/components/use-dialog";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Checkbox} from "@/components/ui/checkbox";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import RichEmpty from "@/components/RichEmpty";

const FormSchema = z.object({
    name: z.string().min(2, {
        message: "名称最少2个字",
    }).max(12, {message: "名称最长12字"}),
    remark: z.string().max(100, "最大长度不能超过100")
        .nullable(), // 允许 null 值，也可以用 .optional() 允许 undefined 值
    permissions: z.any()
})
const RoleList = ({
                      isLoading,
                      updating,
                      roles,
                      deleting,
                      deleteRoleById,
                      updateRole,
                      permissions
                  }) => {
    const [activeRole, setActiveRole] = useState<any>({
        id: 0,
        name: ''
    })

    // 删除角色
    const deleteDialog = useDialog(null);

    const handleRoleDelete = async () => {
        await deleteRoleById(activeRole.id)
        deleteDialog.dismiss()
    }

    // 编辑角色
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
            remark: "",
            permissions: [],
        }
    })
    const editDialog = useDialog(form)

    function onSubmit(data: z.infer<typeof FormSchema>) {
        updateRole({id: activeRole.id, ...data}).then(
            () => {
                editDialog.dismiss()
            }
        );
    }

    const onRoleClick = (r) => {
        setActiveRole(r)
        form.reset({
            name: r.name,
            remark: r.remark,
            permissions: r.permissions
        })
    }
    return (
        <div className='relative min-h-60'>
            {isLoading && (
                <div
                    className="absolute top-0 left-0 right-0 bottom-0 bg-muted/50 bg-opacity-70 flex justify-center items-center z-50">
                    <div
                        className="w-10 h-10 border-4 border-t-4 border-gray-200 border-t-sky-500 rounded-full animate-spin"></div>
                </div>
            )}
            {(roles.length == 0 && !isLoading) ? <RichEmpty description={'暂无角色数据'}/> : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>名称</TableHead>
                            <TableHead>类型</TableHead>
                            <TableHead className="hidden md:table-cell">
                                描述
                            </TableHead>
                            <TableHead>
                                <span className="sr-only">Actions</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            roles.map((r, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-semibold">
                                        {r.name}
                                    </TableCell>
                                    <TableCell>
                                        {r.type === 1 ? <Badge variant="outline">内置</Badge> :
                                            <Badge>自定义</Badge>}
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        {r.remark}
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild onPointerDown={() => onRoleClick(r)}>
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
                                                <DropdownMenuItem {...editDialog.triggerProps}>
                                                    编辑
                                                    <DropdownMenuShortcut><Pencil
                                                        className={'size-4'}/></DropdownMenuShortcut>
                                                </DropdownMenuItem>
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
            <Dialog {...deleteDialog.dialogProps} >
                <DialogContent>
                    <DialogHeader>
                        <DialogDescription><BadgeX
                            className='text-red-500 inline mr-2 mb-1'/>确定删除角色 <strong>{activeRole.name}</strong> 吗？</DialogDescription>
                    </DialogHeader>
                    <div className='grid place-items-end'>
                        {
                            deleting ?
                                <Button disabled variant="destructive">
                                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin"/>
                                    正在删除...
                                </Button> :
                                <Button variant="destructive" onClick={handleRoleDelete}>确定</Button>
                        }

                    </div>
                </DialogContent>
            </Dialog>
            <Dialog {...editDialog.dialogProps}>
                <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
                    <DialogHeader>
                        <DialogTitle>角色编辑</DialogTitle>
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
                                            <FormLabel>名称</FormLabel>
                                            <FormControl>
                                                <Input placeholder="输入角色名称，如：系统运维" {...field}
                                                       autoComplete={"off"} className='w-2/3'/>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="remark"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>描述</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="输入角色描述信息" {...field}
                                                          autoComplete={"off"} className='w-2/3'/>
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
                                    name="permissions"
                                    render={() => (
                                        <FormItem>
                                            <div className="mb-4">
                                                <FormLabel className="text-base">权限</FormLabel>
                                                <FormDescription>
                                                    为角色选择权限，权限为授权具有该角色的用户可访问的资源的标识。
                                                </FormDescription>
                                            </div>
                                            <div className="grid grid-cols-3 gap-4">
                                                {permissions.map((item) => (
                                                    <FormField
                                                        key={item.id}
                                                        control={form.control}
                                                        name="permissions"
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
                                    updating ?
                                        <Button disabled>
                                            <ReloadIcon className="mr-2 h-4 w-4 animate-spin"/>
                                            正在更新...
                                        </Button> :
                                        <Button type="submit">更新</Button>
                                }
                            </form>
                        </Form>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default RoleList