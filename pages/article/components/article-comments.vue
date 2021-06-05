<template>
   <div>
       <form class="card comment-form">
          <div class="card-block">
            <textarea v-model="newComment" class="form-control" placeholder="Write a comment..." rows="3"></textarea>
          </div>
          <div class="card-footer">
            <img :src="article.author.image" class="comment-author-img" />
            <button class="btn btn-sm btn-primary" @click.prevent="createComment" :disabled="disabledComment">
             Post Comment
            </button>
          </div>
        </form>
        
        <div class="card" v-for="(comment, idx) in comments" :key="comment.id">
          <div class="card-block">
            <p class="card-text">{{comment.body}}</p>
          </div>
          <div class="card-footer">
            <nuxt-link :to="{
                name: 'profile',
                params: {
                    username: comment.author.username
                }
            }" class="comment-author">
              <img :src="comment.author.image" class="comment-author-img" />
            </nuxt-link>
            &nbsp;
            <nuxt-link :to="{
                name: 'profile',
                params: {
                    username: comment.author.username
                }
            }" class="comment-author">
             {{comment.author.username}}
            </nuxt-link>
            <span class="date-posted">{{comment.createdAt | date('MMM DD, YYYY')}}</span>
            <span class="mod-options" v-if="checkCommentUser(comment)" @click="deleteComment(comment, idx)">
                <i class="ion-trash-a"></i>
            </span>
          </div>
        </div>
    </div> 
</template>
<script>
import { getComments, createComment, deleteComment } from '@/api/article'
import { mapState } from 'vuex'

export default {
    name: 'ArticleComments',
    data() {
        return {
            comments: [],
            newComment: '',
            disabledComment: false
        }
    },
    props: {
        article: {
            type: Object,
            required: true
        }
    },
    computed: {
        ...mapState(['user'])
    },
    async mounted() {
        const { data } = await getComments(this.article.slug)
        this.comments = data.comments
    },
    methods: {
        async createComment() {
            this.disabledComment = true
            const {data} = await createComment(this.article.slug, {
                comment: {
                    body: this.newComment
                }
            })
            this.comments.unshift(data.comment)
            this.newComment = ''
            this.disabledComment = false
        },
        checkCommentUser(comment) {
            return comment.author.username = this.user.username
        },
        async deleteComment(comment, idx) {
            const {data} = await deleteComment(this.article.slug, comment.id)
            this.comments.splice(idx, 1)
        }
    }
}
</script>