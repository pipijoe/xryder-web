import React, {useEffect, useRef} from "react";

const GoogleAd = () => {
    const adRef = useRef(null);
    const isPushed = useRef(false); // ✅ 确保 push 只执行一次

    useEffect(() => {
        if (!adRef.current || isPushed.current) return; // ✅ 防止重复 push

        try {
            if (window.adsbygoogle) {
                window.adsbygoogle.push({});
                isPushed.current = true; // ✅ 记录已 push，防止重复执行
            }
        } catch (e) {
            console.error("Google AdSense 加载失败", e);
        }
    }, []);

    return (
        <ins ref={adRef}
             className="adsbygoogle"
             style={{ display: "block", minHeight: "200px" }} // ✅ 设定最小高度，避免 Google 不渲染广告
             data-ad-client="ca-pub-7922172287806480"
             data-ad-slot="9810880179"
             data-ad-format="auto"
             data-full-width-responsive="true"
        />
    );
};

export default GoogleAd;
