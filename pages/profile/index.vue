<template>
  <div class="profile-page">

  <div class="user-info">
    <div class="container">
      <div class="row">

        <div class="col-xs-12 col-md-10 offset-md-1">
          <img :src="author.image" class="user-img" />
          <h4>{{author.username}}</h4>
          <p>
            {{author.bio || '博主很懒，这里什么也没留下'}}
          </p>

          <nuxt-link v-if="currentUser" class="btn btn-sm btn-outline-secondary action-btn" :to="{
            name: 'settings'
          }"><i class="ion-gear-a"></i> Edit Profile Settings</nuxt-link>
          <button v-else class="btn btn-sm btn-outline-secondary action-btn" :disabledFollowing="disabledFollowing" @click="toggleFollow">
            <i class="ion-plus-round"></i>
            &nbsp;
            {{ author.following ? "UnFollowing" : "Following" }}
            {{author.username}} 
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="container">
    <div class="row">

      <div class="col-xs-12 col-md-10 offset-md-1">
        <div class="articles-toggle">
          <ul class="nav nav-pills outline-active">
            <li class="nav-item">
              <nuxt-link exact class="nav-link" :to="{
                name: 'profile'
              }">My Articles</nuxt-link>
            </li>
            <li class="nav-item">
              <nuxt-link exact class="nav-link" :to="{
                name: 'profile',
                query: {
                  tab: 'favorite'
                }
              }">Favorited Articles</nuxt-link>
            </li>
          </ul>
        </div>
        <template v-if="articleList.length">
<div class="article-preview" v-for="article in articleList" :key="article.slug">
          <div class="article-meta">
            <nuxt-link :to="{
              name: 'profile',
              params: {
                username: article.author.username
              }
            }">
            <img :src="article.author.image" />
            </nuxt-link>
            <div class="info">
              <nuxt-link class="author" :to="{
              name: 'profile',
              params: {
                username: article.author.username
              }
            }">
            {{article.author.username}}
            </nuxt-link>
              <span class="date">{{article.createdAt | date('MMM DD, YYYY')}}</span>
            </div>
            <button class="btn btn-outline-primary btn-sm pull-xs-right" :class="{
              'active': article.favorited
            }" :disabled="article.favoriteDisabled" @click="onFavorite(article)">
              <i class="ion-heart"></i> {{article.favoritesCount}}
            </button>
          </div>
          <nuxt-link :to="{
            name: 'article',
            params: {
              slug: article.slug
            }
          }" class="preview-link">
            <h1>{{article.title}}</h1>
            <p>{{article.description}}</p>
            <span>Read more...</span>
          </nuxt-link>
        </div>
        </template>
        <div v-else class="article-preview">
            啥也没有呀
        </div>

      </div>

    </div>
  </div>

</div>
</template>

<script>
import { mapState } from 'vuex'
import { getArticles, followUser, deleteFavorite, addFavorite } from '@/api/article'
import { getProfile } from '@/api/profiles'

export default {
    name: 'profile',
    middleware: 'auth',
    watchQuery: true,
    async asyncData({query, params}) {
      const username = params.username
      const queryParams = Object.assign({}, query)
      if (queryParams.tab) {
        queryParams.favorited = username
      } else {
        queryParams.author = username
      }
      const [{data: articleData}, {data: profileData}] = await Promise.all([getArticles(queryParams), getProfile(username)])
      articleData.articles.forEach(item => {
          item.favoriteDisabled = false
        })
      return {
        articleList: articleData.articles,
        author: profileData.profile,
      }
    },
    data() {
      return {
        disabledFollowing: false
      }
    },
    computed: {
      currentUser() {
        return this.$route.params.username === this.user.username
      },
        ...mapState(['user'])
    },
    methods: {
      async toggleFollow() {
        let type = "POST";
        if (this.author.following) {
          type = "DELETE";
        }
        this.disabledFollowing = true
        const { data } = await followUser(type, this.author.username);
        this.author = data.profile
        this.disabledFollowing = false
      },
      async onFavorite(article) {
        article.favoriteDisabled = true
        if (article.favorited) {
          await deleteFavorite(article.slug)
          article.favorited = false
          article.favoritesCount --
        } else {
          await addFavorite(article.slug)
          article.favorited = true
          article.favoritesCount ++
        }
        article.favoriteDisabled = false
      }
    }
}
</script>

<style>

</style>