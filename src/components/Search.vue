
<template>
  <div>
    <div 
      v-loading="$root.loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      class="container">
      <h1> Search results for {{ $root.search_query }} </h1>
      <anime-list :animes="$root.search_results" />
    </div>
  </div>
</template>

<script>
import AnimeList from '@/components/modules/AnimeList'
export default {
  name: 'Home',
  components: {
    AnimeList
  },
}
</script>