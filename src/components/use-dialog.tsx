import React, {useState} from "react";

export function useDialog(form: any) {
    const [isOpen, setIsOpen] = useState(false);
    const triggerRef = React.useRef();

    function trigger() {
        setIsOpen(true);
    }

    function dismiss() {
        setIsOpen(false);
        triggerRef.current?.focus();
        form && form.reset()
    }

    return {
        triggerProps: {
            ref: triggerRef,
            onClick: trigger,
        },
        dialogProps: {
            open: isOpen,
            onOpenChange: open => {
                if (open) trigger();
                else dismiss();
            },
        },
        trigger,
        dismiss,
    };
}