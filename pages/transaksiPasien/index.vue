<template>
  <v-data-table
    :headers="headers"
    :items="transaksiPasien"
    :search="search"
    sort-by="id"
    :sort-desc="sortDesc"
    :page="page"
    :options.sync="options"
    :server-items-length="totalTransaksi"
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
    <template #top>
      <v-toolbar flat color="softgreen" class="rounded-t-xl pa-1">
        <v-toolbar-title>Transaksi Pasien</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <!-- menampilkan field search -->
        <v-col cols="4" class="pa-0 pr-3">
          <v-text-field
            ref="filterSearch"
            v-model="search"
            append-icon="mdi-magnify"
            label="Cari Nama Pasien"
            single-line
            hide-details
            dense
            outlined
            class="elevation-0"
            color="primary"
            @keyup="getDataTransaksi($event)"
          ></v-text-field>
        </v-col>

        <!-- Filter Periode -->
        <v-col class="pa-0 d-flex">
          <v-menu
            ref="datesFilter"
            v-model="datesFilter"
            :close-on-content-click="false"
            :nudge-right="40"
            :return-value.sync="dates"
            transition="scale-transition"
            min-width="290px"
            offset-y
            class="pl-0"
          >
            <template #activator="{ on, attrs }">
              <v-text-field
                v-model="dateRangeText"
                label="Filter Date"
                prepend-inner-icon="mdi-calendar"
                dense
                readonly
                outlined
                hide-details
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="dates" range no-title>
              <v-btn text color="primary" @click="getDataByDate([])"
                >Clear
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="datesFilter = false">
                Cancel
              </v-btn>
              <v-btn text color="primary" @click="getDataByDate(dates)">
                OK
              </v-btn>
            </v-date-picker>
          </v-menu>
          <div class="flex-grow-1"></div>

          <!-- Fitur Export -->
          <div class="pl-3">
            <downloadexcel
              :fetch="exportToExcel"
              :fields="dataExportField"
              name="transaksi-pasien.xls"
            >
              <v-btn color="custom-gradient-green" dark elevation="0">
                <v-icon left dark> mdi-microsoft-excel </v-icon>
                Export to Excel
              </v-btn>
            </downloadexcel>
          </div>
        </v-col>

        <transaksi-detail ref="transaksiDetail"></transaksi-detail>
      </v-toolbar>
    </template>
    <template #[`item.actions`]="{ item }">
      <div justify="space-around">
        <v-btn x-small class="my-2 pa-3" elevation="0" color="primary" dark>
          <v-icon small dark @click="detailItem(item)"> mdi-eye </v-icon>
        </v-btn>
      </div>
    </template>
  </v-data-table>
</template>

<script>
import transaksiDetail from '~/pages/transaksiPasien/transaksiDetail'

