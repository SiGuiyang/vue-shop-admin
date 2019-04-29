<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button v-permission="'ROLE_ADMIN'" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
      <el-button v-permission="'ROLE_ADMIN'" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleBatchCreate">批量拉黑</el-button>
    </div>
    <!--表格渲染-->
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;">
      <el-table-column prop="phone" label="手机号码"/>
      <el-table-column prop="createTime" label="创建时间"/>
      <el-table-column prop="deleteStatus" label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.deleteStatus" type="success">已移除</el-tag>
          <el-tag v-else type="danger">黑名单</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createUser" label="创建人"/>
      <el-table-column label="操作" width="180" fixed="right" class-name="small-padding fixed-width" align="center">
        <template slot-scope="scope">
          <el-button v-permission="'ROLE_ADMIN'" type="primary" size="mini" @click="handleModify(scope.row)">编辑</el-button>
          <el-button v-permission="'ROLE_ADMIN'" v-if="scope.row.deleteStatus" type="danger" size="mini" @click="handleBlack(scope.row.id, false)">拉入</el-button>
          <el-button v-permission="'ROLE_ADMIN'" v-else type="success" size="mini" @click="handleBlack(scope.row.id, true)">移除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getList" />
    <i-form ref="dataForm" :form-data="formData"/>
    <i-send ref="dataSend"/>
  </div>
</template>

<script>
import { fetchList, del, modify } from '@/api/blackList'
import waves from '@/directive/waves' // Waves directive
import permission from '@/directive/permission'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import IForm from './form'
import ISend from './send'
import { getAccessToken } from '@/utils/auth'
import Constants from '@/utils/constants'
export default {
  components: { Pagination, IForm, ISend },
  directives: { waves, permission },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        pageSize: 20
      },
      formData: {}
    }
  },
  computed: {
    actionURL() {
      return process.env.BASE_API + '/admin/upload?access_token=' + getAccessToken(Constants.access_token)
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.total

        setTimeout(() => {
          this.listLoading = false
        }, 1500)
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleUploadSuccess(respnse) {
      this.publishCoupon.file = respnse.data.url
    },
    handleCreate() {
      const _this = this.$refs['dataForm']
      _this.dialogStatus = 'create'
      _this.dialogFormVisible = true
      this.formData = {}
    },
    handleBatchCreate() {
      const _this = this.$refs['dataSend']
      _this.sendFormVisible = true
    },
    handleModify(row) {
      this.formData = Object.assign({}, row) // copy obj
      const _this = this.$refs['dataForm']
      _this.dialogStatus = 'update'
      _this.dialogFormVisible = true
    },
    handleDelete(id) {
      del(id).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功'
        })
        this.getList()
      })
    },
    handleBlack(id, deleteStatus) {
      modify({ id: id, deleteStatus: deleteStatus }).then(() => {
        this.$message({
          type: 'success',
          message: '操作成功'
        })
        this.getList()
      })
    }
  }
}
</script>

<style scoped>

</style>
