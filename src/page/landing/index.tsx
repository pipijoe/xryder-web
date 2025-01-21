/**
 * @license MIT
 * Created by: joetao
 * Created on: 2025/1/21
 * Project: xryder
 * Description: This is a rapid development template for middle and backend UI based on vite, react, tailwindcss and shadcn.
 */
import LandingHeader from "@/page/landing/components/LandingHeader";
import React from "react";
import {Helmet} from "react-helmet-async";
import LandingContent from "@/page/landing/components/LandingContent";
import LandingFooter from "@/page/landing/components/LandingFooter";

const LandingPage = () => {
    return (
        <div>
            <Helmet>
                <title>X.Ryder | AI时代的WEB开发模板</title>
            </Helmet>
            <LandingHeader />
            <LandingContent />
            <LandingFooter />

        </div>
    )
}

export default LandingPage
