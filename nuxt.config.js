// import colors from 'vuetify/es5/util/colors'

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - Sistem Informasi Manajemen',
    title: 'ADAMLabs',
    meta: [
      {
        charset: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        hid: 'description',
        name: 'description',
        content: '',
      },
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.png',
      },
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['@/assets/main.css', '@/assets/custom.css'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/apexchart', ssr: false },
    { src: '~/plugins/downloadexcel' },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    '@nuxtjs/color-mode',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // '@nuxtjs/auth',
    '@nuxtjs/auth-next',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    'vue-toastification/nuxt',
  ],
  toast: {
    timeout: 1000,
    closeOnClick: false,
    position: 'top-center',
  },
  auth: {
    strategies: {
      local: {
        scheme: 'refresh',
        token: {
          property: 'data.accessToken',
        },
        refreshToken: {
          property: 'data.refreshToken',
          tokenRequired: true,
        },
        user: {
          property: 'data',
        },
        endpoints: {
          login: {
            url: '/api/auth/login',
            method: 'post',
          },
          user: {
            url: '/api/auth/user',
            method: 'get',
          },
          refresh: {
            url: '/api/auth/refreshToken',
            method: 'post',
          },
          logout: {
            url: '/api/auth/logout',
            method: 'post',
          },
        },
      },
    },
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseURL: process.env.BASE_URL,
    // baseURL: 'http://localhost:3003/',
  },
  router: {
    middleware: ['auth'],
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en',
    },
  },

  server: {
    port: process.env.PORT,
    host: process.env.HOST,
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      // dark: false,
      themes: {
        // dark: {
        //   primary: colors.blue.darken2,
        //   accent: colors.grey.darken3,
        //   secondary: colors.amber.darken3,
        //   info: colors.teal.lighten1,
        //   warning: colors.amber.base,
        //   error: colors.deepOrange.accent4,
        //   success: colors.green.accent3,
        // },
        light: {
          primary: '#00BFA5',
          secondary: '#E2C790',
          softgrey: '#f5f5f5',
          softgreen: '#ECFAF8',
          success: '#00BFA5',
        },
      },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
  loading: false,
}
