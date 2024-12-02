import {Input} from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Textarea} from "@/components/ui/textarea";
import {Checkbox} from "@/components/ui/checkbox";
import React, {useCallback, useState} from "react";
import {PlusCircle, Search} from "lucide-react";
import {debounce} from 'lodash';
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {ReloadIcon} from "@radix-ui/react-icons";

const FormSchema = z.object({
    name: z.string().min(2, {
        message: "名称最少2个字",
    }).max(12, {message: "名称最长12字"}),
    remark: z.string().max(100, "最大长度不能超过100")
        .nullable(), // 允许 null 值，也可以用 .optional() 允许 undefined 值
    permissions: z.any()
})
const RoleToolBar = ({
                         addRole,
                         search, params,
                         saving,
                         permissions
                     }) => {

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
            remark: "",
            permissions: [],
        }
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {
        addRole(data).then(
            () => {
                setOpen(false)
                form.reset({
                    name: "",
                    remark: "",
                    permissions: []
                })
            }
        );
    }

    const [open, setOpen] = useState(false);
    const onOpenChange = (open: boolean) => {
        setOpen(open)
        if (!open) {
            form.reset({
                name: "",
                remark: "",
                permissions: []
            })
        }
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
        debouncedSearch(value)
    }

    return (
        <div className="flex flex-row gap-2 pt-2">
            <div className="relative flex-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
                <Input
                    type="search"
                    placeholder="搜索角色名..."
                    onChange={handleSearch}
                    className="w-full appearance-none bg-background pl-8 shadow-none w-64"
                />
            </div>
            <div className='flex gap-2 place-items-end'>
                <Dialog open={open} onOpenChange={onOpenChange}>
                    <DialogTrigger asChild>
                        <Button size="sm" className="h-7 gap-1">
                            <PlusCircle className="h-3.5 w-3.5"/>
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">添加角色</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[485px]">
                        <DialogHeader>
                            <DialogTitle>添加角色</DialogTitle>
                            <DialogDescription>
                                输入角色信息，包括名称、描述等，点击保存按钮完成操作。
                            </DialogDescription>
                        </DialogHeader>
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
        </div>
    )
}

export default RoleToolBar