/**
 * @license MIT
 * Created by: joetao
 * Created on: 2024/12/2
 * Project: xryder
 * Description: This is a rapid development template for middle and backend UI based on vite, react, tailwindcss and shadcn.
 */

import * as React from "react"
import {Github, Mail} from "lucide-react"

import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import {AccountState} from "@/store/accountStore";
import {NavLink} from "react-router-dom";

export function NavSecondary({
                                 account,
                                 ...props
                             }: {
    account: AccountState
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
    return (
        <SidebarGroup {...props}>
            <SidebarGroupContent>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild size="sm">
                            <NavLink to={'/mail'}>
                                <Mail className='w-5 h-5'/>
                                <span>收件箱</span>
                                {account.newMails > 0 && (
                                    <span
                                        className="absolute top-1 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-white text-xs">
                                        {account.newMails > 100 ? "99+" : account.newMails}
                                    </span>
                                )}
                            </NavLink>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild size="sm">
                            <a href={'https://github.com/pipijoe/xryder-web'} target={'_blank'}>
                                <Github className='w-5 h-5'/>
                                <span>GitHub</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}
