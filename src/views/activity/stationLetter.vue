<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="$t('activity.coupon.templateName')" v-model="listQuery.templateName" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.templateType" :placeholder="$t('activity.coupon.templateType')" clearable style="width: 120px" class="filter-item">
        <el-option v-for="(item,index) in templateTypeOptions" :key="index" :label="item.value" :value="item.key"/>
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;">
      <el-table-column :label="$t('table.id')" prop="id" width="65" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('activity.coupon.templateName')" align="center">
        <template slot-scope="scope">
          <span class="link-type">{{ scope.row.templateName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('activity.coupon.templateType')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.templateType }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('activity.coupon.deleteStatus')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.deleteStatus }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('activity.coupon.orderAmount')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.orderAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('activity.coupon.discountAmount')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.discountAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.createUser')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createUser }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.createTime')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" class-name="small-padding fixed-width" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{ $t('table.edit') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getCouponTemplateList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="50%">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px">
        <el-form-item :label="$t('activity.coupon.templateName')" prop="templateName">
          <el-input v-model="temp.templateName" placeholder="请设置"/>
        </el-form-item>
        <el-form-item :label="$t('activity.coupon.templateType')" prop="templateType">
          <el-select v-model="temp.templateType" class="filter-item" placeholder="请选择">
            <el-option v-for="(item,index) in templateTypeOptions" :key="index" :label="item.value" :value="item.key"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('activity.coupon.orderAmount')" prop="orderAmount">
          <el-input v-model.number="temp.orderAmount" placeholder="请设置"/>
        </el-form-item>
        <el-form-item :label="$t('activity.coupon.discountAmount')" prop="discountAmount">
          <el-input v-model="temp.discountAmount" placeholder="请设置"/>
        </el-form-item>
        <el-form-item :label="$t('activity.coupon.deleteStatus')" prop="deleteStatus">
          <el-switch
            v-model="temp.deleteStatus"
            active-text="启用"
            inactive-text="关闭"
            active-color="#13ce66"
            inactive-color="#ff4949" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { fetchCouponTemplateList, modifyCouponTemplate } from '@/api/activity'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'StationLetter',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        templateName: undefined,
        templateType: undefined
      },
      templateTypeOptions: [
        { key: '1', value: '优惠券' },
        { key: '2', value: '折扣券' }
      ],
      textMap: {
        update: '编辑',
        create: '新建优惠券模板'
      },
      dialogStatus: undefined,
      dialogFormVisible: false,
      temp: {
        id: undefined,
        templateName: '',
        templateType: '',
        orderAmount: '',
        discountAmount: '',
        deleteStatus: false
      },
      rules: {
        templateName: [{ required: true, message: '优惠券模板不能为空', trigger: 'change' }],
        templateType: [{ required: true, message: '模版类型不能为空', trigger: 'change' }],
        orderAmount: [{ type: 'number', required: true, message: '订单金额只能是整数', trigger: 'blur' },
          { validator: (rule, value, callback) => {
            if (/^[1-9]\d*$/.test(value)) {
              callback()
            } else {
              callback(new Error('订单金额只能是整数'))
            }
          }, trigger: 'change'
          }
        ],
        discountAmount: [{ type: 'number', required: true, message: '满减金额只能是整数', trigger: 'blur' },
          { validator: (rule, value, callback) => {
            if (/^[1-9]\d*$/.test(value)) {
              callback()
            } else {
              callback(new Error('满减金额只能是整数'))
            }
          }, trigger: 'change'
          }
        ]
      }
    }
  },
  created() {
    this.getCouponTemplateList()
  },
  methods: {
    getCouponTemplateList() {
      this.listLoading = true
      fetchCouponTemplateList(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.total

        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getConfigList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.operationUser = 'vue-element-admin'
          modifyCouponTemplate(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          modifyCouponTemplate(tempData).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
          this.getCouponTemplateList()
        }
      })
    }
  }
}
</script>
