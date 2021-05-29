<template>
  <div class="settings-page">
  <div class="container page">
    <div class="row">

      <div class="col-md-6 offset-md-3 col-xs-12">
        <h1 class="text-xs-center">Your Settings</h1>

        <form @prevent.submit>
          <fieldset>
              <fieldset class="form-group">
                <input v-model="userData.image" class="form-control" type="text" placeholder="URL of profile picture">
              </fieldset>
              <fieldset class="form-group">
                <input v-model="userData.username" class="form-control form-control-lg" type="text" placeholder="Your Name">
              </fieldset>
              <fieldset class="form-group">
                <textarea v-model="userData.bio" class="form-control form-control-lg" rows="8" placeholder="Short bio about you"></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input v-model="userData.email" class="form-control form-control-lg" type="text" placeholder="Email">
              </fieldset>
              <fieldset class="form-group">
                <input v-model="userData.password" class="form-control form-control-lg" type="password" placeholder="Password">
              </fieldset>
              <button class="btn btn-lg btn-primary pull-xs-right" type="button" @click="updateUser">
                Update Settings
              </button>
          </fieldset>
        </form>
      </div>

    </div>
  </div>
</div>
</template>

<script>
import { updateUser } from '@/api/settings'
import { mapState, mapMutations } from 'vuex'

export default {
    name: 'setting',
    middleware: 'auth',
    data() {
      return {
        userData: {
          username: '',
          password: '',
          bio: '',
          image: '',
          email: ''
        }
      }
    },
    created() {
      this.userData = Object.assign({}, this.user)
    },
    computed: {
        ...mapState(['user'])
    },
    methods: {
      async updateUser() {
      const { data } = await updateUser({
        user: this.userData
      })
      this.setUser(data.user)
      this.$router.push({name: 'profile',
      params: {
        username: data.user.username
      }})
    },
    ...mapMutations(['setUser'])
    }
}
</script>

<style>

</style>