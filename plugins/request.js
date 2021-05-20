import axios from 'axios'

export const request = axios.create({
    baseURL: 'https://conduit.productionready.io'
})

export default function({store}, inejct) {
    request.interceptors.request.use(function(config) {
        const user = store.state.user
        console.log(user, '-0')
        if (user && user.token) {
            config.headers.Authorization = `Token ${user.token}`
        }
        return config
    }, function(error) {
        return Promise.reject(error)
    })
}
