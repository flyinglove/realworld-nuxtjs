<template>
  <div class="editor-page">
  <div class="container page">
    <div class="row">

      <div class="col-md-10 offset-md-1 col-xs-12">
        <form>
          <fieldset>
            <fieldset class="form-group">
                <input v-model="article.title" type="text" class="form-control form-control-lg" placeholder="Article Title">
            </fieldset>
            <fieldset class="form-group">
                <input v-model="article.description" type="text" class="form-control" placeholder="What's this article about?">
            </fieldset>
            <fieldset class="form-group">
                <textarea v-model="article.body" class="form-control" rows="8" placeholder="Write your article (in markdown)"></textarea>
            </fieldset>
            <fieldset class="form-group">
                <input type="text" v-model="curTag" class="form-control" placeholder="Enter tags" @keyup.enter="addTag">
                <div class="tag-list">
                  <span :key="tag" v-for="tag in article.tagList" class="tag-default tag-pill">
                    <i class="ion-close-round" @click="removeTag(tag)"></i>{{tag}}
                  </span>
                </div>
            </fieldset>
            <button class="btn btn-lg pull-xs-right btn-primary" type="button" @click="onSubmit">
                Publish Article
            </button>
          </fieldset>
        </form>
      </div>

    </div>
  </div>
</div>
</template>

<script>
import { createArticle } from '@/api/editor'
import { getArticle } from '@/api/article'

export default {
    name: 'editor',
    middleware: 'auth',
    data() {
      return {
        curTag: ''
      }
    },
    async asyncData({params, query}) {
      let article = {
          title: '',
          description: '',
          body: '',
          tagList: []
        }
      if (query.slug) {
        const {data}  = await getArticle(query.slug)
        article = data.article
      }
      return {
        article
      }
    },
    methods: {
      async onSubmit(e) {
        let {data} = await createArticle({article: this.article})
        this.$router.push({
          name: 'article',
          params: {
            slug: data.article.slug
          }
        })
      },
      addTag() {
        if (this.article.tagList.includes(this.curTag)) {
          return
        }
        this.article.tagList.push(this.curTag)
        this.curTag = ''
      },
      removeTag(tag) {
        for (let i = 0; i < this.article.tagList.length; i++) {
          if (tag === this.article.tagList[i]) {
            this.article.tagList.splice(i, 1)
            return
          }
        }
      }
    }

}
</script>

<style>

</style>