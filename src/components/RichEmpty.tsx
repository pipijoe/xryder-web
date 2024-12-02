import { emptyImg } from '@/utils'
import React from "react";
export default function RichEmpty({title, description}) {
    return (
        <div className="flex flex-col items-center justify-center h-64 bg-background text-foreground">
            <img src={emptyImg} alt={"empty"} className="w-20" />
            <div className="space-y-4 text-center">
                <h1 className="text-xl font-bold">{title}</h1>
                <p className="text-muted-foreground">
                    {description}
                </p>
            </div>
        </div>
    )
}