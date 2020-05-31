<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.bizType"
                style="width: 200px;"
                class="filter-item"
                placeholder="模型" />
      <el-input v-model="listQuery.name"
                style="width: 200px;"
                class="filter-item"
                placeholder="表单名称" />
      <el-button v-waves
                 class="filter-item"
                 type="primary"
                 icon="el-icon-search"
                 @click="handleFilter">搜索</el-button>
      <el-button class="filter-item"
                 style="margin-left: 10px;"
                 type="primary"
                 icon="el-icon-edit"
                 @click="handleCreate">创建
      </el-button>
    </div>

    <el-table v-loading="listLoading"
              :data="list"
              stripe
              fit
              highlight-current-row
              style="width: 100%;">
      <el-table-column label="模型"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.bizType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="表单名称"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       fixed="right"
                       class-name="small-padding fixed-width"
                       align="center">
        <template slot-scope="scope">
          <el-button type="primary"
                     @click="handleModify(scope.row)">编辑
          </el-button>
          <el-button type="success"
                     @click="handleFormSettingModel(scope.row)">预览表单
          </el-button>
          <el-button type="danger"
                     @click="handleFormSettingModel(scope.row)">表单模型设置
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>listQuery.pageSize"
                :total="total"
                :page.sync="listQuery.page"
                :limit.sync="listQuery.pageSize"
                @pagination="handleList" />
    <i-form ref="dataForm"
            :form-data="formData" />
    <dynamic-view-form ref="dynamicViewForm" />
  </div>
</template>

<script>
import { postFormList } from '@/api/generate/form'
import waves from '@/directive/waves' // Waves directive
import permission from '@/directive/permission'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import IForm from './form'
import DynamicViewForm from './dynamic'

export default {
  name: 'Dynamic',
  components: { Pagination, IForm, DynamicViewForm },
  directives: { waves, permission },
  data () {
    return {
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        pageSize: 20,
        bizType: null,
        name: null
      },
      formData: {}
    }
  },
  created () {
    this.handleList()
  },
  methods: {
    handleFilter () {
      this.listQuery.page = 1
      this.handleList()
    },
    handleList () {
      this.listLoading = true
      postFormList(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.total

        setTimeout(() => {
          this.listLoading = false
        }, 1500)
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleCreate () {
      const _this = this.$refs['dataForm']
      this.formData = {}
      _this.dialogStatus = 'create'
      _this.dialogFormVisible = true
      _this.bizTypeDisabled = false
    },
    handleModify (row) {
      this.formData = Object.assign({}, row) // copy obj
      const _this = this.$refs['dataForm']
      _this.dialogStatus = 'update'
      _this.dialogFormVisible = true
      _this.bizTypeDisabled = true
    },
    handleFormSettingModel () {
      const _this = this.$refs['dynamicViewForm']
      _this.dialogDynamicVisible = true
    }
  }
}
</script>
