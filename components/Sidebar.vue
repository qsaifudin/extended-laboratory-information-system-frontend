<template>
  <v-app>
    <v-navigation-drawer
      v-if="isAuth"
      app
      permanent
      floating
      width="270"
      :mini-variant="mini"
      color="primary"
      class="custom-sidebar"
    >
      <v-list-item class="side-max-min pa-2 ml-">
        <v-btn
          v-if="mini"
          elevation="0"
          x-small
          class="py-4 ma-0"
          color="#FFFFFF"
          outlined
          @click.stop="mini = !mini"
        >
          <v-icon small color="white"> mdi-fullscreen</v-icon>
        </v-btn>
        <v-container v-else class="d-flex justify-space-between align-center">
          <NuxtLink to="/">
            <img src="~/assets/images/header-logo.png" alt="" width="150px"
          /></NuxtLink>
          <v-btn
            elevation="0"
            x-small
            class="pa-0 py-4"
            color="#FFFFFF"
            outlined
            @click.stop="mini = !mini"
          >
            <v-icon small color="#FFFFFF">mdi-fullscreen-exit</v-icon>
          </v-btn>
        </v-container>
      </v-list-item>

      <v-list nav class="pr-0 pt-5">
        <template v-for="(item, index) in items">
          <v-list-item
            :key="index"
            :to="`${item.link}`"
            :title="item.title"
            @click.stop
          >
            <v-list-item-icon class="mr-3">
              <v-icon color="#FFFFFF">{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                <h4 class="custom-item-title">{{ item.title }}</h4>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app fixed class="px-2 custom-header">
      <v-spacer></v-spacer>
      <v-menu offset-y>
        <template #activator="{ on, attrs }">
          <v-btn
            outlined
            color="grey"
            rounded
            elevation="0"
            dark
            v-bind="attrs"
            class="pa-3 pr-0 text-right"
            v-on="on"
          >
            <div class="d-flex flex-column">
              <div class="font-weight-bold text--darken-5 pb-0">{{ user }}</div>
              <small class="font-weight-thin text-capitalize">{{
                roleName
              }}</small>
            </div>
            <v-avatar class="ml-2" outlined color="grey lighten-2" size="46"
              ><v-icon color="grey">mdi-account</v-icon>
            </v-avatar>
          </v-btn>
        </template>
        <v-list>
          <v-list-item class="justify-md-center">
            <v-btn depressed color="error" @click="logout"> Logout </v-btn>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main class="custom-color-bg">
      <div class="pa-5">
        <nuxt />
      </div>
    </v-main>
  </v-app>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  data() {
    return {
      items: [],
      user: '',
      roleName: '',
      itemsSuperAdmin: [
        {
          link: '/',
          icon: 'mdi-view-dashboard',
          title: 'Dashboard',
        },
        {
          link: '/user',
          icon: 'mdi-account-box',
          title: 'Datamaster User',
          role: 'superadmin',
        },
        {
          link: '/vendor',
          icon: 'mdi-account-group',
          title: 'Datamaster Vendor',
          role: 'admin',
        },
        {
          link: '/kategoriRs',
          icon: 'mdi-ballot-outline',
          title: 'Datamaster Kategori RS',
        },
        {
          link: '/rs',
          icon: 'mdi-hospital-building',
          title: 'Datamaster Rumah Sakit',
        },
        {
          link: '/lab',
          icon: 'mdi-flask-outline',
          title: 'Datamaster Laboratorium',
        },
        {
          link: '/transaksiPasien',
          icon: 'mdi-chart-histogram',
          title: 'Transaksi Pasien',
        },
      ],
      mini: false,
    }
  },
  computed: {
    ...mapState(['isAuth', 'cekRole']),
  },

  mounted() {
    this.user = this.$auth.user.nama.toUpperCase()
    this.roleName = this.$auth.user.role.nama
    switch (this.cekRole) {
      case 'superadmin':
        this.pathSuperAdmin()
        break
      case 'admin':
        this.pathAdmin()
        break
      case 'vendor':
        this.pathVendor()
        break
    }
  },

  methods: {
    ...mapMutations(['SET_IS_AUTH', 'SET_ROLE']),
    pathSuperAdmin() {
      this.items = this.itemsSuperAdmin
    },
    pathAdmin() {
      this.items = this.itemsSuperAdmin
      this.items.splice(1, 1)
    },
    pathVendor() {
      this.items = this.itemsSuperAdmin
      this.items.splice(1, 5)
    },
    async logout() {
      await this.$auth.logout()
      this.SET_IS_AUTH(false)
      this.SET_ROLE(null)
      this.$router.push('/login')
    },
  },
}
</script>
