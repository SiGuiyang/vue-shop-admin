<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="$t('activity.fightGroup.activityName')" v-model="listQuery.activityName" style="width: 200px;" class="filter-item" />
      <el-date-picker v-model="listQuery.beginTime" :placeholder="$t('time.beginTime')" format="yyyy-MM-dd HH:mm:ss" class="filter-item" type="datetime"/>
      <el-date-picker v-model="listQuery.endTime" :placeholder="$t('time.endTime')" format="yyyy-MM-dd HH:mm:ss" class="filter-item" type="datetime"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button v-waves v-permission="'/admin/activity/fightGroup/modify'" class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
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
      <el-table-column :label="$t('activity.fightGroup.activityName')" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.activityName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('activity.fightGroup.activityImg')" width="340" align="center">
        <template slot-scope="scope">
          <span><img :src="scope.row.activityImg" width="300" height="200"></span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('activity.fightGroup.activityTime')" width="300" align="center">
        <template slot-scope="scope">
          <span>{{ getActivityTime(scope.row) }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('common.createTime')" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('common.createUser')" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createUser }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.actions')" width="300" fixed="right" class-name="small-padding fixed-width" align="center">
        <template slot-scope="scope">
          <!-- 编辑-->
          <el-button v-permission="'/admin/activity/fightGroup/modify'" type="primary" size="mini" @click="handleQuery(scope.row)">{{ $t('table.edit') }}</el-button>
          <router-link v-permission="'/admin/activity/fightGroup/rule/info'" :to="'/activity/fightGroup/rule/'+scope.row.id">
            <!-- 规则-->
            <el-button v-waves class="filter-item" type="success" size="mini">{{ $t('activity.fightGroup.rule') }}</el-button>
          </router-link>
          <!-- 商品-->
          <el-button v-waves v-permission="'/admin/goods/modify'" class="filter-item" type="warning" size="mini" @click="handleJump(scope.row)">{{ $t('activity.fightGroup.goods') }}</el-button>
          <router-link v-permission="'/admin/activity/fightGroup/record'" :to="'/activity/fightGroup/record/'+scope.row.id">
            <!-- 记录-->
            <el-button v-waves class="filter-item" type="primary" size="mini">{{ $t('activity.fightGroup.record') }}</el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getFightGroup" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="60%">
      <el-form ref="dataForm" :rules="rules" :model="activityTemp" label-position="left" label-width="100px">
        <el-form-item :label="$t('activity.fightGroup.activityName')" prop="activityName">
          <el-input v-model="activityTemp.activityName" placeholder="请设置"/>
        </el-form-item>
        <el-form-item :label="$t('activity.fightGroup.activityImg')" prop="activityImg">
          <div style="margin-bottom: 20px;">
            <Upload v-model="activityTemp.activityImg" />
          </div>
        </el-form-item>
        <el-form-item :label="$t('time.beginTime')" prop="beginTime">
          <el-date-picker v-model="activityTemp.beginTime" :placeholder="$t('time.beginTime')" format="yyyy-MM-dd HH:mm:ss" class="filter-item" type="datetime"/>
        </el-form-item>
        <el-form-item :label="$t('time.endTime')" prop="endTime">
          <el-date-picker v-model="activityTemp.endTime" :placeholder="$t('time.endTime')" format="yyyy-MM-dd HH:mm:ss" class="filter-item" type="datetime"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button v-permission="'/admin/activity/fightGroup/modify'" type="primary" @click="dialogStatus==='create'?createData():updateData()">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { fetchFightGroup, modifyFightGroup } from '@/api/activity'
import { parseTime } from '@/utils'
import waves from '@/directive/waves' // Waves directive
import permission from '@/directive/permission'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import Upload from '@/components/Upload/singleImage3'

export default {
  name: 'FightGroupActivity',
  components: { Pagination, Upload },
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
      textMap: {
        update: '编辑',
        create: '新建'
      },
      dialogStatus: undefined,
      dialogFormVisible: false,
      activityTemp: {
        id: undefined,
        activityName: undefined,
        activityImg: undefined,
        beginTime: undefined,
        endTime: undefined
      },
      rules: {
        activityName: [{ required: true, message: '活动标题不能为空', trigger: 'blur' }],
        activityImg: [{ required: true, message: '分享地址不能为空', trigger: 'blur' }],
        beginTime: [{ required: true, message: '分享标题不能为空', trigger: 'blur' }],
        endTime: [{ required: true, message: '分享副标题不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getFightGroup()
  },
  methods: {
    getFightGroup() { // 活动列表
      this.listLoading = true
      fetchFightGroup(this.listQuery).then(response => {
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
      this.activityTemp.id = undefined
      this.activityTemp.activityName = undefined
      this.activityTemp.activityImg = undefined
      this.activityTemp.beginTime = undefined
      this.activityTemp.endTime = undefined
    },
    handleCreate() {
      this.restForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    handleQuery(row) {
      this.activityTemp = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.activityTemp.event = 'add'
          this.activityTemp.createUser = this.$store.state.user.sysCode
          modifyFightGroup(this.activityTemp).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            this.getFightGroup()
          })
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.activityTemp)
          tempData.event = 'modify'
          modifyFightGroup(tempData).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
            this.getFightGroup()
          })
        }
      })
    },
    handleJump(row) {
      let event = ''
      if (row.goodsId === undefined || row.goodsId === '' || row.goodsId === null) {
        event = 'add'
      } else {
        event = 'info'
      }
      this.$router.push({
        name: 'GoodsEdit',
        params: {
          goodsId: row.goodsId,
          event: event,
          operationType: 'fightGroup'
        }
      })
    }
  }
}
</script>
