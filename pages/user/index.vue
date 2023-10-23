<template>
  <v-data-table
    :headers="headers"
    :items="user"
    :search="search"
    sort-by="id"
    :sort-desc="sortDesc"
    :page="page"
    :options.sync="options"
    :server-items-length="totalUser"
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
        <v-toolbar-title>User</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <!-- menampilkan search -->
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Cari Nama User"
          single-line
          hide-details
          dense
          outlined
          class="elevation-0"
          color="primary"
          @keyup="getDataUser($event)"
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
                        label="Nama"
                        dense
                        outlined
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" class="pb-0">
                      <v-text-field
                        v-model="editedItem.username"
                        :rules="usernameRules"
                        label="Username"
                        dense
                        outlined
                        required
                        @keydown.space.prevent
                      ></v-text-field>
                    </v-col>
                    <v-col v-if="editedIndex == -1" cols="12" class="pb-0">
                      <v-text-field
                        v-model="editedItem.password"
                        :rules="passwordRules"
                        label="Password"
                        dense
                        outlined
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col class="d-flex pb-0" cols="12">
                      <v-autocomplete
                        v-model="editedItem.role_id"
                        :items="role"
                        item-text="nama"
                        item-value="id"
                        :rules="roleRules"
                        label="Role"
                        dense
                        outlined
                        @change="getVendorData"
                      ></v-autocomplete>
                    </v-col>
                    <v-col v-if="showVendor === true" cols="12" class="pb-0">
                      <v-autocomplete
                        v-model="editedItem.vendor_id"
                        :items="vendor"
                        item-text="nama"
                        item-value="id"
                        :rules="vendorRules"
                        label="Nama Vendor"
                        dense
                        outlined
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
        <user-detail ref="userDetail"></user-detail>
        <user-password ref="userPassword"></user-password>
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
          <v-icon small @click="editItem(item)"> mdi-pencil </v-icon>
        </v-btn>
        <v-btn
          elevation="0"
          x-small
          class="my-2 pa-3 ml-2 elevation-4 transparent"
          color="red"
          dark
        >
          <v-icon small dark @click="editPassword(item)">
            mdi-lock-check
          </v-icon>
        </v-btn>
      </div>
    </template>
  </v-data-table>
</template>

<script>
import userPassword from '~/pages/user/userPassword'
import userDetail from '~/pages/user/userDetail'
export default {
  components: { userDetail, userPassword },
  middleware: 'isSuperadmin',
  data: () => ({
    number: '',
    role: [],
    dialog: false,
    search: '',
    // rules untuk required field
    kodeRules: [(v) => !!v || 'Kode is required'],
    nameRules: [(v) => !!v || 'Name is required'],
    usernameRules: [(v) => !!v || 'Username is required'],
    passwordRules: [(v) => !!v || 'Password is required'],
    roleRules: [(v) => !!v || 'Role is required'],
    vendorRules: [(v) => !!v || 'Nama Vendor is required'],
    // menampilkan data di tabel user
    headers: [
      { text: 'No', value: 'index', sortable: false, width: '6%' },
      {
        text: 'Nama',
        align: 'start',
        value: 'nama',
      },
      { text: 'Username', value: 'username' },
      { text: 'Role', value: 'role.nama', sortable: false },
      { text: 'Actions', value: 'actions', sortable: false, width: '200px' },
    ],
    user: [],
    editedIndex: -1,
    editedItem: {
      no: '',
      nama: '',
      username: '',
      password: '',
      role: '',
      role_id: '',
      vendor_id: null,
    },
    vendor: [],
    page: 1,
    totalUser: 0,
    numberOfPages: 0,
    options: {},

    sortDesc: true,
    progressBar: true,
    progressBarCard: false,

    showVendor: false,
    valid: true,
    errMessage: '',
    errDeskripsi: '',
  }),
  computed: {
    // mengatur judul untuk card popup
    formTitle() {
      return this.editedIndex === -1 ? 'Tambah Data User' : 'Edit Data User'
    },
  },

  watch: {
    dialog(val) {
      val || this.close()
    },

    options: {
      handler() {
        this.getDataUser()
      },
    },
    deep: true,
  },

  mounted() {
    this.$axios.$get('/api/user/role').then((res) => {
      this.role = res.data
    })
  },

  methods: {
    // menampilkan field pilihan vendor apabila role yang dipilih adalah vendor
    getVendorData(item) {
      this.showVendor = false
      if (item === 3) {
        this.showVendor = true
        this.$axios.$get(`/api/vendor`).then((res) => {
          this.vendor = res.data
        })
      }
    },

    // menampilkan detail untuk data user
    getDetailItem(item) {
      this.$refs.userDetail.open(item)
    },

    // method untuk edit / create new password
    editPassword(item) {
      this.$refs.userPassword.open(item)
    },

    // method untuk edit data user
    editItem(item) {
      this.getVendorData(item.role_id)
      this.editedIndex = this.user.indexOf(item)
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
      this.showVendor = false
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
            .patch(`api/user/${this.editedItem.id}`, this.editedItem)
            .then(() => {
              this.close()
              this.getDataUser()
              this.valid = true
              this.$toast.success('Berhasil update data')
            })
            .catch(({ response: err }) => {
              this.catchError(err)
            })
        } else {
          this.$axios
            .post(`api/user/`, this.editedItem)
            .then(() => {
              this.close()
              this.getDataUser()
              this.valid = true
              this.$toast.success('Berhasil menyimpan data')
            })
            .catch(({ response: err }) => {
              this.catchError(err)
            })
        }
      }
    },

    // mendapatkan data user berdasarkan pagination per page
    getDataUser(e) {
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
          '/api/user/onSearchPaginated?nama=' +
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
          this.user = data
          this.totalUser = total
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

<style scoped></style>
