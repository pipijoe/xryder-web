/**
 * @license MIT
 * Created by: joetao
 * Created on: 2024/11/29
 * Project: xryder
 * Description: This is a rapid development template for middle and backend UI based on vite, react, tailwindcss and shadcn.
 */

import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { useLocation } from 'react-router-dom';
import { Toaster } from "sonner"

export default function Layout({ children }: { children: React.ReactNode }) {
    const location = useLocation();
    // 不应用 Layout 的路径
    const noLayoutPaths = ['/login', '/403', '/500'];

    if (noLayoutPaths.includes(location.pathname)) {
        return <>
            {children}
            <Toaster  position="top-center" richColors />
        </>;
    }
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                {children}
            </SidebarInset>
            <Toaster position="top-center" richColors/>
        </SidebarProvider>
    )
}
