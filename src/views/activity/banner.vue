<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="$t('activity.banner.title')" v-model="listQuery.title" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.module" :placeholder="$t('activity.banner.bannerType')" clearable style="width: 120px" class="filter-item">
        <el-option v-for="(item,index) in bannerTypeOptions" :key="index" :label="item.value" :value="item.key"/>
      </el-select>
      <el-select v-model="listQuery.module" :placeholder="$t('activity.banner.shareChannel')" clearable style="width: 120px" class="filter-item">
        <el-option v-for="(item,index) in shareChannelOptions" :key="index" :label="item.value" :value="item.key"/>
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
      <el-table-column :label="$t('activity.banner.title')" align="center">
        <template slot-scope="scope">
          <span class="link-type">{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('activity.banner.bannerUrl')" align="center">
        <template slot-scope="scope">
          <span><img :src="scope.row.bannerUrl"></span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('activity.banner.bannerType')" class-name="status-col" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.bannerType | statusFilter">{{ scope.row.deleteStatus }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('activity.banner.shareTitle')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.shareTitle }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('activity.banner.shareSubtitle')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.shareSubtitle }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('activity.banner.shareIcon')" align="center">
        <template slot-scope="scope">
          <span><img :src="scope.row.shareIcon"></span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('activity.banner.shareChannel')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.shareChannel }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('activity.banner.createUser')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createUser }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('activity.banner.createTime')" align="center">
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

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getBannerList" />

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
        <el-form-item :label="$t('activity.banner.shareIcon')" prop="bannerUrl">
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
          <el-select v-model="temp.shareChannel" class="filter-item" placeholder="请选择">
            <el-option v-for="(item,index) in shareChannelOptions" :key="index" :label="item.value" :value="item.key"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('activity.banner.status')" prop="deleteStatus">
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
import { fetchBannerList, modifyBanner } from '@/api/activity'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import Upload from '@/components/Upload/singleImage3'

export default {
  name: 'BannerManage',
  components: { Pagination, Upload },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        configName: undefined,
        module: undefined
      },
      bannerTypeOptions: [],
      shareChannelOptions: [],
      textMap: {
        update: '编辑',
        create: '新建'
      },
      dialogStatus: undefined,
      dialogFormVisible: false,
      temp: {
        id: undefined,
        title: '',
        bannerUrl: '',
        bannerClickUrl: '',
        bannerType: '',
        shareUrl: '',
        shareTitle: '',
        shareSubtitle: '',
        shareIcon: '',
        shareChannel: '',
        createUser: '',
        deleteStatus: ''
      },
      rules: {
        title: [{ required: true, message: '活动标题不能为空', trigger: 'change' }],
        bannerUrl: [{ required: true, message: 'banner图片地址不能为空', trigger: 'change' }],
        shareUrl: [{ required: true, message: '分享地址不能为空', trigger: 'change' }],
        shareTitle: [{ required: true, message: '分享标题不能为空', trigger: 'change' }],
        shareSubtitle: [{ required: true, message: '分享副标题不能为空', trigger: 'change' }],
        shareIcon: [{ required: true, message: '分享图标不能为空', trigger: 'change' }],
        shareChannel: [{ required: true, message: '分享渠道不能为空', trigger: 'change' }]
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

        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getBannerList()
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
          modifyBanner(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
          this.getBannerList()
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
          modifyBanner(tempData).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
          this.getBannerList()
        }
      })
    }
  }
}
</script>
