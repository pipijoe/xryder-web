/**
 * @license MIT
 * Created by: joetao
 * Created on: 2024/12/3
 * Project: xryder
 * Description: This is a rapid development template for middle and backend UI based on vite, react, tailwindcss and shadcn.
 */
import { create } from 'zustand'
import api from '../axiosInstance';

/**
 * 埋点数据
 */
export const useVisitorStore = create((set) => ({
    count: 0,
    visit: async (params: any) => {
        try {
            await api.post('/v1/visitor/visit', params);
        } catch (error: any) {
            set({error: error.response?.data?.msg});
        }
    },
    uv: async () => {
        const data: any = await api.get('/v1/visitor/uv');
        set({
            count: data.data
        })
    }
}))