<template>
  <div class="tiles">
    <el-card v-for="anime in animes" :key="anime.mal_id" class="box-card">
      <h4 class="title">
        {{ anime.title }}
      </h4>
      <div class="body">
        <img slot="reference" @click="viewShow(anime.mal_id)" :src="anime.image_url">
      </div>
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
    viewShow (mal_id) {
      this.$router.push({
        name: 'content',
        params: {
          'content_id': mal_id
        }
      })
    }
  },
  components: {
    Tag
  }
}
</script>
<style lang="scss">
.el-card__body {
  padding: 10px;
}
</style>
<style lang="scss" scoped>
@import '../../styles/global';
.tiles {
 @include flexCenter(row, center);
 $margin: 5px;
 $cols: 3;
 $width: 100% / $cols;
 >div {
  width: calc(#{$width} - #{$margin} * #{$cols});
  margin: $margin;
  height: auto;
  .title {
    text-align: center;
    margin: 0;
    margin-bottom: 5px;
  }
  .body {
    @include flexCenter(row, center, flex-start);
    img {
      height: 100%;
      width: auto;
      overflow: auto;
    }
    div {
      padding: 5px;
      font-size: $fs-small;
    }
  }
  .footer {
    @include flexCenter(column, flex-start, flex-start);
    .genres{
      padding: 5px;
      width: 100%;
      @include flexCenter(row, center);
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