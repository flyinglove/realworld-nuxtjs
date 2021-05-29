import axios from 'axios'

export const request = axios.create({
    baseURL: 'https://conduit.productionready.io'
})

export default function({store}, inejct) {
    request.interceptors.request.use(function(config) {
        const user = store.state.user
        if (user && user.token) {
            config.headers.Authorization = `Token ${user.token}`
        }
        return config
    }, function(error) {
        return Promise.reject(error)
    })
    request.interceptors.response.use(function(config) {
        return config
    }, function(error) {
        return {}
    })
}
