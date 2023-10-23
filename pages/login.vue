<template>
  <v-app>
    <v-main>
      <v-container
        fill-height
        fluid
        class="d-flex pa-0 custom-login"
        @keyup.enter="login()"
      >
        <!-- Left Content -->
        <v-col md="6" class="pa-6 text-center">
          <v-card dark class="login-card-right">
            <img src="~/assets/images/login-hello.png" width="80%" />
            <v-row class="mt-5">
              <v-col class="d-flex justify-end align-center">
                <img
                  class="login-logo-right"
                  src="~/assets/images/header-logo.png"
                />
              </v-col>
              <v-divider vertical class="grey lighten-3"></v-divider>
              <v-col class="text-left text--accent-1">
                <h2 class="font-weight-thin text--accent-1">
                  Medical Check Up <br />
                  dan Rapid Test di Rumah
                </h2>
              </v-col>
            </v-row>
          </v-card>
        </v-col>

        <!-- Card Login -->
        <v-col cols="12" md="6" class="pa-6 d-flex justify-center">
          <v-card
            outlined
            class="rounded-xl pa-10 overflow-hidden"
            elevation="12"
            color="white"
            width="100%"
          >
            <v-progress-linear
              v-show="progressBar"
              indeterminate
              height="7"
              absolute
              top
            ></v-progress-linear>
            <img src="~/assets/images/logo.png" width="40px" />
            <v-list-item-title class="font-weight-bold pt-5">
              <h1>Login</h1>
            </v-list-item-title>
            <v-list-item-subtitle
              >Silahkan login terlebih dahulu</v-list-item-subtitle
            >

            <!-- Form Login -->
            <v-list-item-content class="pt-12">
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-text-field
                  v-model="username"
                  required
                  :rules="usernameRules"
                  label="username"
                  name="username"
                  prepend-inner-icon="mdi-account"
                  type="text"
                />
                <v-text-field
                  v-model="password"
                  :rules="passwordRules"
                  label="Password"
                  required
                  prepend-inner-icon="mdi-lock"
                  type="password"
                />
              </v-form>
              <div class="text-center mt-4 mb-2">
                <div
                  v-if="errMessage != ''"
                  class="
                    d-inline-block
                    pa-4
                    mb-7
                    text-center
                    red
                    lighten-5
                    rounded-lg
                    red--text
                  "
                >
                  {{ errMessage }}
                </div>
                <v-btn
                  block
                  color="primary"
                  class="elevation-0 pa-6"
                  @click="login()"
                >
                  <h3 class="white--text">LOGIN</h3>
                </v-btn>
              </div>
            </v-list-item-content>
          </v-card>
        </v-col>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  layout: 'empty',
  auth: false,
  data() {
    return {
      step: 1,

      username: '',
      usernameRules: [(v) => !!v || 'username is empty'],
      password: '',
      passwordRules: [(v) => !!v || 'password is empty'],

      valid: true,
      errMessage: '',

      progressBar: false,
    }
  },

  computed: {
    ...mapState(['isAuth', 'cekRole']),
  },

  mounted() {
    if (this.$auth.loggedIn) {
      this.$router.push('/')
    }
  },

  methods: {
    ...mapMutations(['SET_IS_AUTH', 'SET_ROLE']),
    login() {
      this.progressBar = true
      const payload = {
        username: this.username,
        password: this.password,
      }
      this.$refs.form.validate()

      // Login
      this.$auth
        .loginWith('local', { data: payload })
        .then((res) => {
          this.SET_ROLE(res.data.data.role.nama)
          this.SET_IS_AUTH(true)
          this.$router.push('/')
          this.progressBar = false
        })
        .catch(({ response: err }) => {
          this.errMessage = err.data.message
          this.$router.push('/login')
          this.progressBar = false
        })
    },
  },
}
</script>
