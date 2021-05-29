<template>
  <div class="article-meta">
    <nuxt-link
      :to="{
        name: 'profile',
        params: {
          username: article.author.username,
        },
      }"
      ><img :src="article.author.image"
    /></nuxt-link>
    <div class="info">
      <nuxt-link
        :to="{
          name: 'profile',
          params: {
            username: article.author.username,
          },
        }"
        class="author"
        >{{ article.author.username }}</nuxt-link
      >
      <span class="date">{{ article.createdAt | date("MMM DD, YYYY") }}</span>
    </div>
    <template v-if="currentUser">
        <span>

    <nuxt-link class="btn btn-outline-secondary btn-sm" :to="{
        name: 'editor',
        query: {
            slug: article.slug
        }
    }"><i class="ion-edit"></i> Edit Article</nuxt-link>

    <button class="btn btn-outline-danger btn-sm" @click="deleteArticle">
      <i class="ion-trash-a"></i> Delete Article
    </button>

  </span>
    </template>
    <template v-else>
        <button
      class="btn btn-sm"
      :class="{
        'btn-outline-secondary': !article.author.following,
        'btn-secondary': article.author.following,
      }"
      :disabled="disabledFollowing"
      @click="toggleFollow"
    >
      <i class="ion-plus-round"></i>
      &nbsp;
      {{ article.author.following ? "UnFollowing" : "Following" }}
      {{ article.author.username }}
    </button>
    &nbsp;
    <button
      class="btn btn-sm"
      :class="{ active: article.author.favorited, 'btn-outline-primary': !article.favorited, 'btn-primary': article.favorited }"
      :disabled="diabledFavorited"
      @click="toggleFavorite"
    >
      <i class="ion-heart"></i>
      &nbsp; {{article.favorited ? 'UnFavorite Article' : 'Favorite Article'}}
      <span class="counter">({{ article.favoritesCount }})</span>
    </button>
    </template>
  </div>
</template>
<script>
import { followUser, addFavorite, deleteFavorite, deleteArticle } from "@/api/article";
import { mapState } from 'vuex'
export default {
  name: "article-meta",
  props: {
    article: {
      type: Object,
      required: true,
    },
  },
  data() {
      return {
          disabledFollowing: false,
          diabledFavorited: false
      }
  },
  computed: {
      currentUser() {
          return this.user.username === this.article.author.username
      },
        ...mapState(['user'])
    },
  methods: {
    async toggleFollow() {
      let type = "POST";
      if (this.article.author.following) {
        type = "DELETE";
      }
      this.disabledFollowing = true
      const { data } = await followUser(type, this.article.author.username);
      this.$emit("update-author", data.profile);
      this.disabledFollowing = false
    },
    async toggleFavorite() {
        let data
        this.diabledFavorited = true
        if (this.article.favorited) {
            data = await deleteFavorite(this.article.slug)
        } else {
            data = await addFavorite(this.article.slug)
        }
        this.diabledFavorited = false
        this.$emit('update-article', data.data.article)
    },
    async deleteArticle() {
        const {data} = await deleteArticle(this.article.slug)
        this.$router.push({
            name: 'home',
            query: {
                tab: 'your_feed'
            }
        })
    }
  },
};
</script>
