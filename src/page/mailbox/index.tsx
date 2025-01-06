/**
 * @license MIT
 * Created by: joetao
 * Created on: 2024/12/2
 * Project: xryder
 * Description: This is a rapid development template for middle and backend UI based on vite, react, tailwindcss and shadcn.
 */
import React, {useEffect, useState} from "react"
import {ScrollArea} from "@/components/ui/scroll-area"
import {Card, CardContent} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {BadgeX, Mail, MailOpen, Trash2} from "lucide-react"
import {format} from "date-fns"
import {Helmet} from "react-helmet-async";
import {Separator} from "@/components/ui/separator";
import {useAccountStore} from "@/store/accountStore";
import {useDialog} from "@/components/use-dialog";
import {Dialog, DialogContent, DialogDescription, DialogHeader} from "@/components/ui/dialog";
import {ReloadIcon} from "@radix-ui/react-icons";
import {toast} from "sonner";
import {SidebarTrigger} from "@/components/ui/sidebar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

const MailBox = () => {
    const {mails, getMails, account, getAccount, readMail, deleteMail, deleting} = useAccountStore()
    const [selectedMail, setSelectedMail] = useState(mails[0])
    const [activeTab, setActiveTab] = useState("all")

    useEffect(() => {
        getMails({})
        getAccount()
    }, [])

    const handleTabChange = (value) => {
        setActiveTab(value)
        if (value === 'unread') {
            getMails({status: 0})
        } else {
            getMails({})
        }
    }

    const handleMailRead = (mail) => {
        if (!mail.hasRead) {
            readMail({id: mail.id})
        }
    }
    const deleteDialog = useDialog(null);

    const handleMailDelete = async () => {
        await deleteMail({id: selectedMail.id}).then(
            (res: any) => {
                if (res.code === 200) {
                    toast.success("已删除！")
                    deleteDialog.dismiss()
                } else {
                    toast.error("删除失败！", {
                        description: res.data
                    })
                }
            }
        )
    }

    return (
        <div>
            <Helmet>
                <title>{account.newMails > 0 ? `收件箱(${account.newMails})` : '收件箱'}</title>
            </Helmet>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                <div className="flex flex-1 items-center gap-2 px-3">
                    <SidebarTrigger className="-ml-1"/>
                    <Separator orientation="vertical" className="mr-2 h-4"/>
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbLink href="/">
                                    首页
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block"/>
                            <BreadcrumbItem className="hidden md:block">
                                收件箱
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>
            <div className={'w-full max-w-6xl flex p-4'}>
                {/* 左侧消息列表 */}
                <Card className="w-1/3 pb-4">
                    <div className={'flex justify-between p-4'}>
                        <h2 className="text-lg font-semibold w-32">收件箱</h2>
                        <Tabs value={activeTab} onValueChange={handleTabChange}>
                            <TabsList>
                                <TabsTrigger value="all">所有邮件</TabsTrigger>
                                <TabsTrigger value="unread">未读邮件</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                    <div className="relative">
                        <ScrollArea className={'h-[calc(100vh-200px)]'}>
                            <div className="grid gap-2 p-4">
                                {mails.length == 0 && <p className="text-center ">没有未读邮件</p>}
                                {mails.map((mail) => (
                                    <Card
                                        key={mail.id}
                                        className={`p-4 cursor-pointer hover:bg-accent ${
                                            selectedMail?.id === mail.id ? "bg-accent" : ""
                                        }`}
                                        onClick={() => {
                                            setSelectedMail(mail)
                                            handleMailRead(mail)
                                        }}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-medium truncate flex-1">{mail.title}</h3>
                                            <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                              {format(mail.createTime, "HH:mm")}
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground line-clamp-2">{mail.content}</p>
                                        <div className="flex justify-between items-center mt-2">
                                            <p className="text-xs text-muted-foreground">
                                                {format(mail.createTime, "yyyy-MM-dd")}
                                            </p>
                                            {mail.hasRead ? (
                                                <MailOpen className="h-4 w-4 text-muted-foreground"/>
                                            ) : (
                                                <Mail className="h-4 w-4 text-blue-500"/>
                                            )}
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                </Card>

                <Card className="ml-2 p-6 w-2/3 h-[calc(100vh-110px)]">
                    <CardContent>
                        {selectedMail ? (
                            <>
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-2xl font-bold">{selectedMail.title}</h2>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        {...deleteDialog.triggerProps}
                                        aria-label="删除通知"
                                        className={'w-6 h-6'}
                                    >
                                        <Trash2 className="h-3.5 w-3.5"/>
                                    </Button>
                                </div>
                                <Separator className="my-4" />
                                <pre className="text-muted-foreground mb-4 whitespace-normal break-words whitespace-pre-wrap">{selectedMail.content}</pre>
                                <p className="text-sm text-muted-foreground">
                                    发送时间：{format(selectedMail.createTime, "yyyy-MM-dd HH:mm:ss")}
                                </p>
                            </>
                        ) : (
                            <p className="text-center text-muted-foreground">请选择一封邮件</p>
                        )}
                    </CardContent>
                </Card>
            </div>
            <Dialog {...deleteDialog.dialogProps} >
                <DialogContent>
                    <DialogHeader>
                        <DialogDescription>
                            <BadgeX className='text-red-500 inline mr-2 mb-1'/>确定删除这封邮件吗？
                        </DialogDescription>
                    </DialogHeader>
                    <p className={'text-muted-foreground'}>标题：
                        <strong>{selectedMail && selectedMail.title}</strong></p>
                    <div className='grid place-items-end'>
                        {
                            deleting ?
                                <Button disabled variant="destructive">
                                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin"/>
                                    正在删除...
                                </Button> :
                                <Button variant="destructive" onClick={handleMailDelete}>确定</Button>
                        }
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default MailBox