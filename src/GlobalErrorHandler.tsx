import React, {useEffect} from "react";
import useErrorStore from "./store/errorStore";
import {AlertCircle} from "lucide-react";
import {AnimatePresence, motion} from "framer-motion";

const GlobalErrorHandler = () => {
    const {error, clearError} = useErrorStore();

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                clearError(); // 2秒后清除错误
            }, 2000);

            return () => clearTimeout(timer); // 清理计时器
        }
    }, [error, clearError]);

    // 动画配置
    const variants = {
        hidden: {x: "100%", opacity: 0},
        visible: {x: 0, opacity: 1},
        exit: {x: "100%", opacity: 0},
    };

    return (
        <AnimatePresence>
            {error && (
                <motion.div
                    className="fixed top-16 right-4 p-4 rounded-lg shadow-md z-50 w-96 bg-destructive"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={variants}
                    transition={{duration: 0.3}}
                >
                    <div className={'flex items-center gap-2'}>
                        <AlertCircle className="h-4 w-4 "/>
                        <h2 className={'font-semibold'}>错误！</h2>
                    </div>
                    <div className={'text-secondary-foreground text-sm mt-2'}>
                        {error}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default GlobalErrorHandler;
