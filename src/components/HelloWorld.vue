<template>
  <div class="hello">
    <h1>Welcome. Please, login.</h1>

    <button v-if="!isAuthenticated" @click="useAuthProvider">Google Login</button>
    <button v-if="isAuthenticated" @click="logout">Logout</button>
    <br>
    <br><br>
    <button @click="fetchUserInfo">Fetch user info (API call)</button>

  </div>
</template>

<script>
import { Google } from 'universal-social-auth'

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
      responseData: {},
      hash: '',
      data: {},
    }
  },
  computed: {
    isAuthenticated() {
      return this.currentUser != null
    },
    currentUser() {
      return (this.$store.state.userInfo) ? this.$store.state.userInfo : null
    },
  },
  methods: {
    useAuthProvider () {
      this.$Oauth.authenticate('google', Google).then(async (response) => {
        const rsp = response
        if (rsp.code) {
          this.responseData.code = rsp.code
          this.responseData.provider = 'google'
          await this.useSocialLogin()
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    async useSocialLogin () {
      // otp from input Otp form
      // hash user data in your backend with Cache or save to database
      const pdata = { code: this.responseData.code, otp: this.data.tok, hash: this.hash }
      try {
        await this.$axios.get(`${process.env.VUE_APP_BACKEND_BASE_URL}sanctum/csrf-cookie`)
        const response = await this.$axios.post(`${process.env.VUE_APP_BACKEND_BASE_URL}login/`, pdata)
          // `response` data base on your backend config
        if (response.data.status === 444) {
          this.hash = response.data.hash
          this.fauth = true // Option show Otp form incase you using 2fa or any addition security apply to your app you can handle all that from here
        }else if (response.data.status === 445) {
          //do something Optional
        }else {
          await this.useLoginFirst()
        }
      } catch(err) {
        console.log(err)
      }
    },
    async  useLoginFirst () {
      // this sample of to pust user data to my store
      try {
        const response = await this.$axios.get(`${process.env.VUE_APP_BACKEND_BASE_URL}api/user`)
        this.$store.commit('setUserInfo', response.data)
        console.log(response.data)
      } catch (err) {
        console.log(err)
      }
    },
    async logout() {
      try {
        await this.$axios.get(`${process.env.VUE_APP_BACKEND_BASE_URL}logout`)
        this.$store.commit('setUserInfo', null)
      } catch (err) {
        console.log(err)
      }
    },
    async fetchUserInfo() {
      try {
        const response = await this.$axios.get(`${process.env.VUE_APP_BACKEND_BASE_URL}api/user`)
        console.log(response.data)
      } catch (err) {
        console.log(err)
        alert('Error')
      }
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
