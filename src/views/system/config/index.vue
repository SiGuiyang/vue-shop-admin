<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.configName"
                style="width: 200px;"
                placeholder="配置项名称"
                class="filter-item"
                @keyup.enter.native="handleFilter" />
      <el-button v-waves
                 class="filter-item"
                 type="primary"
                 icon="el-icon-search"
                 @click="handleFilter">搜索</el-button>
      <el-button v-permission="'PAGER_SYSTEM_CONFIG_CREATE'"
                 class="filter-item"
                 style="margin-left: 10px;"
                 type="primary"
                 icon="el-icon-edit"
                 @click="handleCreate">新增
      </el-button>
      <el-button v-permission="'PAGER_SYSTEM_CONFIG_CREATE'"
                 class="filter-item"
                 style="margin-left: 10px;"
                 type="success"
                 icon="el-icon-refresh"
                 @click="handleRefresh">更新缓存
      </el-button>
    </div>

    <el-table :key="tableKey"
              v-loading="listLoading"
              :data="list"
              stripe
              fit
              highlight-current-row>
      <el-table-column label="配置项名称"
                       width="220"
                       align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.configName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="配置项类型"
                       width="160"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.configType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态"
                       class-name="status-col"
                       width="100"
                       align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.configStatus | statusFilter">{{ scope.row.configStatus ? '禁用': '启用' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="说明"
                       width="200"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间"
                       width="180"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       class-name="small-padding fixed-width"
                       fixed="right"
                       width="220"
                       align="center">
        <template slot-scope="scope">
          <el-button v-permission="'PAGER_SYSTEM_CONFIG_MODIFY'"
                     type="primary"
                     size="mini"
                     @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button v-permission="'PAGER_SYSTEM_CONFIG_MODIFY'"
                     type="warning"
                     size="mini"
                     @click="handleDetail(scope.row)">明细
          </el-button>
          <el-button v-if="scope.row.configStatus"
                     v-permission="'PAGER_SYSTEM_CONFIG_MODIFY'"
                     type="success"
                     size="mini"
                     @click="handleStatus(scope.row, false)">启用
          </el-button>
          <el-button v-else
                     v-permission="'PAGER_SYSTEM_CONFIG_MODIFY'"
                     type="danger"
                     size="mini"
                     @click="handleStatus(scope.row, true)">禁用
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0"
                :total="total"
                :page.sync="listQuery.page"
                :limit.sync="listQuery.pageSize"
                @pagination="getList" />
    <i-form ref="dataForm"
            :form-data="formData"
            :options="moduleTypeOptions" />
    <i-detail ref="dataDetail" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { fetchList, modifyConfig, getRefreshConfig } from '@/api/config'
import waves from '@/directive/waves'
import permission from '@/directive/permission'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import IForm from './form'
import IDetail from './detail'

export default {
  name: 'ConfigManage',
  components: { Pagination, IForm, IDetail },
  directives: { waves, permission },
  filters: {
    statusFilter (status) {
      const statusMap = {
        false: 'success',
        true: 'danger'
      }
      return statusMap[status]
    }
  },
  data () {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        pageSize: 10,
        configName: undefined
      },
      formData: {
        configName: undefined,
        configValue: undefined,
        description: undefined
      }
    }
  },
  computed: {
    ...mapGetters([
      'moduleTypeOptions'
    ])
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
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
    handleFilter () {
      this.listQuery.page = 1
      this.getList()
    },
    handleCreate () {
      const _this = this.$refs['dataForm']
      _this.dialogStatus = 'create'
      _this.dialogFormVisible = true
      _this.configNameDisabled = false
      _this.configTypeDisabled = false
      this.formData = {
        configName: undefined,
        configValue: undefined,
        configType: undefined,
        description: undefined
      }
    },
    handleRefresh () {
      getRefreshConfig().then(() => {
        this.$notify({
          title: '成功',
          message: '更新成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleUpdate (row) {
      this.formData = Object.assign({}, row) // copy obj
      const _this = this.$refs['dataForm']
      _this.dialogStatus = 'update'
      _this.dialogFormVisible = true
      _this.configNameDisabled = true
      _this.configTypeDisabled = true
    },
    handleStatus (row, data) {
      this.formData = Object.assign({}, row) // copy obj
      this.formData.configStatus = data
      modifyConfig(this.formData).then(() => {
        this.$notify({
          title: '成功',
          message: '更新成功',
          type: 'success',
          duration: 2000
        })
        this.getList()
      })
    },
    handleDetail (row) {
      const _this = this.$refs['dataDetail']
      _this.dialogDetailVisible = true
      _this.configDetailType = row.configType
    }
  }
}
</script>
