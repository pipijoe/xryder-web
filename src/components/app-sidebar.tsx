"use client"

import * as React from "react"
import {
    BookOpen,
    Bot, Building2, CircleEllipsis,
    ContactRound, Crown,
    GalleryVerticalEnd, Mail,
    RectangleEllipsis,
    Settings2,
    SquareTerminal, UserRoundCog, X,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavSystem } from "@/components/nav-system"
import { NavUser } from "@/components/nav-user"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"
import {useEffect} from "react";
import {useAuthStore} from "@/store/authStore";
import {useAccountStore} from "@/store/accountStore";
import useSystemStore from "@/store/systemStore";
import {NavSecondary} from "@/components/nav-secondary";

const data = {
    navMain: [
        {
            title: "Playground",
            url: "#",
            icon: SquareTerminal,
            isActive: true,
            items: [
                {
                    title: "History",
                    url: "#",
                },
                {
                    title: "Starred",
                    url: "#",
                },
                {
                    title: "Settings",
                    url: "#",
                },
            ],
        },
        {
            title: "Models",
            url: "#",
            icon: Bot,
            items: [
                {
                    title: "Genesis",
                    url: "#",
                },
                {
                    title: "Explorer",
                    url: "#",
                },
                {
                    title: "Quantum",
                    url: "#",
                },
            ],
        },
        {
            title: "Documentation",
            url: "#",
            icon: BookOpen,
            items: [
                {
                    title: "Introduction",
                    url: "#",
                },
                {
                    title: "Get Started",
                    url: "#",
                },
                {
                    title: "Tutorials",
                    url: "#",
                },
                {
                    title: "Changelog",
                    url: "#",
                },
            ],
        },
        {
            title: "系统管理",
            url: "#",
            icon: Settings2,
            items: [
                {
                    title: "用户管理",
                    url: "/sys/users",
                },
                {
                    title: "角色管理",
                    url: "/sys/roles",
                },
                {
                    title: "部门管理",
                    url: "/sys/department",
                },
                {
                    title: "职位管理",
                    url: "/sys/position",
                },
                {
                    title: "邮件通知",
                    url: "/sys/mail",
                },
                {
                    title: "操作日志",
                    url: "/sys/log",
                },
                {
                    title: "登录日志",
                    url: "/sys/login-log",
                },
            ],
        },
    ],
    navSecondary: [
        {
            title: "邮件通知",
            url: "/mail",
            icon: Mail,
        }
    ],
    projects: [
        {
            name: "project 1",
            url: "#",
            icon: ContactRound,
        },
        {
            name: "project 2",
            url: "#",
            icon: ContactRound,
        }
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const {account, getAccount} = useAccountStore();
    const {queryDepartment} = useSystemStore()
    const {logout} = useAuthStore()
    useEffect(() => {
        getAccount();
        queryDepartment({})
    }, [])
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="#">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    X.R
                                </div>
                                <div className="flex flex-row gap-0.5 leading-none">
                                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">X.Ryder</span>
                                    <span className="text-sm">v1.2.0</span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent className={'custom-scrollbar'}>
                <NavMain items={data.navMain} />
                <NavSystem projects={data.projects} />
                <NavSecondary items={data.navSecondary} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={account} logout={logout}/>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
