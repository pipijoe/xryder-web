/**
 * @license MIT
 * Created by: joetao
 * Created on: 2024/12/2
 * Project: xryder
 * Description: This is a rapid development template for middle and backend UI based on vite, react, tailwindcss and shadcn.
 */
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {CircleUser, PlusCircle} from "lucide-react";
import { Progress } from "@/components/ui/progress"
import {useAccountStore} from "@/store/accountStore";
import {Separator} from "@/components/ui/separator";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import React, {useEffect} from "react";
import {ReloadIcon} from "@radix-ui/react-icons";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import validator from "validator";
import {toast} from "sonner";
import {useDialog} from "@/components/use-dialog";
import {DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Dialog} from "@radix-ui/react-dialog";
import {useAuthStore} from "@/store/authStore";
import {encryptPassword} from '@/utils'
import {useSystemStore} from "@/store/systemStore";
import {findDepartmentPathById, formatPath} from '@/utils'
import { Helmet } from 'react-helmet-async';
import {SidebarTrigger} from "@/components/ui/sidebar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import {ScrollArea} from "@/components/ui/scroll-area";

const FormSchema = z.object({
    nickname: z
        .string()
        .min(2, {
            message: "用户名最短2个字",
        })
        .max(16, { message: "用户名最长16个字" }),
    mobile: z
        .string()
        .optional()
        .refine(
            (value) => !value || validator.isMobilePhone(value),
            { message: "无效的手机号" }
        ),
    email: z
        .string()
        .optional()  // 允许空值
        .refine(
            (value) => !value || validator.isEmail(value),
            { message: "无效的邮箱" }
        ), // 自定义校验：为空或者是有效的邮箱
});

