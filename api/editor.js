import {request} from '@/plugins/request'

export function createArticle(params) {
    return request({
        method: 'POST',
        url: '/api/articles',
        data: params
    })
}
