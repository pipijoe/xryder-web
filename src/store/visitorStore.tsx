/**
 * @license MIT
 * Created by: joetao
 * Created on: 2024/12/3
 * Project: xryder
 * Description: This is a rapid development template for middle and backend UI based on vite, react, tailwindcss and shadcn.
 */
import {create} from 'zustand'
import api from '../axiosInstance';
import {parseQuery} from '@/utils'

/**
 * 埋点数据
 */
export const useVisitorStore = create((set) => ({
    count: 0,
    monitors: [],
    thinking: false,
    error: null,
    visit: async (params: any) => {
        try {
            await api.post('/v1/visitor/visit', params);
        } catch (error: any) {
            set({error: error.response?.data?.msg});
        }
    },
    uv: async () => {
        const result: any = await api.get('/v1/visitor/uv');
        set({
            count: result.data
        })
    },
    chat: async (question) => {
        set({thinking: true, error: null});
        try {

            const result: any = await api.get('/v1/monitor/chat?' + parseQuery({question}));
            if (result) {
                if (result.data.message.length == 0) {
                    set((state) => ({
                        monitors: [...state.monitors, result.data],
                        thinking: false
                    }))
                } else {
                    set({ thinking: false});
                    return result.data.message
                }
            }

        } catch (error) {
            set({error: error.response?.data?.msg || '服务器异常', thinking: false});
        }
    }
}))