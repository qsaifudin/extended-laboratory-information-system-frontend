<template>
  <v-data-table
    :headers="headers"
    :items="rumkit"
    :search="search"
    sort-by="id"
    :sort-desc="sortDesc"
    :page="page"
    :options.sync="options"
    :server-items-length="totalRumkit"
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
        <v-toolbar-title>Rumah Sakit</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <!-- menampilkan search -->
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Cari Nama Rumah Sakit"
          single-line
          hide-details
          dense
          outlined
          class="elevation-0"
          color="primary"
          @keyup="getDataRS($event)"
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-dialog
          v-model="dialog"
          persistent
          scrollable
          max-width="1000px"
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
              @click="getDataCreate"
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
                    <v-col cols="12" sm="12" md="6" class="pb-0">
                      <v-col cols="12" class="pb-0">
                        <v-text-field
                          v-model="editedItem.kode"
                          clearable
                          :rules="kodeRules"
                          label="Kode Rumah Sakit"
                          required
                          outlined
                          dense
                          @keydown.space.prevent
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" class="pb-0">
                        <v-text-field
                          v-model="editedItem.nama"
                          clearable
                          :rules="nameRules"
                          required
                          label="Nama Rumah Sakit"
                          outlined
                          dense
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" class="pb-0">
                        <v-autocomplete
                          v-model="editedItem.kategori_id"
                          clearable
                          :items="kategori"
                          item-text="nama"
                          item-value="id"
                          :rules="kategoriRules"
                          label="Kategori Rumah Sakit"
                          outlined
                          dense
                        ></v-autocomplete>
                      </v-col>
                      <v-col cols="12" class="pb-0">
                        <v-autocomplete
                          v-model="editedItem.vendor_id"
                          clearable
                          :items="vendor"
                          item-text="nama"
                          item-value="id"
                          :rules="vendorRules"
                          label="Nama Vendor"
                          outlined
                          dense
                        ></v-autocomplete>
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
                          <!-- menampilkan error handling -->
                          <p>
                            {{ errMessage }}
                          </p>
                          {{ errDeskripsi }}
                        </div>
                      </v-col>
                    </v-col>
                    <v-divider vertical></v-divider>
                    <v-col cols="12" sm="12" md="6" class="pb-0">
                      <v-col cols="12" class="pb-0">
                        <v-autocomplete
                          v-model="editedItem.provinsi_id"
                          clearable
                          :items="provinsi"
                          :rules="provinsiRules"
                          item-text="nama"
                          item-value="id"
                          label="Provinsi"
                          required
                          outlined
                          dense
                          @change="getKotaByProvinsi"
                        ></v-autocomplete>
                      </v-col>
                      <v-col cols="12" class="pb-0">
                        <v-autocomplete
                          v-model="editedItem.kota_id"
                          clearable
                          :items="namaKota"
                          item-text="nama"
                          item-value="id"
                          :rules="kotaRules"
                          label="Kota"
                          outlined
                          dense
                          @change="getKecamatanByKota"
                        ></v-autocomplete>
                      </v-col>
                      <v-col cols="12" class="pb-0">
                        <v-autocomplete
                          v-model="editedItem.kecamatan_id"
                          clearable
                          :items="kecamatan"
                          item-text="nama"
                          item-value="id"
                          :rules="kecamatanRules"
                          label="Kecamatan"
                          outlined
                          dense
                        ></v-autocomplete>
                      </v-col>
                      <v-col cols="12" class="pb-0">
                        <v-textarea
                          v-model="editedItem.alamat"
                          clearable
                          :rules="alamatRules"
                          label="Alamat"
                          rows="2"
                          outlined
                          dense
                        ></v-textarea>
                      </v-col>
                      <v-col cols="12" class="pt-0 pb-0">
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
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions class="action">
                <v-spacer></v-spacer>
                <v-btn
                  :disabled="!valid"
                  color="primary"
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
        <rumkit-detail ref="rumkitDetail"></rumkit-detail>
      </v-toolbar>
    </template>
    <template #[`item.actions`]="{ item }">
      <div justify="space-around">
        <!-- button detail item -->
        <v-btn elevation="0" x-small class="my-2 pa-3" color="primary" dark>
          <v-icon small @click="detailItem(item)"> mdi-eye </v-icon>
        </v-btn>
        <!-- button edit item -->
        <v-btn
          elevation="0"
          x-small
          class="my-2 pa-3 ml-2 elevation-4 transparent"
          color="amber"
          dark
        >
          <v-icon small @click="editItem(item)"> mdi-pencil </v-icon>
        </v-btn>
      </div>
    </template>
  </v-data-table>
