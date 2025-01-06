"use client"

import {type LucideIcon,} from "lucide-react"
import {NavLink} from 'react-router-dom';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import * as React from "react";
import {useTranslation} from "react-i18next";

export function NavSystem({
                                projects, label
                            }: {
    projects: {
        name: any
        url: string
        icon: LucideIcon
    }[]
}) {
    const {t} = useTranslation();
    return (
        <SidebarGroup>
            <SidebarGroupLabel>{t(label)}</SidebarGroupLabel>
            <SidebarMenu>
                {projects.map((item) => (
                    <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton asChild tooltip={t(item.name)}>
                            <NavLink to={item.url}>
                                <item.icon />
                                <span>{t(item.name)}</span>
                            </NavLink>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    )
}
