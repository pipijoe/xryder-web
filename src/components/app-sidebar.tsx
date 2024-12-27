"use client"

import * as React from "react"
import {useEffect} from "react"
import {BookOpen, Bot, Mail, Monitor, Settings2, SquareTerminal,} from "lucide-react"
import {v4 as uuidv4} from 'uuid';

import {NavMain} from "@/components/nav-main"
import {NavSystem} from "@/components/nav-system"
import {NavUser} from "@/components/nav-user"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"
import {useAuthStore} from "@/store/authStore";
import {useAccountStore} from "@/store/accountStore";
import useSystemStore from "@/store/systemStore";
import {NavSecondary} from "@/components/nav-secondary";
import {useVisitorStore} from "@/store/visitorStore";

const data = {
    navMain: [
        {
            title: "Playground",
            url: "#",
            icon: SquareTerminal,
            isActive: true,
            items: [
                {
                    title: "对话",
                    url: "/chat",
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
            title: "文档",
            url: "/docs",
            icon: BookOpen,
            items: [
                {
                    title: "简介",
                    url: "/docs/introduction",
                },
                {
                    title: "开始",
                    url: "/docs/getstarted",
                },
                {
                    title: "教程",
                    url: "/docs/tutorials",
                },
                {
                    title: "更新日志",
                    url: "/docs/changelog",
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
            title: "收件箱",
            url: "/mail",
            icon: Mail,
        }
    ],
    projects: [
        {
            name: "监控",
            url: "/monitor",
            icon: Monitor,
        },
    ],
}

// 检查或生成用户唯一标识符
function getOrCreateUUID() {
    let userUUID = localStorage.getItem('userUUID');
    if (!userUUID) {
        userUUID = uuidv4(); // 生成新的 UUID
        localStorage.setItem('userUUID', userUUID); // 存储在 localStorage
    }
    return userUUID;
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const {account, getAccount} = useAccountStore();
    const {queryDepartment} = useSystemStore()
    const {logout} = useAuthStore()
    const { visit } = useVisitorStore()
    useEffect(() => {
        getAccount();
        queryDepartment({})
        recordVisit()
    }, [])
    // 发送访客信息到后端
    function recordVisit() {
        const userUUID = getOrCreateUUID();
        visit({userUUID})
    }
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="/">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    X.R
                                </div>
                                <div className="flex flex-row gap-0.5 leading-none">
                                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">X.Ryder</span>
                                    <span className="text-sm">v1.1.0</span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent className={'custom-scrollbar'}>
                <NavMain items={data.navMain} />
                <NavSystem projects={data.projects} />
                <NavSecondary account={account} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={account} logout={logout}/>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
