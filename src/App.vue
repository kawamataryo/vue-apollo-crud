<template>
  <v-app>
    <CustomerTable/>
  </v-app>
</template>

<script>
import CustomerTable from './components/CustomerTable'

export default {
  name: 'App',
  components: {
    CustomerTable
  },
}
</script>
