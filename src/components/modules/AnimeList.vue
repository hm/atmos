<template>
  <el-table
    class="table"
    :data="animes"
    :stripe="true"
    border
    @row-click="viewShow">
    <el-table-column
      prop="title"
      label="Name"
      sortable
      width="auto">
      <template slot-scope="scope">
        <div>
          <img :src="scope.row.image_url">
          <div class="flex-center"> {{ scope.row.title }} </div>
        </div>
      </template>
    </el-table-column>
    <el-table-column
      prop="type"
      label="Type"
      sortable
      width="100">
    </el-table-column>
    <el-table-column
      prop="episodes"
      sortable
      label="Episodes"
      width="100">
      <template slot-scope="scope">
        <div class="flex-center"> {{ scope.row.episodes || 'unknown' }} </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: 'anime-list',
  props: {
    animes: Array
  },
  mounted () {
    console.log(this.animes)
  },
  methods: {
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
@import '../../styles/global';
.table {
  width: 100%;
  @media (max-width: 900px) {
    table {
      table-layout: auto;
    }
  }
  tr {
    td:first-child:hover {
      cursor:pointer;
    }
    @media (max-width: 900px) {
      td:not(:first-child), th:not(:first-child) {
        display: none;
      }
      table {
        table-layout: auto;
      }
    }
  }
  div {
    @include flexCenter(row, flex-start, center, nowrap);
    img {
      width:auto;
      height:50px;
      margin-right:10px;
    }
  }
}
</style>