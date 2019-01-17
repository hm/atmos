
<template>
  <div
    v-loading="loading"
    element-loading-text="Loading..."
    element-loading-background="rgba(0, 0, 0, 0.8)"
    class="container">
    <div v-if="!loading">
      <div class="title">
        <h1> {{ content.title }} </h1>
      </div>
      <div class="body">
        <div class="left-col">
          <img @click="goToEpisodes()" :src="content.poster">
          <div>
            <p> Information </p>
            <p> Type: <tag :label="content.type" /> </p>
            <p> Episodes: <span> {{ content.episodes || 'unknown' }} </span> </p>
            <p> Status: <span> {{ content.status }} </span> </p>
          </div>
          <div>
            <p> Statistics
            <p class="score" @click="openMal()"> Score: <span> {{ content.score }} </span> </p>
            <p class="popularity" @click="openMal()"> Popularity: <span> #{{ content.popularity }} </span> </p>
          </div>
        </div>
        <div class="right-col">
          <div class="breadcrumbs">
            <a @click="goToEpisodes()"> {{ content.title }} </a> /
            <a v-if="episode > 0"> Episode {{ episode }} </a>
          </div>
          <div
            v-loading="findingEpisodes"
            element-loading-text="Finding Episodes..."
            element-loading-background="rgba(0, 0, 0, 0.8)" 
            class="stream">
            <template v-if="episode === 0">
              <div class="episodes">
                <template v-if="episodesReleased">
                  <el-button
                    type="info"
                    v-for="ep in episodesReleased"
                    :key="ep"
                    @click="selectEpisode(ep)">
                    episode {{ ep }}
                  </el-button>
                </template>
                <h1 v-else-if="!findingEpisodes">
                  No Mirrors found for this series
                </h1>
              </div>
              <p> Synopsis </p>
              <div class="flex-center" v-html="content.synopsis" />
            </template>
            <episode
              v-else-if="episodesReleased"
              :episode="episode"
              :title="content.title"
              :max="episodesReleased"
              @update="updateEpisode"
              />
          </div>
        </div>
      </div>
    </div> <!-- END container-->
  </div>
</template>

