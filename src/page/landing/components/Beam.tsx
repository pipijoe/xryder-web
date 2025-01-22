/**
 * @license MIT
 * Created by: joetao
 * Created on: 2025/1/22
 * Project: xryder
 * Description: This is a rapid development template for middle and backend UI based on vite, react, tailwindcss and shadcn.
 */
"use client";

import React, { forwardRef, useRef } from "react";

import { cn } from "@/lib/utils";
import { AnimatedBeam } from "@/components/magicui/animated-beam";
import {BiLogoSpringBoot} from "react-icons/bi";
import { FaReact } from "react-icons/fa6";
import { BiLogoTailwindCss } from "react-icons/bi";
import { viteImg } from '@/utils'

const Circle = forwardRef<
    HTMLDivElement,
    { className?: string; children?: React.ReactNode }
    >(({ className, children }, ref) => {
    return (
        <div
            ref={ref}
            className={cn(
                "z-10 flex size-12 items-center justify-center rounded-full border-2 border-border bg-white p-2 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]",
                className,
            )}
        >
            {children}
        </div>
    );
});

Circle.displayName = "Circle";

export function AnimatedBeamMultipleOutput({
                                                   className,
                                               }: {
    className?: string;
}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const div1Ref = useRef<HTMLDivElement>(null);
    const div2Ref = useRef<HTMLDivElement>(null);
    const div3Ref = useRef<HTMLDivElement>(null);
    const div4Ref = useRef<HTMLDivElement>(null);
    const div5Ref = useRef<HTMLDivElement>(null);
    const div6Ref = useRef<HTMLDivElement>(null);
    const div7Ref = useRef<HTMLDivElement>(null);

    return (
        <div
            className={cn(
                "relative flex w-full items-center justify-center overflow-hidden rounded-lg bg-background p-10",
                className,
            )}
            ref={containerRef}
        >
            <div className="flex size-full flex-row items-stretch justify-between gap-10 max-w-xl">
                <div className="flex flex-col justify-center gap-2">
                    <Circle ref={div1Ref}>
                        <Icons.googleDrive />
                    </Circle>
                    <Circle ref={div2Ref}>
                        <Icons.googleDocs />
                    </Circle>
                    <Circle ref={div3Ref}>
                        <Icons.whatsapp />
                    </Circle>
                    <Circle ref={div4Ref}>
                        <Icons.messenger />
                    </Circle>
                    <Circle ref={div5Ref}>
                        <Icons.notion />
                    </Circle>
                </div>
                <div className="flex flex-col justify-center">
                    <Circle ref={div6Ref} className="size-16">
                        <Icons.openai />
                    </Circle>
                </div>
                <div className="flex flex-col justify-center">
                    <Circle ref={div7Ref}>
                        <Icons.user />
                    </Circle>
                </div>
            </div>

            <AnimatedBeam
                containerRef={containerRef}
                fromRef={div1Ref}
                toRef={div6Ref}
            />
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={div2Ref}
                toRef={div6Ref}
            />
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={div3Ref}
                toRef={div6Ref}
            />
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={div4Ref}
                toRef={div6Ref}
            />
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={div5Ref}
                toRef={div6Ref}
            />
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={div6Ref}
                toRef={div7Ref}
            />
        </div>
    );
}

const Icons = {
    notion: () => (
        <div
            className="flex aspect-square size-7 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            AI
        </div>
    ),
    openai: () => (
        <div
            className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            X.R
        </div>
    ),
    googleDrive: () => (
        <div>
            <BiLogoSpringBoot  className={'w-8 h-8 text-lime-600'}/>
        </div>

    ),
    whatsapp: () => (
        <div>
            <FaReact className={'w-8 h-8 text-sky-600'}/>
        </div>
    ),
    googleDocs: () => (
        <div>
            <BiLogoTailwindCss className={'w-8 h-8 text-sky-500'}/>
        </div>
    ),
    messenger: () => (
        <div>
            <img src={viteImg}  alt={'vite'} width={36}/>
        </div>
    ),
    user: () => (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#000000"
            strokeWidth="2"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    ),
};
