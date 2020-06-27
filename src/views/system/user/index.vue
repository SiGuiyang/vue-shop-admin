<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.phone"
                placeholder="手机号码"
                style="width: 200px;"
                class="filter-item"
                @keyup.enter.native="handleFilter" />
      <el-button v-waves
                 class="filter-item"
                 type="primary"
                 icon="el-icon-search"
                 @click="handleFilter">
        搜索
      </el-button>
      <el-button v-permission="'PAGER_SYSTEM_USER_CREATE'"
                 class="filter-item"
                 style="margin-left: 10px;"
                 type="primary"
                 icon="el-icon-edit"
                 @click="handleCreate">
        新增
      </el-button>
    </div>
    <el-table v-loading="listLoading"
              :data="list"
              stripe
              fit
              highlight-current-row
              @row-click="tableSelectRows">
      <el-table-column label="手机号码"
                       align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="拥有角色"
                       align="center">
        <template slot-scope="scope">
          <span>{{ getRoles(scope.row) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态"
                       class-name="status-col"
                       width="100"
                       align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.deleteStatus | statusFilter">
            {{ scope.row.deleteStatus ? '禁用' : '启用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建人"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createUser }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       width="180"
                       fixed="right"
                       class-name="small-padding fixed-width"
                       align="center">
        <template slot-scope="scope">
          <el-button v-permission="'PAGER_SYSTEM_USER_MODIFY'"
                     type="primary"
                     size="mini"
                     @click="handleModify(scope.row)">
            编辑
          </el-button>
          <el-button v-if="scope.row.deleteStatus"
                     v-permission="'PAGER_SYSTEM_USER_MODIFY'"
                     type="success"
                     size="mini"
                     @click="handleDelete(scope.row, false)">
            启用
          </el-button>
          <el-button v-else
                     v-permission="'PAGER_SYSTEM_USER_MODIFY'"
                     type="danger"
                     size="mini"
                     @click="handleDelete(scope.row, true)">
            禁用
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <form-create v-model="fApi"
                 :rule="rule"
                 :option="options"></form-create>

    <pagination v-show="total>listQuery.pageSize"
                :total="total"
                :page.sync="listQuery.page"
                :limit.sync="listQuery.pageSize"
                @pagination="getUserList" />
    <i-form ref="dataForm"
            :form-data="formData" />
  </div>
</template>

<script>
import { fetchList, del } from '@/api/sysuser'
import { getFormGet } from '@/api/generate/form'
import waves from '@/directive/waves' // Waves directive
import permission from '@/directive/permission'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import IForm from './form'

export default {
  name: 'UserManage',
  components: { Pagination, IForm },
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
      fApi: {},
      options: {
        onSubmit: (formData) => {
          alert(JSON.stringify(formData))
        },
        resetBtn: true,
        form: {
          //行内表单模式
          inline: false,
          //表单域标签的位置，如果值为 left 或者 right 时，则需要设置 label-width
          labelPosition: 'top',
          //表单域标签的后缀
          labelSuffix: undefined,
          //是否显示必填字段的标签旁边的红色星号
          hideRequiredAsterisk: false,
          //表单域标签的宽度，例如 '50px'。作为 Form 直接子元素的 form-item 会继承该值。支持 auto。
          labelWidth: '125px',
          //是否显示校验错误信息
          showMessage: true,
          //是否以行内形式展示校验信息
          inlineMessage: false,
          //是否在输入框中显示校验结果反馈图标
          statusIcon: false,
          //是否在 rules 属性改变后立即触发一次验证
          validateOnRuleChange: true,
          //是否禁用该表单内的所有组件。若设置为 true，则表单内组件上的 disabled 属性不再生效
          disabled: false,
          //用于控制该表单内组件的尺寸 medium / small / mini
          size: 'medium'
        },
        row: {
          //栅格间隔
          gutter: 24,
          //布局模式，可选 flex，现代浏览器下有效
          type: undefined,
          //flex 布局下的垂直排列方式 top/middle/bottom
          align: 'middle',
          //flex 布局下的水平排列方式 start/end/center/space-around/space-between
          justify: undefined,
          //自定义元素标签
          tag: 'div'
        }
      },
      rule: [
        {
          type: 'input',
          field: 'goods_name',
          title: '商品名称',
          col: {
            span: 12
          }
        },
        {
          type: 'checkbox',
          field: 'label',
          title: '标签',
          col: {
            span: 12
          },
          options: [
            { label: '好用', value: 0 },
            { label: '快速', value: 1 },
            { label: '高效', value: 2 },
            { label: '全能', value: 3 }
          ]
        },
        {
          type: 'checkbox',
          field: 'label2',
          title: '标签',
          col: {
            span: 12
          },
          options: [
            { label: '好用', value: 0 },
            { label: '快速', value: 1 },
            { label: '高效', value: 2 },
            { label: '全能', value: 3 }
          ]
        }
      ],
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        pageSize: 10,
        phone: undefined
      },
      tableSelectData: {},
      statusOptions: ['published', 'draft', 'deleted'],
      formData: {
        avatar: undefined,
        deleteStatus: false,
        id: undefined,
        password: undefined,
        phone: undefined,
        roleIds: [],
        sysName: undefined,
        username: undefined
      }
    }
  },
  created () {
    this.getUserList()
    this.initForm()
  },
  methods: {
    tableSelectRows (row, event, column) {
      this.tableSelectData = row
    },
    initForm () {
      const params = {
        bizType: 'PAGER_CONFIG_DICTIONARY'
      }
      getFormGet(params).then(response => {
        this.rule = response.data
      })
    },
    getUserList () {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.total
        this.list.forEach(k => {
          this.roleIds = JSON.parse(k.roleIds)
        })
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      }).catch(() => {
        this.listLoading = false
      })
    },
    getRoles (row) { // 拥有的角色
      let content = ''
      if (row.roles !== null) {
        for (let i = 0; i < row.roles.length; i++) {
          content += row.roles[i].roleName + '|'
        }
      }
      return content
    },
    handleFilter () { // 查询列表
      this.listQuery.page = 1
      this.getUserList()
    },
    handleModifyStatus (row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    handleCreate () { // 创建
      const _this = this.$refs['dataForm']
      _this.dialogStatus = 'create'
      _this.passwordDisabled = false
      _this.dialogFormVisible = true
      this.restForm()
    },
    handleModify (row) { // 编辑弹框
      this.formData = Object.assign({}, row) // copy obj
      this.formData.roleIds = row.roles.map(item => item.id)
      const _this = this.$refs['dataForm']
      _this.dialogStatus = 'update'
      _this.passwordDisabled = true
      _this.dialogFormVisible = true
    },
    handleDelete (row, data) {
      this.formData = Object.assign({}, row) // copy obj
      this.formData.deleteStatus = data
      del(this.formData).then(() => {
        this.$notify({
          title: '成功',
          message: '更新成功',
          type: 'success',
          duration: 2000
        })
        this.getUserList()
      })
    },
    restForm () {
      this.formData = {
        avatar: undefined,
        deleteStatus: false,
        id: undefined,
        password: undefined,
        phone: undefined,
        roleIds: [],
        sysName: undefined,
        username: undefined
      }
    }
  }
}
</script>
