import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import UniversalSocialauth from 'universal-social-auth'
import axios from 'axios'

Vue.config.productionTip = false

const options = {
  providers: {
    google: {
      clientId: process.env.VUE_APP_GOOGLE_CLIENT_ID,
      redirectUri: process.env.VUE_APP_GOOGLE_REDIRECT_URL,
    },
  }
}

const Oauth = new UniversalSocialauth(axios, options)

const client = axios.create({
  withCredentials: true,
  json: true
})

Vue.prototype.$axios = client
Vue.prototype.$Oauth = Oauth

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
