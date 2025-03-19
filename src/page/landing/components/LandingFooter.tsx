import React from "react";
import { zhipuImg } from '@/utils/'
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

            <footer>
                <div className={'grid grid-cols-2'}>
                    <div className={'text-center text-muted-foreground text-sm'}>
                        <p className={'text-xl text-foreground'}><span className={'font-bold'}>X.Ryder</span> | 莱德</p>
                        <p>email: cutesimba@163.com</p>
                        <p>&copy; {currentYear} X.Ryder All rights reserved.</p>
                        <a href="https://beian.miit.gov.cn/" target="_blank">苏ICP备2024137819号-1</a>
                    </div>
                    <div className={'text-center'}>
                        <a href={'https://www.zhipuai.cn/'}><img src={zhipuImg} alt={`智普AI Logo`} width={86} height={32} className="inline mr-2 " /></a>
                    </div>
                </div>

            </footer>
        </div>
    )
}

export default LandingFooter
