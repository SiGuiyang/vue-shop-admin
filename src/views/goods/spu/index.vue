<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.spuName"
                placeholder="spu名称"
                style="width: 200px;"
                class="filter-item"
                clearable
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
      <el-table-column label="spu名称"
                       align="left">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.spuName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="序号"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sequence }}</span>
        </template>
      </el-table-column>
      <el-table-column label="spu图标"
                       align="center">
        <template slot-scope="scope">
          <img v-if="scope.row.spuImage"
               :src="scope.row.spuImage"
               width="80"
               height="80" />
        </template>
      </el-table-column>
      <el-table-column label="更新时间"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作人"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.updateUser }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       class-name="small-padding fixed-width"
                       fixed="right"
                       width="300"
                       align="center">
        <template slot-scope="scope">
          <el-button type="warning"
                     icon="el-icon-s-operation"
                     size="small"
                     @click="handleClassification(scope.row)">商品分类</el-button>
          <el-button type="primary"
                     icon="el-icon-edit"
                     size="small"
                     @click="handleQuery(scope.row)">编辑</el-button>
          <el-button type="danger"
                     icon="el-icon-delete"
                     size="small"
                     @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0"
                :total="total"
                :page.sync="listQuery.page"
                :limit.sync="listQuery.pageSize"
                @pagination="getSpuList" />

    <i-form ref="dataForm"
            :form-data="formData" />
    <classification ref="classificationForm"
                    :spu="spu" />
  </div>
</template>

<script>
import { postSpuPage, deleteSpu } from '@/api/goods/spu'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import IForm from './form'
import Classification from './gcIndex'

export default {
  name: 'Spu',
  components: { Pagination, IForm, Classification },
  directives: { waves },
  data () {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        spuName: undefined,
        page: 1,
        pageSize: 10
      },
      dialogFormVisible: false,
      dialogFormTitle: '编辑',
      spu: {},
      formData: {
        id: undefined,
        sequence: undefined,
        spuName: undefined,
        spuImage: undefined,
        createUser: undefined,
        updateUser: undefined
      },
      rules: {
        className: [{ required: true, message: '分类名称不能为空', trigger: 'blur' }],
        icon: [{ required: true, message: '图片不能为空', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.getSpuList()
  },
  methods: {
    getSpuList () { // 商品分类列表
      this.listLoading = true
      postSpuPage(this.listQuery).then(response => {
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

      this.getSpuList()
    },
    restForm () {
      this.formData.id = undefined
      this.formData.classificationId = undefined
      this.formData.spuName = undefined
      this.formData.spuImage = undefined
      this.formData.sequence = undefined
      this.formData.createUser = undefined
      this.formData.updateUser = undefined
    },
    handleCreate () { // 创建
      const _this = this.$refs['dataForm']
      _this.dialogStatus = 'create'
      _this.dialogFormVisible = true
      this.restForm()
    },
    handleClassification (row) {
      const _this = this.$refs['classificationForm']
      _this.dialogFormVisible = true
      this.spu = {
        id: row.id,
        spuName: row.spuName
      }
    },
    handleQuery (row) { // 查看分类中的商品
      this.formData = Object.assign({}, row) // copy obj
      const _this = this.$refs['dataForm']
      _this.dialogStatus = 'update'
      _this.dialogFormVisible = true
    },
    handleDelete (row) {
      const params = {
        id: row.id
      }
      deleteSpu(params).then(() => {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.getSpuList()
      })
    }
  }
}
</script>
