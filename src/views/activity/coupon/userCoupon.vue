<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="$t('activity.coupon.couponName')" v-model="listQuery.couponName" style="width: 200px;" class="filter-item"/>
      <el-input :placeholder="$t('activity.coupon.phone')" v-model="listQuery.phone" style="width: 200px;" class="filter-item"/>
      <el-select v-model="listQuery.discountType" :placeholder="$t('activity.coupon.discountType')" clearable style="width: 120px" class="filter-item">
        <el-option v-for="(item,index) in discountTypeOptions" :key="index" :label="item.value" :value="item.key"/>
      </el-select>
      <el-date-picker v-model="listQuery.beginTime" :placeholder="$t('time.beginTime')" format="yyyy-MM-dd" class="filter-item" type="date"/>
      <el-date-picker v-model="listQuery.endTime" :placeholder="$t('time.endTime')" format="yyyy-MM-dd" class="filter-item" type="date"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
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
      <el-table-column :label="$t('activity.coupon.couponName')" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.couponName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('activity.coupon.couponName')" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('activity.coupon.phone')" align="center" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('activity.coupon.templateName')" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.templateName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('activity.coupon.discountType')" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ getDiscountType(scope.row.discountType) }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('activity.coupon.deleteStatus')" align="center" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.deleteStatus | statusFilter">{{ scope.row.deleteStatus ? '禁用' : '启用' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('activity.coupon.orderAmount')" align="center" width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.orderAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('activity.coupon.couponAmount')" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.couponAmount != null ? scope.row.couponAmount : '——' }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('activity.coupon.discountStrength')" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.discountStrength != null ? scope.row.discountStrength + ' 折' : '——' }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('time.beginTime')" align="center" width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.beginTime | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('time.endTime')" align="center" width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.endTime | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.createTime')" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getCouponList" />
  </div>
</template>

<script>
import { fetchUserCoupons } from '@/api/activity'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'UserCoupon',
  components: { Pagination },
  directives: { waves },
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
        pageSize: 10,
        couponName: undefined,
        phone: undefined,
        discountType: undefined,
        beginTime: undefined,
        endTime: undefined
      },
      discountTypeOptions: [
        { key: 1, value: '优惠券' },
        { key: 2, value: '折扣券' }
      ]
    }
  },
  created() {
    this.getCouponList()
  },
  methods: {
    getCouponList() {
      this.listLoading = true
      fetchUserCoupons(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.total

        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      }).catch(error => {
        this.$message.error(error)
        this.listLoading = false
      })
    },
    getDiscountType(type) {
      return this.discountTypeOptions.filter(v => v.key === type)[0].value
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getCouponList()
    }
  }
}
</script>
