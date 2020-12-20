<template>
  <el-dialog :visible.sync="reissueFormVisible"
             title="补发优惠券"
             width="50%">
    <el-upload :on-success="handleUploadSuccess"
               :file-list="uploadFile"
               :action="actionURL"
               accept=".xlsx"
               class="upload-demo">
      <el-button v-waves
                 size="small"
                 type="primary">点击上传<i class="el-icon-upload el-icon-right" /></el-button>
      <div slot="tip"
           class="el-upload__tip">只能上传xlsx文件，且不超过10MB</div>
    </el-upload>

    <div slot="footer"
         class="dialog-footer">
      <el-button v-waves
                 :loading="downloadLoading"
                 class="filter-item"
                 type="warning"
                 icon="el-icon-download"
                 @click="handleDownload">下载模板
      </el-button>
      <el-button @click="reissueFormVisible = false">取消</el-button>
      <el-button v-permission="'ROLE_SUPER_ADMIN'"
                 type="primary"
                 @click="handleReissueCoupon">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { postPublishCoupon } from '@/api/activity/coupon'
import { getToken } from '@/utils/auth'
import Constants from '@/utils/constants'
import permission from '@/directive/permission'
import waves from '@/directive/waves' // Waves directive

export default {
  directives: { permission, waves },
  data () {
    return {
      reissueFormVisible: false,
      downloadLoading: false,
      uploadFile: [],
      downloadContent: {
        downloadFile: 'http://pk6b0a7n8.bkt.clouddn.com/coupon_send_template.xlsx',
        downloadFilename: 'coupon_send_template'
      },
      publishCoupon: {
        file: undefined,
        templateId: undefined
      },
      reissueRules: {
        file: [
          {
            validator: (rule, value, callback) => {
              if (value === null || value === undefined || value === '') {
                callback(new Error('上传文件不能为空'))
              } else {
                const suffix = value.substring(value.lastIndexOf('.') + 1, value.length)
                if (suffix !== 'xlsx') {
                  callback(new Error('上传文件格式必须是xlsx'))
                } else {
                  callback()
                }
              }
            }, trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    actionURL () {
      return process.env.VUE_APP_BASE_API + '/activity/coupon/publish?access_token=' + getToken(Constants.access_token) + '&templateId=' + this.publishCoupon.templateId
    }
  },
  methods: {
    handleUploadSuccess (respnse) {
      this.publishCoupon.file = respnse.data.url
    },
    handleDownload () {
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = this.downloadContent.downloadFile
      document.body.appendChild(link)
      link.click()
    },
    handleReissueCoupon () {
      postPublishCoupon(this.publishCoupon).then(() => {
        this.reissueFormVisible = false
        this.$message({
          message: '发送优惠券成功',
          type: 'success'
        })
      })
    }
  }
}
</script>
