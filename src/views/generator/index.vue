<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.tableSchema"
                 style="width: 200px;"
                 class="filter-item"
                 placeholder="请选择实例">
        <el-option v-for="item in tableSchemaOptions"
                   :key="item.tableSchema"
                   :label="item.tableSchemaName"
                   :value="item.tableSchema" />
      </el-select>
      <el-input v-model="listQuery.tableName"
                style="width: 200px;"
                class="filter-item"
                placeholder="请输入表名" />
      <el-button v-waves
                 class="filter-item"
                 type="primary"
                 icon="el-icon-search"
                 @click="handleFilter">搜索</el-button>
    </div>

    <el-table v-loading="listLoading"
              :data="list"
              stripe
              fit
              highlight-current-row
              style="width: 100%;">
      <el-table-column label="实例名"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.tableSchema }}</span>
        </template>
      </el-table-column>
      <el-table-column label="表名"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.tableName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="表注释"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.tableComment }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       width="180"
                       fixed="right"
                       class-name="small-padding fixed-width"
                       align="center">
        <template slot-scope="scope">
          <el-button v-permission="'ROLE_SUPER_ADMIN'"
                     type="primary"
                     size="mini"
                     @click="handleModify(scope.row)">编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0"
                :total="total"
                :page.sync="listQuery.page"
                :limit.sync="listQuery.pageSize"
                @pagination="getList" />
    <i-form ref="dataForm"
            :list="formData" />
  </div>
</template>

<script>
import { fetchList, getTableColumn } from '@/api/generate/generator'
import waves from '@/directive/waves' // Waves directive
import permission from '@/directive/permission'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import IForm from './form'

export default {
  name: 'Index',
  components: { Pagination, IForm },
  directives: { waves, permission },
  data () {
    return {
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        pageSize: 20,
        tableSchema: null,
        tableName: null
      },
      tableSchemaOptions: [
        { tableSchema: 'pager_order', tableSchemaName: '订单实例' },
        { tableSchema: 'pager_activity', tableSchemaName: '活动实例' },
        { tableSchema: 'pager_goods', tableSchemaName: '商品实例' },
        { tableSchema: 'pager_shop', tableSchemaName: '数据中心实例' },
        { tableSchema: 'pager_platform', tableSchemaName: '基础平台' }
      ],
      formData: [],
      selectedTable: null,
      selectedSchema: null
    }
  },
  methods: {
    handleFilter () {
      this.listQuery.page = 1
      this.getList()
    },
    getList () {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.total
        this.list.forEach(k => {
          k.roleIds = JSON.parse(k.roleIds)
        })

        setTimeout(() => {
          this.listLoading = false
        }, 1500)
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleModify (row) {
      const params = { tableName: row.tableName, tableSchema: row.tableSchema }
      const _this = this.$refs['dataForm']
      getTableColumn(params).then(response => {
        this.formData = response.data
        _this.dialogFormVisible = true
        _this.tableName = row.tableName
        _this.tableSchema = row.tableSchema
      })
    }
  }
}
</script>

<style scoped>
</style>
