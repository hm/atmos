
<template>
<div>
    <div class="container bg-white px-4 py-4 u-h-100p rounded box-shadow-v1">
      <div class="row text-left">
        <div class="col-12 mb-2" style="position:relative">
          <h4> Newly Added
          </h4>
        </div>
      </div>
      <div class="col-12 flex-center">
        <el-dialog append-to-body title="Submit New Series" :visible.sync="dialogFormVisible">
          <el-form :model="form">
            <el-form-item label="Title" :label-width="formLabelWidth">
              <el-input v-model="form.name" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="Description" :label-width="formLabelWidth">
              <el-input type="textarea"></el-input>
            </el-form-item>
            <el-form-item label="Type" :label-width="formLabelWidth">
              <el-select v-model="form.region" placeholder="Select a series type">
                <el-option label="Anime" value="0" ></el-option>
                <el-option label="TV show" value="1"></el-option>
                <el-option label="Movie" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">Cancel</el-button>
            <el-button type="primary" @click="dialogFormVisible = false">Confirm</el-button>
          </span>
        </el-dialog>
      </div>
      <el-table
        :data="subset"
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
              <img :src="scope.row.poster" style="width:auto;height:50px;margin-right:10px">
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

export default {
  name: 'Home',
  methods: {
  },
  computed: {
    subset () {
      if (this.getShows !== null) {
        return this.getShows.map(x => {
          let obj = {
            id: x._id.$oid,
            poster: x.poster,
            title: x.title,
            type: x.show_type,
            episodes: x.episodes,
            status: x.status,
            score: x.score
          }
          return obj
        })
      } else {
        return []
      }
    }
  },
  data () {
    return {
      step: 0,
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      formLabelWidth: '100px',
      dialogFormVisible: false,
      status: null,
      searchString: '',
      selectedGenres: [],
      genres: ['Action', 'Mystery', 'Horror', 'Psychological','Supernatural', 'Drama', 'Seinen', 'Drama', 'Romance', 'Comedy', 'Sci-fi', 'Thriller'],
      showList: [],
      loading: false
    }
  },
  methods: {
    viewShow (row, event, tableInfo) {
      if (tableInfo.label === 'Name') {
        this.$router.push({name: 'content', params: {'contentId': row.id} })
      }
    },
    search () {
      this.loading = true
      const options = {
        genres: this.selectedGenres,
        status: this.status,
        string: this.searchString
      }
      this.searchShows(options).then(response => {
        console.log(response)
        this.showList = response
        this.step = 1
        this.loading = false
      })
    }
  }
}
</script>
<style>
.el-table--striped .el-table__body tr.el-table__row--striped td{
  background-color: #eee;
}
.el-table--border td:first-child .cell:hover {
  cursor: pointer;
}
</style>
<style scoped>
.show:hover {
  cursor:pointer;
  opacity:0.8;
}
.full-width {
  width: 100%;
}
.title {
  font-weight: bold;
}
.rounded {
  border-radius:5px;
}
.inline-flex {
  display:inline-flex;
}
.hover:hover {
  cursor:pointer;
}
.flex-wrap {
  flex-wrap: wrap;
}
.bold {
  font-weight:bold;
}
.sm-line-height {
  line-height:15px;
}
.border-bottom{
  border-bottom: 2px solid black;
  padding-bottom: 5px;
}
.bg-grey {
  background-color: #eee;
}
.big-badge {
  font-size:20px;
}
.sm-font {
  font-size:12px;
}
.ultra-lg {
  font-size:35px;
  font-weight:bold;
}
.flex-center {
  display:flex;
  justify-content: center;
  align-items: center;
}
.flex-column {
  flex-direction: column;
}
</style>
