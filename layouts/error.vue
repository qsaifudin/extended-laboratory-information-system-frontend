<template>
  <v-app dark>
    <v-container fluid fill-height class="pa-0">
      <v-row align="center" justify="center">
        <v-col cols="12" sm="12">
          <v-card elevation="0" class="mx-auto" max-width="1000">
            <div class="text-center">
              <h1 v-if="error.statusCode === 404">
                <div>
                  <img src="~/assets/images/404.png" height="150" />
                </div>
                {{ pageNotFound }}
              </h1>
              <h1 v-else>
                {{ otherError }}
              </h1>
              <div class="my-2">
                <v-btn x-large color="amber" @click="to">
                  <v-icon left>mdi-arrow-left</v-icon>Back
                </v-btn>
                <v-btn x-large color="success" href="/">
                  <v-icon left>mdi-home</v-icon>Homepage
                </v-btn>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
export default {
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      pageNotFound: 'Page Not Found',
      otherError: 'An error occurred',
    }
  },

  head() {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title,
    }
  },

  methods: {
    to() {
      if (this.error.statusCode === 404) {
        this.$router.back()
      } else {
        this.$router.go(0)
      }
    },
  },
}
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
