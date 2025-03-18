import axios, {AxiosError, AxiosRequestHeaders, AxiosResponse, InternalAxiosRequestConfig} from 'axios';
import useErrorStore from "./store/errorStore";
import qs from 'qs'

const ignoreMsgs = [
    '无效的刷新令牌',
    '刷新令牌已过期'
]

let requestList: any[] = []
// 是否正在刷新中
let isRefreshToken = false
// 请求白名单，无须token的接口
const whiteList: string[] = ['/api/v1/token', '/login', '/v1/publicKey']
// 所有通过api发送的请求，都会加上/api的前缀
const api = axios.create({
    baseURL: '/api',
});

// request拦截器
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // 是否需要设置 token
        let isToken = true
        whiteList.some((v) => {
            if (config.url && config.url.startsWith(v)) {
                return isToken = false
            }
        })
        if (localStorage.getItem('token') && isToken) {
            config.headers.Authorization = 'Bearer ' + localStorage.getItem('token') // 让每个请求携带自定义token
        }

        const params = config.params || {}
        const data = config.data || false
        if (
            config.method?.toUpperCase() === 'POST' &&
            (config.headers as AxiosRequestHeaders)['Content-Type'] ===
            'application/x-www-form-urlencoded'
        ) {
            config.data = qs.stringify(data)
        }
        // get参数编码
        if (config.method?.toUpperCase() === 'GET' && params) {
            config.params = {}
            const paramsStr = qs.stringify(params, { allowDots: true })
            if (paramsStr) {
                config.url = config.url + '?' + paramsStr
            }
        }
        return config
    },
    (error: AxiosError) => {
        console.log(error) // for debug
        Promise.reject(error)
    }
)

// response 拦截器
api.interceptors.response.use(
    async (response: AxiosResponse<any>) => {
        let { data, status } = response
        if (status == 500) {
            await handleError()
            return Promise.reject('服务器异常！')
        }
        const config = response.config
        if (!data) {
            throw new Error()
        }
        if (
            response.request.responseType === 'blob' ||
            response.request.responseType === 'arraybuffer'
        ) {
            if (response.data.type !== 'application/json') {
                return response
            }
            data = await new Response(response.data).json()
        }
        const code = data.code
        // 获取状态码描述信息
        const msg = data.msg
        if (ignoreMsgs.indexOf(msg) !== -1) {
            // 如果是忽略的错误码，直接返回 msg 异常
            return Promise.reject(msg)
        }
        else if (code === 405) {
            // 如果未认证，并且未进行刷新令牌，说明可能是访问令牌过期了
            if (!isRefreshToken) {
                isRefreshToken = true
                // 1. 如果获取不到刷新令牌，则只能执行登出操作
                if (!localStorage.getItem("refreshToken")) {
                    return handleAuthorized()
                }
                // 2. 进行刷新访问令牌
                try {
                    const refreshTokenRes = await refreshToken()
                    if (refreshTokenRes.data.code == 200) {
                        // 2.1 刷新成功，则回放队列的请求 + 当前请求
                        localStorage.setItem('token', (await refreshTokenRes).data.data)
                        config.headers!.Authorization = 'Bearer ' + localStorage.getItem('token')
                        requestList.forEach((cb: any) => {
                            cb()
                        })
                        requestList = []
                        return api(config)
                    } else {
                        return handleAuthorized()
                    }

                } catch (e) {
                    // 为什么需要 catch 异常呢？刷新失败时，请求因为 Promise.reject 触发异常。
                    // 2.2 刷新失败，只回放队列的请求
                    requestList.forEach((cb: any) => {
                        cb()
                    })
                    // 提示是否要登出。即不回放当前请求！不然会形成递归
                    return handleAuthorized()
                } finally {
                    requestList = []
                    isRefreshToken = false
                }
            } else {
                // 添加到队列，等待刷新获取到新的令牌
                return new Promise((resolve) => {
                    requestList.push(() => {
                        config.headers!.Authorization = 'Bearer ' + localStorage.getItem("token")
                        resolve(api(config))
                    })
                })
            }
        } else if (code === 500) {
            return handleError()
        } else if (code === 403) {
            return handleForbidden()
        } else if (code === 406) {
            return handleAuthorized()
        } else if (code === 401) {
            if (!window.location.href.includes('login')) {
                window.location.href = '/login'
            }
            localStorage.removeItem('token')
            localStorage.removeItem('refreshToken')
            return data
        } else {
            return data
        }
    },
    (error: AxiosError) => {
        // HTTP 错误处理
        const setError = useErrorStore.getState().setError;
        setError(error.response?.data?.message || "网络错误");
        return Promise.reject(error);
    }
)

const refreshToken = async () => {
    return await axios.get('/api/v1/token?refreshToken=' + localStorage.getItem('refreshToken'))
}

const handleAuthorized = () => {
    // 如果已经到重新登录页面则不进行弹窗提示
    if (window.location.href.includes('login')) {
        return
    }
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    window.location.href = '/login'
    return Promise.reject('认证失败')
}

const handleForbidden = () => {
    const setError = useErrorStore.getState().setError;
    setError("未授权访问");
    return Promise.reject(new Error("未授权访问"));
}

const handleError = () => {
    const setError = useErrorStore.getState().setError;
    setError("服务器异常");
    return Promise.reject(new Error("服务器异常"));
}

export default api;
