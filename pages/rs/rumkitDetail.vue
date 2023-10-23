<template>
  <v-dialog v-model="dialog" persistent scrollable max-width="1000px">
    <v-card>
      <v-card-title class="pa-0">
        <v-toolbar flat color="softgreen" class="rounded-t pa-1">
          <span>Detail Data Rumah Sakit</span>
          <v-spacer></v-spacer>
          <v-btn fab small depressed color="softgreen" @click="close">
            <v-icon color="#606060">mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
      </v-card-title>
      <v-divider></v-divider>

      <!-- menampilkan data pada card detail rumah sakit -->
      <v-card-text class="pt-4">
        <v-list v-if="detailItem" class="px-4" flat>
          <v-row>
            <v-col cols="12" sm="12" md="6" class="pt-0">
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
                    class="text-big font-weight-thin"
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
                    class="text-big font-weight-thin"
                    v-text="detailItem.nama"
                  ></h3>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-icon class="mr-3">
                  <v-icon large>mdi-ballot-outline</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-subtitle class="text-big"
                    ><span class="custom-primary">
                      Kategori RS:</span
                    ></v-list-item-subtitle
                  >
                  <h3
                    class="text-big font-weight-thin"
                    v-text="detailItem.kategori_rs.nama"
                  ></h3>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-icon class="mr-3">
                  <v-icon large>mdi-account-group</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-subtitle class="text-big"
                    ><span class="custom-primary">
                      Vendor:</span
                    ></v-list-item-subtitle
                  >
                  <h3
                    class="text-big font-weight-thin"
                    v-text="detailItem.vendor.nama"
                  ></h3>
                </v-list-item-content>
              </v-list-item>
            </v-col>

            <v-col cols="12" sm="12" md="6" class="pt-0">
              <v-list-item>
                <v-list-item-icon class="mr-3">
                  <v-icon large>mdi-map-marker</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-subtitle class="text-big"
                    ><span class="custom-primary">
                      Provinsi:</span
                    ></v-list-item-subtitle
                  >
                  <h3
                    class="text-big font-weight-thin"
                    v-text="detailItem.provinsi.nama"
                  ></h3>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-icon class="mr-3">
                  <v-icon large>mdi-city</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-subtitle class="text-big"
                    ><span class="custom-primary">
                      Kota:</span
                    ></v-list-item-subtitle
                  >
                  <h3
                    class="text-big font-weight-thin"
                    v-text="detailItem.kota.nama"
                  ></h3>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-icon class="mr-3">
                  <v-icon large>mdi-office-building-marker</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-subtitle class="text-big"
                    ><span class="custom-primary">
                      Kecamatan:</span
                    ></v-list-item-subtitle
                  >
                  <h3
                    class="text-big font-weight-thin"
                    v-text="detailItem.kecamatan.nama"
                  ></h3>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-icon class="mr-3">
                  <v-icon large>mdi-home</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-subtitle class="text-big"
                    ><span class="custom-primary">
                      Alamat:</span
                    ></v-list-item-subtitle
                  >
                  <h3
                    class="text-big font-weight-thin"
                    v-text="detailItem.alamat"
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
                  <div class="pb-1">
                    <v-chip
                      small
                      class="py-2"
                      outlined
                      :color="getColor(detailItem.status)"
                      dark
                    >
                      {{ detailItem.status ? 'Active' : 'Inactive' }}
                    </v-chip>
                  </div>
                </v-list-item-content>
              </v-list-item>
            </v-col>
          </v-row>
        </v-list>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'RumkitDetail',
  components: {},
  data: () => ({
    dialog: false,
    // detail data dalam tabel
    detailItem: {
      no: '',
      kode: '',
      nama: '',
      provinsi: '',
      kota: '',
      kecamatan: '',
      alamat: '',
      vendor: '',
      kategori_rs: '',
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
