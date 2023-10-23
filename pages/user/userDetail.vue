<template>
  <v-dialog v-model="dialog" scrollable persistent max-width="500px">
    <form>
      <v-card>
        <v-card-title class="pa-0">
          <v-toolbar flat color="softgreen" class="rounded-t pa-1">
            <span>Detail Data User </span>
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
                  <v-list-item-icon>
                    <v-icon large>mdi-account-outline</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-subtitle class="text-big"
                      ><span class="custom-primary pt-0"
                        >Nama :</span
                      ></v-list-item-subtitle
                    >
                    <h3
                      class="text-big font-weight-thin"
                      v-text="detailItem.nama"
                    ></h3>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-icon>
                    <v-icon large>mdi-card-account-details</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-subtitle class="text-big"
                      ><span class="custom-primary"
                        >Username:</span
                      ></v-list-item-subtitle
                    >
                    <h3
                      class="text-big font-weight-thin"
                      v-text="detailItem.username"
                    ></h3>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-icon>
                    <v-icon large>mdi-text-box-check-outline</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-subtitle class="text-big"
                      ><span class="custom-primary"
                        >Role:</span
                      ></v-list-item-subtitle
                    >
                    <h3
                      class="text-big font-weight-thin"
                      v-text="detailItem.role.nama"
                    ></h3>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item v-if="showVendorDetail === true">
                  <v-list-item-icon>
                    <v-icon large>mdi-account-group</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-subtitle class="text-big"
                      ><span class="custom-primary"
                        >Nama Vendor:</span
                      ></v-list-item-subtitle
                    >
                    <h3
                      class="text-big font-weight-thin"
                      v-text="detailItem.vendor.nama"
                    ></h3>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </form>
  </v-dialog>
</template>

<script>
export default {
  name: 'UserDetail',
  components: {},
  data: () => ({
    dialog: false,
    // detail data dalam tabel
    detailItem: {
      no: '',
      nama: '',
      username: '',
      role: '',
      vendor: '',
    },

    showVendorDetail: true,
  }),
  methods: {
    // membuka card
    open(item) {
      this.dialog = true
      this.detailItem = Object.assign({}, item)
      // kondisi untuk menampilkan field vendor di card
      if (item.role_id === 3) {
        this.showVendorDetail = true
      } else {
        this.showVendorDetail = false
      }
    },
    // menutup card
    close() {
      this.dialog = false
    },
  },
}
</script>

<style scoped></style>
