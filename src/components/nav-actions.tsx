"use client"

import * as React from "react"
import {ModeToggle} from "@/components/mode-toggle";

export function NavActions() {
    return (
        <div className="flex items-center gap-2 text-sm">
            <ModeToggle />
        </div>
    )
}
