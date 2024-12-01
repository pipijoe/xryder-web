import axios, {AxiosError, AxiosRequestHeaders, AxiosResponse, InternalAxiosRequestConfig} from 'axios';
import qs from 'qs'
const ignoreMsgs = [
    '无效的刷新令牌', // 刷新令牌被删除时，不用提示
    '刷新令牌已过期' // 使用刷新令牌，刷新获取新的访问令牌时，结果因为过期失败，此时需要忽略。否则，会导致继续 401，无法跳转到登出界面
]

let requestList: any[] = []
// 是否正在刷新中
let isRefreshToken = false
// 请求白名单，无须token的接口
const whiteList: string[] = ['/api/v1/token']
const api = axios.create({
    baseURL: '/api', // 使用配置文件中的 API 地址
});

// request拦截器
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // 是否需要设置 token
        let isToken = true
        whiteList.some((v) => {
            if (config.url && config.url?.includes(v)) {
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
        // Do something with request error
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
            // 返回“[HTTP]请求没有返回值”;
            throw new Error()
        }
        // 未设置状态码则默认成功状态
        // 二进制数据则直接返回，例如说 Excel 导出
        if (
            response.request.responseType === 'blob' ||
            response.request.responseType === 'arraybuffer'
        ) {
            // 注意：如果导出的响应为 json，说明可能失败了，不直接返回进行下载
            if (response.data.type !== 'application/json') {
                return response.data
            }
            data = await new Response(response.data).json()
        }
        const code = data.code
        // 获取错误信息
        const msg = data.msg
        if (ignoreMsgs.indexOf(msg) !== -1) {
            // 如果是忽略的错误码，直接返回 msg 异常
            return Promise.reject(msg)
        } else if (code === 405) {
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
        handleError()
        return Promise.reject(error)
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
    window.location.href = '/403'
    return Promise.reject('未授权访问！')
}

const handleError = () => {
    window.location.href = '/500'
}

export default api;
