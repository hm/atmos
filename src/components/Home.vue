
<template>
  <div
    v-loading="loading"
    element-loading-text="Loading..."
    element-loading-background="rgba(0, 0, 0, 0.8)"
    class="home">
    <div class="container">
      <h1> {{ pascalCase(season) }} {{ year }} Anime </h1>
      <anime-list :animes="animes" />
    </div>
  </div>
</template>

<script>
import maw from "@/myanimewatch";
import AnimeList from '@/components/modules/AnimeList'
import upperFirst from 'lodash/upperFirst'
export default {
  name: 'Home',
  async created () {
    const date = new Date();
    this.year = date.getFullYear();
    this.season = this.getAnimeSeason(date.getMonth());
    const response = await maw.getSeasonAnime(this.year, this.season);
    this.animes = response.anime;
    this.loading = false;
  },
  data () {
    return {
      animes: undefined,
      year: undefined,
      season: undefined,
      loading: true,
    }
  },
  methods: {
    pascalCase: (string) => upperFirst(string),
    getAnimeSeason (month) {
      switch (month) {
        case 0:
        case 1:
        case 2:
          return 'winter';
        case 3:
        case 4:
        case 5:
          return 'spring';
        case 6:
        case 7:
        case 8:
          return 'summer';
        case 9:
        case 10:
        case 11:
          return 'fall';
      }
    }
  },
  components: {
    AnimeList
  }
}
</script>