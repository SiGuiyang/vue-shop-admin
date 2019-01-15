<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="$t('activity.banner.title')" v-model="listQuery.title" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.bannerType" :placeholder="$t('activity.banner.bannerType')" clearable style="width: 120px" class="filter-item">
        <el-option v-for="(item,index) in bannerTypeOptions" :key="index" :label="item.value" :value="item.key"/>
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button v-permission="'/admin/activity/banner/modify'" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="60%">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px">
        <el-form-item :label="$t('activity.banner.title')" prop="title">
          <el-input v-model="temp.title" placeholder="请设置"/>
        </el-form-item>
        <el-form-item :label="$t('activity.banner.bannerUrl')" prop="bannerUrl">
          <div style="margin-bottom: 20px;">
            <Upload v-model="temp.bannerUrl" />
          </div>
        </el-form-item>
        <el-form-item :label="$t('activity.banner.shareIcon')" prop="shareIcon">
          <div style="margin-bottom: 20px;">
            <Upload v-model="temp.shareIcon" />
          </div>
        </el-form-item>
        <el-form-item :label="$t('activity.banner.bannerClickUrl')" prop="bannerClickUrl">
          <el-input v-model="temp.bannerClickUrl" placeholder="请设置"/>
        </el-form-item>
        <el-form-item :label="$t('activity.banner.shareUrl')" prop="shareUrl">
          <el-input v-model="temp.shareUrl" placeholder="请设置"/>
        </el-form-item>
        <el-form-item :label="$t('activity.banner.shareTitle')" prop="shareTitle">
          <el-input v-model="temp.shareTitle" placeholder="请设置"/>
        </el-form-item>
        <el-form-item :label="$t('activity.banner.shareSubtitle')" prop="shareSubtitle">
          <el-input v-model="temp.shareSubtitle" placeholder="请设置"/>
        </el-form-item>
        <el-form-item :label="$t('activity.banner.bannerType')" prop="bannerType">
          <el-select v-model="temp.bannerType" class="filter-item" placeholder="请选择">
            <el-option v-for="(item,index) in bannerTypeOptions" :key="index" :label="item.value" :value="item.key"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('activity.banner.shareChannel')" prop="shareChannel">
          <el-select v-model="temp.shareChannel" class="filter-item" placeholder="请选择" multiple width="30%">
            <el-option v-for="(item,index) in shareChannelOptions" :key="index" :label="item.value" :value="item.key"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('activity.banner.status')" prop="deleteStatus">
          <el-switch
            v-model="temp.deleteStatus"
            active-text="关闭"
            inactive-text="启用"
            active-color="#ff4949"
            inactive-color="#13ce66" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button v-permission="'/admin/activity/banner/modify'" type="primary" @click="dialogStatus==='create'?createData():updateData()">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { fetchBannerList, modifyBanner } from '@/api/activity'
import waves from '@/directive/waves' // Waves directive
import permission from '@/directive/permission'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import Upload from '@/components/Upload/singleImage3'

export default {
  name: 'BannerManage',
  components: { Pagination, Upload },
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
      textMap: {
        update: '编辑',
        create: '新建'
      },
      dialogStatus: undefined,
      dialogFormVisible: false,
      temp: {
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
      },
      rules: {
        title: [{ required: true, message: '活动标题不能为空', trigger: 'blur' }],
        bannerUrl: [{ required: true, message: 'banner图片地址不能为空', trigger: 'blur' }],
        shareUrl: [{ required: true, message: '分享地址不能为空', trigger: 'blur' }],
        shareTitle: [{ required: true, message: '分享标题不能为空', trigger: 'blur' }],
        shareSubtitle: [{ required: true, message: '分享副标题不能为空', trigger: 'blur' }],
        shareIcon: [{ required: true, message: '分享图标不能为空', trigger: 'blur' }],
        bannerType: [{ required: true, message: 'Banner 类型不能为空', trigger: 'blur' }],
        shareChannel: [{ required: true, message: '分享渠道不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getBannerList()
  },
  methods: {
    getBannerList() {
      this.listLoading = true
      fetchBannerList(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.total

        this.list.forEach(k => {
          k.shareChannel = JSON.parse(k.shareChannel)
        })

        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      }).catch(error => {
        this.$message.error(error)
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
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    restForm() {
      this.temp.id = undefined
      this.temp.title = undefined
      this.temp.bannerUrl = ''
      this.temp.bannerClickUrl = undefined
      this.temp.bannerType = undefined
      this.temp.shareUrl = undefined
      this.temp.shareTitle = undefined
      this.temp.shareSubtitle = undefined
      this.temp.shareIcon = ''
      this.temp.shareChannel = []
      this.temp.createUser = undefined
      this.temp.deleteStatus = false
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.event = 'add'
          this.temp.createUser = this.$store.state.user.sysCode
          modifyBanner(this.temp).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            this.getBannerList()
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
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
          tempData.event = 'modify'
          modifyBanner(tempData).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
            this.getBannerList()
          })
        }
      })
    }
  }
}
</script>
