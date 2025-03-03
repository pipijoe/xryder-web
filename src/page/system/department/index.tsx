/**
 * @license MIT
 * Created by: joetao
 * Created on: 2024/11/29
 * Project: xryder
 * Description: This is a rapid development template for middle and backend UI based on vite, react, tailwindcss and shadcn.
 */
import useSystemStore from "@/store/systemStore";
import { Helmet } from 'react-helmet-async';
import DepartmentTree from "@/components/system/DepartmentTree";
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

const Department = () => {
    const {
        department,
        isLoading,
        saving,
        deleting,
        addDepartment,
        queryDepartment,
        deleteDepartment,
        updateDepartment,
        updating
    } = useSystemStore()

    const handleDeptAdd = async (data) => {
        await addDepartment(data).then(
            (res) => {
                if (res.code === 200) {
                    toast.success("添加成功！")
                    queryDepartment({})
                } else {
                    toast.error("添加失败！", {
                        description: res.data
                    })
                }
            }
        );
    }

    const handleDeptDelete = async (departmentId) => {
        await deleteDepartment(departmentId).then((res: any) => {
            if (res.code == 200) {
                toast.success("已删除！")
                queryDepartment({})
            } else {
                toast.error("删除失败！", {
                    description: res.data
                })
            }
        })
    }

    const handleDeptUpdate = async (params) => {
        await updateDepartment(params).then((res: any) => {
            if (res.code == 200) {
                toast.success("修改成功！")
                queryDepartment({})
            } else {
                toast.error("修改失败！", {
                    description: res.data
                })
            }
        })
    }
    const handleSearch = async (params: any) => {
        queryDepartment(params)
    }
    return (
        <div>
            <Helmet>
                <title>部门管理</title>
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
                                <BreadcrumbPage>部门管理</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>
            <div className={'pl-4 pt-2 pr-4 container grid gap-2'}>
                <DepartmentTree department={department}
                                addDepartment={handleDeptAdd}
                                deleteDepartment={handleDeptDelete}
                                updateDepartment={handleDeptUpdate}
                                loading={isLoading}
                                saving={saving}
                                deleting={deleting}
                                updating={updating}
                                search={handleSearch}
                />
            </div>
        </div>

    )
}

export default Department