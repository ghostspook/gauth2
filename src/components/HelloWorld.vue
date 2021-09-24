<template>
  <div class="hello">
    <h1>{{ msg }}</h1>

    <button @click="useAuthProvider">Google Login</button>

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
          await this.useLoginFirst(response.data)
        }
      } catch(err) {
        console.log(err)
      }
    },
    async  useLoginFirst (e) {
      // this sample of to pust user data to my store
      console.log(e)
    }
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
