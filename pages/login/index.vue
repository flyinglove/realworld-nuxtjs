<template>
  <div class="auth-page">
  <div class="container page">
    <div class="row">

      <div class="col-md-6 offset-md-3 col-xs-12">
        <h1 class="text-xs-center"> {{ isLogin ? 'Sign in' : 'Sign up' }}</h1>
        <p class="text-xs-center">
          <!-- <a href="">Have an account?</a> -->
          <nuxt-link v-if="isLogin" to='/register'>Need an account?</nuxt-link>
          <nuxt-link v-else to='/login'>Have an account?</nuxt-link>
        </p>

        <ul class="error-messages">
            <template v-for="(messages, field) in errors">
                <li v-for="(message, index) in messages" :key="index">
                    {{field}} {{message}}
                </li>
            </template>
        </ul>

        <form @submit.prevent='onSubmit'>
          <fieldset v-if="!isLogin" class="form-group">
            <input class="form-control form-control-lg" v-model="user.username" type="text" placeholder="Your Name" required>
          </fieldset>
          <fieldset class="form-group">
            <input class="form-control form-control-lg" v-model='user.email' type="email" placeholder="Email" required>
          </fieldset>
          <fieldset class="form-group">
            <input class="form-control form-control-lg" v-model='user.password' type="password" placeholder="Password" required>
          </fieldset>
          <button class="btn btn-lg btn-primary pull-xs-right">
            {{ isLogin ? 'Sign in' : 'Sign up' }}
          </button>
        </form>
      </div>

    </div>
  </div>
</div>
</template>

<script>
const Cookie = process.client ? require('js-cookie') : undefined
import {login, register} from '@/api/user'
// import { mapMutations } from 'vuex'
export default {
    name: 'login',
    middleware: 'unauth',
    data() {
        return {
            user: {
                username: '',
                email: '',
                password: ''
            },
            errors: {}
        }
    },
    methods: {
        async onSubmit() {
            try {
                const { data } =this.isLogin ? await login({
                    user: this.user
                }) : await register({
                    user: this.user
                })
                this.$store.commit('setUser', data.user)
                Cookie.set('user', data.user)
                this.$router.push('/')
            } catch(err) {
                this.errors = err.response.data.errors
            }
        }
    },
    computed: {
        isLogin() {
            return this.$route.name === 'login'
        }
    }
}
</script>

<style>

</style>