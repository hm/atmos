<template>
  <div
    v-loading="loading"
    element-loading-text="Loading..."
    element-loading-background="rgba(0, 0, 0, 0.8)"
    :key="`episode-${episode}`"
    class="episode">
    <!-- <div>
      <el-select
        class="mirror-select"
        v-model="selectedMirror">
        <el-option
          v-for="mirror in links[episode]"
          :key="mirror"
          :value="mirror">
        </el-option>
      </el-select>
    </div> -->

    <template v-if="selectedMirror">
      <video width="100%" height="auto" controls>
        <source :src="selectedMirror" type="video/mp4">
        Your browser does not support the video tag.
      </video>
    </template>

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
import axios from 'axios';
import CryptoJS from 'crypto-js';

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
      twistURL: '',
    }
  },
  computed: {
    screenWidth () {
      return window.innerWidth
    }
  },
  async mounted () {
    this.getTwistUrl(this.episode);
  },
  methods: {
    decrypt (encryptedString) {
      return CryptoJS.enc.Utf8.stringify(
        CryptoJS.AES.decrypt(encryptedString, 'LXgIVP&PorO68Rq7dTx8N^lP!Fa5sGJ^*XK')
      );
    },
    async getTwistUrl(episode) {
      const sources = await axios({
        url: `https://twist.moe/api/anime/${this.title}/sources`,
        headers: {
          'Access-Control-Allow-Headers': 'x-access-token',
          'x-access-token': '1rj2vRtegS8Y60B3w3qNZm5T2Q0TN2NR'
        },
      });
      if (!sources) {
        return false;
      }
      const url = this.decrypt(sources.data[episode - 1].source);
      this.links[episode] = [];
      this.links[episode].push('http://api.streamani.me?url=' + url);
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
      this.getTwistUrl(episode);
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
