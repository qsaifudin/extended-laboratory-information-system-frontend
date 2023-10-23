<template>
  <v-app class="d-flex pa-5 rounded-xl custom-box-shadow-soft">
    <v-container fluid class="px-0">
      <!-- Top Filter -->
      <v-row class="px-3 py-0" align="center">
        <div class="pr-3 v-toolbar__title">Dashboard</div>
        <v-divider vertical class="py-5"></v-divider>
        <v-col
          v-if="role == 'superadmin' || role == 'admin'"
          class="pa-3 py-0"
          cols="3"
        >
          <v-autocomplete
            ref="vendorFilter"
            clearable
            dense
            :items="vendor"
            item-text="nama"
            item-value="id"
            hide-details=""
            label="Pilih Vendor"
            prepend-inner-icon="mdi-magnify"
            outlined
            @change="getRs"
          ></v-autocomplete>
        </v-col>
        <v-col class="pa-0 pr-3" cols="3">
          <v-autocomplete
            ref="rsFilter"
            clearable
            dense
            :items="rumahSakit"
            item-text="nama"
            item-value="kode"
            hide-details=""
            label="Pilih Rumah Sakit"
            prepend-inner-icon="mdi-magnify"
            outlined
            @change="getAllData"
          ></v-autocomplete>
        </v-col>
        <v-col cols="3" class="pa-0 pl-0">
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
                v-model="dates"
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
            <v-date-picker v-model="dates" range no-title type="month">
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="datesFilter = false">
                Cancel
              </v-btn>
              <v-btn text color="primary" @click="getDataByDate(dates)">
                OK
              </v-btn>
            </v-date-picker>
          </v-menu>
        </v-col>
      </v-row>

      <!-- Keterangan RS & Vendor yang dipilih -->
      <div class="mt-5 pl-1">
        <div>Vendor : {{ selectedVendor }}</div>
        <div>
          RS : <b> {{ selectedRs }}</b>
        </div>
      </div>
    </v-container>
    <v-divider> </v-divider>
    <div>
      <v-progress-linear
        v-show="progressBar"
        color="primary"
        indeterminate
        rounded
        height="2"
        absolute
      ></v-progress-linear>
    </div>
    <v-container fluid class="px-0">
      <v-row class="pa-1">
        <v-col cols="12">
          <!-- Card total atas -->
          <v-row class="primary rounded pa-3">
            <v-col cols="3">
              <Card
                title="Pasien"
                subtitle="Pasien"
                icon="mdi-account-supervisor"
                :count="`${totalPasien}`"
                class=""
                color="white"
                :panah="`${upDownPasien}`"
                :persentase="`${persentasePasien}`"
                :keterangan="`${keterangan}`"
              />
            </v-col>

            <v-col cols="3">
              <Card
                title="Pemeriksaan"
                icon="mdi-stethoscope"
                :count="`${totalPemeriksaan}`"
                color="white"
                :panah="`${upDownPemeriksaan}`"
                :persentase="`${persentasePemeriksaan}`"
                :keterangan="`${keterangan}`"
              />
            </v-col>

            <v-col cols="3">
              <Card
                title="Pasien Laki-Laki"
                icon="mdi-gender-male"
                :count="`${totalPasienPerGender['Laki-laki'] || 0}`"
                color="white"
                :panah="`${upDownPria}`"
                :persentase="`${persentasePria}`"
                :keterangan="`${keterangan}`"
              />
            </v-col>

            <v-col cols="3">
              <Card
                title="Pasien Perempuan"
                subtitle="Perempuan"
                icon="mdi-gender-female"
                :count="`${totalPasienPerGender['Perempuan'] || 0}`"
                color="white"
                :panah="`${upDownWanita}`"
                :persentase="`${persentaseWanita}`"
                :keterangan="`${keterangan}`"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="8">
              <!-- Chart Demografi -->
              <v-card class="pa-3 pt-0 custom-box-shadow-soft">
                <v-form ref="filterDemografi">
                  <v-row no-gutters class="pa-2">
                    <v-col cols="4" class="pt-2">
                      <v-autocomplete
                        ref="provinsiFilter"
                        clearable
                        dense
                        :items="provinsi"
                        item-text="nama"
                        item-value="id"
                        hide-details=""
                        label="Filter Provinsi"
                        prepend-inner-icon="mdi-magnify"
                        @change="getDataByDemografi($event, 'provinsi')"
                      ></v-autocomplete>
                    </v-col>
                    <v-col cols="4" class="pt-2">
                      <v-autocomplete
                        ref="kotaFilter"
                        clearable
                        dense
                        :items="kota"
                        item-text="nama"
                        item-value="id"
                        hide-details=""
                        label="Filter Kota"
                        prepend-inner-icon="mdi-magnify"
                        @change="getDataByDemografi($event, 'kota')"
                      ></v-autocomplete>
                    </v-col>
                    <v-col cols="4" class="pt-2">
                      <v-autocomplete
                        ref="kecamatanFilter"
                        clearable
                        dense
                        :items="kecamatan"
                        item-text="nama"
                        item-value="id"
                        hide-details=""
                        label="Filter kecamatan"
                        prepend-inner-icon="mdi-magnify"
                        @change="getDataByDemografi($event, 'kecamatan')"
                      ></v-autocomplete>
                    </v-col>
                  </v-row>
                </v-form>
                <apexchart
                  :options="optionsDemografi"
                  :series="dataDemografi"
                  height="250"
                >
                </apexchart>
              </v-card>
              <br />

              <!-- Chart Kunjungan -->
              <v-card class="pa-3 pt-0 custom-box-shadow-soft">
                <apexchart
                  class="pt-2"
                  :options="optionsKunjungan"
                  :series="dataKunjungan"
                  height="250"
                >
                </apexchart>
              </v-card>
            </v-col>

            <!-- Card pemeriksaan per jenis -->
            <v-col cols="4" class="">
              <div class="custom-soft-green rounded pa-3">
                <small> <b>Total Pemeriksaan per Jenis </b> </small>
                <v-divider class="pa-1"></v-divider>
                <v-card-title
                  v-for="item in totalPemeriksaanPerNama"
                  :key="item.id"
                  class="pa-1"
                  ><small
                    ><b>{{ item.x }}</b></small
                  >
                  <v-spacer></v-spacer>
                  <v-chip fab small depressed color="light-purple">{{
                    item.y
                  }}</v-chip>
                  <v-progress-linear
                    :value="progressBarPemeriksaan(item.y)"
                  ></v-progress-linear>
                </v-card-title>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="8">
              <v-card class="pa-3 custom-box-shadow-soft">
                <div id="chart">
                  <apexchart
                    type="donut"
                    width="380"
                    :options="optionsDiagnosa"
                    :series="dataDiagnosa"
                  ></apexchart>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import Card from '~/components/base/Card.vue'

