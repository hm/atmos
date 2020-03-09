<template>
  <div class="tiles">
    <el-card
      v-for="anime in animes"
      :key="anime.mal_id"
      class="tile">
      <h4 class="title">
        {{ anime.title }}
      </h4>
        <router-link :to="showLink(anime.mal_id)">
          <div v-lazy-container="{selector: 'img'}" class="body">
            <img slot="reference" :data-src="anime.image_url" />
          </div>
        </router-link>
      <div class="footer">
        <div class="genres">
          <tag
            :label="genre.name"
            v-for="genre in anime.genres" 
            :key="genre.mal_id">
          </tag>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import Tag from '@/components/modules/Tag'
export default {
  name: 'anime-tiles',
  props: {
    animes: Array
  },
  methods: {
    showLink (mal_id) {
      return {
        name: 'content',
        params: {
          'content_id': mal_id
        }
      }
    }
  },
  components: {
    Tag
  }
}
</script>
<style lang="scss" scoped>
@import '../../styles/global';
.tiles {
 @include flexCenter(row, flex-start, flex-start);
 .tile {
  $margin: 10px;
  padding: 0px;
  > div {
    padding: 0;
  }
  width: calc(25% - #{$margin} * 2);
  @media (max-width: 1200px) {
    width: calc(33% - #{$margin} * 2);
  }
  @media (max-width: 750px) {
    width: calc(50% - #{$margin} * 2);
  }
  @media (max-width: 450px) {
    width: 100%;
  }
  height: auto;
  margin: $margin;
  .title {
    text-align: center;
    margin: 0;
    margin-bottom: 5px;
  }
  .body {
    @include flexCenter(row, center, flex-start);
    img {
      height: auto;
      width: 100%;
      overflow: auto;
      &:hover {
        cursor: pointer;
      }
    }
    div {
      padding: 5px;
      font-size: $fs-small;
    }
  }
  .footer {
    @include flexCenter(column, flex-start, flex-start);
    .genres{
      width: 100%;
      @include flexCenter(row, flex-start);
      @media (max-width: 1200px) {
        @include flexCenter(row, center);
      }
    }
    .details {
      width: 100%;
      font-size: $fs-small;
      @include flexCenter(row, flex-start, flex-start);
      .left-col, .right-col {
        width: 50%;
        @include flexCenter(column, flex-start, flex-start);
      }
    }
  }
 }
}
</style>