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
      clientId: '1021657019789-0khdrh3s877pn9kl3gh5tf29tm6uq6bt.apps.googleusercontent.com',
      redirectUri: 'http://portal-dev.ide.edu.ec:8080/auth/callback',
    },
  }
}

const Oauth = new UniversalSocialauth(axios, options)

Vue.prototype.$axios = axios
Vue.prototype.$Oauth = Oauth

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
