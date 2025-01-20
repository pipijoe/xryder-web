/**
 * Created by: joetao
 * Created on: 2025/1/10
 * Project: my-app
 * Description: This is a rapid development template for middle and backend UI based on vite, react, tailwindcss and shadcn.
 */
"use client"

import {Area, AreaChart, CartesianGrid, XAxis} from "recharts"

import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,} from "@/components/ui/card"
import {ChartContainer, ChartTooltip, ChartTooltipContent,} from "@/components/ui/chart"
import React from "react";

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "hsl(var(--chart-1))",
    },
}

const ChatLineChart = ({data}) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{data.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <AreaChart
                        accessibilityLayer
                        data={data.data}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey={data.fields[data.fields.length - 2]}
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(timestamp) => {
                                const date = new Date(timestamp); // 将时间戳转换为 Date 对象
                                return date.toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                }); // 格式化日期
                            }}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="line" />}
                        />
                        <Area
                            dataKey={data.fields[data.fields.length - 1]}
                            type="natural"
                            fill="var(--color-desktop)"
                            fillOpacity={0.4}
                            stroke="var(--color-desktop)"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="p-4">
                {data.summary}
            </CardFooter>
        </Card>
    )
}

export default ChatLineChart