export default {
  components: {
    Card,
  },
  data: () => ({
    role: '',
    rumahSakit: [],
    vendor: [],
    selectedVendor: '',
    selectedRs: '',

    datesFilter: false,
    dates: [
      new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 7),
    ],

    keterangan: '%',
    upDownPasien: 'mdi-arrow-up-thick',
    upDownPemeriksaan: 'mdi-arrow-up-thick',
    upDownPria: 'mdi-arrow-up-thick',
    upDownWanita: 'mdi-arrow-up-thick',

    totalPasien: '',
    totalPemeriksaan: '',
    persentasePasien: '',
    persentasePemeriksaan: '',
    persentasePria: '',
    persentaseWanita: '',
    totalPemeriksaanPerNama: '',
    totalPasienPerGender: '',

    // Data chart demografi
    dataDemografi: [],
    optionsDemografi: {
      chart: {
        animations: {
          enabled: false,
        },
        type: 'bar',
        toolbar: {
          show: false,
        },
      },
      xaxis: {
        categories: [],
      },
      colors: ['#1565C0'],
      plotOptions: {
        bar: {
          borderRadius: 3,
        },
      },
      fill: {
        opacity: 1,
      },
      dataLabels: {
        enabled: false,
      },
      title: {
        text: 'Total Pasien per Wilayah',
        style: {
          fontFamily: 'customQuick',
          color: '#3a3a3a',
        },
      },
      noData: {
        text: 'No Data',
      },
    },
    categoriesDemografi: [],
    provinsi: [],
    kota: [],
    kecamatan: [],

    // Data chart kunjungan
    dataKunjungan: [],
    optionsKunjungan: {
      chart: {
        animations: {
          enabled: false,
        },
      },
      colors: ['#00BFA5'],
      dataLabels: {
        enabled: false,
      },
      title: {
        text: 'Total Pasien per Kunjungan',
        style: {
          fontFamily: 'customQuick',
          color: '#3a3a3a',
        },
      },
      noData: {
        text: 'No Data',
      },
    },

    // Data chart diagnosa
    dataDiagnosa: [],
    optionsDiagnosa: {
      title: {
        text: 'Total Pasien per Diagnosa',
        style: {
          fontFamily: 'customQuick',
          color: '#3a3a3a',
        },
      },
      chart: {
        animations: {
          enabled: false,
        },
      },
      dataLabels: {
        formatter(val, opts) {
          return opts.w.config.series[opts.seriesIndex]
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    },

    progressBar: false,
  }),

  mounted() {
    // Disable open dropdown filter by RS
    this.$refs.rsFilter.isFocused = false
    this.$refs.rsFilter.isMenuActive = false

    this.getAllData('all')

    const role = this.$auth.user.role.nama
    if (role === 'superadmin' || role === 'admin') {
      this.role = 'admin'
      this.getVendor()
      this.getRs('')
    } else if (role === 'vendor') {
      this.role = 'vendor'
      this.getRs('', this.$auth.user.vendor_id)
      this.getVendor(this.$auth.user.vendor_id)
    }
  },

  methods: {
    // mengambil data provinsi dari API
    getProvinsi() {
      this.$axios.$get('/api/wilayah/provinsi/').then((res) => {
        this.provinsi = res.data
      })
    },

    // mengambil data rumah sakit berdasarkan vendor
    getRs(item, cekVendor) {
      item = item || ''
      if (cekVendor === undefined) {
        this.$axios.get(`/api/rumahsakit?vendorId=${item}`).then((res) => {
          this.rumahSakit = res.data.data
        })
        if (item !== '') {
          this.$refs.rsFilter.isFocused = true
          this.$refs.rsFilter.isMenuActive = true
        }
      } else {
        this.$axios.get(`/api/rumahsakit?vendorId=${cekVendor}`).then((res) => {
          this.rumahSakit = res.data.data
        })
      }
    },

    // mengambil data vendor
    async getVendor(vendor = '') {
      await this.$axios.get(`/api/vendor/${vendor}`).then((res) => {
        this.vendor = res.data.data
        if (this.$auth.user.vendor_id > 0) {
          this.selectedVendor = res.data.data.nama
        }
      })
    },

    // mengambil data berdasarkan filter waktu
    getDataByDate(data) {
      this.$refs.datesFilter.save(data)
      const kodeRs = this.$refs.rsFilter.initialValue

      this.getAllData(kodeRs, data)
    },

    // mengambil data berdasarkan wilayah demografi
    getDataByDemografi(data, tipeDemografi) {
      this.progressBar = true
      const kodeRs = this.$refs.rsFilter.lazyValue || 'all'
      const provinsi = this.$refs.provinsiFilter.lazyValue || ''
      let kecamatan = this.$refs.kecamatanFilter.lazyValue || ''
      let kota = this.$refs.kotaFilter.lazyValue || ''
      if (tipeDemografi === 'provinsi') {
        kota = ''
        kecamatan = ''
      }
      if (tipeDemografi === 'kota') {
        kecamatan = ''
      }

      this.$axios
        .get(
          `api/dashboard?kode_rs=${kodeRs}&dates=${this.dates}&provinsi=${provinsi}&kota=${kota}&kecamatan=${kecamatan}`
        )
        .then((res) => {
          this.showDataRespone(res, data, tipeDemografi)
        })
    },

    setDemografiXTitle(data) {
      this.optionsDemografi = {
        xaxis: {
          categories: this.categoriesDemografi,
          title: {
            text: data,
            style: {
              fontFamily: 'customQuick',
              color: '#3a3a3a',
            },
          },
        },
      }
    },

    getAllData(data, dates = this.dates) {
      if (dates[1] === dates[0]) {
        dates.splice(dates[1], 1)
      }
      this.$refs.filterDemografi.reset()
      this.progressBar = true
      this.$axios
        .get(
          `api/dashboard?kode_rs=${
            data || 'all'
          }&dates=${dates}&provinsi=&kota=&kecamatan=`
        )
        .then((res) => {
          this.showDataRespone(res)
        })
    },

    showDataRespone(res, data, tipeDemografi = '') {
      const {
        selectedVendor,
        totalPasien,
        totalPemeriksaan,
        totalPasienPerGender,
        totalPasienPerWilayah,
        totalPasienPerPeriode,
        totalPemeriksaanPerNama,
        totalPasienPerDiagnosa,
        persentasePasien,
        persentasePemeriksaan,
        persentasePria,
        persentaseWanita,
      } = res.data.data

      if (this.$auth.user.role.nama !== 'vendor') {
        this.selectedVendor = selectedVendor
      }

      this.selectedRs = this.$refs.rsFilter.internalSearch || '-'

      // Show panah persentase
      this.upDownPasien =
        persentasePasien < 0 ? 'mdi-arrow-down-thick' : 'mdi-arrow-up-thick'
      this.upDownPria =
        persentasePria < 0 ? 'mdi-arrow-down-thick' : 'mdi-arrow-up-thick'
      this.upDownWanita =
        persentaseWanita < 0 ? 'mdi-arrow-down-thick' : 'mdi-arrow-up-thick'
      this.upDownPemeriksaan =
        persentasePemeriksaan < 0
          ? 'mdi-arrow-down-thick'
          : 'mdi-arrow-up-thick'
      if (this.dates[1]) {
        this.persentasePasien = ''
        this.upDownPasien = ''
        this.persentasePemeriksaan = ''
        this.upDownPemeriksaan = ''
        this.persentasePria = ''
        this.upDownPria = ''
        this.persentaseWanita = ''
        this.upDownWanita = ''
        this.keterangan = ''
      } else {
        this.keterangan = '%'
      }

      // Get data Total
      this.totalPasien = totalPasien
      this.totalPemeriksaan = totalPemeriksaan
      this.totalPasienPerGender = totalPasienPerGender
      this.totalPemeriksaanPerNama = totalPemeriksaanPerNama

      // Get data Persentase
      this.persentasePria = persentasePria
      this.persentaseWanita = persentaseWanita
      this.persentasePasien = persentasePasien
      this.persentasePemeriksaan = persentasePemeriksaan

      // Chart demografi
      let chartName = 'Provinsi'
      if (tipeDemografi === 'provinsi') {
        this.kota = []
        this.kecamatan = []
        if (data !== null) {
          chartName = 'Kota/Kabupaten'
          totalPasienPerWilayah.forEach((value) => {
            this.kota.push(value.x)
          })
        }
      } else if (tipeDemografi === 'kota') {
        this.kecamatan = []
        chartName = 'Kota/Kabupaten'
        if (data !== null) {
          chartName = 'Kecamatan'
          totalPasienPerWilayah.forEach((value) => {
            this.kecamatan.push(value.x)
          })
        }
      } else if (tipeDemografi === 'kecamatan') {
        this.kecamatan = []
        chartName = 'Kecamatan'
        totalPasienPerWilayah.forEach((value) => {
          this.kecamatan.push(value.x)
        })
      } else if (tipeDemografi === '') {
        this.provinsi = []
        totalPasienPerWilayah.forEach((value) => {
          this.provinsi.push(value.x)
        })
      }
      this.dataDemografi = [
        {
          name: 'Pasien',
          data: totalPasienPerWilayah.map((x) => x.y),
        },
      ]
      this.categoriesDemografi = totalPasienPerWilayah.map((x) => x.x)
      this.setDemografiXTitle(chartName)

      // Chart Kunjungan
      this.dataKunjungan = [
        {
          name: 'Pasien',
          data: totalPasienPerPeriode.map((x) => x.y),
        },
      ]
      this.optionsKunjungan = {
        xaxis: {
          categories: totalPasienPerPeriode.map((x) => x.x),
        },
      }

      // Chart Diagnosa
      this.optionsDiagnosa = {
        labels: totalPasienPerDiagnosa.map((x) => x.x),
      }
      const countDiagnosa = totalPasienPerDiagnosa.map((x) => x.y)
      const countDiagnosaLength =
        this.dataDiagnosa.length + countDiagnosa.length
      for (let i = 0; i <= countDiagnosaLength; i++) {
        this.dataDiagnosa.pop()
      }
      countDiagnosa.forEach((value) => {
        this.dataDiagnosa.push(value)
      })

      this.progressBar = false
    },

    progressBarPemeriksaan(item) {
      return (item / this.totalPemeriksaan) * 100
    },
  },
}
</script>
