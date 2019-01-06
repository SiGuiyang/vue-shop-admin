<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="$t('goods.classificationName')" v-model="listQuery.classificationName" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;">
      <el-table-column :label="$t('table.id')" prop="id" align="center" min-width="25">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('goods.classificationName')" min-width="55" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.goodsName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('goods.goodsImg')" min-width="80" align="center">
        <template slot-scope="scope">
          <span class="link-type">{{ scope.row.icon }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('goods.createTime')" min-width="55" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.operationUser')" min-width="55" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.operationUser }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" min-width="50" class-name="small-padding fixed-width" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleQuery(scope.row.id)">{{ $t('table.edit') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getClassificationList" />

  </div>
</template>

<script>
import { fetchClassificationList } from '@/api/goods'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'Classification',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        pageSize: 20,
        classificationName: undefined
      },
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getClassificationList()
  },
  methods: {
    getClassificationList() { // 商品分类列表
      this.listLoading = true
      fetchClassificationList(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.total

        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleFilter() { // 搜索
      this.listQuery.page = 1
      if (this.listQuery.beginTime !== undefined &&
        this.listQuery.endTime !== undefined &&
        this.listQuery.beginTime.getTime() > this.listQuery.endTime.getTime()) {
        this.$message({
          message: '开始时间不能大于结束时间',
          type: 'warning'
        })

        return
      }

      this.getClassificationList()
    },
    handleQuery(gcsId) { // 查看分类中的商品

    }
  }
}
</script>
