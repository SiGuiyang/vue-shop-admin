<template>
  <el-dialog :title="gcTitle"
             :visible.sync="dialogFormVisible"
             width="60%"
             @opened="handleOpen">
    <el-button v-waves
               class="filter-item"
               type="primary"
               icon="el-icon-edit"
               @click="handleCreate">新增</el-button>

    <el-table v-loading="listLoading"
              :data="list"
              stripe
              fit
              highlight-current-row
              style="width: 100%;">
      <el-table-column label="分类名称"
                       align="left">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.className }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="序号"
                       align="center">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.sequence }}</el-tag>
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
                       width="220"
                       align="center">
        <template slot-scope="scope">
          <el-button type="primary"
                     size="small"
                     icon="el-icon-edit"
                     @click="handleQuery(scope.row)">编辑</el-button>
          <el-button type="danger"
                     size="small"
                     icon="el-icon-delete"
                     @click="handleDel(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <gc-form ref="dataForm"
             :form-data="formData"
             :spu="spu" />
  </el-dialog>
</template>

<script>
import { postClassificationList, deleteClassification } from '@/api/goods/classification'
import waves from '@/directive/waves' // Waves directive
import GcForm from './gcForm'

export default {
  name: 'Classification',
  components: { GcForm },
  directives: { waves },
  props: {
    spu: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      gcTitle: null,
      list: null,
      listLoading: false,
      listQuery: {
        className: undefined
      },
      dialogFormVisible: false,
      formData: {
        id: undefined,
        className: undefined,
        sequence: undefined
      }
    }
  },
  methods: {
    handleOpen () {
      this.gcTitle = '商品分类 - ' + this.spu.spuName
      this.getList()
    },
    getList () { // 商品分类列表
      this.listLoading = true
      postClassificationList({ spuId: this.spu.id }).then(response => {
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
      deleteClassification({ id: row.id }).then(() => {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.getList() // 刷新页面
      })
    }
  }
}
</script>
