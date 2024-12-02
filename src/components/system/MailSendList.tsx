import React from "react";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import RichEmpty from "@/components/RichEmpty";
import {Clock} from "lucide-react";

const MailSendList = ({
                      isLoading,
                      notifications,
                  }) => {

    return (
        <div className='relative min-h-60'>
            {isLoading && (
                <div className="absolute top-0 left-0 right-0 bottom-0 bg-muted/50 bg-opacity-70 flex justify-center items-center z-50">
                    <div className="w-10 h-10 border-4 border-t-4 border-gray-200 border-t-sky-500 rounded-full animate-spin"></div>
                </div>
            )}
            {(notifications.length == 0 && !isLoading) ? <RichEmpty description={'还没有已发送的通知'}/> : (
                notifications.map(n => (
                    <Accordion type="single" collapsible>
                        <AccordionItem value={n.id}>
                            <AccordionTrigger>{n.title}</AccordionTrigger>
                            <AccordionContent>
                                <pre>
                                    {n.content}
                                </pre>
                                <div className={'flex justify-end mt-1 items-center'}>
                                    <Clock className={'w-4 h-4 mr-2'}/><span>{n.createTime}</span>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                ))
            )}
        </div>
    )
}

export default MailSendList