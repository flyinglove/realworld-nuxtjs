<template>
  <div class="home-page">

  <div class="banner">
    <div class="container">
      <h1 class="logo-font">conduit</h1>
      <p>A place to share your knowledge.</p>
    </div>
  </div>

  <div class="container page">
    <div class="row">

      <div class="col-md-9">
        <div class="feed-toggle">
          <ul class="nav nav-pills outline-active">
            <li v-if="user" class="nav-item" >
              <nuxt-link class="nav-link"
                :class="{
                    active: tab === 'your_feed'
                }"
                exact 
                :to="{
                  name: 'home',
                  query: {
                      tab: 'your_feed'
                  }
              }">Your Feed</nuxt-link>
            </li>
            <li class="nav-item">
              <nuxt-link class="nav-link"
                :class="{
                    active: tab === 'global_feed'
                }"
                exact
                :to="{
                  name: 'home',
                  query: {
                      tab: 'global_feed'
                  }
              }">Global Feed</nuxt-link>
            </li>
            <li class="nav-item" v-if="tag">
              <nuxt-link class="nav-link"
              :class="{
                  active: 'tag' === tab
              }"
               exact :to="{
                  name: 'home',
                  query: {
                      tab: 'tag',
                      tag
                  }
              }">#{{tag}}</nuxt-link>
            </li>
          </ul>
        </div>
        <template v-if="articles.length">
          <div class="article-preview" v-for="article in articles" :key="article.slug">
          <div class="article-meta">
            <!-- <a href="profile.html"><img src="http://i.imgur.com/Qr71crq.jpg" /></a> -->
            <nuxt-link :to="{
                name: 'profile',
                params: {
                    username: article.author.username
                }
            }"><img :src="article.author.image" /></nuxt-link>
            <div class="info">
              <!-- <a href="" class="author">Eric Simons</a> -->
              <nuxt-link :to="{
                name: 'profile',
                params: {
                    username: article.author.username
                }
            }" class="author">{{article.author.username}}</nuxt-link>
              <span class="date">{{article.createdAt |
                 date('MMM DD, YYYY')}}</span>
            </div>
            <button class="btn btn-outline-primary btn-sm pull-xs-right" :class="{
                active: article.favorited
            }" @click="onFavorite(article)" :disabled="article.favoriteDisabled">
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
        <div class="article-preview" v-else>
          啥也没有呀
        </div>
        
        <nav>
            <ul class="pagination">

                <li class="page-item" :class="{active: page === item}" v-for="item in totalPage" :key="item">
                    <nuxt-link class="page-link" :to="{
                        name: 'home',
                        query: {
                            page: item,
                            tag: $route.query.tag,
                            tab: tab
                        }
                    }">{{item}}</nuxt-link>
                </li>

            </ul>
        </nav>
      </div>

      <div class="col-md-3">
        <div class="sidebar">
          <p>Popular Tags</p>

          <div class="tag-list">
            <nuxt-link :to="{
                name: 'home',
                query: {
                    tag: item,
                    tab: 'tag'
                }
            }" class="tag-pill tag-default" v-for="(item, index) in tags" :key="index">{{item}}</nuxt-link>
          </div>
        </div>
      </div>

    </div>
  </div>

</div>
</template>

<script>
import { getArticles, getFeedArticles, addFavorite, deleteFavorite } from '@/api/article'
import { getTags } from '@/api/tag'
import { mapState } from 'vuex'

export default {
    name: 'HomeIndex',
    watchQuery: ['page', 'tag', 'tab'],
    async asyncData({query, store}) {
        const page = Number.parseInt(query.page || 1)
        const limit = 20
        const { tag, tab='global_feed' } = query
        const loadArticles = store.state.user && tab === 'your_feed' ? getFeedArticles : getArticles
        const [data, tagData] = await Promise.all([loadArticles({
            limit,
            offset: (page - 1) * limit,
            tag: tag
        }), getTags()])
        const {articles, articlesCount} = data.data
        articles.forEach(item => {
          item.favoriteDisabled = false
        })
        const {tags} = tagData.data
        const totalPage = Math.ceil(articlesCount / limit)
        return {
            articles: articles,
            articleCount: articlesCount,
            page,
            limit,
            totalPage,
            tags,
            tag,
            tab
        }
    },
    computed: {
        ...mapState(['user'])
    },
    methods: {
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