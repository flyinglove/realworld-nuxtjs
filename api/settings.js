import {request} from '@/plugins/request'

export const updateUser = params => {
    return request({
        method: 'PUT',
        url: '/api/user',
        data: params
    })
}