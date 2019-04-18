<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="$t('activity.fightGroup.activityName')" v-model="listQuery.activityName" style="width: 200px;" class="filter-item" />
      <el-date-picker v-model="listQuery.beginTime" :placeholder="$t('time.beginTime')" format="yyyy-MM-dd HH:mm:ss" class="filter-item" type="datetime"/>
      <el-date-picker v-model="listQuery.endTime" :placeholder="$t('time.endTime')" format="yyyy-MM-dd HH:mm:ss" class="filter-item" type="datetime"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button v-waves v-permission="'ROLE_ADMIN'" class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;">
      <el-table-column :label="$t('table.id')" type="selection" width="65" align="center"/>>
      <el-table-column label="活动名称" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.activityName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="活动图片" width="340" align="center">
        <template slot-scope="scope">
          <span><img :src="scope.row.activityImg" width="300" height="200"></span>
        </template>
      </el-table-column>
      <el-table-column label="活动时间" width="300" align="center">
        <template slot-scope="scope">
          <span>{{ getActivityTime(scope.row) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>

      <el-table-column label="创建人" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createUser }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="300" fixed="right" class-name="small-padding fixed-width" align="center">
        <template slot-scope="scope">
          <!-- 编辑-->
          <el-button v-permission="'ROLE_ADMIN'" type="primary" size="mini" @click="handleQuery(scope.row)">编辑</el-button>
          <router-link v-permission="'ROLE_ADMIN'" :to="'/activity/fightGroup/rule/'+scope.row.id">
            <!-- 规则-->
            <el-button v-waves class="filter-item" type="success" size="mini">{{ $t('activity.fightGroup.rule') }}</el-button>
          </router-link>
          <!-- 商品-->
          <el-button v-waves v-permission="'ROLE_ADMIN'" class="filter-item" type="warning" size="mini" @click="handleJump(scope.row)">拼团商品</el-button>
          <router-link v-permission="'ROLE_ADMIN'" :to="'/activity/assembly/record/'+scope.row.id">
            <!-- 记录-->
            <el-button v-waves class="filter-item" type="primary" size="mini">成团记录</el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getFightGroup" />

    <i-form ref="dataForm" :form-data="formData" />
  </div>
</template>

<script>
import { fetchList } from '@/api/assembly'
import { parseTime } from '@/utils'
import waves from '@/directive/waves' // Waves directive
import permission from '@/directive/permission'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import IForm from './form'

export default {
  components: { Pagination, IForm },
  directives: { waves, permission },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        pageSize: 20,
        activityName: undefined,
        beginTime: undefined,
        endTime: undefined
      },
      formData: {}
    }
  },
  created() {
    this.getFightGroup()
  },
  methods: {
    getFightGroup() { // 活动列表
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
    handleFilter() { // 搜索
      this.listQuery.page = 1
      if (this.listQuery.beginTime !== undefined &&
        this.listQuery.endTime !== undefined &&
        this.listQuery.beginTime.getTime() > this.listQuery.endTime.getTime()) {
        this.$message({
          message: '开始时间不能大于结束时间',
          type: 'warning'
        })

        return
      }
      this.getFightGroup()
    },
    getActivityTime(row) {
      const beginTime = row.beginTime
      const endTime = row.endTime

      return parseTime(beginTime, '{y}-{m}-{d}') + ' 至 ' + parseTime(endTime, '{y}-{m}-{d}')
    },
    restForm() {
      this.formData.id = undefined
      this.formData.activityName = undefined
      this.formData.activityImg = undefined
      this.formData.beginTime = undefined
      this.formData.endTime = undefined
    },
    handleCreate() {
      this.restForm()
      const _this = this.$refs['dataForm']
      _this.dialogStatus = 'create'
      _this.dialogFormVisible = true
    },
    handleQuery(row) {
      this.formData = Object.assign({}, row)
      const _this = this.$refs['dataForm']
      _this.dialogStatus = 'update'
      _this.dialogFormVisible = true
    },
    handleJump(row) {
      let event = ''
      if (row.goodsId === undefined || row.goodsId === '' || row.goodsId === null) {
        event = 'add'
      } else {
        event = 'info'
      }
      this.$router.push({
        path: '/activity/assembly/edit',
        query: {
          goodsId: row.goodsId,
          event: event,
          operationType: 'fightGroup'
        }
      })
    }
  }
}
</script>
