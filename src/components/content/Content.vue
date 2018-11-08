
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
          <img :src="content.poster">
          <div>
            <p> Information </p>
            <p> Type: <tag :label="content.type" /> </p>
            <p> Episodes: <span> {{ content.episodes || 'unknown' }} </span> </p>
            <p> Status: <span> {{ content.status }} </span> </p>
          </div>
          <div>
            <p> Statistics
            <p> Score: <span> {{ content.score }} </span> </p>
            <p> Popularity: <span> #{{ content.popularity }} </span> </p>
          </div>
        </div>
        <div class="right-col">
          <div class="breadcrumbs">
            <a> Anime </a> /
            <a> {{ content.title }} </a> /
            <a @click="goToEpisodes()"> Episodes </a> /
            <a v-if="episode > 0"> Episode {{ episode }} </a>
          </div>
          <div class="stream">
            <template v-if="episode === 0">
              <div class="episodes">
                <template v-if="episodesWithMirrors.length > 0">
                  <el-button
                    type="info"
                    v-for="(mirrors, index) in episodesWithMirrors"
                    :key="mirrors.id"
                    @click="selectEpisode(index + 1)">
                    episode {{ (index + 1) }}
                  </el-button>
                </template>
                <h1 v-else>
                  No Mirrors found for this series
                </h1>
              </div>
              <p> Synopsis </p>
              <div class="flex-center" v-html="content.synopsis" />
            </template>
            <episode
              v-else
              :mirrors="episodesWithMirrors || []"
              :maxEpisodes="maxEpisodes()"
              :index="parseInt(episode - 1)"
              @next="nextEpisode()"
              @prev="prevEpisode()"
              />
          </div>
        </div>
      </div>
    </div> <!-- END container-->
  </div>
</template>

<script>
import maw from "@/myanimewatch";
import { EPISODE, CONTENT } from "@/constants/routes";
import Episode from '@/components/content/Episode'
import Tag from '@/components/modules/Tag'

export default {
  name: "Home",
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
  },
  computed: {
    episodesWithMirrors () {
      return this.episodes.filter(x => x.length > 0)
    },
  },
  methods: {
    async load() {
      this.loading = true;
      this.episode = this.$route.params.episode
        ? this.$route.params.episode
        : 0;

      if (this.content_id != this.$route.params.content_id) {
        this.content_id = this.$route.params.content_id;

        await this.setAnimeDetails();
        await this.setThreadDetails();
      }
      this.loading = false;
    },
    async setThreadDetails() {
      const thread = await maw.getEpisodeThread(this.content_id);
      var top_level_posts = thread.main_post.children.slice();
      top_level_posts.splice(0, 0, thread.main_post);

      var episodes = []; // maybe theres a short hand for this...
      for (var i = 0; i < this.content.episodes; i++) episodes.push([]);

      // check top level posts for mirrors
      for (var i = 0; i < top_level_posts.length; i++) {
        var post = top_level_posts[i];
        if (!post.data.tags || post.data.tags == 0) {
          // #epN should exist
          continue;
        }

        for (var j = 0; j < this.content.episodes; j++) {
          if (
            post.data.tags.includes("ep" + (j + 1)) &&
            post.data.json_metadata.attachment.isIframe()
          ) {
            // when edits occur, past tags all exist in the original posts 'data.tags' field
            // so instead, we look at *this posts in specific* tags
            var tags = thread.all_posts.find(
              p => p.transaction == post.transaction
            ).data.tags;

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
    prevEpisode() {
      this.selectEpisode(parseInt(this.episode) - 1);
    },
    nextEpisode() {
      this.selectEpisode(parseInt(this.episode) + 1);
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
        name: CONTENT,
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
    display: flex;
    justify-content: center;
    align-items: flex-start;
    .left-col {
      div {
        p {
          line-height: 15px;
          font-weight: bold;
          span {
            font-weight: normal;
          }
        }
        p:first-child {
          padding-bottom: 5px;
          border-bottom: 2px solid black;
        }
      }
    }
    .right-col {
      padding-left: 20px;
      padding-right: 20px;
      width: 100%;
      .breadcrumbs {
        margin: 5px;
        a:hover {
          cursor:pointer;
        }
      }
      .stream {
        background-color: $grey;
        padding: 20px;
        .episodes {
          @include flexCenter(row, flex-start);
          $cols: 6;
          $margin: 2px;
          button {
            margin: $margin;
            width: calc(100% / #{$cols} - #{$margin * 2});
            @include flexCenter;
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
