import { create } from 'zustand';
import api from '../axiosInstance';
import {parseQuery} from '@/utils'

interface LoginLogState {
    id: number,
    username: string
    nickname: string
    loginDate: string
    success: boolean
}

interface OperationLogState {
    id: number
    content: string
    methodName: string
    requestParams: string
    operator: string
    operationTime: string
    timeTaken: number
}

export interface PositionState {
    id: number,
    name: string,
    description: string,
    deptId: number,
    deptName: string
}

export interface NotificationState {
    id: number
    title: string
    content: string
    createTime: string
}

interface SystemState {
    userInfo: any;
    users: any[];
    roles: any[];
    allRoles: any[];
    permissions: any[],
    notifications: NotificationState[],
    department: {},
    loginLogs: LoginLogState[]
    operationLogs: OperationLogState[]
    positions: PositionState[]
    total: number,
    isLoading: boolean,
    positionLoading: boolean,
    saving: boolean,
    deleting: boolean,
    updating: boolean,
    addUser: (params: any) => Promise<any>;
    setupUser: (params: any) => Promise<any>;
    queryUsers: (params: any) => Promise<any>;
    queryUserById: (id: string) => Promise<any>;
    deleteUserById: (id: string) => Promise<any>;
    addRole: (params: any) => Promise<any>;
    queryRoles: (params: any) => Promise<any>;
    updateRole: (params: any) => Promise<any>;
    queryAllRoles: () => Promise<any>;
    distributeRole: (params: any) => Promise<any>;
    queryPermissions: () => Promise<any>;
    deleteRoleById: (id: number) => Promise<any>;
    queryDepartment: (params: any) => Promise<any>;
    deleteDepartment: (id: string) => Promise<any>;
    updateDepartment: (params: any) => Promise<any>;
    toggleEnabled: (params: any) => Promise<any>;
    resetPwd: (params: any) => Promise<any>;
    queryLoginLogs: (params: any) => Promise<any>;
    queryOperationLogs: (params: any) => Promise<any>;
    queryPositions: (params: any) => Promise<any>;
    addPosition: (params: any) => Promise<any>;
    queryNotifications: (params: any) => Promise<any>;
    sendNotification: (params: any) => Promise<any>;
}

