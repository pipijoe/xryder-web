/**
 * @license MIT
 * Created by: joetao
 * Created on: 2024/12/3
 * Project: xryder
 * Description: This is a rapid development template for middle and backend UI based on vite, react, tailwindcss and shadcn.
 */
import {ChartContainer} from "@/components/ui/chart";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Bar, BarChart, Rectangle, XAxis} from "recharts";

const VisitorChart = ({count}: {count: number}) => {
    return (
        <div>
            <Card
                className="max-w-xs" x-chunk="charts-01-chunk-3"
            >
                <CardHeader className="p-4 pb-0">
                    <CardTitle>今日访客数</CardTitle>
                    <CardDescription>
                        独立访客数量，指在一天内访问网站的去重用户数（UV）
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-row items-baseline gap-4 p-4 pt-0">
                    <div className="flex items-baseline gap-1 text-3xl font-bold tabular-nums leading-none">
                        {count}
                        <span className="text-sm font-normal text-muted-foreground">
                    人
                  </span>
                    </div>
                    <ChartContainer
                        config={{
                            steps: {
                                label: "Steps",
                                color: "hsl(var(--chart-1))",
                            },
                        }}
                        className="ml-auto w-[72px]"
                    >
                        <BarChart
                            accessibilityLayer
                            margin={{
                                left: 0,
                                right: 0,
                                top: 0,
                                bottom: 0,
                            }}
                            data={[
                                {
                                    date: "2024-01-01",
                                    steps: 2000,
                                },
                                {
                                    date: "2024-01-02",
                                    steps: 2100,
                                },
                                {
                                    date: "2024-01-03",
                                    steps: 2200,
                                },
                                {
                                    date: "2024-01-04",
                                    steps: 1300,
                                },
                                {
                                    date: "2024-01-05",
                                    steps: 1400,
                                },
                                {
                                    date: "2024-01-06",
                                    steps: 2500,
                                },
                                {
                                    date: "2024-01-07",
                                    steps: 1600,
                                },
                            ]}
                        >
                            <Bar
                                dataKey="steps"
                                fill="var(--color-steps)"
                                radius={2}
                                fillOpacity={0.2}
                                activeIndex={6}
                                activeBar={<Rectangle fillOpacity={0.8} />}
                            />
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={4}
                                hide
                            />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    )
}
export default VisitorChart