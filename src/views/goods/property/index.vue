<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.propertyName"
                placeholder="属性名称"
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
      <el-table-column label="属性名称"
                       align="left">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.propertyName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="所属属性组"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.propertyGroupName }}</span>
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
          <span>{{ scope.row.createUser }}</span>
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
    <pagination v-show="total>listQuery.pageSize"
                :total="total"
                :page.sync="listQuery.page"
                :limit.sync="listQuery.pageSize"
                @pagination="getList" />
    <i-form ref="dataForm"
            :form-data="formData" />
  </div>
</template>

<script>
import { postList, putModify } from '@/api/goods/property'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination'
import IForm from './form'

export default {
  name: 'GoodsProperty',
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
        propertyName: undefined
      },
      dialogFormVisible: false,
      dialogFormTitle: '编辑',
      formData: {
        id: undefined,
        groupId: undefined,
        propertyName: undefined,
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
      this.formData.propertyName = undefined
      this.formData.propertyGroupId = undefined
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
        deleteStatus: true,
        updateUser: this.$store.state.user.username
      }
      putModify(params).then(() => {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.getList()
      })
    }
  }
}
</script>
