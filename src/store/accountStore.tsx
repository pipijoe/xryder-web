import { create } from 'zustand';
import api from '../axiosInstance';
import {parseQuery} from '@/utils'

export interface AccountState {
    nickname: string
    username: string
    departmentId: number,
    position: string,
    newMails: number,
    email: string
    mobile: string
    avatar: string
    enabled: boolean
    loginData: string
    loginIp: string
    roles: any[]
    permissions: string[]
}


interface MailState {
    id: number
    title: string
    content: string
    hasRead: boolean
    createTime: string
}

interface StoreState {
    account: AccountState;
    mails: MailState[];
    isLoading: boolean;
    uploadPercentage: number;
    uploading: boolean;
    error: string | null;
    getAccount: () => Promise<any>;
    changeAvatar: (e) => Promise<void>;
    getMails: (params: any) => Promise<void>;
    readMail: (params: any) => Promise<void>;
    deleteMail: (params: any) => Promise<void>;
    keepAlive: () => Promise<void>;
}

export const useAccountStore = create<StoreState>((set) => ({
    account: {
        nickname: '',
        username: '',
        departmentId: 0,
        newMails: 0,
        email: '',
        mobile: '',
        avatar: '',
        enabled: '',
        loginData: '',
        loginIp: '',
        roles: [],
        permissions: []
    },
    mails: [],
    changing: false,
    saving: false,
    deleting: false,
    uploadPercentage: 0,
    uploading: false,
    error: null,
    getAccount: async () => {
        set({error: null});
        try {
            const data = await api.get('/v1/account');
            set({
                account: data.data,
            });
            return data.data
        } catch (error: any) {
            set({error: error.response?.data?.msg});
        }
    },
    updateAccount: async (params: any) => {
        set({saving: true, error: null});
        try {
            const data = await api.put('/v1/account', params);
            set({
                account: data.data,
                saving: false
            });
            return data
        } catch (error: any) {
            set({error: error.response?.data?.msg, saving: false});
        }
    },
    changePassword: async (params: any) => {
        set({changing: true, error: null});
        try {
            const data = await api.put('/v1/account/password', params);
            set({
                changing: false
            });
            return data
        } catch (error: any) {
            set({error: error.response?.data?.msg, changing: false});
        }
    },
    changeAvatar: async (e) => {
        set({uploadPercentage: 0, uploading: true, error: null});
        const formData = new FormData();
        const file = e.target.files[0];
        formData.append('file', file);
        try {
            const data = await api.post('/v1/account/avatar', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    set({
                        uploadPercentage: percentCompleted
                    })
                },
            });
            set(state => ({
                uploadPercentage: 100,
                uploading: false,
                account: {...state.account, avatar: data.data.fileData}
            }))
        } catch (error) {
            set({error: error.response?.data?.msg || '上传成功', upLoading: false});
        }
    },
    getMails: async (params) => {
        set({isLoading: true, error: null});
        try {
            const data = await api.get('/v1/mails?'+ parseQuery(params));
            set({
                mails: data.data,
                isLoading: false
            });
        } catch (error: any) {
            set({error: error.response?.data?.msg, isLoading: false});
        }
    },
    readMail: async (params) => {
        set({error: null});
        try {
            const data: any = await api.put('/v1/mails/' + params.id +'/read');
            if (data.code == 200) {
                set((state) => ({
                    mails: state.mails.map(m => m.id === params.id ? {...m, hasRead: true} : m),
                    account: {...state.account, newMails: state.account.newMails -1 }
                }));
            }
        } catch (error: any) {
            set({error: error.response?.data?.msg});
        }
    },
    deleteMail: async (params) => {
        set({error: null, deleting: false});
        try {
            const data: any = await api.delete('/v1/mails/' + params.id);
            if (data.code == 200) {
                set((state) => ({
                    mails: state.mails.filter(m => m.id !== params.id),
                    deleting: false
                }));
            }
            return data
        } catch (error: any) {
            set({error: error.response?.data?.msg, deleting: false});
        }
    },
    keepAlive: async () => {
        set({error: null});
        try {
            const refreshTokenRes = await api.get('/v1/token?refreshToken=' + localStorage.getItem('refreshToken'))
            if (refreshTokenRes.data.code == 200) {
                localStorage.setItem('token', refreshTokenRes.data.data)
            }
        } catch (error: any) {
            set({error: error.response?.data?.msg});
        }
    },
}));
