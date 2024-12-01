import { create } from 'zustand'
import api from '../axiosInstance'; // 引入 Axios 实例
import {parseQuery} from '@/utils'

export const useAuthStore = create((set) => ({
    name: '',
    permissions: [],
    token: '',
    refreshToken: '',
    publicKey: '',
    isLoading: false,
    error: null,
    login: async (username: string, password: string) => {
        set({isLoading: true, error: null});
        try {
            const data: any = await api.post('/login?' + parseQuery({username, password}));
            if (data.code == 200) {
                set({
                    name: data.data.nickname,
                    permissions: data.data.permissions,
                    token: data.data.token,
                    refreshToken: data.data.refreshToken,
                    isLoading: false
                });
            } else {
                set({
                    isLoading: false
                })
            }
            return data
        } catch (error: any) {
            set({error: error.response?.data?.msg || 'Login failed', isLoading: false});
        }
    },
    getPublicKey: async () => {
        const data: any = await api.get('/v1/publicKey');
        set({
            publicKey: data.data
        })
    },
    logout: () => {
        set({token: null, refreshToken: '', user: null})
        localStorage.removeItem("token")
        localStorage.removeItem("refreshToken")
        window.location.href = '/login'
    },
}));
