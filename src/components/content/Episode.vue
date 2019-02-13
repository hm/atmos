<template>
  <div
    v-loading="loading"
    element-loading-text="Loading..."
    element-loading-background="rgba(0, 0, 0, 0.8)"
    :key="`episode-${episode}`"
    class="episode">
    <div>
      <el-select
        class="mirror-select"
        v-model="selectedMirror">
        <el-option
          v-for="mirror in links[episode]"
          :key="mirror"
          :value="mirror">
        </el-option>
      </el-select>
    </div>

    <div v-if="selectedMirror">
      <iframe
        scrolling="no"
        :src="selectedMirror"
        :key="`${selectedMirror}-episode-${episode}`"
        allow="encrypted-media"
        allowfullscreen />

      <!-- <div>
        <h4>
        posted by {{ selectedMirror.data.poster }}
        <i class="fa fa-thumbs-up green hover" aria-hidden="true" />: {{ selectedMirror.up }}
        </h4>
      </div> -->

    </div>

    <h4>
      <el-pagination
        class="pagination"
        background
        :page-size="1"
        @current-change="updateEpisode"
        :current-page="episode"
        layout="pager, jumper"
        :total="max">
      </el-pagination>
    </h4>

    <footer>
      It is strongly recommended you use an ad-blocker such as uBlock Origin to avoid potentially malicious ads while viewing content.
    </footer>
  </div>
</template>

<script>
import requests from '@/requests';
export default {
  name: "Episode",
  props: [
    'episode',
    'mirrors',
    'title',
    'max',
  ],
  data () {
    return {
      selectedMirrorString: undefined,
      selectedMirror: undefined,
      links: {},
      loading: false,
    }
  },
  computed: {
    screenWidth () {
      return window.innerWidth
    }
  },
  async mounted () {
    this.getLinks(this.episode);
  },
  methods: {
    sanitize (string) {
      return string
        .replace(/ä/g, 'a')
        .replace(/Ⅲ/g, 'iii')
        .replace(/[^a-zA-Z0-9[\t][-]]*/g, "")
        .replace(/ /g, '-')
        .replace(/[^\u0000-\u007F]+/g, '-')
        .replace(/[:]*[?]*[!]*[(]*[)]*[,]*[.]*[~]*[']*["]*[*]*[@]*[;]*/g, '')
    },
    async getLinks(episode) {
      if (!this.links[episode]) {
        this.loading = true;
        let title = this.title.toLowerCase();
        title = title.replace('hangyaku no lelouch', 'lelouch of the rebellion');
        title = title.replace('kakegurui××', 'kakegurui xx');
        title = this.sanitize(title);
        let response = await requests.get(`https://gogoanimes.co/${title}-episode-${episode}`);
        let found = true;
        while (1) {
          const start = response.indexOf('data-video="');
          if (start === -1) {
            break;
          }
          response = response.substring(start + 12);
          const end = response.indexOf('"');
          if (!this.links[episode]) {
            this.links[episode] = [];
            this.links[episode].push(response.substring(0, end));
          } else {
            this.links[episode].push(response.substring(0, end));
          }
        }
        this.loading = false;
      }
      this.selectedMirror = this.links[episode][0];
      this.$forceUpdate();
    },
    getBaseLink (mirror) {
      return mirror.data.json_metadata.attachment.value.match(/^.+?[^\/:](?=[?\/]|$)/)[0];
    },
    getMirrorLabel (mirror) {
      return `${this.getBaseLink(mirror)} - ${mirror.data.poster} - ${mirror.up} upvotes`;
    },
    updateEpisode (episode) {
      this.$emit('update', episode);
      this.episode = episode;
      this.getLinks(episode);
    }
  }
}
</script>

<style lang="scss">
.mirror-select {
  input {
    pointer-events: none !important;
  }
}
  .pagination {
    .el-pagination__jump {
      margin-top: 10px;
    }
    .el-pager li.active {
      background-color: #12161c!important;
    }
  }
</style>

<style lang="scss" scoped>
@import '../../styles/global';
.episode {
  @include flexCenter(column);
  div {
    width: 100%;
    @include flexCenter(column);
    iframe {
      width: 50vw;
      max-width: 100%;
      height: 28.125vw;
      max-height: 366.1875px;
      min-height: 260px;
      overflow: auto;
      @media (max-width: 900px) {
        width: 100vw;
        max-width: 100%;
        height: 47vw;
      }
    }
  }
}
h4 {
  margin-top: 10px;
  @include flexCenter;
  i {
    font-size: 30px;
    &:hover {
      cursor:pointer;
      opacity: 0.6;
    }
  }
  span {
    margin-right: 10px;
    margin-left: 10px;
  }
}
</style>