
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
  metaInfo: {
    titleTemplate: '%s | Search'
  },
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
      try {
        const response = await maw.searchAnime(this.$route.params.search_query);
        this.results = response.data.results;
        this.loading = false;
      } catch (error) {
        this.loading = false;
        console.log('error while searching for animes', error);
      }
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