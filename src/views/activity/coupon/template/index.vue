<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="$t('activity.coupon.templateName')" v-model="listQuery.templateName" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.templateType" :placeholder="$t('activity.coupon.templateType')" clearable style="width: 120px" class="filter-item">
        <el-option v-for="(item,index) in templateTypeOptions" :key="index" :label="item.value" :value="item.key"/>
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button v-permission="'ROLE_ADMIN'" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
      <el-button v-permission="'ROLE_ADMIN'" :disabled="reissueDisabled" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="reissueFormVisible = true">{{ $t('table.reissueCoupon') }}</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="65"/>
      <el-table-column :label="$t('activity.coupon.templateName')" align="center" width="200">
        <template slot-scope="scope">
          <span class="link-type">{{ scope.row.templateName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('activity.coupon.templateType')" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ getTemplateType(scope.row.templateType) }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('activity.coupon.deleteStatus')" align="center" width="80">
        <template slot-scope="scope">
          <el-tag :type="scope.row.deleteStatus | statusFilter">{{ scope.row.deleteStatus ? '禁用' : '启用' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('activity.coupon.orderAmount')" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.orderAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('activity.coupon.couponAmount')" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.couponAmount != null ? scope.row.couponAmount: '——' }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('activity.coupon.discountStrength')" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.discountStrength != null ? scope.row.discountStrength + ' 折' : '——' }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('activity.coupon.description')" align="center" width="260">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.createUser')" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.createUser }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.createTime')" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" class-name="small-padding fixed-width" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button v-permission="'ROLE_ADMIN'" type="primary" size="mini" @click="handleUpdate(scope.row)">{{ $t('table.edit') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getCouponTemplateList" />

    <i-form ref="dataForm" :form-data="formData" :template-type-options="templateTypeOptions" />
    <i-send ref="sendForm" />
  </div>
</template>

<script>
import { fetchCouponTemplateList } from '@/api/activity'
import waves from '@/directive/waves' // Waves directive
import permission from '@/directive/permission'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import IForm from './form'
import ISend from './send'

export default {
  name: 'CouponTemplate',
  components: { Pagination, IForm, ISend },
  directives: { waves, permission },
  filters: {
    statusFilter(status) {
      const statusMap = {
        false: 'success',
        true: 'danger'
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
        pageSize: 20,
        templateName: undefined,
        templateType: undefined
      },
      templateTypeOptions: [
        { key: 1, value: '优惠券' },
        { key: 2, value: '折扣券' }
      ],
      formData: {},
      reissueDisabled: true
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
      }).catch(() => {
        this.listLoading = false
      })
    },
    getTemplateType(type) {
      return this.templateTypeOptions.filter(v => v.key === type)[0].value
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getCouponTemplateList()
    },
    handleSelectionChange(row) { // 复选框变化出发事件
      const _this = this.$refs['sendForm']
      if (row.length === 1) {
        this.reissueDisabled = false
        _this.publishCoupon.templateId = row[0].id
      } else {
        this.reissueDisabled = true
      }
      console.log(row)
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    handleCreate() {
      this.formData = {}
      const _this = this.$refs['dataForm']
      _this.dialogStatus = 'create'
      _this.dialogFormVisible = true
    },
    handleUpdate(row) {
      this.formData = Object.assign({}, row) // copy obj
      const _this = this.$refs['dataForm']

      if (this.formData.templateType === 2) {
        _this.discountVisible = true
        this.formData.discountStrength = this.formData.discountStrength * 100
      } else {
        _this.discountVisible = false
      }
      _this.dialogStatus = 'update'
      _this.dialogFormVisible = true
    }
  }
}
</script>