const passwordSchema = z.object({
    oldPassword: z.string().min(8, "原密码长度必须至少为 8 位"),

    newPassword: z.string()
        .min(8, "新密码长度必须至少为 8 位")
        .max(16, "新密码长度不能超过 16 位")
        .regex(/^[A-Za-z]/, "新密码必须以字母开头")
        .regex(/[0-9]/, "新密码必须包含至少一个数字")
        .regex(/[!@#$%^&*(),.?":{}|<>]/, "新密码必须包含至少一个符号"),

    confirmPassword: z.string(),
}).superRefine((data, ctx) => {
    if (data.newPassword === data.oldPassword) {
        ctx.addIssue({
            path: ['newPassword'],
            message: '新密码不能与原密码相同',
        });
    }

    if (data.confirmPassword !== data.newPassword) {
        ctx.addIssue({
            path: ['confirmPassword'],
            message: '确认密码必须与新密码相同',
        });
    }
});

const Account = () => {
    const {account, changeAvatar, uploading, uploadPercentage, saving, updateAccount, changePassword, changing} = useAccountStore();
    const {department} = useSystemStore()
    const {getPublicKey, publicKey, logout} = useAuthStore()
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            nickname: account.nickname,
            email: account.email || '',
            mobile: account.mobile || '',
        },
    });
    useEffect(() => {
        if (publicKey.length == 0) {
            getPublicKey()
        }
        if (account) {
            form.reset({
                nickname: account.nickname,
                email: account.email || '',
                mobile: account.mobile || ''
            });
        }
    }, [account])

    const changeMyAvatar = (e) => {
        const file = e.target.files[0]; // 获取上传的文件

        if (!file) return;

        // 限制文件大小为20KB
        const maxSize = 2 * 1024 * 10; // 2KB

        if (file.size > maxSize) {
            toast.warning("文件大小不能超过 20KB，请选择更小的图片！");
            e.target.value = ""; // 清空输入框的值
            return;
        }
        changeAvatar(e).then(
            () => toast.success("上传成功！")
        )
    }

    function onSubmit(data: z.infer<typeof FormSchema>) {
        updateAccount(data).then(
            (res: any) => {
                if (res.code === 200) {
                    toast.success("保存成功！")
                } else {
                    toast.error("保存失败！", {
                        description: res.data
                    })
                }
            }
        )
    }

    const changePasswordForm = useForm<z.infer<typeof passwordSchema>>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            oldPassword: '',
            newPassword: '',
            confirmPassword: ''
        }
    })

    const changePasswordDialog = useDialog(changePasswordForm);

    const handlePasswordChange = (data: z.infer<typeof passwordSchema>) => {
        const params = {oldPassword: encryptPassword(data.oldPassword, publicKey), newPassword: encryptPassword(data.newPassword, publicKey)}
        changePassword(params).then((res) => {
            if (res.code == 200) {
                toast.success("修改成功！", {
                    description: '正在跳转到登录页面'
                })
                changePasswordDialog.dismiss()
                setTimeout(() => {
                    logout()
                }, 2000)
            }
        })
    }
    return (
        <div>
            <Helmet>
                <title>账户设置</title>
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
                                账户设置
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>
            <ScrollArea className={'h-[calc(100vh-80px)]'}>
                <div className="container grid gap-2 p-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>账户设置</CardTitle>
                            <CardDescription>
                                编辑个人信息，包括头像、姓名、密码、邮箱、手机号、绑定第三方账号
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-6">
                                <div className="grid gap-3">
                                    <ul className="grid gap-3 md:hidden">
                                        <li className="flex items-center justify-between">
                                                                    <span className="text-muted-foreground">
                                                                        用户名
                                                                    </span>
                                            <span>{account.username}</span>
                                        </li>
                                        <li className="flex items-center justify-between">
                                                                    <span className="text-muted-foreground">
                                                                        部门
                                                                    </span>
                                            <span>{formatPath(findDepartmentPathById(department, account.departmentId)) || '暂无'}</span>
                                        </li>
                                        <li className="flex items-center justify-between">
                                                                    <span className="text-muted-foreground">
                                                                        职位
                                                                    </span>
                                            <span>{account.position}</span>
                                        </li>
                                        <li className="flex items-center justify-between">
                                                                    <span className="text-muted-foreground">
                                                                        角色
                                                                    </span>
                                            <span>{account.roles && account.roles.map(role => role.name).join(',')}</span>
                                        </li>
                                    </ul>
                                    <div className='flex items-center space-x-8 flex-col md:flex-row'>
                                        <div className='hidden md:block md:w-1/4'>
                                            <Label htmlFor="name">用户名</Label>
                                            <p className='font-semibold'>{account.username}</p>
                                        </div>
                                        <Separator orientation="vertical" className={'hidden md:block'}/>
                                        <div className='hidden md:block  md:w-1/4'>
                                            <Label htmlFor="name">部门</Label>
                                            <p className='font-semibold'>
                                                {formatPath(findDepartmentPathById(department, account.departmentId)) || '暂无'}
                                            </p>
                                        </div>
                                        <Separator orientation="vertical" className={'hidden md:block'}/>
                                        <div className='hidden md:block  md:w-1/4'>
                                            <Label htmlFor="name">职位</Label>
                                            <p className='font-semibold'>{account.position}</p>
                                        </div>
                                        <Separator orientation="vertical" className={'hidden md:block'}/>
                                        <div className='hidden md:block  md:w-1/4'>
                                            <Label htmlFor="name">角色</Label>
                                            <p className='font-semibold'>{account.roles && account.roles.map(role => role.name).join(',')}</p>
                                        </div>
                                    </div>
                                </div>
                                <Separator />
                                <div className="grid gap-3">
                                    <Label htmlFor="picture">头像</Label>
                                    <div className='flex items-center gap-4'>
                                        {
                                            account.avatar ?
                                                <Avatar className='w-24 h-24'>
                                                    <AvatarImage src={'data:image/png;base64,' + account.avatar} alt="avatar" />
                                                    <AvatarFallback>{account.nickname}</AvatarFallback>
                                                </Avatar> :
                                                <CircleUser className="h-16 w-16" />
                                        }
                                        <div className="grid w-full max-w-sm items-center gap-1.5">
                                            <Label htmlFor="picture">点击上传头像</Label>
                                            <Input
                                                type="file"
                                                onChange={changeMyAvatar}
                                                className='w-64 cursor-pointer'
                                                accept="image/png, image/jpeg"
                                            />
                                            {uploading && <Progress value={uploadPercentage} className={'w-64'}/> }
                                        </div>
                                    </div>

                                </div>

                                <div className="grid gap-3">
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
                                                                   className='w-full md:w-2/3'/>
                                                        </FormControl>
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
                                                                   className='w-full md:w-2/3'/>
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
                                                                   className='w-full md:w-2/3'/>
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
                                                        正在保存...
                                                    </Button> :
                                                    <Button type="submit">保存</Button>
                                            }
                                        </form>
                                    </Form>
                                </div>
                                <Separator />

                                <div className="grid gap-3">
                                    <Label htmlFor="description">绑定第三方账号</Label>
                                    <Button size="sm" className="h-7 gap-1 w-32" variant="secondary">
                                        <PlusCircle className="h-3.5 w-3.5"/>
                                        <span>添加绑定</span>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="border-t px-6 py-4 grid-col gap-2">
                            <Button variant="destructive" {...changePasswordDialog.triggerProps}>修改密码</Button>
                        </CardFooter>
                    </Card>
                </div>
            </ScrollArea>
            <Dialog {...changePasswordDialog.dialogProps} >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>修改密码</DialogTitle>
                        <DialogDescription>
                            修改密码之后需要重新进行登录
                        </DialogDescription>
                    </DialogHeader>
                    <div>
                        <Form {...changePasswordForm}>
                            <form onSubmit={changePasswordForm.handleSubmit(handlePasswordChange)} className="w-full space-y-6">
                                <FormField
                                    control={changePasswordForm.control}
                                    name="oldPassword"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>原密码</FormLabel>
                                            <FormControl>
                                                <Input placeholder="输入原密码" {...field} autoComplete={"off"}
                                                       className='w-2/3' type={"password"}/>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={changePasswordForm.control}
                                    name="newPassword"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>新密码</FormLabel>
                                            <FormControl>
                                                <Input placeholder="输入新密码" {...field} autoComplete={"off"}
                                                       className='w-2/3' type={"password"}/>
                                            </FormControl>
                                            <FormDescription>
                                                长度为 8-16 位。
                                                由字母、数字和符号组成，并以字母开头。
                                                新密码不得与原密码相同。
                                            </FormDescription>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={changePasswordForm.control}
                                    name="confirmPassword"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>确认密码</FormLabel>
                                            <FormControl>
                                                <Input placeholder="确认密码" {...field} autoComplete={"off"}
                                                       className='w-2/3' type={"password"}/>
                                            </FormControl>
                                            <FormDescription>
                                                再次输入一次新密码，确保2次输入的密码一致
                                            </FormDescription>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                {
                                    changing ?
                                        <Button disabled>
                                            <ReloadIcon className="mr-2 h-4 w-4 animate-spin"/>
                                            正在修改...
                                        </Button> :
                                        <Button type="submit">确认修改</Button>
                                }
                            </form>
                        </Form>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Account