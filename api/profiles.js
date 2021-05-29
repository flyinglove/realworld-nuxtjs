import {request} from '@/plugins/request'

export function getProfile(username) {
    return request({
        method: 'GET',
        url: `/api/profiles/${username}`,
    })
}
