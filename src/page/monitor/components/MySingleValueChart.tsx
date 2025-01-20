import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import React from "react";

/**
 * Created by: joetao
 * Created on: 2025/1/13
 * Project: my-app
 * Description: This is a rapid development template for middle and backend UI based on vite, react, tailwindcss and shadcn.
 */
const MySingleValueChart = ({data}) => {
    const field = data.fields[data.fields.length - 2]
    const valueField = data.fields[data.fields.length - 1]
    return (
        <Card>
            <CardHeader>
                <CardTitle>{data.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid items-center gap-2">
                    <div className="grid flex-1 auto-rows-min gap-0.5">
                        <div
                            className="flex items-baseline gap-1 text-4xl font-bold tabular-nums leading-none"
                        >
                            {data.data[0][valueField]}
                        </div>
                        <div className="text-sm text-muted-foreground">{data.data[0][field]}</div>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="p-4">
                {data.summary}
            </CardFooter>
        </Card>
    )
}
export default MySingleValueChart