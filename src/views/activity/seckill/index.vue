<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.activityName"
                placeholder="活动名称"
                style="width: 200px;"
                class="filter-item" />
      <el-button v-waves
                 class="filter-item"
                 type="primary"
                 icon="el-icon-search"
                 @click="handleFilter">搜索</el-button>
      <el-button v-waves
                 v-permission="'ROLE_SUPER_ADMIN'"
                 class="filter-item"
                 type="primary"
                 icon="el-icon-edit"
                 @click="handleCreate">添加
      </el-button>
    </div>

    <el-table :key="tableKey"
              v-loading="listLoading"
              :data="list"
              stripe
              fit
              highlight-current-row
              style="width: 100%;">
      <el-table-column label="活动名称"
                       width="200"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.activityName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="活动图片"
                       width="340"
                       align="center">
        <template slot-scope="scope">
          <span><img :src="scope.row.activityImg"
                     alt=""
                     width="300"
                     height="200"></span>
        </template>
      </el-table-column>
      <el-table-column label="活动时间"
                       width="300"
                       align="center">
        <template slot-scope="scope">
          <span>{{ getActivityTime(scope.row) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="状态"
                       width="100"
                       align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.deleteStatus"
                  type="danger">禁用</el-tag>
          <el-tag v-else
                  type="success">启用</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="创建时间"
                       width="200"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>

      <el-table-column label="更新人"
                       width="200"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.updateUser }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作"
                       width="240"
                       fixed="right"
                       class-name="small-padding fixed-width"
                       align="center">
        <template slot-scope="scope">
          <!-- 编辑-->
          <el-button v-permission="'ROLE_SUPER_ADMIN'"
                     type="primary"
                     size="small"
                     @click="handleUpdate(scope.row)">编辑
          </el-button>
          <!-- 启用-->
          <el-button v-if="scope.row.deleteStatus"
                     v-permission="'ROLE_SUPER_ADMIN'"
                     type="success"
                     size="small"
                     @click="handleDisable(scope.row.id,false)">启用
          </el-button>
          <!-- 禁用-->
          <el-button v-else
                     v-permission="'ROLE_SUPER_ADMIN'"
                     type="danger"
                     size="small"
                     @click="handleDisable(scope.row.id,true)">禁用
          </el-button>
          <router-link v-permission="'ROLE_SUPER_ADMIN'"
                       :to="'/activity/exchange/rule/'+scope.row.id">
            <!-- 满赠规则-->
            <el-button v-waves
                       type="success"
                       size="small">规则</el-button>
          </router-link>
          <router-link v-permission="'ROLE_SUPER_ADMIN'"
                       :to="'/activity/exchange/goods/'+scope.row.id">
            <!-- 满赠规则-->
            <el-button v-waves
                       type="warning"
                       size="small">满赠商品</el-button>
          </router-link>
          <router-link v-permission="'ROLE_SUPER_ADMIN'"
                       :to="'/activity/exchange/record/'+scope.row.id">
            <!-- 购买记录-->
            <el-button v-waves
                       type="primary"
                       size="small">购买记录</el-button>
          </router-link>
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
import { fetchList, modifyExchange } from '@/api/activity/exchange'
import { parseTime } from '@/utils'
import waves from '@/directive/waves' // Waves directive
import permission from '@/directive/permission'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import IForm from './form'

export default {
  name: 'SeckillManage',
  components: { Pagination, IForm },
  directives: { waves, permission },
  data () {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        pageSize: 10,
        activityName: undefined,
        beginTime: undefined,
        endTime: undefined
      },
      formData: {}
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () { // 活动列表
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
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
    getActivityTime (row) {
      const beginTime = row.beginTime
      const endTime = row.endTime

      return parseTime(beginTime, '{y}-{m}-{d}') + ' 至 ' + parseTime(endTime, '{y}-{m}-{d}')
    },
    restForm () {
      this.formData.id = undefined
      this.formData.activityName = undefined
      this.formData.activityImg = undefined
    },
    handleCreate () {
      this.formData = {}
      const _this = this.$refs['dataForm']
      _this.dialogStatus = 'create'
      _this.dialogFormVisible = true
    },
    handleUpdate (row) {
      this.formData = Object.assign({}, row)
      const _this = this.$refs['dataForm']
      _this.dialogStatus = 'update'
      _this.dialogFormVisible = true
    },
    handleDisable (id, deleteStatus) {
      const params = {
        id: id,
        deleteStatus: deleteStatus,
        updateUser: this.$store.state.user.username
      }
      modifyExchange(params).then(() => {
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