export const useSystemStore = create<SystemState>((set, get) => ({
    userInfo: {},
    users: [],
    roles: [],
    allRoles: [],
    permissions: [],
    notifications: [],
    department: {
        id: '0', name: '', children: []
    },
    loginLogs: [],
    operationLogs: [],
    positions: [],
    total: 0,
    page: 1,
    rows: 0,
    userInfoQuerying: false,
    isLoading: false,
    saving: false,
    deleting: false,
    updating: false,
    error: null,
    addUser: async (params: any) => {
        set({saving: true, error: null});
        try {
            const data = await api.post('/v1/users', params);
            set({
                saving: false
            });
            return data
        } catch (error: any) {
            set({error: error.response?.data?.msg, saving: false});
        }
    },
    setupUser: async (params: any) => {
        set({saving: true, error: null});
        try {
            const data = await api.put('/v1/users/setting', params);
            set({
                saving: false
            });
            return data
        } catch (error: any) {
            set({error: error.response?.data?.msg, saving: false});
        }
    },
    queryUsers: async (params: any) => {
        set({isLoading: true, error: null});
        try {
            const data = await api.get('/v1/users?'+ parseQuery(params));
            set({
                users: data.data.data,
                total: data.data.total,
                page: data.data.page,
                rows: data.data.rows,
                isLoading: false
            });
        } catch (error: any) {
            set({error: error.response?.data?.msg, isLoading: false});
        }
    },
    queryUserById: async (id: any) => {
        set({userInfoQuerying: true, error: null});
        try {
            const data = await api.get('/v1/users/'+ id);
            set({
                userInfo: data.data,
                userInfoQuerying: false
            });
        } catch (error: any) {
            set({error: error.response?.data?.msg, userInfoQuerying: false});
        }
    },
    deleteUserById: async (id: any) => {
        set({deleting: true, error: null});
        try {
            const data = await api.delete('/v1/users/'+ id);
            set({
                deleting: false
            });
            return data
        } catch (error: any) {
            set({error: error.response?.data?.msg, deleting: false});
        }
    },
    addRole: async (params: any) => {
        set({saving: true, error: null});
        try {
            const data = await api.post('/v1/roles', params);
            set({
                saving: false
            });
            return data
        } catch (error: any) {
            set({error: error.response?.data?.msg, saving: false});
        }
    },
    updateRole: async (params: any) => {
        set({updating: true, error: null});
        try {
            const data = await api.put('/v1/roles', params);
            set({
                updating: false
            });
            return data
        } catch (error: any) {
            set({error: error.response?.data?.msg, updating: false});
        }
    },
    queryRoles: async (params: any) => {
        set({isLoading: true, error: null});
        try {
            const data = await api.get('/v1/roles/pageable?'+ parseQuery(params));
            set({
                roles: data.data.data,
                total: data.data.total,
                page: data.data.page,
                rows: data.data.rows,
                isLoading: false
            });

        } catch (error: any) {
            set({error: error.response?.data?.msg, isLoading: false});
        }
    },
    queryAllRoles: async () => {
        try {
            const data = await api.get('/v1/roles');
            set({
                allRoles: data.data
            });

        } catch (error: any) {
            set({error: error.response?.data?.msg});
        }
    },
    distributeRole: async (params: any) => {
        set({saving: true, error: null});
        try {
            const data = await api.post('/v1/users/roles', {...params, username: get().userInfo.username});
            set({
                saving: false
            });
            return data
        } catch (error: any) {
            set({error: error.response?.data?.msg, saving: false});
        }
    },
    sendNotification: async (params: any) => {
        set({saving: true, error: null});
        try {
            const data = await api.post('/v1/notifications', params);
            set({
                saving: false
            });
            return data
        } catch (error: any) {
            set({error: error.response?.data?.msg, saving: false});
        }
    },
    queryNotifications: async (params: any) => {
        set({isLoading: true, error: null});
        try {
            const data = await api.get('/v1/notifications?' + parseQuery(params));
            set({
                notifications: data.data.data,
                total: data.data.total,
                page: data.data.page,
                rows: data.data.rows,
                isLoading: false
            });
            return data
        } catch (error: any) {
            set({error: error.response?.data?.msg, isLoading: false});
        }
    },
    queryPermissions: async () => {
        set({error: null});
        try {
            const data = await api.get('/v1/roles/permissions');
            set({
                permissions: data.data,
            });
        } catch (error: any) {
            set({error: error.response?.data?.msg, isLoading: false});
        }
    },
    deleteRoleById: async (id: number) => {
        set({deleting: true, error: null});
        try {
            const data = await api.delete('/v1/roles/'+ id);
            set({
                deleting: false
            });
            return data
        } catch (error: any) {
            set({error: error.response?.data?.msg, deleting: false});
        }
    },
    queryDepartment: async (params: any) => {
        set({isLoading: true, error: null});
        try {
            const data = await api.get('/v1/departments?' + parseQuery(params));
            set({
                department: data.data,
                isLoading: false,
            });
        } catch (error: any) {
            set({error: error.response?.data?.msg, isLoading: false});
        }
    },
    addDepartment: async (params: any) => {
        set({saving: true, error: null});
        try {
            const data = await api.post('/v1/departments', params);
            set({
                saving: false
            });
            return data
        } catch (error: any) {
            set({error: error.response?.data?.msg, saving: false});
        }
    },
    deleteDepartment: async (id: string) => {
        set({deleting: true, error: null});
        try {
            const data = await api.delete('/v1/departments/' + id)
            set({
                deleting: false
            });
            return data
        } catch (error: any) {
            set({error: error.response?.data?.msg, deleting: false});
        }
    },
    updateDepartment: async (params: any) => {
        set({updating: true, error: null});
        try {
            const data = await api.put('/v1/departments/' + params.id, params.body)
            set({
                updating: false
            });
            return data
        } catch (error: any) {
            set({error: error.response?.data?.msg, updating: false});
        }
    },
    // 启用/禁用用户
    toggleEnabled: async (username: string) => {
        set({updating: true, error: null});
        try {
            const data: any = await api.put('/v1/users/' + username + '/status')
            if (data.code == 200) {
                set((state) => ({
                    users: state.users.map((user) =>
                        user.username === username
                            ? { ...user, enabled: !user.enabled }
                            : user
                    ),
                    updating: false
                }));
            } else {
                set({
                    updating: false
                });
            }
            return data
        } catch (error: any) {
            set({error: error.response?.data?.msg, updating: false});
        }
    },
    resetPwd: async (username: string) => {
        set({updating: true, error: null});
        try {
            const data: any = await api.put('/v1/users/' + username + '/pwd/reset')
            set({
                updating: false
            });
            return data
        } catch (error: any) {
            set({error: error.response?.data?.msg, updating: false});
        }
    },
    queryLoginLogs: async (params: any) => {
        set({isLoading: true, error: null});
        try {
            const data = await api.get('/v1/logs/login?'+ parseQuery(params));
            set({
                loginLogs: data.data.data,
                total: data.data.total,
                page: data.data.page,
                rows: data.data.rows,
                isLoading: false
            });
        } catch (error: any) {
            set({error: error.response?.data?.msg, isLoading: false});
        }
    },
    queryOperationLogs: async (params: any) => {
        set({isLoading: true, error: null});
        try {
            const data = await api.get('/v1/logs/operation?'+ parseQuery(params));
            set({
                operationLogs: data.data.data,
                total: data.data.total,
                page: data.data.page,
                rows: data.data.rows,
                isLoading: false
            });
        } catch (error: any) {
            set({error: error.response?.data?.msg, isLoading: false});
        }
    },
    queryPositions: async (params: any) => {
        set({positionLoading: true, error: null});
        try {
            const data = await api.get('/v1/positions?'+ parseQuery(params));
            set({
                positions: data.data.data,
                total: data.data.total,
                page: data.data.page,
                rows: data.data.rows,
                positionLoading: false
            });
        } catch (error: any) {
            set({error: error.response?.data?.msg, positionLoading: false});
        }
    },
    addPosition: async (params: any) => {
        set({saving: true, error: null});
        try {
            const data = await api.post('/v1/positions', params);
            set({
                saving: false
            });
            return data
        } catch (error: any) {
            set({error: error.response?.data?.msg, saving: false});
        }
    },
    updatingPosition: async (params: any) => {
        set({saving: true, error: null});
        try {
            const data = await api.put('/v1/positions', params);
            set({
                saving: false
            });
            return data
        } catch (error: any) {
            set({error: error.response?.data?.msg, saving: false});
        }
    },
    deletePosition: async (id: number) => {
        set({deleting: true, error: null});
        try {
            const data = await api.delete('/v1/positions/' + id);
            set({
                deleting: false
            });
            return data
        } catch (error: any) {
            set({error: error.response?.data?.msg, deleting: false});
        }
    },

}))

export default useSystemStore