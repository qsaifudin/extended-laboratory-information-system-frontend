<template>
  <v-card
    class="
      custom-item-card-1 custom-box-shadow-soft
      cus-height-100
      card-total-bg
    "
  >
    <!-- struktur Card dashboard -->
    <v-card-text class="text-left pa-3">
      <div class="text-subtitle-1 font-weight-bold text-right pr-2">
        <v-icon small class="mb-2" :color="getColor(panah)">{{ panah }}</v-icon>
        <b :class="panah === 'mdi-arrow-up-thick' ? 'green--text' : 'red--text'"
          >{{ persentase }} {{ keterangan }}</b
        >
      </div>
      <v-row>
        <v-col cols="3" class="d-flex justify-center">
          <v-icon large class="mb-2" color="teal accent-4">{{ icon }}</v-icon>
        </v-col>
        <v-col cols="9" class="text-left pl-0">
          <div class="text-h3 black--text text--darken-2">
            {{ count }}
          </div>
        </v-col>
      </v-row>
      <div class="text-h6 text--darken-2 mt-2 pl-2">
        <b>{{ title }}</b>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    icon: { type: String, default: 'mdi-hospital-building' },
    title: { type: String, default: 'UnTitle' },
    subtitle: { type: String, default: 'UnTitle' },
    count: { type: String, default: '0' },
    panah: { type: String, default: '' },
    persentase: { type: String, default: '0' },
    keterangan: { type: String, default: '' },
  },

  methods: {
    // mengatur warna panah persentase
    getColor(panah) {
      if (panah === 'mdi-arrow-up-thick') return 'green'
      else return 'red'
    },
  },
}
</script>
