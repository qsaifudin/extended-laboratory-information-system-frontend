<template>
  <v-data-table
    :headers="headers"
    :items="vendor"
    :search="search"
    sort-by="id"
    :sort-desc="sortDesc"
    :page="page"
    :options.sync="options"
    :server-items-length="totalVendor"
    :page-count="numberOfPages"
    class="custom-table"
    loading
    :footer-props="{
      showFirstLastPage: true,
      firstIcon: 'mdi-arrow-collapse-left',
      lastIcon: 'mdi-arrow-collapse-right',
    }"
  >
    <!-- menampilkan loading -->
    <v-progress-linear
      v-show="progressBar"
      slot="progress"
      color="primary"
      indeterminate
      rounded
      height="2"
      absolute
    ></v-progress-linear>
    <template #[`item.index`]="{ index }"> {{ index + number }} </template>
    <template #[`item.status`]="{ item }">
      <v-chip x-small class="py-2" outlined :color="getColor(item.status)">
        <b>{{ item.status ? 'Active' : 'Inactive' }}</b>
      </v-chip>
    </template>
    <template #top>
      <v-toolbar flat color="softgreen" class="rounded-t-xl pa-1">
        <v-toolbar-title>Vendor</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <!-- menampilkan search -->
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Cari Nama Vendor"
          single-line
          hide-details
          dense
          outlined
          class="elevation-0"
          color="primary"
          @keyup="getDataVendor($event)"
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-dialog
          v-model="dialog"
          max-width="500px"
          scrollable
          persistent
          @keydown.enter="save()"
        >
          <!-- menampilkan button tambah data -->
          <template #activator="{ on, attrs }">
            <v-btn
              color="custom-gradient-green"
              dark
              v-bind="attrs"
              elevation="0"
              v-on="on"
              @click="getProvinsi"
            >
              <v-icon left dark> mdi-plus </v-icon>
              Tambah Data
            </v-btn>
          </template>
          <v-form ref="form" v-model="valid">
            <v-card>
              <v-card-title class="pa-0">
                <v-toolbar flat color="softgreen">
                  <v-toolbar-title>{{ formTitle }}</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-btn fab small depressed color="softgreen" @click="close">
                    <v-icon color="#606060">mdi-close</v-icon>
                  </v-btn>
                </v-toolbar>
              </v-card-title>
              <v-divider></v-divider>
              <div>
                <!-- menampilkan loading di card -->
                <v-progress-linear
                  v-show="progressBarCard"
                  indeterminate
                  height="5"
                  absolute
                ></v-progress-linear>
              </div>
              <v-card-text class="pt-4">
                <v-container>
                  <v-row>
                    <v-col cols="12" class="pb-0">
                      <v-text-field
                        v-model="editedItem.nama"
                        clearable
                        :rules="nameRules"
                        dense
                        outlined
                        label="Nama Vendor"
                      ></v-text-field>
                    </v-col>
                    <v-col class="d-flex pb-1" cols="12">
                      <v-autocomplete
                        v-model="editedItem.provinsi_id"
                        clearable
                        :items="provinsi"
                        :rules="provinsiRules"
                        item-text="nama"
                        item-value="id"
                        label="Provinsi"
                        dense
                        outlined
                        @change="getKotaByProvinsi"
                      ></v-autocomplete>
                    </v-col>
                    <v-col class="d-flex pb-0" cols="12">
                      <v-autocomplete
                        v-model="editedItem.kota_id"
                        clearable
                        :items="namaKota"
                        item-text="nama"
                        item-value="id"
                        :rules="kotaRules"
                        label="Kota"
                        dense
                        outlined
                      ></v-autocomplete>
                    </v-col>
                    <v-col cols="12" class="pb-0">
                      <v-sheet class="pl-3">
                        Status
                        <v-switch
                          v-model="editedItem.status"
                          inset
                          :label="`${
                            editedItem.status ? 'Active' : 'Inactive'
                          }`"
                        ></v-switch>
                      </v-sheet>
                    </v-col>
                    <v-col
                      v-if="errMessage != ''"
                      class="d-flex justify-center"
                    >
                      <div
                        class="
                          pa-4
                          text-center
                          red
                          lighten-5
                          rounded-lg
                          red--text
                        "
                      >
                        <p>
                          {{ errMessage }}
                        </p>
                        {{ errDeskripsi }}
                      </div>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions class="action">
                <v-spacer></v-spacer>
                <v-btn
                  :disabled="!valid"
                  color="success"
                  large
                  elevation="0"
                  class="ma-1 pr-12 pl-12"
                  @click="save"
                >
                  Simpan
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-form>
        </v-dialog>
        <vendor-detail ref="vendorDetail"></vendor-detail>
      </v-toolbar>
    </template>
    <template #[`item.actions`]="{ item }">
      <div justify="space-around">
        <!-- button detail item -->
        <v-btn elevation="0" x-small class="my-2 pa-3" color="primary" dark>
          <v-icon small dark @click="getDetailItem(item)"> mdi-eye </v-icon>
        </v-btn>
        <!-- button edit item -->
        <v-btn
          elevation="0"
          x-small
          class="my-2 pa-3 ml-2 elevation-4 transparent"
          color="amber"
          dark
        >
          <v-icon small dark @click="editItem(item)"> mdi-pencil </v-icon>
        </v-btn>
      </div>
    </template>
  </v-data-table>
</template>

<script>
import vendorDetail from '~/pages/vendor/vendorDetail'
export default {
  components: { vendorDetail },
  middleware: 'isAdmin',
  data: () => ({
    number: '',
    provinsi: [],
    namaKota: [],
    status: true,
    dialog: false,
    search: '',
    // rules untuk required field
    nameRules: [(v) => !!v || 'Name is required'],
    provinsiRules: [(v) => !!v || 'Provinsi is required'],
    kotaRules: [(v) => !!v || 'Kota is required'],
    statusRules: [(v) => !!v || 'Status is required'],
    // menampilkan data di tabel rumah sakit
    headers: [
      { text: 'No', value: 'index', sortable: false, width: '6%' },
      {
        text: 'Vendor',
        align: 'start',
        value: 'nama',
      },
      { text: 'Provinsi', value: 'provinsi.nama', sortable: false },
      { text: 'Kota', value: 'kota.nama', sortable: false },
      { text: 'Status', value: 'status' },
      { text: 'Actions', value: 'actions', sortable: false, width: '150px' },
    ],
    vendor: [],
    editedIndex: -1,
    editedItem: {
      no: '',
      nama: '',
      provinsi: '',
      namaKota: '',
      status: true,
    },

    page: 1,
    totalVendor: 0,
    numberOfPages: 0,
    options: {},

    sortDesc: true,
    progressBar: true,
    progressBarCard: false,

    valid: true,
    errMessage: '',
    errDeskripsi: '',
  }),

  computed: {
    // mengatur judul untuk card popup
    formTitle() {
      return this.editedIndex === -1 ? 'Tambah Data Vendor' : 'Edit Data Vendor'
    },
  },

  watch: {
    dialog(val) {
      val || this.close()
    },

    options: {
      handler() {
        this.getDataVendor()
      },
    },
    deep: true,
  },

  methods: {
    // mengambil data provinsi dari API
    getProvinsi(item) {
      this.$axios.$get('/api/wilayah/provinsi/').then((res) => {
        this.provinsi = res.data
      })
      this.editedItem.status = true
    },
    // mengambil data kota berdasarkan id provinsi
    getKotaByProvinsi(item) {
      this.$axios.$get(`/api/wilayah/kota/atProvinsi/${item}`).then((res) => {
        this.namaKota = res.data
      })
    },
    // mengatur warna pada status
    getColor(status) {
      if (status === true) return 'primary'
      else return 'red'
    },

    // menampilkan detail untuk data vendor
    getDetailItem(item) {
      this.$axios.get(`api/vendor/${item.id}`).then((res) => {
        item = res.data.data
        this.$refs.vendorDetail.open(item)
      })
    },

    // method untuk edit data vendor
    editItem(item) {
      this.$axios.$get(`/api/wilayah/provinsi/`).then((res) => {
        this.provinsi = res.data
      })
      this.getKotaByProvinsi(item.provinsi_id)
      this.editedIndex = this.vendor.indexOf(item)
      this.editedItem = ''
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.$refs.form.reset()
        this.editedIndex = -1
        this.$refs.form.resetValidation()
        this.errMessage = ''
        this.errDeskripsi = ''
        this.editedItem = Object.assign({}, '')
        this.progressBarCard = false
      })
    },

    // menangkap error
    catchError(err) {
      this.errMessage = err.data.message
      this.errDeskripsi = err.data.deskripsi
      this.valid = true
      this.progressBarCard = false
    },

    save() {
      if (this.$refs.form.validate()) {
        this.valid = false
        this.progressBarCard = true
        if (this.editedIndex > -1) {
          this.$axios
            .patch(`api/vendor/${this.editedItem.id}`, this.editedItem)
            .then(() => {
              this.close()
              this.getDataVendor()
              this.valid = true
              this.$toast.success('Berhasil update data')
            })
            .catch(({ response: err }) => {
              this.catchError(err)
            })
        } else {
          this.$axios
            .post(`api/vendor/`, this.editedItem)
            .then(() => {
              this.close()
              this.getDataVendor()
              this.valid = true
              this.$toast.success('Berhasil menyimpan data')
            })
            .catch(({ response: err }) => {
              this.catchError(err)
            })
        }
      }
    },

    // mendapatkan data vendor berdasarkan pagination per page
    getDataVendor(e) {
      const sortBy =
        this.options.sortBy[0] === undefined ? 'id' : this.options.sortBy[0]
      const sortDesc =
        this.options.sortDesc[0] === undefined ? true : this.options.sortDesc[0]
      this.progressBar = true

      const { itemsPerPage } = this.options
      const page = e ? 1 : this.options.page

      this.number = itemsPerPage * (page - 1) + 1
      this.$axios
        .get(
          '/api/vendor/onSearchPaginated?nama=' +
            this.search +
            '&page=' +
            page +
            '&limit=' +
            itemsPerPage +
            '&sortBy=' +
            sortBy +
            '&sortDesc=' +
            sortDesc
        )
        .then((res) => {
          const { data, total, totalPages } = res.data
          this.vendor = data
          this.totalVendor = total
          this.numberOfPages = totalPages
          this.progressBar = false
        })
        .catch((err) => {
          console.log(err)
        })
    },
  },
}
</script>
