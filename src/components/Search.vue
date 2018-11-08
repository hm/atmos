
<template>
  <div :key="$route.params.search_query" >
    <div 
      v-loading="loading"
      element-loading-text="Loading..."
      element-loading-background="rgba(0, 0, 0, 0.8)"
      class="container">
      <h1> Search results for {{ $route.params.search_query }} </h1>
      <anime-list :animes="results" />
    </div>
  </div>
</template>

<script>
import AnimeList from '@/components/modules/AnimeList'
import maw from "@/myanimewatch";
export default {
  name: 'Home',
  components: {
    AnimeList
  },
  data () {
    return {
      results: undefined,
      loading: true,
    }
  },
  methods: {
    async search () {
      this.loading = true;
      this.results = undefined;
      const response = await maw.searchAnime(this.$route.params.search_query);
      this.results = response.results;
      this.loading = false;
    }
  },
  watch: {
    '$route.params.search_query': {
      handler: 'search',
      immediate: true
    }
  },
}
</script>