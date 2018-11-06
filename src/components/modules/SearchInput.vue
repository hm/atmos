<template>
  <el-input
    placeholder="search for an anime"
    prefix-icon="el-icon-search"
    v-model="$root.search_query"
    @keydown.space.native="addSpace()"
    @keyup.enter.native="search">
  </el-input>
</template>

<script>
import maw from "@/myanimewatch";
export default {
  name: 'search',
  props: {
    type: String
  },
  methods: {
    addSpace () {
      this.$root.search_query += ' ';
    },
    async search () {
      this.$root.loading = true;
      this.$router.push({ name: 'search'});
      const response = await maw.searchAnime(this.$root.search_query);
      this.$root.search_results = response.results;
      this.$root.loading = false;
    }
  },
}
</script>