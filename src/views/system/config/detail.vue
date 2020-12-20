<template>
  <div>
    <el-dialog title="配置项明细"
               width="80%"
               :visible.sync="dialogDetailVisible"
               @open="handleOpen">
      <el-button v-permission="'PAGER_SYSTEM_CONFIG_CREATE'"
                 class="filter-item"
                 style="margin-left: 10px;"
                 type="primary"
                 icon="el-icon-edit"
                 @click="handleDetailCreate">新增
      </el-button>
      <el-table v-loading="listLoading"
                :data="list"
                stripe
                fit
                highlight-current-row>
        <el-table-column label="配置项名称"
                         align="left">
          <template slot-scope="scope">
            <span>{{ scope.row.configName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="配置项类型"
                         align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.configType }}</span>
          </template>
        </el-table-column>
        <el-table-column label="配置项值"
                         align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.configValue }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态"
                         class-name="status-col"
                         align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.configStatus | statusFilter">{{ scope.row.configStatus ? '禁用': '启用' }}</el-tag>
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
                       size="small"
                       icon="el-icon-edit"
                       @click="handleDetailUpdate(scope.row)">编辑
            </el-button>
            <el-button v-if="scope.row.configStatus"
                       v-permission="'PAGER_SYSTEM_CONFIG_MODIFY'"
                       type="success"
                       size="small"
                       icon="el-icon-circle-check"
                       @click="handleStatus(scope.row, false)">启用
            </el-button>
            <el-button v-else
                       v-permission="'PAGER_SYSTEM_CONFIG_MODIFY'"
                       type="danger"
                       size="small"
                       icon="el-icon-circle-close"
                       @click="handleStatus(scope.row, true)">禁用
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <detail-form ref="dataDetailForm"
                 :detail-form-data="detailFormData" />
  </div>
</template>

<script>
import { putConfigDetailModify, getConfigDetailList } from '@/api/config'
import DetailForm from './detailForm'
import waves from '@/directive/waves'
import permission from '@/directive/permission'
export default {
  name: 'ConfigDetail',
  components: { DetailForm },
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
      textMap: {
        update: '编辑配置',
        create: '新增配置'
      },
      list: [],
      listLoading: false,
      configDetailType: null, // 配置项类型
      dialogDetailStatus: undefined,
      dialogDetailVisible: false,
      configNameDisabled: false,
      configTypeDisabled: false,
      detailFormData: {
        configName: undefined,
        configType: undefined,
        configValue: undefined,
        configKey: this.configDetailType,
        description: undefined,
        createUser: undefined,
        updateUser: undefined
      },
      rules: {
        configName: [{ required: true, message: '配置项名称不能为空', trigger: 'blur' }],
        configType: [{ required: true, message: '配置项类型不能为空', trigger: 'blur' }],
        configValue: [{ required: true, message: '配置项值不能为空', trigger: 'blur' }],
        module: [{ required: true, message: '模块不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    handleOpen () {
      const params = { configKey: this.configDetailType }
      this.handleDetailList(params)
    },
    handleDetailCreate () {
      const _this = this.$refs['dataDetailForm']
      _this.dialogDetailFormVisible = true
      _this.dialogDetailStatus = 'create'
      this.detailFormData = {
        id: undefined,
        configName: undefined,
        configType: undefined,
        configValue: undefined,
        configKey: this.configDetailType
      }
    },
    handleDetailUpdate (row) {
      this.detailFormData = Object.assign({}, row) // copy obj
      const _this = this.$refs['dataDetailForm']
      _this.dialogDetailFormVisible = true
      _this.dialogDetailStatus = 'update'
      this.detailFormData.configKey = this.configDetailType
    },
    handleDetailList (data) {
      this.listLoading = true
      getConfigDetailList(data).then((response) => {
        this.list = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleStatus (row, data) {
      this.detailFormData = Object.assign({}, row) // copy obj
      this.detailFormData.configStatus = data
      putConfigDetailModify(this.detailFormData).then(() => {
        this.$message({
          message: '更新成功',
          type: 'success'
        })
        this.handleDetailList({ configKey: this.configDetailType })
      })
    }
  }
}
</script>
