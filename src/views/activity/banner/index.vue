<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.title"
                placeholder="标题"
                style="width: 200px;"
                class="filter-item"
                @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.bannerType"
                 placeholder="类型"
                 clearable
                 class="filter-item">
        <el-option v-for="(item,index) in bannerTypeOptions"
                   :key="index"
                   :label="item.value"
                   :value="item.key" />
      </el-select>
      <el-button v-waves
                 class="filter-item"
                 type="primary"
                 icon="el-icon-search"
                 @click="handleFilter">搜索</el-button>
      <el-button v-permission="'PAGER_ACTIVITY_BANNER_CREATE'"
                 class="filter-item"
                 style="margin-left: 10px;"
                 type="primary"
                 icon="el-icon-edit"
                 @click="handleCreate">新增
      </el-button>
    </div>

    <el-table :key="tableKey"
              v-loading="listLoading"
              :data="list"
              stripe
              fit
              highlight-current-row
              style="width: 100%;">
      <el-table-column label="标题"
                       align="left">
        <template slot-scope="scope">
          <span class="link-type">{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型"
                       class-name="status-col"
                       align="center">
        <template slot-scope="scope">
          <span>{{ getBannerTypeName(scope.row) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="分享标题"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.shareTitle }}</span>
        </template>
      </el-table-column>
      <el-table-column label="分享副标题"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.shareSubtitle }}</span>
        </template>
      </el-table-column>
      <el-table-column label="分享渠道"
                       align="center">
        <template slot-scope="scope">
          <span>{{ getShareChannelName(scope.row) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态"
                       class-name="status-col"
                       align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.bannerStatus"
                  type="danger">禁用</el-tag>
          <el-tag v-else
                  type="success">启用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作人"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.updateUser }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       class-name="small-padding fixed-width"
                       fixed="right"
                       width="160"
                       align="center">
        <template slot-scope="scope">
          <el-button v-permission="'PAGER_ACTIVITY_BANNER_MODIFY'"
                     type="primary"
                     size="small"
                     @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button v-if="scope.row.bannerStatus"
                     v-permission="'PAGER_ACTIVITY_BANNER_MODIFY'"
                     type="success"
                     size="small"
                     @click="handleDisable(scope.row.id, false)">启用
          </el-button>
          <el-button v-else
                     v-permission="'PAGER_ACTIVITY_BANNER_MODIFY'"
                     type="danger"
                     size="small"
                     @click="handleDisable(scope.row.id, true)">禁用
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>listQuery.pageSize"
                :total="total"
                :page.sync="listQuery.page"
                :limit.sync="listQuery.pageSize"
                @pagination="getBannerList" />
    <i-form ref="dataForm"
            :form-data="formData"
            :banner-type-options="bannerTypeOptions"
            :share-channel-options="shareChannelOptions" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { fetchList, modify } from '@/api/activity/banner'
import waves from '@/directive/waves' // Waves directive
import permission from '@/directive/permission'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import IForm from './form'

export default {
  name: 'BannerManage',
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
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        pageSize: 10,
        title: undefined,
        bannerType: undefined
      },
      formData: {
        id: undefined,
        title: undefined,
        bannerUrl: '',
        bannerClickUrl: undefined,
        bannerType: undefined,
        shareUrl: undefined,
        shareTitle: undefined,
        shareSubtitle: undefined,
        shareIcon: '',
        shareChannel: undefined,
        createUser: undefined
      }
    }
  },
  computed: {
    ...mapGetters([
      'bannerTypeOptions',
      'shareChannelOptions'
    ])
  },
  created () {
    this.getBannerList()
  },
  methods: {
    getBannerList () {
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
      this.getBannerList()
    },
    handleCreate () {
      this.restForm()
      const _this = this.$refs['dataForm']
      _this.dialogStatus = 'create'
      _this.dialogFormVisible = true
    },
    getBannerTypeName (row) {
      const arr = this.bannerTypeOptions.filter(v => v.key === row.bannerType)
      if (arr.length === 0) {
        return '--'
      } else {
        return arr[0].value
      }
    },
    getShareChannelName (row) {
      if (row.shareChannel && row.shareChannel.length > 0) {
        let result = ''
        for (var i = 0; i < row.shareChannel.length; i++) {
          const channel = row.shareChannel[i]
          const temp = this.shareChannelOptions.filter(item => item.key === channel)
          if (temp && temp.length > 0) {
            result += temp[0].value
            if (i !== row.shareChannel.length - 1) {
              result += '|'
            }
          }
        }
        return result
      } else {
        return '--'
      }

    },
    restForm () {
      this.formData.id = undefined
      this.formData.title = undefined
      this.formData.bannerUrl = ''
      this.formData.bannerClickUrl = undefined
      this.formData.bannerType = undefined
      this.formData.shareUrl = undefined
      this.formData.shareTitle = undefined
      this.formData.shareSubtitle = undefined
      this.formData.shareIcon = undefined
      this.formData.shareChannel = undefined
      this.formData.createUser = undefined
    },
    handleUpdate (row) {
      this.formData = Object.assign({}, row) // copy obj
      const _this = this.$refs['dataForm']
      _this.dialogStatus = 'update'
      _this.dialogFormVisible = true
    },
    handleDisable (id, bannerStatus) {
      const params = {
        id: id,
        updateUser: this.$store.state.user.username,
        bannerStatus: bannerStatus
      }
      modify(params).then(() => {
        this.$message({
          type: 'success',
          message: '操作成功'
        })
        this.getBannerList()
      })
    }
  }
}
</script>
