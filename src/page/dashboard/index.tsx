import {SidebarTrigger} from "@/components/ui/sidebar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList, BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import {Separator} from "@/components/ui/separator";
import {NavActions} from "@/components/nav-actions"
import React from "react";
import {Helmet} from "react-helmet-async";

const Dashboard = () => {
    return (
        <div>
            <Helmet>
                <title>仪表盘</title>
            </Helmet>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                <div className="flex flex-1 items-center gap-2 px-3">
                    <SidebarTrigger className="-ml-1"/>
                    <Separator orientation="vertical" className="mr-2 h-4"/>
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbLink href="#">
                                    Building Your Application
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block"/>
                            <BreadcrumbItem>
                                <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
                <div className="ml-auto px-3">
                    <NavActions/>
                </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="aspect-video rounded-xl bg-muted/50"/>
                    <div className="aspect-video rounded-xl bg-muted/50"/>
                    <div className="aspect-video rounded-xl bg-muted/50"/>
                </div>
                <div className="min-h-[50vh] flex-1 rounded-xl bg-muted/50"/>
            </div>
        </div>
    )
}

export default Dashboard