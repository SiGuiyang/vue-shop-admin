<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.spuName"
                placeholder="spu名称"
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
      <el-table-column label="spu名称"
                       align="center">
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
          <span><img :src="scope.row.spuImage"
                     alt=""></span>
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
                     @click="handleQuery(scope.row)">编辑</el-button>
          <el-button type="danger"
                     size="mini"
                     @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <i-form ref="dataForm"
            :form-data="formData" />
  </div>
</template>

<script>
import { postList } from '@/api/goods/spu'
import waves from '@/directive/waves' // Waves directive
import IForm from './form'

export default {
  name: 'Classification',
  components: { IForm },
  directives: { waves },
  data () {
    return {
      tableKey: 0,
      list: null,
      listLoading: false,
      listQuery: {
        spuName: undefined,
        page: 1,
        pageSize: 10
      },
      dialogFormVisible: false,
      dialogFormTitle: '编辑',
      formData: {
        id: undefined,
        classId: undefined,
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
    this.getList()
  },
  methods: {
    getList () { // 商品分类列表
      this.listLoading = true
      postList(this.listQuery).then(response => {
        this.list = response.data

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
    restForm () {
      this.formData.id = undefined
      this.formData.classId = undefined
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
    handleQuery (row) { // 查看分类中的商品
      this.formData = Object.assign({}, row) // copy obj
      const _this = this.$refs['dataForm']
      _this.dialogFormVisible = true
    },
    handleDelete (row) {
      this.formData = Object.assign({}, row) // copy obj
      const _this = this.$refs['dataForm']
      _this.dialogFormVisible = true
    }
  }
}
</script>
