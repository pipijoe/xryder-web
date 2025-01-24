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
                <meta name="description" content="X.Ryder（莱德）是一个基于Java和React的轻量、灵活、具备AI功能的WEB开发模板。" />
                <meta name="keywords" content="WEB框架, React, Java, Spring AI, 大模型, AI, 智能助手" />
            </Helmet>
            <LandingHeader />
            <LandingContent />
            <LandingFooter />

        </div>
    )
}

export default LandingPage
