<template>
  <el-menu
    :default-active="current_page"
    class="navbar"
    mode="horizontal"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
  >
    <el-menu-item index="home" @click="navigateTo('home')"> Home </el-menu-item>
    <li class="fake-menu-item">
      <search-input />
    </li>
  </el-menu>
</template>

<script>
import SearchInput from './SearchInput'
export default {
  name: 'navbar',
  data () {
    return {
      current_page: 'home'
    }
  },
  methods: {
    setCurrentPage () {
      this.current_page = this.$route.name
    },
    navigateTo (page) {
      this.$router.push({
        name: page
      })
    }
  },
  components: {
    SearchInput
  }
}
</script>

<style lang="scss" scoped>
@import '../../styles/global';
.navbar {
  border-bottom: none!important;
  @include flexCenter;
  li {
    margin-left: 20px;
    margin-right: 20px;
    font-size: 24px !important;
  }
}
</style>