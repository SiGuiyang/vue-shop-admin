<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.keyword"
                placeholder="手机号码"
                style="width: 200px;"
                clearable
                class="filter-item" />
      <el-select v-model="listQuery.state"
                 placeholder="状态"
                 clearable
                 class="filter-item">
        <el-option :value="true"
                   label="移除" />
        <el-option :value="false"
                   label="白名单" />
      </el-select>
      <el-date-picker v-model="listQuery.range"
                      type="datetimerange"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      :default-time="['00:00:00', '23:59:59']"
                      class="filter-item">
      </el-date-picker>
      <el-button v-waves
                 class="filter-item"
                 type="primary"
                 icon="el-icon-search"
                 @click="handleFilter">搜索</el-button>
      <el-button class="filter-item"
                 style="margin-left: 10px;"
                 type="primary"
                 icon="el-icon-edit"
                 @click="handleCreate">添加
      </el-button>
      <el-button class="filter-item"
                 style="margin-left: 10px;"
                 type="primary"
                 icon="el-icon-edit"
                 @click="handleBatchCreate">批量拉黑
      </el-button>
    </div>
    <!--表格渲染-->
    <el-table v-loading="listLoading"
              :data="list"
              stripe
              fit
              highlight-current-row
              style="width: 100%;">
      <el-table-column prop="phone"
                       label="手机号码">
        <template slot-scope="scope">
          <el-tag> {{ scope.row.phone }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="state"
                       align="center"
                       label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.state"
                  type="success">已移除</el-tag>
          <el-tag v-else
                  type="danger">白名单</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="updateTime"
                       align="center"
                       label="更新时间">
        <template slot-scope="scope">
          <span> {{ scope.row.updateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="updateUser"
                       align="center"
                       label="操作人" />
      <el-table-column label="操作"
                       width="220"
                       fixed="right"
                       class-name="small-padding fixed-width"
                       align="center">
        <template slot-scope="scope">
          <el-button type="primary"
                     size="small"
                     @click="handleModify(scope.row)">编辑
          </el-button>
          <el-button v-if="scope.row.state"
                     type="danger"
                     size="small"
                     @click="handleBlack(scope.row.id, false)">拉入
          </el-button>
          <el-button v-else
                     type="success"
                     size="small"
                     @click="handleBlack(scope.row.id, true)">移除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination v-show="total>listQuery.pageSize"
                :total="total"
                :page.sync="listQuery.page"
                :limit.sync="listQuery.pageSize"
                @pagination="getList" />
    <i-form ref="dataForm"
            :form-data="formData" />
    <i-send ref="dataSend" />
  </div>
</template>

<script>
import { postWhitelistPage, deleteWhitelist, putWhitelist } from '@/api/risk/whitelist'
import waves from '@/directive/waves' // Waves directive
import permission from '@/directive/permission'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import IForm from './form'
import ISend from './send'
import { getToken } from '@/utils/auth'
import Constants from '@/utils/constants'

export default {
  components: { Pagination, IForm, ISend },
  directives: { waves, permission },
  data () {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        pageSize: 20,
        phone: undefined,
        state: undefined,
        range: undefined
      },
      formData: {}
    }
  },
  computed: {
    actionURL () {
      return process.env.BASE_API + '/admin/upload?access_token=' + getToken(Constants.access_token)
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      this.listLoading = true
      postWhitelistPage(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.total

        setTimeout(() => {
          this.listLoading = false
        }, 1500)
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleFilter () {
      this.listQuery.page = 1
      this.getList()
    },
    handleUploadSuccess (respnse) {
      this.publishCoupon.file = respnse.data.url
    },
    handleCreate () {
      const _this = this.$refs['dataForm']
      _this.dialogStatus = 'create'
      _this.dialogFormVisible = true
      this.formData = {}
    },
    handleBatchCreate () {
      const _this = this.$refs['dataSend']
      _this.sendFormVisible = true
    },
    handleModify (row) {
      this.formData = Object.assign({}, row) // copy obj
      const _this = this.$refs['dataForm']
      _this.dialogStatus = 'update'
      _this.dialogFormVisible = true
    },
    handleDelete (id) {
      deleteWhitelist({ id: id }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功'
        })
        this.getList()
      })
    },
    handleBlack (id, state) {
      putWhitelist({ id: id, state: state }).then(() => {
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
