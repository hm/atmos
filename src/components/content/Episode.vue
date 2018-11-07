<template>
  <div :key="`episode-${index}`" class="episode">
    <div>
      <el-select v-model="selectedMirrorString">
        <el-option 
          v-for="mirror in mirrors[index]"
          :key="mirror.id"
          :value="getMirrorLabel(mirror)">
        </el-option>
      </el-select>
    </div>

    <div v-if="selectedMirror">
      <iframe
        :src="selectedMirror.data.json_metadata.attachment.value" 
        :key="selectedMirror.id" 
        allow="encrypted-media" 
        allowfullscreen />

      <div>
        <h4> 
        posted by {{ selectedMirror.data.poster }} 
        <i @click="upvote()" class="fa fa-thumbs-up green hover" aria-hidden="true" />: {{ selectedMirror.up }} 
        </h4>
      </div>
    </div>
    <h4>
      <i @click="$emit('prev')" v-if="episode > 1" class="el-icon-caret-left hover" aria-hidden="true"/>
      <span> Episode {{ episode }} </span>
      <i @click="$emit('next')" v-if="episode < maxEpisodes" class="el-icon-caret-right hover" aria-hidden="true"/>
    </h4>
  </div>
</template>

<script>
export default {
  name: "Episode",
  props: [
    'index',
    'maxEpisodes',
    'mirrors',
  ],
  data () {
    return {
      selectedMirrorString: undefined,
      selectedMirror: undefined,
    }
  },
  computed: {
    episode () {
      return this.index + 1
    }
  },
  methods: {
    setSelectedMirrorString () {
      console.log(this.mirrors[this.index])
      this.selectedMirrorString = this.mirrors[this.index][0] ? this.getMirrorLabel(this.mirrors[this.index][0]) : []
    },
    setSelectedMirror (mirror) {
      this.selectedMirror = this.mirrors[this.index].find(mirror => this.getMirrorLabel(mirror) === this.selectedMirrorString)
    },
    getBaseLink (mirror) {
      return mirror.data.json_metadata.attachment.value.match(/^.+?[^\/:](?=[?\/]|$)/)[0]
    },
    getMirrorLabel (mirror) {
      return `${this.getBaseLink(mirror)} - ${mirror.data.poster} - ${mirror.up} upvotes`
    },
  },
  watch: {
    episode: {
      handler: 'setSelectedMirrorString',
      immediate: true
    },
    selectedMirrorString: {
      handler: 'setSelectedMirror',
      immediate: true
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../styles/global';
.episode {
  @include flexCenter(column);
  div {
    width: 100%;
    @include flexCenter(column);
    iframe {
      width: 50vw;
      height: 28.125vw;
      min-height: 260px;
      overflow: auto;
    }
  }
}
</style>