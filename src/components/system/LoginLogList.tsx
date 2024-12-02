import React from "react";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import {Badge} from "@/components/ui/badge";
import RichEmpty from "@/components/RichEmpty";

const LoginLogList = ({
                      isLoading,
                      loginLogs,
                  }) => {

    return (
        <div className='relative min-h-60'>
            {isLoading && (
                <div className="absolute top-0 left-0 right-0 bottom-0 bg-muted/50 bg-opacity-70 flex justify-center items-center z-50">
                    <div className="w-10 h-10 border-4 border-t-4 border-gray-200 border-t-sky-500 rounded-full animate-spin"></div>
                </div>
            )}
            {(loginLogs.length == 0 && !isLoading) ? <RichEmpty description={'暂无登录日志数据'}/> : (
                <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>用户名</TableHead>
                        <TableHead>昵称</TableHead>
                        <TableHead>
                            登录时间
                        </TableHead>
                        <TableHead>
                            登录结果
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                {
                    loginLogs.map((l, index) => (
                        <TableRow key={index}>
                            <TableCell className="font-semibold">
                                {l.username}
                            </TableCell>
                            <TableCell>
                                {l.nickname}
                            </TableCell>
                            <TableCell>
                                {l.loginDate}
                            </TableCell>
                            <TableCell>
                                {l.success ? <Badge>成功</Badge> :
                                    <Badge variant="destructive">失败</Badge>}
                            </TableCell>
                        </TableRow>
                    ))
                }
                </TableBody>
            </Table>)}
        </div>
    )
}

export default LoginLogList