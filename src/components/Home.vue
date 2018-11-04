
  <template>
  <div 
    v-loading="loading"
    element-loading-text="Loading..."
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    class="home">
    <div class="container bg-white px-4 py-4 u-h-100p rounded box-shadow-v1">
      <div class="row text-left">
        <div class="col-12 mb-2" style="position:relative">
          <h4> Newly Added
          </h4>
        </div>
      </div>
      <el-table
        :data="animes"
        :stripe="true"
        border
        @row-click="viewShow"
        style="width: 100%">
        <el-table-column
          prop="title"
          label="Name"
          sortable
          width="auto">
          <template slot-scope="scope">
            <div style="display:flex">
              <img :src="scope.row.image_url" style="width:auto;height:50px;margin-right:10px">
              <div class="flex-center"> {{ scope.row.title }} </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="type"
          label="Type"
          sortable
          width="180">
        </el-table-column>
        <el-table-column
          prop="episodes"
          sortable
          label="Episode Count">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import maw from "@/myanimewatch";
export default {
  name: 'Home',
  async created () {
    const date = new Date();
    const year = date.getFullYear();
    const month = this.getAnimeSeason(date.getMonth());
    const response = await maw.getSeasonAnime(year, month);
    this.animes = response.anime;
    this.loading = false;
  },
  data () {
    return {
      animes: [],
      loading: true
    }
  },
  methods: {
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
    },
    viewShow (row, event, tableInfo) {
      if (tableInfo.label === 'Name') {
        this.$router.push({
          name: 'content',
          params: {
            'content_id': row.mal_id
          }
        })
      }
    }
  }
}
</script>
<style lang="scss">
.home {
  tr {
    td:first-child:hover {
      cursor:pointer;
    }
  }
}
</style>