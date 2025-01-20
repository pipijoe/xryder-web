/**
 * Created by: joetao
 * Created on: 2025/1/13
 * Project: my-app
 * Description: This is a rapid development template for middle and backend UI based on vite, react, tailwindcss and shadcn.
 */

"use client"

import {Bar, BarChart, CartesianGrid, Rectangle, XAxis} from "recharts"

import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,} from "@/components/ui/card"
import {ChartContainer, ChartTooltip, ChartTooltipContent,} from "@/components/ui/chart"
import React from "react";

const chartConfig = {
    value: {
        label: "统计值",
        color: "hsl(var(--chart-2))",
    },
}

const ChatBarChart = ({data}) => {

    return (
        <Card>
            <CardHeader>
                <CardTitle>{data.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={data.data}>
                        <CartesianGrid vertical={false}/>
                        <XAxis
                            dataKey={data.fields[data.fields.length - 2]}
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideIndicator/>}
                        />
                        <Bar
                            dataKey="value"
                            fill="var(--color-value)"
                            radius={5}
                            activeBar={<Rectangle fillOpacity={0.8}/>}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="p-4">
                {data.summary}
            </CardFooter>
        </Card>
    )
}

export default ChatBarChart
