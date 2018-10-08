<template>
  <v-container>
    <!--入力フォーム-->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-container>
          <h2 v-if="isCreate">名簿に追加する</h2>
          <h2 v-if="!isCreate">名簿を更新する</h2>
          <v-form ref="form" v-model="valid" lazy-validation>
            <!--名前-->
            <v-text-field
                v-model="customer.name"
                :rules="nameRules"
                :counter="20"
                label="名前"
                required
            ></v-text-field>
            <!--性別-->
            <v-radio-group
                v-model="customer.gender"
                :rules="nameRules"
                row
            >
              <v-radio label="男性" value="男性"></v-radio>
              <v-radio label="女性" value="女性"></v-radio>
              <v-radio label="その他" value="その他"></v-radio>
            </v-radio-group>
            <!--追加ボタン-->
            <v-btn
                v-if="isCreate"
                :disabled="!valid"
                @click="createCustomer"
            >
              追加
            </v-btn>
            <!--更新ボタン-->
            <v-btn
                v-if="!isCreate"
                :disabled="!valid"
                @click="updateCustomer"
            >
              更新
            </v-btn>
            <v-btn @click="clear">クリア</v-btn>
          </v-form>
        </v-container>
      </v-card>
    </v-dialog>

    <!--ツールバー-->
    <v-toolbar flat color="grey lighten-2">
      <v-toolbar-title>顧客名簿サンプル</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="primary" dark class="mb-2" @click="showDialogNew">新規追加</v-btn>
    </v-toolbar>

    <!-- データテーブル -->
    <v-data-table
        :headers="headers"
        :items="customers"
        :loading="progress"
        :pagination.sync="pagination"
        no-data-text="顧客が登録されておりません。"
        class="elevation-1"
    >
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <td>{{ props.item.createdAt }}</td>
        <td>{{ props.item.name }}</td>
        <td>{{ props.item.gender }}</td>
        <td class="justify-end layout px-0">
          <v-btn
              color="success"
              small
              outline
              flat
              @click="showDialogUpdate(props.item.id, props.item.name, props.item.gender)"
          >
            <v-icon small>
              edit
            </v-icon>
          </v-btn>
          <v-btn
              color="error"
              small
              outline
              flat
              @click="deleteCustomer(props.item.name, props.item.id)"
          >
            <v-icon small>
              delete
            </v-icon>
          </v-btn>

        </td>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
  /* eslint-disable no-console */

  import {ALL_CUSTOMERS} from "../constants/customer-query";
  import {CREATE_CUSTOMER, UPDATE_CUSTOMER, DELETE_CUSTOMER} from "../constants/customer-mutation";

  export default {
    name: "CustomerTable",
    data: () => ({
      // 顧客情報
      customers: [],
      // データテーブル
      headers: [
        {text: '追加日', value: 'createdAt'},
        {text: '名前', value: 'name'},
        {text: '性別', value: 'gender'},
        {text: '', value: '', sortable: false},
      ],
      pagination: {
        descending: true,
        rowsPerPage: 10
      },
      // フォーム入力値
      customer: {
        id: '',
        name: '',
        gender: '',
      },
      // バリデーション
      valid: true,
      nameRules: [
        v => !!v || '名前は必須項目です',
        v => (v && v.length <= 20) || '名前は20文字以内で入力してください'
      ],
      genderRules: [
        v => !!v || '性別は必須項目です',
      ],
      // ローディングの表示フラグ
      progress: false,
      // ダイアログの表示フラグ
      dialog: false,
      // 新規・更新のフラグ
      isCreate: true,
    }),
    apollo: {
      // すべての顧客情報の取得
      customers: ALL_CUSTOMERS
    },
    methods: {
      // --------------------------------
      // 新規作成
      // --------------------------------
      createCustomer: function () {
        if (this.$refs.form.validate()) {
          this.progress = true
          this.$apollo.mutate({
            mutation: CREATE_CUSTOMER,
            variables: {
              name: this.customer.name,
              gender: this.customer.gender,
            }
          }).then(() => {
            this.$apollo.queries.customers.fetchMore({
              updateQuery: (previousResult, {fetchMoreResult}) => {
                return {
                  customers: fetchMoreResult.customers
                }
              }
            })
            this.dialog = false
            this.progress = false
          }).catch((error) => {
            console.error(error)
          })
        }
      },
      // --------------------------------
      // 更新
      // --------------------------------
      updateCustomer: function () {
        this.progress = true
        this.$apollo.mutate({
          mutation: UPDATE_CUSTOMER,
          variables: {
            id: this.customer.id,
            name: this.customer.name,
            gender: this.customer.gender,
          }
        }).then(() => {
          this.$apollo.queries.customers.fetchMore({
            updateQuery: (previousResult, {fetchMoreResult}) => {
              return {
                customers: fetchMoreResult.customers
              }
            }
          })
          this.dialog = false
          this.progress = false
        }).catch((error) => {
          console.error(error)
        })
      },
      // --------------------------------
      // フォームのクリア
      // --------------------------------
      clear: function () {
        this.$refs.form.reset()
      },
      // --------------------------------
      // 新規追加ダイアログの表示
      // --------------------------------
      showDialogNew: function () {
        this.clear()
        this.isCreate = true
        this.dialog = true
      },
      // --------------------------------
      // 更新ダイアログの表示
      // --------------------------------
      showDialogUpdate: function (id, name, gender) {
        this.customer.id = id
        this.customer.name = name
        this.customer.gender = gender
        this.isCreate = false
        this.dialog = true
      },
      // --------------------------------
      // 削除
      // --------------------------------
      deleteCustomer: function (name, id) {
        if (!confirm(name + 'さんを削除してもよろしいですか？')) {
          return
        }
        this.progress = true
        this.$apollo.mutate({
          mutation: DELETE_CUSTOMER,
          variables: {
            id: id
          }
        }).then(() => {
          this.$apollo.queries.customers.fetchMore({
            updateQuery: (previousResult, {fetchMoreResult}) => {
              return {
                customers: fetchMoreResult.customers
              }
            }
          })
          this.progress = false
        }).catch((error) => {
          console.error(error)
        })
      },
    }
  }
</script>
