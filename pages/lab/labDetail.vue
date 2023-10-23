<template>
  <v-dialog v-model="dialog" max-width="500px" scrollable persistent>
    <v-card>
      <v-card-title class="pa-0">
        <v-toolbar flat color="softgreen" class="rounded-t pa-1">
          <span>Detail Data Laboratorium</span>
          <v-spacer></v-spacer>
          <v-btn fab small depressed color="softgreen" @click="close">
            <v-icon color="#606060">mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
      </v-card-title>
      <v-divider></v-divider>

      <!-- menampilkan data pada card detail rumah sakit -->
      <v-card-text class="pt-4">
        <v-container>
          <v-row>
            <v-list v-if="detailItem" class="px-4" flat>
              <v-list-item>
                <v-list-item-icon class="mr-3">
                  <v-icon large>mdi-check-circle-outline</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-subtitle class="text-big"
                    ><span class="custom-primary">
                      Kode :</span
                    ></v-list-item-subtitle
                  >
                  <h3
                    class="font-weight-thin text-big"
                    v-text="detailItem.kode"
                  ></h3>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-icon class="mr-3">
                  <v-icon large>mdi-account-outline</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-subtitle class="text-big"
                    ><span class="custom-primary">
                      Nama :</span
                    ></v-list-item-subtitle
                  >
                  <h3
                    class="font-weight-thin text-big"
                    v-text="detailItem.nama"
                  ></h3>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-icon class="mr-3">
                  <v-icon large>mdi-hospital-building</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-subtitle class="text-big"
                    ><span class="custom-primary">
                      Rumah Sakit:</span
                    ></v-list-item-subtitle
                  >
                  <h3
                    class="text-big font-weight-thin"
                    v-text="detailItem.rumah_sakit.nama"
                  ></h3>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-icon class="mr-3">
                  <v-icon large>mdi-file-check</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-subtitle class="text-big"
                    ><span class="custom-primary">
                      Status:</span
                    ></v-list-item-subtitle
                  >
                  <h3 class="font-weight-thin pb-1">
                    <v-chip
                      small
                      class="py-2"
                      outlined
                      :color="getColor(detailItem.status)"
                      dark
                    >
                      {{ detailItem.status ? 'Active' : 'Inactive' }}
                    </v-chip>
                  </h3>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'LabDetail',
  components: {},
  data: () => ({
    dialog: false,
    // detail data dalam tabel
    detailItem: {
      no: '',
      kode: '',
      nama: '',
      rumah_sakit: '',
      status: '',
    },
  }),
  methods: {
    // membuka card
    open(item) {
      this.dialog = true
      this.detailItem = Object.assign({}, item)
    },
    // menutup card
    close() {
      this.dialog = false
    },
    // mengatur warna pada status
    getColor(status) {
      if (status === true) return 'primary'
      else return 'red'
    },
  },
}
</script>

<style scoped></style>
