<template>
  <v-dialog v-model="dialog" max-width="500px" scrollable persistent>
    <v-form ref="form" v-model="valid">
      <v-card @keyup.enter="savePassword()">
        <v-card-title class="pa-0">
          <v-toolbar flat color="softgreen" light>
            <span>Password Baru</span>
            <v-spacer></v-spacer>
            <v-btn fab small depressed color="softgreen" @click="close">
              <v-icon color="#606060">mdi-close</v-icon>
            </v-btn>
          </v-toolbar>
        </v-card-title>
        <v-divider></v-divider>

        <div>
          <!-- menampilkan loading -->
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
              <v-col cols="12" md="12" class="pb-0">
                <v-text-field
                  v-model="editedItem.newPassword"
                  clearable
                  :rules="passwordRules"
                  label="Password Baru"
                  outlined
                  dense
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="12">
                <v-text-field
                  v-model="editedItem.confirmPassword"
                  clearable
                  :rules="confirmPasswordRules"
                  label="Konfirmasi Password Baru"
                  outlined
                  dense
                  required
                ></v-text-field>
              </v-col>
              <v-col v-if="errMessage != ''" class="d-flex justify-center">
                <div
                  class="pa-4 text-center red lighten-5 rounded-lg red--text"
                >
                  <!-- menampilkan error handling -->
                  <p>
                    {{ errMessage }}
                  </p>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-toolbar>
          <v-divider></v-divider>
          <v-card-actions class="action">
            <v-spacer></v-spacer>
            <v-btn
              :disabled="!valid"
              color="success"
              large
              elevation="0"
              class="ma-1 pr-12 pl-12"
              @click="savePassword"
            >
              Simpan
            </v-btn>
          </v-card-actions>
        </v-toolbar>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
export default {
  name: 'UserPassword',
  data: () => ({
    dialog: false,
    // rules untuk required field
    passwordRules: [(v) => !!v || 'Password is required'],
    confirmPasswordRules: [(v) => !!v || 'Password is required'],
    editedItem: {
      id: '',
      newPassword: '',
      confirmPassword: '',
    },

    progressBarCard: false,
    valid: true,
    errMessage: '',
  }),

  watch: {
    dialog(val) {
      val || this.close()
    },
  },

  methods: {
    // membuka card dan pengaturan id data yang diedit
    open(item) {
      this.editedItem.id = item.id
      this.dialog = true
    },

    // menutup card
    close() {
      this.dialog = false
      this.$refs.form.reset()
      this.$refs.form.resetValidation()
      this.errMessage = ''
      this.progressBarCard = false
    },

    // menangkap error
    catchError(err) {
      this.errMessage = err.data.message
      this.valid = true
      this.progressBarCard = false
    },

    // save new password dan validasi password
    savePassword() {
      if (this.$refs.form.validate()) {
        if (this.editedItem.newPassword !== this.editedItem.confirmPassword) {
          this.errMessage = 'Password tidak sesuai'
        } else {
          this.$axios.patch(`api/user/${this.editedItem.id}`, {
            password: this.editedItem.confirmPassword,
          })
          this.valid = false
          this.progressBarCard = true
          this.close()
          this.$toast.success('Berhasil menyimpan data')
        }
      }
    },
  },
}
</script>
