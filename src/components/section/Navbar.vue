<template>
  <el-menu
    :default-active="currentPage"
    class="el-menu"
    mode="horizontal"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
  >
    <el-menu-item 
      v-for="(route, index) in pages" 
      @click="navigateTo(route)"
      :index="route" 
      :key="`${route}-${index}`"
      > 
        {{ route }}
    </el-menu-item>
  </el-menu>
</template>

<script>
import { HOME, SEARCH } from '@/constants/routes'
export default {
  name: 'navbar',
  created () {
    this.pages = [HOME, SEARCH]
  },
  data () {
    return {
      pages: [],
      current_page: undefined
    }
  },
  methods: {
    setCurrentPage () {
      console.log(this.$route.name)
      this.current_page = this.$route.name
    },
    navigateTo (page) {
      this.$router.push({
        name: page
      })
    }
  },
  watch: {
    '$route.name': {
      handler: 'setCurrentPage',
      immediate: true
    }
  }
}
</script>

<style lang="scss">
.el-menu {
  border-bottom: none!important;
  display: flex;
  li {
    font-size: 24px !important;
  }
  justify-content: center !important;
}
</style>