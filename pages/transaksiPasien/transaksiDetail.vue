<template>
  <div>
    <v-dialog v-model="dialog" scrollable persistent fullscreen>
      <v-card>
        <v-card-title class="pa-0">
          <v-toolbar flat color="softgreen" class="rounded-t pa-1">
            <span>Detail Data Transaksi Pasien</span>
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
              <v-col cols="12" sm="12" md="4" class="pt-0">
                <v-list-item class="pt-0">
                  <v-list-item-icon>
                    <v-icon>mdi-account-outline</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-subtitle class="text-big custom-primary"
                      >Nama:</v-list-item-subtitle
                    >
                    <h3
                      class="text-big font-weight-thin"
                      v-text="detailItem.nama"
                    ></h3>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-check-circle-outline</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-subtitle class="text-big custom-primary"
                      >No.Lab:
                    </v-list-item-subtitle>
                    <h3
                      class="text-big font-weight-thin"
                      v-text="detailItem.no_lab"
                    ></h3>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item class="pt-0">
                  <v-list-item-icon>
                    <v-icon> mdi-numeric-1-box-multiple-outline</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-subtitle class="text-big custom-primary"
                      >No.Registrasi:
                    </v-list-item-subtitle>
                    <h3
                      class="text-big font-weight-thin"
                      v-text="detailItem.no_reg"
                    ></h3>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item class="pt-0">
                  <v-list-item-icon>
                    <v-icon>mdi-numeric</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-subtitle class="text-big custom-primary"
                      >No.RM:
                    </v-list-item-subtitle>
                    <h3
                      class="text-big font-weight-thin"
                      v-text="detailItem.no_rm"
                    ></h3>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-card-account-details-outline</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-subtitle class="text-big custom-primary"
                      >NIK:</v-list-item-subtitle
                    >
                    <h3
                      class="text-big font-weight-thin"
                      v-text="detailItem.nik"
                    ></h3>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-gender-male-female</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-subtitle class="text-big custom-primary"
                      >Gender:</v-list-item-subtitle
                    >
                    <h3
                      class="text-big font-weight-thin"
                      v-text="detailItem.gender"
                    ></h3>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-home</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-subtitle class="text-big custom-primary"
                      >Alamat:</v-list-item-subtitle
                    >
                    <h3
                      class="text-big font-weight-thin"
                      v-text="detailItem.alamat"
                    ></h3>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-map-marker</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-subtitle class="text-big custom-primary">
                      Provinsi:
                    </v-list-item-subtitle>
                    <h3
                      class="text-big font-weight-thin"
                      v-text="detailItem.provinsi"
                    ></h3>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-city</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-subtitle class="text-big custom-primary">
                      Kota:</v-list-item-subtitle
                    >
                    <h3
                      class="text-big font-weight-thin"
                      v-text="detailItem.kota"
                    ></h3>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-office-building-marker</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-subtitle class="text-big custom-primary">
                      Kecamatan:</v-list-item-subtitle
                    >
                    <h3
                      class="text-big font-weight-thin"
                      v-text="detailItem.kecamatan"
                    ></h3>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-file-check-outline</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-subtitle class="text-big custom-primary"
                      >Registrasi ID:</v-list-item-subtitle
                    >
                    <h3
                      class="text-big font-weight-thin"
                      v-text="detailItem.registrasi_id"
                    ></h3>
                  </v-list-item-content>
                </v-list-item>
              </v-col>

              <v-col cols="12" sm="12" md="4" class="pt-0">
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-clipboard-plus-outline</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-subtitle class="text-big custom-primary"
                      >Diagnosa Awal:</v-list-item-subtitle
                    >
                    <h3
                      class="text-big font-weight-thin"
                      v-text="detailItem.diagnosa_awal"
                    ></h3>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-content-paste</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-subtitle class="text-big custom-primary"
                      >ICDT:</v-list-item-subtitle
                    >
                    <h3
                      class="text-big font-weight-thin"
                      v-text="detailItem.icdt"
                    ></h3>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-account-multiple-outline</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-subtitle class="text-big custom-primary"
                      >Penjamin:</v-list-item-subtitle
                    >
                    <h3
                      class="text-big font-weight-thin"
                      v-text="detailItem.penjamin"
                    ></h3>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-office-building-marker-outline</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-subtitle class="text-big custom-primary"
                      >Unit Asal:</v-list-item-subtitle
                    >
                    <h3
                      class="text-big font-weight-thin"
                      v-text="detailItem.unit_asal"
                    ></h3>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-doctor</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-subtitle class="text-big custom-primary"
                      >Dokter Pengirim:</v-list-item-subtitle
                    >
                    <h3
                      class="text-big font-weight-thin"
                      v-text="detailItem.dokter_pengirim"
                    ></h3>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-calendar-blank</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-subtitle class="text-big custom-primary"
                      >Usia Hari:</v-list-item-subtitle
                    >
                    <h3
                      class="text-big font-weight-thin"
                      v-text="detailItem.usia_hari"
                    ></h3>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-calendar-month-outline</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-subtitle class="text-big custom-primary"
                      >Usia Bulan:</v-list-item-subtitle
                    >
                    <h3
                      class="text-big font-weight-thin"
                      v-text="detailItem.usia_bulan"
                    ></h3>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-calendar-range-outline</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-subtitle class="text-big custom-primary"
                      >Usia Tahun:</v-list-item-subtitle
                    >
                    <h3
                      class="text-big font-weight-thin"
                      v-text="detailItem.usia_tahun"
                    ></h3>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-hospital-building</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-subtitle class="text-big custom-primary"
                      >Kode RS:</v-list-item-subtitle
                    >
                    <h3
                      class="text-big font-weight-thin"
                      v-text="detailItem.kode_rs"
                    ></h3>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-flask-outline</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-subtitle class="text-big custom-primary"
                      >Kode Laboratorium:</v-list-item-subtitle
                    >
                    <h3
                      class="text-big font-weight-thin"
                      v-text="detailItem.kode_lab"
                    ></h3>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
              <v-divider vertical></v-divider>

              <v-col cols="12" sm="12" md="4" class="pt-0">
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-clipboard-clock-outline</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-subtitle class="text-big custom-primary"
                      >Waktu Registrasi:</v-list-item-subtitle
                    >
                    <h3
                      class="text-big font-weight-thin"
                      v-text="detailItem.waktu_registrasi"
                    ></h3>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-calendar-clock</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-subtitle class="text-big custom-primary"
                      >Waktu Check In:</v-list-item-subtitle
                    >
                    <h3
                      class="text-big font-weight-thin"
                      v-text="detailItem.waktu_checkin"
                    ></h3>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-clock-check-outline</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-subtitle class="text-big custom-primary"
                      >Waktu Terbit:</v-list-item-subtitle
                    >
                    <h3
                      class="text-big font-weight-thin"
                      v-text="detailItem.waktu_terbit"
                    ></h3>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-file-check</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-subtitle class="text-big custom-primary"
                      >Pemeriksaan:</v-list-item-subtitle
                    >
                    <h3>
                      <div
                        v-for="(item, index) in detailItem.pemeriksaan"
                        :key="item.id"
                      >
                        <h3 class="text-big font-weight-thin pt-2">
                          {{ index + 1 }}. {{ item.nama }}
                        </h3>
                      </div>
                    </h3>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
            </v-row>
          </v-list>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'TransaksiDetail',
  components: {},
  data: () => ({
    dialog: false,
    // detail data dalam tabel
    detailItem: {
      pemeriksaan: '',
    },
  }),
  methods: {
    // membuka card
    open(item) {
      this.dialog = true
      this.detailItem = Object.assign({}, item)
    },
    // membuka card
    close() {
      this.dialog = false
    },
  },
}
</script>

<style scoped></style>
