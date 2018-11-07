<template>
  <el-input
    placeholder="search for an anime"
    prefix-icon="el-icon-search"
    v-model="search_query"
    @keydown.space.native="addSpace()"
    @keyup.enter.native="search">
  </el-input>
</template>

<script>
export default {
  name: 'search',
  props: {
    type: String
  },
  data () {
    return {
      search_query: '',
    }
  },
  methods: {
    addSpace () {
      this.search_query += ' ';
    },
    async search () {
      this.$router.push({
        name: 'search',
        params: {
          search_query: this.search_query
        }
      });
    }
  },
}
</script>