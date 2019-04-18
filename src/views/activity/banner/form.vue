<template>
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="60%" @open="handleOpen">
    <el-form ref="dataForm" :rules="rules" :model="formData" label-position="left" label-width="100px">
      <el-form-item :label="$t('activity.banner.title')" prop="title">
        <el-input v-model="formData.title" placeholder="请设置"/>
      </el-form-item>
      <el-form-item :label="$t('activity.banner.bannerUrl')" prop="bannerUrl">
        <div style="margin-bottom: 20px;">
          <Upload v-model="formData.bannerUrl" />
        </div>
      </el-form-item>
      <el-form-item :label="$t('activity.banner.shareIcon')" prop="shareIcon">
        <div style="margin-bottom: 20px;">
          <Upload v-model="formData.shareIcon" />
        </div>
      </el-form-item>
      <el-form-item :label="$t('activity.banner.bannerClickUrl')" prop="bannerClickUrl">
        <el-input v-model="formData.bannerClickUrl" placeholder="请设置"/>
      </el-form-item>
      <el-form-item :label="$t('activity.banner.shareUrl')" prop="shareUrl">
        <el-input v-model="formData.shareUrl" placeholder="请设置"/>
      </el-form-item>
      <el-form-item :label="$t('activity.banner.shareTitle')" prop="shareTitle">
        <el-input v-model="formData.shareTitle" placeholder="请设置"/>
      </el-form-item>
      <el-form-item :label="$t('activity.banner.shareSubtitle')" prop="shareSubtitle">
        <el-input v-model="formData.shareSubtitle" placeholder="请设置"/>
      </el-form-item>
      <el-form-item :label="$t('activity.banner.bannerType')" prop="bannerType">
        <el-select v-model="formData.bannerType" class="filter-item" placeholder="请选择">
          <el-option v-for="(item,index) in bannerTypeOptions" :key="index" :label="item.value" :value="item.key"/>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('activity.banner.shareChannel')" prop="shareChannel">
        <el-select v-model="formData.shareChannel" class="filter-item" placeholder="请选择" multiple width="30%">
          <el-option v-for="(item,index) in shareChannelOptions" :key="index" :label="item.value" :value="item.key"/>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('activity.banner.status')" prop="deleteStatus">
        <el-switch
          v-model="formData.deleteStatus"
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

</template>

<script>
import { addBanner, modifyBanner } from '@/api/banner'
import waves from '@/directive/waves' // Waves directive
import permission from '@/directive/permission'
export default {
  directives: { waves, permission },
  props: {
    formData: {
      type: Object,
      default: () => ({})
    },
    bannerTypeOptions: {
      type: Array,
      default: () => ([])
    },
    shareChannelOptions: {
      type: Array,
      default: () => ([])
    }
  },
  data() {
    return {
      textMap: {
        update: '编辑',
        create: '新建'
      },
      dialogStatus: undefined,
      dialogFormVisible: false,
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
  methods: {
    handleOpen() {
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.formData.createUser = this.$store.state.user.username
          addBanner(this.formData).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            this.$parent.getBannerList()
          })
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.formData)
          modifyBanner(tempData).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
            this.$parent.getBannerList()
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
