<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="$t('activity.coupon.couponName')" v-model="listQuery.couponName" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.discountType" :placeholder="$t('activity.coupon.discountType')" clearable style="width: 120px" class="filter-item">
        <el-option v-for="(item,index) in discountTypeOptions" :key="index" :label="item.value" :value="item.key"/>
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
      <el-table-column :label="$t('activity.coupon.couponName')" align="center">
        <template slot-scope="scope">
          <span class="link-type">{{ scope.row.couponName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('activity.coupon.templateName')" align="center">
        <template slot-scope="scope">
          <span class="link-type">{{ scope.row.templateName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('activity.coupon.discountType')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.discountType }}</span>
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
        pageSize: 20,
        couponName: undefined,
        discountType: undefined
      },
      discountTypeOptions: [
        { key: '1', value: '优惠券' },
        { key: '2', value: '折扣券' }
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
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getCouponList()
    }
  }
}
</script>
