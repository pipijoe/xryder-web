"use client"

import * as React from "react"
import {useEffect} from "react"
import {
    BookOpen,
    Bot,
    BriefcaseBusiness,
    CircleUserRound, House,
    Landmark,
    LayoutDashboard,
    Mail,
    Monitor,
    RectangleEllipsis,
    ScrollText,
    SquareTerminal,
    UserRoundCog,
} from "lucide-react"
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
            title: "playground",
            url: "/chat",
            icon: SquareTerminal,
            isActive: true,
            items: [
                {
                    title: "aichat",
                    url: "/chat",
                },
                {
                    title: "settings",
                    url: "#",
                },
            ],
        },
        {
            title: "models",
            url: "#",
            icon: Bot,
            items: [
                {
                    title: "explorer",
                    url: "#",
                },
                {
                    title: "members",
                    url: "#",
                },
                {
                    title: "bill",
                    url: "#",
                },
            ],
        },
        {
            title: "docs",
            url: "/docs/introduction",
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
    ],
    workplace: [
        {
            name: 'welcome',
            url: "/welcome",
            icon: House,
        },
        {
            name: 'dashboard',
            url: "/dashboard",
            icon: LayoutDashboard,
        },
    ],
    system: [
        {
            name: "users",
            url: "/sys/users",
            icon: UserRoundCog,
        },
        {
            name: "roles",
            url: "/sys/roles",
            icon: CircleUserRound,
        },
        {
            name: "dept",
            url: "/sys/department",
            icon: Landmark,
        },
        {
            name: "position",
            url: "/sys/position",
            icon: BriefcaseBusiness,
        },
        {
            name: "message",
            url: "/sys/mail",
            icon: Mail,
        },
        {
            name: "log",
            url: "/sys/log",
            icon: ScrollText,
        },
        {
            name: "login-log",
            url: "/sys/login-log",
            icon: RectangleEllipsis,
        },
        {
            name: "monitor",
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
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent className={'custom-scrollbar'}>
                <NavSystem projects={data.workplace} label={'workplace'}/>
                <NavMain items={data.navMain} label={'platform'}/>
                {
                    account.permissions && account.permissions.filter((p: string) => p.startsWith('system')).length > 0 &&
                    <NavSystem projects={data.system} label={'system'}/>
                }
                <NavSecondary account={account} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={account} logout={logout}/>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}