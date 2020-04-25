<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.className"
                placeholder="分类名称"
                style="width: 200px;"
                class="filter-item" />
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

    <el-table v-loading="listLoading"
              :data="list"
              stripe
              fit
              highlight-current-row
              style="width: 100%;">
      <el-table-column label="分类名称"
                       width="160"
                       align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.className }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上级分类名称"
                       width="160"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.parentClassName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Banner名称"
                       width="300"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.bannerName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间"
                       width="200"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改人"
                       width="200"
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
                     @click="handleQuery(scope.row)">编辑</el-button>
          <el-button type="danger"
                     size="mini"
                     @click="handleDel(scope.row)">删除</el-button>
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
import { postList, putModify } from '@/api/goods/classification'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import IForm from './form'

export default {
  name: 'Classification',
  components: { Pagination, IForm },
  directives: { waves },
  data () {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      expand: false,
      listLoading: false,
      listQuery: {
        page: 1,
        pageSize: 10,
        className: undefined
      },
      banners: [],
      dialogFormVisible: false,
      dialogFormTitle: '编辑',
      formData: {
        id: undefined,
        className: undefined,
        icon: undefined,
        createUser: undefined
      },
      rules: {
        className: [{ required: true, message: '分类名称不能为空', trigger: 'blur' }],
        icon: [{ required: true, message: '图片不能为空', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () { // 商品分类列表
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

      this.getList()
    },
    handleCreate () { // 新增
      const _this = this.$refs['dataForm']
      _this.dialogStatus = 'create'
      _this.dialogFormVisible = true
      this.formData = {}
    },
    handleQuery (row) { // 查看分类中的商品
      this.formData = Object.assign({}, row) // copy obj
      const _this = this.$refs['dataForm']
      _this.dialogFormVisible = true
      _this.dialogStatus = 'update'
    },
    handleDel (row) { // 删除分类
      const params = {
        id: row.id,
        deleteStatus: true,
        updateUser: this.$store.state.user.username
      }
      putModify(params).then(() => {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        this.getList() // 刷新页面
      })
    }
  }
}
</script>
