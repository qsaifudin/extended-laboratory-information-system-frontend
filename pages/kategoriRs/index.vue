<template>
  <v-data-table
    :headers="headers"
    :items="rs"
    class="custom-table"
    hide-default-footer
    disable-pagination
    loading
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
    <template #[`item.index`]="{ index }"> {{ index + 1 }} </template>
    <template #[`item.status`]="{ item }">
      <v-chip x-small class="py-2" outlined :color="getColor(item.status)">
        <b>{{ item.status ? 'Active' : 'Inactive' }}</b>
      </v-chip>
    </template>
    <template #top>
      <v-toolbar flat color="softgreen" class="rounded-t-xl pa-1">
        <v-toolbar-title>Kategori Rumah Sakit</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog
          v-model="dialog"
          max-width="500px"
          scrollable
          persistent
          @keydown.enter.prevent="save()"
        >
          <!-- menampilkan button tambah data -->
          <template #activator="{ on, attrs }">
            <v-btn
              color="custom-gradient-green"
              dark
              v-bind="attrs"
              elevation="0"
              v-on="on"
              @click="activeStatus"
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
                        :rules="nameRules"
                        label="Nama Kategori"
                        dense
                        outlined
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="12">
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
        <kategoriRsDetail ref="kategoriRsDetail"></kategoriRsDetail>
      </v-toolbar>
    </template>
    <template #[`item.actions`]="{ item }">
      <div justify="space-around">
        <!-- button detail item -->
        <v-btn elevation="0" x-small class="my-2 pa-3" color="primary" dark>
          <v-icon small @click="getDetailItem(item)"> mdi-eye </v-icon>
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
import kategoriRsDetail from '~/pages/kategoriRs/kategoriRsDetail'
export default {
  components: { kategoriRsDetail },
  middleware: 'isAdmin',
  data: () => ({
    status: true,
    dialog: false,
    // rules untuk required field
    nameRules: [(v) => !!v || 'Name is required'],
    statusRules: [(v) => !!v || 'Status is required'],
    // menampilkan data di tabel rumah sakit
    headers: [
      { text: 'No', value: 'index', sortable: false, width: '6%' },
      {
        text: 'Kategori Rumah Sakit',
        align: 'start',
        value: 'nama',
      },
      { text: 'Status', value: 'status' },
      { text: 'Actions', value: 'actions', sortable: false, width: '150' },
    ],
    rs: [],
    editedIndex: -1,
    editedItem: {
      no: '',
      nama: '',
      status: true,
    },

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
        ? 'Tambah Data Kategori RS'
        : 'Edit Data Kategori RS'
    },
  },

  watch: {
    dialog(val) {
      val || this.close()
    },
  },

  mounted() {
    this.getDataRs()
  },

  methods: {
    // untuk mengatur default status di card tambah data
    activeStatus() {
      this.editedItem.status = true
    },

    // mengatur warna pada status
    getColor(status) {
      if (status === true) return 'primary'
      else return 'red'
    },

    // menampilkan card detail kategori RS
    getDetailItem(item) {
      this.$refs.kategoriRsDetail.open(item)
    },

    // method untuk edit data rumah sakit
    editItem(item) {
      this.editedIndex = this.rs.indexOf(item)
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
            .patch(`api/kategoriRs/${this.editedItem.id}`, this.editedItem)
            .then(() => {
              this.close()
              this.getDataRs()
              this.valid = true
              this.$toast.success('Berhasil update data')
            })
            .catch(({ response: err }) => {
              this.catchError(err)
            })
        } else {
          this.$axios
            .post(`api/kategoriRs/`, this.editedItem)
            .then(() => {
              this.close()
              this.getDataRs()
              this.valid = true
              this.$toast.success('Berhasil menyimpan data')
            })
            .catch(({ response: err }) => {
              this.catchError(err)
            })
        }
      }
    },

    // mendapatkan data kategori rumah sakit dari API
    getDataRs() {
      this.progressBar = true
      this.$axios
        .$get('/api/kategoriRs/')
        .then((res) => {
          this.rs = res.data
          this.progressBar = false
        })
        .catch((err) => {
          console.log(err)
        })
    },
  },
}
</script>
