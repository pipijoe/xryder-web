/**
 * @license MIT
 * Created by: joetao
 * Created on: 2025/1/21
 * Project: xryder
 * Description: This is a rapid development template for middle and backend UI based on vite, react, tailwindcss and shadcn.
 */
import * as React from "react";
import {NavLink} from "react-router-dom";
import {Button} from "@/components/ui/button";
import {FaGithub} from "react-icons/fa";
import {Separator} from "@/components/ui/separator";
import {ModeToggle} from "@/components/mode-toggle";

const LandingHeader = () => {
    return (
        <header
            className="border-grid sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container-wrapper">
                <div className="container flex h-14 items-center justify-between">
                    <nav
                        className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
                        <NavLink to="/" className={'flex gap-2 items-center'}>
                            <div
                                className="flex aspect-square size-7 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                X.R
                            </div>
                            <div className="flex flex-row gap-0.5 leading-none items-center">
                                <span
                                    className="font-semibold">
                                    X.Ryder | 莱德官方文档
                                </span>
                                <span> </span>
                            </div>
                        </NavLink>
                    </nav>
                    <div className="flex gap-1 ml-auto items-center space-x-2 h-6">
                        <a href={'https://github.com/pipijoe/xryder-web/releases'} target={'_blank'}>
                            v1.1.9
                        </a>
                        <Button variant="ghost">
                            <a href={"https://xryder.cn/guide/why.html"} target={'_blank'}>
                                开发指引
                            </a>
                        </Button>
                        <Separator orientation="vertical"/>
                        <ModeToggle />
                        <a href={'https://github.com/pipijoe/xryder-web'} target={'_blank'}>
                            <FaGithub className='w-6 h-6'/>
                        </a>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default LandingHeader