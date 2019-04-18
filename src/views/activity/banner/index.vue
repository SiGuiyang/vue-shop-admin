<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="$t('activity.banner.title')" v-model="listQuery.title" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.bannerType" :placeholder="$t('activity.banner.bannerType')" clearable style="width: 120px" class="filter-item">
        <el-option v-for="(item,index) in bannerTypeOptions" :key="index" :label="item.value" :value="item.key"/>
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button v-permission="'ROLE_ADMIN'" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
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
      <el-table-column :label="$t('activity.banner.title')" width="150" align="center">
        <template slot-scope="scope">
          <span class="link-type">{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('activity.banner.bannerUrl')" width="200" align="center">
        <template slot-scope="scope">
          <span><img :src="scope.row.bannerUrl" width="160px"></span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('activity.banner.bannerType')" class-name="status-col" width="120" align="center">
        <template slot-scope="scope">
          <span>{{ getBannerType(scope.row.bannerType) }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('activity.banner.shareTitle')" width="140" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.shareTitle }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('activity.banner.shareSubtitle')" width="140" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.shareSubtitle }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('activity.banner.shareIcon')" width="200" align="center">
        <template slot-scope="scope">
          <span><img :src="scope.row.shareIcon" width="140px"></span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('activity.banner.shareChannel')" width="140" align="center">
        <template slot-scope="scope">
          <span>{{ getShareChannel(scope.row.shareChannel) }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('activity.banner.status')" class-name="status-col" width="120" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.deleteStatus | statusFilter">{{ scope.row.deleteStatus ? '禁用' : '启用' }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column :label="$t('activity.banner.createUser')" width="140" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createUser }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('activity.banner.createTime')" width="160" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" class-name="small-padding fixed-width" fixed="right" width="100" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{ $t('table.edit') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getBannerList" />
    <i-form ref="dataForm" :form-data="formData" :banner-type-options="bannerTypeOptions" :share-channel-options="shareChannelOptions"/>
  </div>
</template>

<script>
import { fetchList } from '@/api/banner'
import waves from '@/directive/waves' // Waves directive
import permission from '@/directive/permission'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import Upload from '@/components/Upload/singleImage3'
import IForm from './form'

export default {
  name: 'BannerManage',
  components: { Pagination, Upload, IForm },
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
        title: undefined,
        bannerType: undefined
      },
      bannerTypeOptions: [
        { key: 'home', value: '首页' },
        { key: 'integralShop', value: '积分商城' }
      ],
      shareChannelOptions: [
        { key: 'qq', value: 'QQ' },
        { key: 'wechat', value: '微信' },
        { key: 'wechatFriends', value: '朋友圈' }
      ],
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
        createUser: undefined,
        deleteStatus: false
      }
    }
  },
  created() {
    this.getBannerList()
  },
  methods: {
    getBannerList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.total

        this.list.forEach(k => {
          k.shareChannel = JSON.parse(k.shareChannel)
        })

        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      }).catch(() => {
        this.listLoading = false
      })
    },
    getBannerType(bannerType) {
      return this.bannerTypeOptions.filter(k => k.key === bannerType)[0].value
    },
    getShareChannel(channel) {
      let content = ''
      channel.forEach(k => {
        this.shareChannelOptions.map(op => {
          if (op.key === k) {
            content = content + op.value + ' | '
          }
        })
      })
      return content
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getBannerList()
    },
    handleCreate() {
      this.restForm()
      const _this = this.$refs['dataForm']
      _this.dialogStatus = 'create'
      _this.dialogFormVisible = true
    },
    restForm() {
      this.formData.id = undefined
      this.formData.title = undefined
      this.formData.bannerUrl = ''
      this.formData.bannerClickUrl = undefined
      this.formData.bannerType = undefined
      this.formData.shareUrl = undefined
      this.formData.shareTitle = undefined
      this.formData.shareSubtitle = undefined
      this.formData.shareIcon = ''
      this.formData.shareChannel = []
      this.formData.createUser = undefined
      this.formData.deleteStatus = false
    },
    handleUpdate(row) {
      this.formData = Object.assign({}, row) // copy obj
      const _this = this.$refs['dataForm']
      _this.dialogStatus = 'update'
      _this.dialogFormVisible = true
    }
  }
}
</script>
