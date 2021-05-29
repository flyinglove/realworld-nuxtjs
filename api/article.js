import {request} from '@/plugins/request'

export const getArticles = params => {
    return request({
        method: 'GET',
        url: '/api/articles',
        params
    })
}

export const getFeedArticles = params => {
    return request({
        method: 'GET',
        url: '/api/articles/feed',
        params
    })
}


export const addFavorite = slug => {
    return request({
        method: 'POST',
        url: `/api/articles/${slug}/favorite`,
    })
}


export const deleteFavorite = slug => {
    return request({
        method: 'DELETE',
        url: `/api/articles/${slug}/favorite`,
    })
}


export const getComments = slug => {
    return request({
        method: 'GET',
        url: `api/articles/${slug}/comments`,
    })
}

export const createComment = (slug, params) => {
    return request({
        method: 'POST',
        url: `/api/articles/${slug}/comments`,
        data: params
    })
}

export const deleteComment = (slug, commentId) => {
    return request({
        method: 'DELETE',
        url: `/api/articles/${slug}/comments/${commentId}`
    })
}


export const getArticle = slug => {
    return request({
        method: 'GET',
        url: `/api/articles/${slug}`,
    })
}

export const deleteArticle = slug => {
    return request({
        method: 'DELETE',
        url: `/api/articles/${slug}`,
    })
} 
export function followUser(type = 'POST', username) {
    return request({
        method: type,
        url: `/api/profiles/${username}/follow`
    })
}