export default {
  components: { transaksiDetail },
  // menampilkan data pada tabel transaksi pasien
  data: () => ({
    datesFilter: false,
    dates: [],

    headers: [
      { text: 'No', value: 'index', sortable: false, width: '6%' },
      { text: 'No.Lab', value: 'no_lab' },
      { text: 'No.RM', value: 'no_rm' },
      {
        text: 'Nama Pasien',
        align: 'start',
        sortable: true,
        value: 'nama',
      },
      { text: 'NIK', value: 'nik' },
      { text: 'Gender', value: 'gender' },
      { text: 'Actions', value: 'actions', sortable: false, width: '100px' },
    ],
    search: '',
    transaksi: [],
    transaksiPasien: [],
    page: 1,
    totalTransaksi: 0,
    numberOfPages: 0,
    options: {},
    sortDesc: true,

    // Data export
    dataExport: [],
    dataExportField: {
      'No Lab': 'no_lab',
      'No Reg': 'no_reg',
      'No Rm': 'no_rm',
      NIK: 'nik',
      Nama: 'nama',
      Provinsi: 'provinsi',
      Kota: 'kota',
      Kecamatan: 'kecamatan',
      Alamat: 'alamat',
      Gender: 'gender',
      'Usia Hari': 'usia_hari',
      'Usia Bulan': 'usia_bulan',
      'Usia Tahun': 'usia_tahun',
      'Diagnosa Awal': 'diagnosa_awal',
      ICDT: 'icdt',
      Penjamin: 'penjamin',
      'Unit Asal': 'unit_asal',
      'Dokter Pengirim': 'dokter_pengirim',
      'Waktu Registrasi': 'waktu_registrasi',
      'Waktu Checkin': 'waktu_checkin',
      'Waktu Terbit': 'waktu_terbit',
      'Kode RS': 'kode_rs',
      'Kode Lab': 'kode_lab',
      'Registrasi Id': 'registrasi_id',
      // Pemeriksaan: 'pemeriksaan',
      Pemeriksaan: {
        field: 'pemeriksaan',
        callback: (value) => {
          const macamPemeriksaan = []
          value.forEach((v) => {
            macamPemeriksaan.push(v.nama)
          })
          return macamPemeriksaan
        },
      },
    },

    dialog: false,

    progressBar: true,
  }),

  computed: {
    // mengatur judul untuk card popup
    formTitle() {
      return this.editedIndex === -1
        ? 'Transaksi Pasien Baru'
        : 'Edit Data Transaksi Pasien'
    },
    dateRangeText() {
      return this.dates.join(' ~ ')
    },
  },

  watch: {
    dialog(val) {
      val || this.close()
    },

    options: {
      handler() {
        this.getDataTransaksi()
      },
    },
    deep: true,
  },

  methods: {
    // menampilkan detail untuk transaksi pasien
    detailItem(item) {
      this.$axios.get(`api/transaksipasien/${item.id}`).then((res) => {
        item = res.data.data
        this.$refs.transaksiDetail.open(item)
      })
    },

    // method untuk edit data transaksi pasien
    editItem(item) {
      this.getTransaksiPasien()
      this.editedIndex = this.transaksiPasien.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    async exportToExcel() {
      this.progressBar = true
      const search = this.$refs.filterSearch.lazyValue
      await this.getDataTransaksi(search, this.dates, true)
      console.log(this.dataExport)
      return this.dataExport
    },

    getDataByDate(dates) {
      if (dates[1] === dates[0]) {
        dates.splice(dates[1], 1)
      }
      this.$refs.datesFilter.save(dates)
      const search = this.$refs.filterSearch.lazyValue
      this.getDataTransaksi(search, dates)
    },

    // mengambil data transaksi pasien dari API
    getTransaksiPasien() {
      this.$axios.$get('/api/transaksipasien/').then((res) => {
        this.transaksi = res
      })
    },

    // mendapatkan data transaksi pasien berdasarkan pagination per page
    async getDataTransaksi(e, filterDate = this.dates, isExport = false) {
      const sortBy =
        this.options.sortBy[0] === undefined ? 'id' : this.options.sortBy[0]
      const sortDesc =
        this.options.sortDesc[0] === undefined ? true : this.options.sortDesc[0]
      this.progressBar = true

      const { itemsPerPage } = this.options
      const page = e ? 1 : this.options.page

      this.number = itemsPerPage * (page - 1) + 1
      await this.$axios
        .get(
          '/api/transaksipasien/onSearchPaginated?nama=' +
            this.search +
            '&page=' +
            page +
            '&limit=' +
            itemsPerPage +
            '&sortBy=' +
            sortBy +
            '&sortDesc=' +
            sortDesc +
            '&dates=' +
            filterDate +
            '&isExport=' +
            isExport
        )
        .then((res) => {
          // Data table
          if (!isExport) {
            const { data, total, totalPages } = res.data
            this.transaksiPasien = data
            this.totalTransaksi = total
            this.numberOfPages = totalPages
          }

          // Data Export
          else {
            this.dataExport = res.data.data
          }
          this.progressBar = false
        })
        .catch((err) => {
          console.log(err)
        })
    },
  },

  close() {
    this.dialog = false
    this.$nextTick(() => {
      this.editedItem = Object.assign({}, this.defaultItem)
      this.editedIndex = -1
    })
  },
}
</script>
