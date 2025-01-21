import React from "react";

/**
 * @license MIT
 * Created by: joetao
 * Created on: 2025/1/21
 * Project: xryder
 * Description: This is a rapid development template for middle and backend UI based on vite, react, tailwindcss and shadcn.
 */

function LandingFooter() {
    const currentYear = new Date().getFullYear();

    return (
        <div className={'border-t p-16'}>
            <p className={'text-xl text-center'}><span className={'font-bold'}>X.Ryder</span> | 莱德</p>
            <footer className={'text-center text-muted-foreground text-sm'}>
                <p>email: cutesimba@163.com</p>
                <p>&copy; {currentYear} X.Ryder All rights reserved.</p>
                <a href="https://beian.miit.gov.cn/" target="_blank">苏ICP备2024137819号-1</a>
            </footer>
        </div>
    )
}

export default LandingFooter