<script>
import maw from "@/myanimewatch";
import Episode from '@/components/content/Episode'
import Tag from '@/components/modules/Tag'
import requests from "@/requests";
export default {
  name: "Home",
  metaInfo () {
    return {
      titleTemplate: this.episode === 0 ? `%s | ${this.content.title}` : `%s | ${this.content.title} Episode ${this.episode}`
    }
  },
  data() {
    return {
      content_id: 0,
      episode: 0,
      episodes: [],
      loading: true,
      content: {
        type: "",
        episodes: "",
        status: "",
        premiered: "",
        producers: [],
        duration: "",
        genres: [],
        score: "",
        popularity: "",
        category_rank: "",
        prequel: "",
        title: "",
        synopsis: ""
      },
      episodesReleased: undefined,
      findingEpisodes: true,
    };
  },
  watch: {
    "$route.params.content_id": function() {
      this.load();
    },
    "$route.params.episode": function() {
      this.load();
    }
  },
  async mounted() {
    await this.load();
    try {
      let title = this.sanitize(this.content.title);
      title = title.toLowerCase();
      title = title.replace('hangyaku no lelouch', 'lelouch of the rebellion');
      console.log(title);
      let amount = await requests.get('https://gogoanimes.co/category/' + title);
      const epEnd = amount.split(`ep_end = '`);
      console.log(epEnd);
      this.episodesReleased = parseInt(epEnd[epEnd.length - 1].substring(0, epEnd[epEnd.length - 1].indexOf(`'`)));
      this.findingEpisodes = false;
    } catch (error) {
      this.findingEpisodes = false;
    }
  },
  computed: {
    episodesWithMirrors () {
      return this.episodes.filter(x => x.length > 0);
    },
  },
  methods: {  
    openMal () {
      window.open(`https://myanimelist.net/anime/${this.$route.params.content_id}/${this.sanitize(this.content.title)}`, '_blank');
    },
    sanitize (string) {
      return string
        .replace(/ä/g, 'a')
        .replace(/Ⅲ/g, 'iii')
        .replace(/×/g, 'x')
        .replace(/[^a-zA-Z0-9[\t][-]]*/g, "")
        .replace(/ /g, '-')
        .replace(/[^\u0000-\u007F]+/g, '-')
        .replace(/[:]*[?]*[!]*[(]*[)]*[,]*[.]*[~]*[']*["]*[*]*[@]*[;]*/g, '')
    },
    async load() {
      this.loading = true;
      this.episode = this.$route.params.episode
        ? this.$route.params.episode
        : 0;

      if (this.content_id != this.$route.params.content_id) {
        this.content_id = this.$route.params.content_id;

        await this.setAnimeDetails();
        // await this.setThreadDetails();
      }
      this.loading = false;
    },
    async setThreadDetails() {
      const thread = await maw.getEpisodeThread(this.content_id);
      var top_level_posts = thread.main_post.children.slice();
      top_level_posts.splice(0, 0, thread.main_post);

      var episodes = []; // maybe theres a short hand for this...
      const loopAmount = this.content.episodes > 0 ? this.content.episodes : 50
      for (var i = 0; i < loopAmount; i++) episodes.push([]);

      // check top level posts for mirrors
      for (var i = 0; i < top_level_posts.length; i++) {
        var post = top_level_posts[i];
        if (!post.tags || post.tags == 0) {
          // #epN should exist
          continue;
        }

        for (var j = 0; j < loopAmount; j++) {
          if (
            post.tags.includes("ep" + (j + 1)) &&
            post.data.json_metadata.attachment.isIframe()
          ) {
            // when edits occur, past tags all exist in the original posts 'data.tags' field
            // so instead, we look at *this posts in specific* tags
            var tags = thread.all_posts.find(
              p => p.transaction == post.transaction
            ).tags;

            // verify integrity of possible edit
            if (!tags || tags.includes("ep" + (j + 1))) {
              episodes[j].push(post);
              break; // should only be one ep per post
            }
          }
        }
      }

      // sort mirrors by greatest up votes
      for (var i = 0; i < episodes.length; i++) {
        episodes[i].sort((a, b) => b.up - a.up);
      }

      this.episodes = episodes;
    },
    async setAnimeDetails() {
      const mal = await maw.getAnimeInfo(this.content_id);
      this.content.title = mal.title;
      this.content.poster = mal.image_url;
      this.content.type = mal.type;
      this.content.episodes = mal.episodes ? mal.episodes : 0;
      this.content.status = mal.status;
      this.content.score = mal.score;
      this.content.synopsis = mal.synopsis;
      this.content.popularity = mal.popularity;
    },
    upvote() {},
    downvote() {},
    updateEpisode(episode) {
      this.selectEpisode(episode);
    },
    async selectEpisode(episode) {
      this.episode = episode
      this.$router.push({
        name: 'episode',
        params: {
          episode: episode
        }
      });
    },
    goToEpisodes() {
      this.selectedEpisode = null;
      this.$router.push({
        name: 'content',
        params: {
          content_id: this.content_id
        }
      });
    },
    maxEpisodes () {
      return this.episodesWithMirrors.length
    }
  },
  components: {
    Episode,
    Tag
  }
};
</script>

<style lang="scss" scoped>
@import '../../styles/global';
.container {
  .title {
    text-align: center;
  }
  .body {
    @include flexCenter(row, flex-start, flex-start, nowrap);
    @media (max-width: 900px) {
      position: relative;
      @include flexCenter;
      .left-col {
        order: 2;
        padding-left: 20px;
        padding-right: 20px;
        width: 100%;
        img {
          position: absolute;
          width: 35px;
          right: 0px;
          bottom: 0px;
        }
      }
      .right-col {
        order: 1,
      }
    }
    .left-col {
      @media (max-width: 900px) {
        padding: 0;
        @include flexCenter(row, flex-start, flex-start);
        div {
          flex: 1;
        }
      }
      img {
        &:hover {
          cursor:pointer;
        }
      }
      div {
        p {
          line-height: 15px;
          font-weight: bold;
          span {
            font-weight: normal;
          }
          &:first-child {
            padding-bottom: 5px;
            border-bottom: 2px solid black;
          }
        }
        .score:hover, .popularity:hover {
          cursor:pointer;
        }
      }
    }
    .right-col {
      padding-left: 20px;
      padding-right: 20px;
      width: 100%;
      @media (max-width: 900px) {
        padding: 0;
      }
      .breadcrumbs {
        margin: 5px;
        a:hover {
          cursor:pointer;
        }
      }
      .stream {
        background-color: $grey;
        padding: 20px;
        @media (max-width: 900px) {
          padding: 10px;
        }
        .episodes {
          @include flexCenter(row, flex-start);
          $margin: 2px;
          $cols: 6;
          button {
            @include flexCenter;
            margin: $margin;
            // flex: 1;
            @media (min-width: 1201px) {
              width: calc(100% / #{$cols} - #{$margin} * #{$cols - 4});
            }
            @media (max-width: 1200px) {
              width: calc(100% / #{$cols - 1} - #{$margin} * #{$cols - 4});
            }
            @media (max-width: 1000px) {
              width: calc(100% / #{$cols - 2} - #{$margin} * #{$cols - 4});
            }
            @media (max-width: 700px) {
              width: calc(100% / #{$cols - 4} - #{$margin} * #{$cols - 4});
            }
          }
        }
        p {
          font-weight: bold;
          padding-bottom: 5px;
          border-bottom: 2px solid black;
        }
      }
    }
  }
}
</style>