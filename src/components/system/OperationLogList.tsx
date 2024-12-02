import React from "react";

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import RichEmpty from "@/components/RichEmpty";

const OperationLogList = ({
                      isLoading,
                      operationLogs,
                  }) => {

    return (
        <div className='relative min-h-60'>
            {isLoading && (
                <div className="absolute top-0 left-0 right-0 bottom-0 bg-muted/50 bg-opacity-70 flex justify-center items-center z-50">
                    <div className="w-10 h-10 border-4 border-t-4 border-gray-200 border-t-sky-500 rounded-full animate-spin"></div>
                </div>
            )}
            {(operationLogs.length == 0 && !isLoading) ? <RichEmpty description={'暂无操作日志数据'}/> : (
                <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>操作内容</TableHead>
                        <TableHead>
                            操作者
                        </TableHead>
                        <TableHead>
                            操作时间
                        </TableHead>
                        <TableHead>
                            耗时
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                {
                    operationLogs.map((o, index) => (
                        <TableRow key={index}>
                            <TableCell className="font-semibold">
                                {o.content}
                            </TableCell>
                            <TableCell>
                                {o.operator}
                            </TableCell>
                            <TableCell>
                                {o.operationTime}
                            </TableCell>
                            <TableCell>
                                {o.timeTaken}
                            </TableCell>
                        </TableRow>
                    ))
                }
                </TableBody>
            </Table>)}
        </div>
    )
}

export default OperationLogList