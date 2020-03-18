<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.brandGroupName"
                placeholder="品牌组名称"
                style="width: 200px;"
                class="filter-item"
                @keyup.enter.native="handleFilter" />
      <el-button v-waves
                 class="filter-item"
                 type="primary"
                 icon="el-icon-search"
                 @click="handleFilter">搜索</el-button>
      <el-button v-waves
                 class="filter-item"
                 type="primary"
                 icon="el-icon-edit"
                 @click="handleCreate">新增</el-button>
    </div>

    <el-table :key="tableKey"
              v-loading="listLoading"
              :data="list"
              stripe
              fit
              highlight-current-row
              style="width: 100%;">
      <el-table-column label="品牌组名称"
                       align="center">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.brandGroupName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="序号"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sequence }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改人"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.updateUser }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       class-name="small-padding fixed-width"
                       fixed="right"
                       align="center">
        <template slot-scope="scope">
          <el-button type="primary"
                     size="mini"
                     @click="handleModify(scope.row)">编辑</el-button>
          <el-button type="danger"
                     size="mini"
                     @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0"
                :total="total"
                :page.sync="listQuery.page"
                :limit.sync="listQuery.pageSize"
                @pagination="getList" />
    <i-form ref="dataForm"
            :form-data="formData" />
  </div>
</template>

<script>
import { postList, putModify } from '@/api/goods/group'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination'
import IForm from './form'

export default {
  name: 'GoodsBrandGroup',
  components: { IForm, Pagination },
  directives: { waves },
  data () {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        pageSize: 10,
        brandGroupName: undefined,
        timeRange: undefined
      },
      dialogFormVisible: false,
      dialogFormTitle: '编辑',
      formData: {
        id: undefined,
        sequence: 0,
        brandGroupName: undefined,
        createUser: undefined,
        updateUser: undefined
      }
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () { // 商品品牌列表
      this.listLoading = true
      postList(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.total
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleFilter () { // 搜索
      this.listQuery.page = 1
      console.log(this.listQuery)
      this.getList()
    },
    restForm () {
      this.formData.id = undefined
      this.formData.brandGroupName = undefined
      this.formData.sequence = 0
      this.formData.createUser = undefined
      this.formData.updateUser = undefined
    },
    handleCreate () { // 创建
      const _this = this.$refs['dataForm']
      _this.dialogStatus = 'create'
      _this.dialogFormVisible = true
      this.restForm()
    },
    handleModify (row) { // 编辑弹框
      this.formData = Object.assign({}, row) // copy obj
      const _this = this.$refs['dataForm']
      _this.dialogStatus = 'update'
      _this.dialogFormVisible = true
    },
    handleDelete (id) { // 删除
      const params = {
        id: id,
        updateUser: this.$store.state.user.username,
        deleteStatus: true
      }
      putModify(params).then(() => {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        this.getList()
      })
    }
  }
}
</script>
