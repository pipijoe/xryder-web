import {Folder, Tree} from "@/components/magicui/department-tree";
import {FolderPlus, TreePlus} from "@/components/magicui/department-tree-plus";
import {BadgeX, ChevronDown, ChevronRight, OctagonAlert, PlusCircle, Search} from "lucide-react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import React, {useCallback, useState} from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "sonner";
import {ReloadIcon} from "@radix-ui/react-icons";
import {useDialog} from "@/components/use-dialog";
import {Label} from "@/components/ui/label";
import {Separator} from "@/components/ui/separator";
import {debounce} from 'lodash';

const FormSchema = z.object({
    name: z.string().trim().min(2, {
        message: "部门名称最短2个字",
    }).max(20, {message: "部门名称最长20个字"}),
    parentName: z.string().trim().min(1, {
        message: '请选择上级部门'
    }),
})

const DepartmentTree = ({
                            department,
                            loading,
                            addDepartment,
                            saving,
                            deleteDepartment,
                            deleting,
                            updating,
                            updateDepartment,
                            search
                        }) => {
    const [parentDepartment, setParentDepartment] = useState('')
    const [parentId, setParentId] = useState('')
    const [departmentName, setDepartmentName] = useState('')
    const [newDepartmentName, setNewDepartmentName] = useState('')
    const [newDepartmentPosition, setNewDepartmentPosition] = useState("5")
    const [departmentId, setDepartmentId] = useState('')
    const [visible, setVisible] = useState(false);

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
    const updateDialog = useDialog(null);
    const deleteDialog = useDialog(null);

    const TreePlusNode = ({node}) => {
        if (node) {
            return (
                <FolderPlus element={node.name}
                            value={node.id.toString()}
                            deleteDialog={deleteDialog}
                            updateDialog={updateDialog}
                            onClick={() => handleClick(node.id.toString(), node.name, node.position)}
                >
                    {
                        node.children.map((child) => (
                            <TreePlusNode key={child.id} node={child}/>
                        ))}
                </FolderPlus>
            );
        }
        return null
    };

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
            parentName: ""
        },
    })

    const handleSelect = (id: string, name: string) => {
        setParentDepartment(name)
        form.setValue('parentName', name, {shouldValidate: true})
        setVisible(false)
        setParentId(id)
    }

    const handleClick = (id: string, name: string, position: string) => {
        setDepartmentId(id)
        setDepartmentName(name)
        setNewDepartmentName(name)
        setNewDepartmentPosition(position)
    }

    const handleFocus = () => {
        setVisible(true)
    }

    const [open, setOpen] = useState(false);

    const onOpenChange = (open: boolean) => {
        setOpen(open)
        if (!open) {
            form.reset()
            setParentDepartment('')
            setParentId('')
            setVisible(false)
        }
    }

    function onSubmit(data: z.infer<typeof FormSchema>) {
        addDepartment({name: data.name, parentDepartment: {id: parentId}}).then(() => {
            setOpen(false)
            form.reset()
            setParentDepartment('')
            setParentId('')
        })
    }

    const handleUpdate = () => {
        if (newDepartmentName.trim().length < 2 || newDepartmentName.trim().length > 20) {
            toast.warning("名称长度为2-20")
            return
        }
        if (newDepartmentPosition && (newDepartmentPosition < 1 || newDepartmentPosition > 100)) {
            toast.warning("排序范围为1-100")
            return
        }
        updateDepartment({
            id: departmentId,
            body: {name: newDepartmentName, position: newDepartmentPosition}
        }).then(() => {
            updateDialog.dismiss()
            setNewDepartmentName("")
            setDepartmentId("")
        })
    }

    const handleDelete = () => {
        deleteDepartment(departmentId).then(() => {
            deleteDialog.dismiss()
            setDepartmentName('')
            setDepartmentId('')
        });
    }

    // 创建防抖的搜索函数
    const debouncedSearch = useCallback(
        debounce((value) => {
            search({q: value})
        }, 500), // 500ms 防抖时间
        []
    );

    // 处理输入框的变化
    const handleSearch = (e) => {
        const value = e.target.value;
        debouncedSearch(value)
    }

    return (
        <div className='flex grid gap-2 pt-2'>
            <div className="flex flex-row gap-2">
                <div className="relative flex-auto">
                    {
                        loading ?
                            <ReloadIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground animate-spin"/> :
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
                    }
                    <Input
                        type="search"
                        placeholder="搜索部门..."
                        onChange={handleSearch}
                        className="w-full appearance-none bg-background pl-8 shadow-none w-64"
                    />
                </div>
                <div className='flex gap-2 place-items-end'>
                    <Dialog open={open} onOpenChange={onOpenChange}>
                        <DialogTrigger asChild>
                            <Button size="sm" className="h-7 gap-1">
                                <PlusCircle className="h-3.5 w-3.5"/>
                                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">添加部门</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[485px]">
                            <DialogHeader>
                                <DialogTitle>添加部门</DialogTitle>
                                <DialogDescription>
                                    选择上级部门，填入部门名称，点击添加完成部门的新增
                                </DialogDescription>
                            </DialogHeader>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>部门名称</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="输入部门名称" {...field} autoComplete={"off"}
                                                           className='w-3/4'/>
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField render={({field}) => (
                                        <FormItem>
                                            <FormLabel>选择上级部门</FormLabel>
                                            <FormControl>
                                                <div>
                                                    <Input placeholder="点击选择上级部门"
                                                           {...field}
                                                           autoComplete={"off"}
                                                           className='w-3/4'
                                                           value={parentDepartment}
                                                           onFocus={handleFocus}
                                                    />
                                                    <div className='relative z-10'>
                                                        <div
                                                            className={`${visible ? ' ' : 'hidden'} 
                                                     rounded-lg border bg-card text-card-foreground shadow-2xl
                                                        absolute -bottom-18 left-0 w-3/4
                                                        `}>
                                                            <Tree
                                                                className="p-4 overflow-hidden rounded-md h-72"
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
                                               name={'parentName'}
                                               control={form.control}
                                    />

                                    <div className='grid place-items-end'>
                                        {
                                            saving ?
                                                <Button disabled>
                                                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin"/>
                                                    正在添加...
                                                </Button> :
                                                <Button type="submit">添加</Button>
                                        }
                                    </div>

                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <Card x-chunk="dashboard-06-chunk-0">
                <CardHeader>
                    <CardTitle>部门列表</CardTitle>
                    <CardDescription>
                        对部门进行管理，通过层级结构查看，添加，修改和删除部门
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <TreePlus
                        className="p-2 overflow-hidden rounded-md bg-background min-h-[50vh]"
                        initialExpandedItems={[
                            "1"
                        ]}
                    >
                        <TreePlusNode node={department}/>
                    </TreePlus>
                </CardContent>
            </Card>
            <Dialog {...updateDialog.dialogProps} >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle><OctagonAlert className='text-orange-500 inline mr-2 mb-1'/>修改</DialogTitle>
                        <DialogDescription>
                            修改部门 <strong>{departmentName}</strong> 的名称和排序！
                        </DialogDescription>
                    </DialogHeader>
                    <Separator/>
                    <div className="grid w-full max-w-sm items-center gap-2">
                        <div>
                            <Label>新的部门名称</Label>
                            <Input type="text" onChange={(e) => setNewDepartmentName(e.target.value)}
                                   defaultValue={departmentName}/>
                        </div>
                        <div>
                            <Label>部门排序（非必填，可填范围：1-100）</Label>
                            <Input type="number" min="1" max="100"
                                   onChange={(e) => setNewDepartmentPosition(e.target.value)}
                                   defaultValue={newDepartmentPosition}/>
                        </div>
                    </div>
                    <div className='grid place-items-end'>
                        {
                            updating ?
                                <Button disabled>
                                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin"/>
                                    正在修改...
                                </Button> :
                                <Button onClick={handleUpdate}>确定</Button>
                        }

                    </div>
                </DialogContent>
            </Dialog>
            <Dialog {...deleteDialog.dialogProps} >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle><BadgeX className='text-red-500 inline mr-2 mb-1'/>确定删除吗？</DialogTitle>
                        <DialogDescription>
                            删除 <strong>{departmentName}</strong> 及下属部门信息！
                        </DialogDescription>
                    </DialogHeader>
                    <div className='grid place-items-end'>
                        {
                            deleting ?
                                <Button disabled variant="destructive">
                                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin"/>
                                    正在删除...
                                </Button> :
                                <Button variant="destructive" onClick={handleDelete}>确定</Button>
                        }

                    </div>
                </DialogContent>
            </Dialog>
        </div>

    )
}

export default DepartmentTree