/**
 * Created by: joetao
 * Created on: 2025/1/16
 * Project: xryder
 * Description: This is a rapid development template for middle and backend UI based on vite, react, tailwindcss and shadcn.
 */
import lottie from 'lottie-web';
import React, { useEffect, useRef } from 'react';
import animationData from '../assets/lottie/ai.json'
import { motion } from 'framer-motion';

interface AiAgentAvatarProps {
    onClick?: () => void;
    status: 'working' | 'ready';
}

const AiAgentAvatar: React.FC<AiAgentAvatarProps> = ({ onClick, status }) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const animationRef = useRef<lottie.AnimationItem | null>(null);

    useEffect(() => {
        // 初始化动画
        animationRef.current = lottie.loadAnimation({
            container: containerRef.current!,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            animationData: animationData, // 动画文件
        });

        return () => {
            // 清理动画实例
            animationRef.current?.destroy();
        };
    }, []);

    useEffect(() => {
        if (animationRef.current) {
            // 根据 status 动态调整播放速度
            if (status === 'working') {
                animationRef.current.setSpeed(2.5); // 2倍速
            } else if (status === 'ready') {
                animationRef.current.setSpeed(0.5); // 0.5倍速
            }
        }
    }, [status]); // 监听 status 变化

    return (
        <motion.div
            ref={containerRef}
            className="w-16 h-16 cursor-pointer"
            onClick={onClick}
            animate={{
                scale: [1, 1.08, 1], // 呼吸动画的缩放
            }}
            transition={{
                duration: 3.8, // 动画时长
                repeat: Infinity, // 无限循环
                ease: "easeInOut", // 平滑的缓动效果
            }}
        />
    );
};

export default AiAgentAvatar;