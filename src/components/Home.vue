
<template>
  <div
    v-loading="loading"
    element-loading-text="Loading..."
    element-loading-background="rgba(0, 0, 0, 0.8)"
    class="home">
    <div class="container">
      <h1> {{ pascalCase(season) }} {{ year }} Anime </h1>
      <anime-tiles v-if="animes" :animes="animes" />
    </div>
  </div>
</template>

<script>
import maw from "@/myanimewatch";
import AnimeTiles from '@/components/modules/AnimeTiles'
import upperFirst from 'lodash/upperFirst'
export default {
  name: 'Home',
  metaInfo: {
    titleTemplate: '%s | Home'
  },
  async created () {
    const date = new Date();
    this.year = date.getFullYear();
    this.season = this.getAnimeSeason(date.getMonth());
    try {
      const response = await maw.getSeasonAnime(this.year, this.season);
      this.animes = response.data.anime.filter(x => x.genres.findIndex(y => y.name === "Hentai" || y.name === "Kids") === -1);
      this.loading = false;
    } catch (error) {
      this.loading = false;
      console.log('error getting current seasons anime', error);
    }
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
    AnimeTiles
  }
}
</script>
