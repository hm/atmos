
<template>
<div>
    <div class="container bg-white px-4 py-4 u-h-100p rounded box-shadow-v1">
      <div class="row text-center">
        <div class="col-12 ">
          <h1> Search </h1>
        </div>
        <div class="row text-left">
        <!-- <div class="col-12 mb-2" style="position:relative">
          <div class="filter" style="position:absolute;right: 15px;display:flex">
            <el-select @change="search" style="width:150px" v-model="limit" placeholder="page">
              <el-option v-for="i in 10" :label="`page ${i}`" :value="i" :key="`showing-${i}`"></el-option>
            </el-select>
          </div>
        </div> -->
      </div>
        <div class="flex-center col-12">
          <div style="position:relative;width:600px;" class="flex filter">
            <i style="position:absolute;top:12px;left:10px;" class="fa fa-search"></i>
            <el-input @keyup.enter="search()" type="text" placeholder="search" v-model="searchString"> </el-input>
            <!-- <el-select style="width:300px" v-model="searchType" placeholder="filter by">
              <el-option label="All" value="All" default></el-option>
              <el-option label="Title" value="Title" ></el-option>
              <el-option label="Character" value="Character" ></el-option>
              <el-option label="Actor" value="Actor" ></el-option>
              <el-option label="Genres" value="Genres" ></el-option>
            </el-select> -->
            <!-- <el-select style="width:300px" v-model="status" placeholder="status">
              <el-option label="All Status" value="" ></el-option>
              <el-option label="Ongoing" value="Ongoing" ></el-option>
              <el-option label="Complete" value="Complete" ></el-option>
            </el-select> -->
            <el-button type="primary" plain @click="search()" class="btn btn-info" style="line-height: 0;border-radius:0 5px 5px 0">Search</el-button>
          </div>
        </div>
      </div>
      <!-- <template>
        <div class="flex-center flex-wrap">
          <div class="col-6">
            <div>
              <b>Filter by Genres (Multi-Select):</b>
            </div>
            <div>
            </div>
            <div v-for="(genre, index) in genres" class="inline-flex">
              <span @click="toggleGenre(index)" class="badge bg-blue hover" style="margin:2px" :class="{'bg-green': selectedGenres.indexOf(index) !== -1 }" >{{ genre }} </span>
            </div>
            <span @click="selectedGenres = []" class="badge bg-red hover" style="margin:2px"> Clear Selected Genres </span>
          </div>
        </div>

        <div class="flex-center flex-wrap mt-5">
          <div class="col-12 flex-center">
            <div v-for="(letter, index) in letters" class="inline-flex">
              <span @click="filterByFirstLetter(index)" :class="{'bg-green': index === selectedLetter || index === 0 && selectedLetter === ''}" class="badge bg-blue hover" style="margin:2px;min-width:20px">
                {{ letter }}
              </span>
            </div>
          </div>
        </div>
      </template> -->
        <div v-loading="loading" class="flex-center" style="flex-wrap: wrap;justify-content: flex-start;min-height:120px;align-items:center">
            <div
              :key="show.id"
              @click="$router.push({name: 'content', params: {'contentId': show.id} })"
              class="flex-center col-12 show"
              v-for="show in getShows"
              style="align-items:flex-start;justify-content:flex-start;margin-top:20px;line-height: 17px;">
              <img :src="show.banner" style="width:auto;height:70px;margin-right:10px">
              <div class="full-width flex">
                <div style="flex: 1">
                  <div class="title">{{ show.title }} </div>
                  <div> {{ show.type }} ({{ show.episodes }} eps)</div>
                  <div> Score: {{ show.score }} </div>
                </div>
                <div style="flex: 6">
                  <div v-html="show.synopsis" />
                </div>
              </div>
            </div>
            <div v-if="getShows.length === 0" class="flex-center full-width" style="text-align:center">
              <h1> There are no shows that meet your criteria</h1>
            </div>
        </div>
        <div class="flex-center mt-5">
          <el-pagination
            background
            layout="prev, pager, next, jumper"
            :current-page.sync="currentPage"
            @current-change="changePage"
            :page-size="getPageSize()"
            :total="max">
          </el-pagination>
        </div>
    </div>
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
</template>

<script>

export default {
  name: 'Home',
  computed: {

  },
  data () {
    return {
      step: 0,
      status: '',
      searchString: '',
      searchType: 'All',
      selectedGenres: [],
      genres: ['Action', 'Mystery', 'Horror', 'Psychological','Supernatural', 'Drama', 'Seinen', 'Drama', 'Romance', 'Comedy', 'Sci-Fi', 'Thriller'],
      showList: [],
      loading: false,
      currentPage: 1,
      selectedLetter: '',
      limit: '',
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
      skip: 0,
      max: 0,
      formLabelWidth: '100px',
      dialogFormVisible: false,
      letters: ['All', '#', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'X', 'Y', 'Z']
    }
  },
  methods: {
    changePage (newPage) {
      this.currentPage = newPage
      console.log('skip ', (newPage - 1) * this.limit)
      this.skip = (newPage - 1) * this.limit
      this.search()
    },
    getPageSize () {
      if (this.limit === "0") return parseInt(this.max)
      else return parseInt(this.limit)
    },
    filterByFirstLetter (index) {
      this.currentPage = 1
      this.skip = 0
      const letter = this.letters[index]
      if (letter !== 'All') {
        this.selectedLetter = index
      } else {
        this.selectedLetter = ''
      }
      this.$forceUpdate()
      this.search()
    },
    toggleGenre (index) {
      if (this.selectedGenres.indexOf(index) === -1) {
        this.selectedGenres.push(index)
      } else {
        this.selectedGenres.splice(this.selectedGenres.indexOf(index), 1)
      }
    },
    async search () {
      if (this.searchString.trim() !== '') {
        this.loading = true
        let options = {
          query: this.searchString,
          limit: parseInt(this.skip)
        }
        let regex = []
        try {
          const response = await this.searchShows(options)
          console.log(response)
          this.currentPage = response.data.current
          this.max = response.data.total
          console.log(this.currentpage, this.max)
          this.loading = false
        } catch (error) {
          this.loading = false
          console.log(error)
        }
      } else {
        this.$notify.error({
          title: 'Error',
          message: 'Your search is empty'
        })
      }
    }
  }
}
</script>

<style scoped>
.filter {
  height: 40px;
}
.hover:hover {
  cursor:pointer;
  opacity:0.5;
}
.show:hover {
  cursor:pointer;
  opacity:0.5;
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
.bg-yellow {
  background-color: rgb(194, 194, 0);
}
.bg-teal {
  background-color:teal;
}
.bg-grey {
  background-color: #eee;
}
.bg-green {
  background-color: green;
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
}
.flex-column {
  flex-direction: column;
}
</style>
