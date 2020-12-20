<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.templateName"
                placeholder="模板名称"
                style="width: 200px;"
                class="filter-item"
                @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.templateType"
                 placeholder="优惠类型"
                 clearable
                 style="width: 120px"
                 class="filter-item">
        <el-option v-for="(item,index) in offerTypeOptions"
                   :key="index"
                   :label="item.value"
                   :value="item.type" />
      </el-select>
      <el-button v-waves
                 class="filter-item"
                 type="primary"
                 icon="el-icon-search"
                 @click="handleFilter">搜索
      </el-button>
      <el-button v-permission="'PAGER_ACTIVITY_COUPON_TEMPLATE_CREATE'"
                 class="filter-item"
                 style="margin-left: 10px;"
                 type="primary"
                 icon="el-icon-edit"
                 @click="handleCreate">创建
      </el-button>
      <el-button v-permission="'PAGER_ACTIVITY_COUPON_PUBLISH'"
                 :disabled="reissueDisabled"
                 class="filter-item"
                 style="margin-left: 10px;"
                 type="primary"
                 icon="el-icon-plus"
                 @click="handleSend">补发优惠券
      </el-button>
    </div>

    <el-table v-loading="listLoading"
              :data="list"
              stripe
              fit
              highlight-current-row
              style="width: 100%;"
              @selection-change="handleSelectionChange">
      <el-table-column align="center"
                       type="selection"
                       width="65" />
      <el-table-column label="模板名称"
                       align="left">
        <template slot-scope="scope">
          <span class="link-type">{{ scope.row.templateName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="模板类型"
                       align="center"
                       width="160">
        <template slot-scope="scope">
          <span>{{ getTemplateType(scope.row.templateType) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态"
                       align="center"
                       width="120">
        <template slot-scope="scope">
          <el-tag :type="scope.row.state | statusFilter">{{ scope.row.state ? '禁用' : '启用' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="订单满减金额"
                       align="center"
                       width="200">
        <template slot-scope="scope">
          <span class="icon-money">
            <svg-icon icon-class="money" /> {{ scope.row.orderAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="优惠券金额"
                       align="center"
                       width="120">
        <template slot-scope="scope">
          <span class="icon-money">
            <svg-icon icon-class="money" /> {{ scope.row.couponAmount != null ? scope.row.couponAmount: '——' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="折扣力度"
                       align="center"
                       width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.discountStrength != null ? scope.row.discountStrength + ' 折' : '——' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作人"
                       align="center"
                       width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.updateUser }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间"
                       align="center"
                       width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       class-name="small-padding fixed-width"
                       width="160"
                       fixed="right"
                       align="center">
        <template slot-scope="scope">
          <el-button v-permission="'PAGER_ACTIVITY_COUPON_TEMPLATE_MODIFY'"
                     type="primary"
                     size="small"
                     @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button v-if="scope.row.serverStatus"
                     v-permission="'PAGER_ACTIVITY_COUPON_TEMPLATE_MODIFY'"
                     type="success"
                     size="small"
                     @click="handleDisable(scope.row.id,false)">启用
          </el-button>
          <el-button v-else
                     v-permission="'PAGER_ACTIVITY_COUPON_TEMPLATE_MODIFY'"
                     type="danger"
                     size="small"
                     @click="handleDisable(scope.row.id,true)">禁用
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>listQuery.pageSize"
                :total="total"
                :page.sync="listQuery.page"
                :limit.sync="listQuery.pageSize"
                @pagination="getCouponTemplateList" />

    <i-form ref="dataForm"
            :form-data="formData"
            :template-type-options="offerTypeOptions" />
    <i-send ref="sendForm" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { postList, putModifyTemplate } from '@/api/activity/couponTemplate'
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
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        pageSize: 10,
        templateName: undefined,
        templateType: undefined
      },
      formData: {},
      reissueDisabled: true
    }
  },
  computed: {
    ...mapGetters([
      'offerTypeOptions'
    ])
  },
  created () {
    this.getCouponTemplateList()
  },
  methods: {
    getCouponTemplateList () {
      this.listLoading = true
      postList(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.total
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      }).catch(() => {
        this.listLoading = false
      })
    },
    getTemplateType (type) {
      const arr = this.offerTypeOptions.filter(v => v.type === type)
      if (arr.length === 0) {
        return '--'
      } else {
        return arr[0].value
      }
    },
    handleFilter () {
      this.listQuery.page = 1
      this.getCouponTemplateList()
    },
    handleSelectionChange (row) { // 复选框变化出发事件
      const _this = this.$refs['sendForm']
      if (row.length === 1) {
        this.reissueDisabled = false
        _this.publishCoupon.templateId = row[0].id
      } else {
        this.reissueDisabled = true
      }
    },
    handleModifyStatus (row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    handleCreate () {
      this.formData = {}
      const _this = this.$refs['dataForm']
      _this.dialogStatus = 'create'
      _this.dialogFormVisible = true
    },
    handleUpdate (row) {
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
    },
    handleDisable (id, serverStatus) {
      const params = {
        id: id,
        updateUser: this.$store.state.user.username,
        serverStatus: serverStatus
      }
      putModifyTemplate(params).then(() => {
        this.$message({
          type: 'success',
          message: '操作成功'
        })
        this.getCouponTemplateList()
      })
    },
    handleSend () {
      const _this = this.$refs['sendForm']
      _this.reissueFormVisible = true
    }
  }
}
</script>