</template>

<script>
import rumkitDetail from '~/pages/rs/rumkitDetail'
export default {
  components: { rumkitDetail },
  middleware: 'isAdmin',
  data: () => ({
    provinsi: [],
    namaKota: [],
    kecamatan: [],
    vendor: [],
    kategori: [],
    status: false,
    dialog: false,
    search: '',
    // rules untuk required field
    kodeRules: [(v) => !!v || 'Kode is required'],
    nameRules: [(v) => !!v || 'Name is required'],
    provinsiRules: [(v) => !!v || 'Provinsi is required'],
    kotaRules: [(v) => !!v || 'Kota is required'],
    kecamatanRules: [(v) => !!v || 'Kecamatan is required'],
    alamatRules: [(v) => !!v || 'Alamat is required'],
    vendorRules: [(v) => !!v || 'Vendor is required'],
    kategoriRules: [(v) => !!v || 'Kategori is required'],
    statusRules: [(v) => !!v || 'Status is required'],
    // menampilkan data di tabel rumah sakit
    headers: [
      { text: 'No', value: 'index', sortable: false, width: '6%' },
      { text: 'Kode', value: 'kode' },
      {
        text: 'Rumah Sakit',
        align: 'start',
        value: 'nama',
      },
      { text: 'Kota', value: 'kota.nama', sortable: false },
      { text: 'Status', value: 'status' },
      { text: 'Actions', value: 'actions', sortable: false, width: '150px' },
    ],
    rumkit: [],
    editedIndex: -1,
    editedItem: {
      no: '',
      kode: '',
      nama: '',
      provinsi: '',
      namaKota: '',
      kecamatan: '',
      alamat: '',
      vendor: '',
      kategori: '',
      status: false,
    },

    page: 1,
    totalRumkit: 0,
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
      return this.editedIndex === -1
        ? 'Tambah Data Rumah Sakit'
        : 'Edit Data Rumah Sakit'
    },
  },

  watch: {
    dialog(val) {
      val || this.close()
    },

    options: {
      handler() {
        this.getDataRS()
      },
    },
    deep: true,
  },

  methods: {
    // mengambil data dari API untuk card create data
    getDataCreate(item) {
      this.$axios.$get('/api/wilayah/provinsi/').then((res) => {
        this.provinsi = res.data
      })
      this.$axios.$get('/api/kategoriRs/').then((res) => {
        this.kategori = res.data
      })

      this.$axios.$get('/api/vendor').then((res) => {
        this.vendor = res.data
      })
      this.editedItem.status = true
    },
    // mengambil data kecamatan berdasarkan id kota
    getKecamatanByKota(item) {
      this.$axios.$get(`/api/wilayah/kecamatan/atKota/${item}`).then((res) => {
        this.kecamatan = res.data
      })
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
    // menampilkan detail untuk data rumah sakit
    detailItem(item) {
      this.$axios.get(`api/rumahsakit/${item.id}`).then((res) => {
        item = res.data.data
        this.$refs.rumkitDetail.open(item)
      })
    },

    // method untuk edit data rumah sakit
    editItem(item) {
      this.getDataCreate(item)
      this.getKotaByProvinsi(item.provinsi_id)
      this.getKecamatanByKota(item.kota_id)
      this.editedIndex = this.rumkit.indexOf(item)
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
        this.progressBarCard = false
        this.editedItem = Object.assign({}, '')
      })
      this.editedItem.status = false
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
            .patch(`api/rumahsakit/${this.editedItem.id}`, this.editedItem)
            .then(() => {
              this.close()
              this.getDataRS()
              this.valid = true
              this.$toast.success('Berhasil update data')
            })
            .catch(({ response: err }) => {
              this.catchError(err)
            })
        } else {
          this.$axios
            .post(`api/rumahsakit/`, this.editedItem)
            .then(() => {
              this.close()
              this.getDataRS()
              this.valid = true
              this.$toast.success('Berhasil menyimpan data')
            })
            .catch(({ response: err }) => {
              this.catchError(err)
            })
        }
      }
    },

    // mendapatkan data rumah sakit berdasarkan pagination per page
    getDataRS(e) {
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
          '/api/rumahsakit/onSearchPaginated?nama=' +
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
          this.rumkit = data
          this.totalRumkit = total
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
