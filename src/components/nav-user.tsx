"use client"

import {
    BadgeCheck, BadgeInfo,
    Bell,
    ChevronsUpDown,
    CreditCard, Headset,
    LogOut,
    Sparkles, UserCog,
} from "lucide-react"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import {useDialog} from "@/components/use-dialog";
import {logoImg} from '@/utils'

import {DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Dialog} from "@radix-ui/react-dialog";
import {useNavigate} from "react-router-dom";

export function NavUser({
                            user,
                            logout
                        }: {
    user: {
        username: string
        nickname: string
        avatar: string
    },
    logout
}) {
    const { isMobile } = useSidebar()
    const aboutDialog = useDialog(null);
    const navigate = useNavigate();

    const supportDialog = useDialog(null);
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage src={'data:image/png;base64,' + user.avatar} alt={user.nickname} />
                                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">{user.nickname}</span>
                                <span className="truncate text-xs">{user.username}</span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage src={'data:image/png;base64,' + user.avatar} alt={user.nickname} />
                                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">{user.nickname}</span>
                                    <span className="truncate text-xs">{user.username}</span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem onClick={() => navigate('/account')}>
                                <UserCog className={'size-4 mr-2'}/>
                                账户设置
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuGroup>
                            <DropdownMenuItem onClick={() => navigate('/personal')}>
                                <UserCog className={'size-4 mr-2'}/>
                                个性化设置
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem {...supportDialog.triggerProps}>
                                <Headset className={'size-4 mr-2'}/>
                                技术支持
                            </DropdownMenuItem>
                            <DropdownMenuItem  {...aboutDialog.triggerProps}>
                                <BadgeInfo className={'size-4 mr-2'}/>
                                关 于
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={logout}>
                            <LogOut className={'size-4 mr-2'}/>
                            登 出
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
            <Dialog {...aboutDialog.dialogProps} >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle><BadgeInfo className={'text-sky-500 inline mr-2 mb-1'}/>X.Ryder</DialogTitle>
                        <DialogDescription>
                            一个基于vite、react、tailwindcss和shadcn的中后台ui快速开发模板。
                        </DialogDescription>
                    </DialogHeader>
                    <div className="container mx-auto text-center">
                        <img src={logoImg} alt={"logo"} className="mx-auto mb-4 w-20 h-auto"/>
                        <p className="text-sm">&copy; {new Date().getFullYear()} X.Ryder.</p>
                    </div>
                </DialogContent>
            </Dialog>
            <Dialog {...supportDialog.dialogProps} >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle><Headset className={'text-sky-500 inline mr-2 mb-1'}/>技术支持</DialogTitle>
                        <DialogDescription>
                            发送问题邮件至cutesimba@163.com,备注xryder.cn
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </SidebarMenu>
    )
}
