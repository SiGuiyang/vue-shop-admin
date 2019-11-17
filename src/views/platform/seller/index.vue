<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.brandName" placeholder="品牌名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-date-picker
        :default-time="['00:00:00', '23:59:59']"
        v-model="listQuery.timeRange"
        type="datetimerange"
        value-format="yyyy-MM-dd HH:mm:ss"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        class="filter-item"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">新增</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      stripe
      fit
      highlight-current-row
      style="width: 100%;">
      <el-table-column label="品牌名称" width="160" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.brandName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属品牌组" width="160" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.brandGroupName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="品牌图标" width="240" align="center">
        <template slot-scope="scope">
          <span><img :src="scope.row.icon"></span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改人" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createUser }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" class-name="small-padding fixed-width" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleModify(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getList" />
    <i-form ref="dataForm" :form-data="formData" :brand-group="brandGroup"/>
  </div>
</template>

<script>
import { getList, modify } from '@/api/goods/brand'
import { listAll } from '@/api/goods/group'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination'
import IForm from './form'

export default {
  name: 'Classification',
  components: { IForm, Pagination },
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
        brandName: undefined,
        timeRange: undefined
      },
      dialogFormVisible: false,
      dialogFormTitle: '编辑',
      brandGroup: [],
      formData: {
        id: undefined,
        brandGroupId: undefined,
        sequence: undefined,
        brandName: undefined,
        brandCode: undefined,
        icon: undefined,
        createUser: undefined,
        updateUser: undefined
      }
    }
  },
  created() {
    this.getList()
    this.getBrandGroupList()
  },
  methods: {
    getList() { // 商品品牌列表
      this.listLoading = true
      getList(this.listQuery).then(response => {
        this.list = response.data

        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      }).catch(() => {
        this.listLoading = false
      })
    },
    getBrandGroupList() {
      listAll().then((response) => {
        this.brandGroup = response.data
      })
    },
    handleFilter() { // 搜索
      this.listQuery.page = 1
      console.log(this.listQuery)
      this.getList()
    },
    restForm() {
      this.formData.id = undefined
      this.formData.brandName = undefined
      this.formData.icon = undefined
      this.formData.createUser = undefined
      this.formData.brandGroupId = undefined
      this.formData.sequence = undefined
      this.formData.brandCode = undefined
      this.formData.icon = undefined
      this.formData.createUser = undefined
      this.formData.updateUser = undefined
    },
    handleCreate() { // 创建
      const _this = this.$refs['dataForm']
      _this.dialogStatus = 'create'
      _this.dialogFormVisible = true
      this.restForm()
    },
    handleModify(row) { // 编辑弹框
      this.formData = Object.assign({}, row) // copy obj
      const _this = this.$refs['dataForm']
      _this.dialogStatus = 'update'
      _this.dialogFormVisible = true
    },
    handleDelete(id) { // 删除
      const params = {
        id: id,
        deleteStatus: true,
        updateUser: this.$store.state.user.username
      }
      modify(params).then(() => {
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
