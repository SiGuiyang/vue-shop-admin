<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="$t('activity.coupon.templateName')" v-model="listQuery.templateName" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.templateType" :placeholder="$t('activity.coupon.templateType')" clearable style="width: 120px" class="filter-item">
        <el-option v-for="(item,index) in templateTypeOptions" :key="index" :label="item.value" :value="item.key"/>
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button v-permission="'/admin/activity/coupon/template'" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
      <el-button v-permission="'/admin/activity/coupon/template'" :disabled="reissueDisabled" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="reissueFormVisible = true">{{ $t('table.reissueCoupon') }}</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="65"/>
      <el-table-column :label="$t('activity.coupon.templateName')" align="center" width="200">
        <template slot-scope="scope">
          <span class="link-type">{{ scope.row.templateName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('activity.coupon.templateType')" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ getTemplateType(scope.row.templateType) }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('activity.coupon.deleteStatus')" align="center" width="80">
        <template slot-scope="scope">
          <el-tag :type="scope.row.deleteStatus | statusFilter">{{ scope.row.deleteStatus ? '禁用' : '启用' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('activity.coupon.orderAmount')" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.orderAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('activity.coupon.couponAmount')" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.couponAmount != null ? scope.row.couponAmount: '——' }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('activity.coupon.discountStrength')" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.discountStrength != null ? scope.row.discountStrength + ' 折' : '——' }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('activity.coupon.description')" align="center" width="260">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.createUser')" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.createUser }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.createTime')" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" class-name="small-padding fixed-width" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button v-permission="'/admin/activity/coupon/template'" type="primary" size="mini" @click="handleUpdate(scope.row)">{{ $t('table.edit') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getCouponTemplateList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="50%">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px">
        <el-form-item :label="$t('activity.coupon.templateName')" prop="templateName">
          <el-input v-model="temp.templateName" placeholder="请设置"/>
        </el-form-item>
        <el-form-item :label="$t('activity.coupon.templateType')" prop="templateType">
          <el-select v-model="temp.templateType" class="filter-item" placeholder="请选择" @change="handleChangeType">
            <el-option v-for="(item,index) in templateTypeOptions" :key="index" :label="item.value" :value="item.key"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('activity.coupon.orderAmount')" prop="orderAmount">
          <el-input v-model.number="temp.orderAmount" placeholder="请设置"/>
        </el-form-item>
        <el-form-item v-if="!discountVisible" :label="$t('activity.coupon.couponAmount')" prop="couponAmount">
          <el-input v-model.number="temp.couponAmount" placeholder="请设置"/>
        </el-form-item>
        <el-form-item
          v-if="discountVisible"
          :label="$t('activity.coupon.discountStrength')"
          prop="discountStrength">
          <el-input v-model.number="temp.discountStrength" placeholder="请设置"/>
        </el-form-item>
        <el-form-item :label="$t('activity.coupon.description')" prop="description">
          <el-input :autosize="{ minRows: 4, maxRows: 8}" v-model="temp.description" type="textarea" placeholder="请添加说明"/>
        </el-form-item>
        <el-form-item :label="$t('activity.coupon.deleteStatus')" prop="deleteStatus">
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
        <el-button v-permission="'/admin/activity/coupon/template/modify'" type="primary" @click="dialogStatus==='create'?createData():updateData()">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="reissueFormVisible" title="补发优惠券" width="50%">

      <el-upload
        :on-success="handleUploadSuccess"
        :file-list="uploadFile"
        :action="actionURL"
        accept=".xlsx"
        class="upload-demo">
        <el-button v-waves size="small" type="primary">点击上传<i class="el-icon-upload el-icon-right"/></el-button>
        <div slot="tip" class="el-upload__tip">只能上传xlsx文件，且不超过10MB</div>
      </el-upload>

      <div slot="footer" class="dialog-footer">
        <el-button v-waves :loading="downloadLoading" class="filter-item" type="warning" icon="el-icon-download" @click="handleDownload">{{ $t('table.downloadTemplate') }}</el-button>
        <el-button @click="reissueFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button v-permission="'/admin/publish/coupon'" type="primary" @click="handleReissueCoupon">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchCouponTemplateList, modifyCouponTemplate, publishCoupon } from '@/api/activity'
import waves from '@/directive/waves' // Waves directive
import permission from '@/directive/permission'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'CouponTemplate',
  components: { Pagination },
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
        templateName: undefined,
        templateType: undefined
      },
      templateTypeOptions: [
        { key: 1, value: '优惠券' },
        { key: 2, value: '折扣券' }
      ],
      textMap: {
        update: '编辑',
        create: '新建优惠券模板'
      },
      dialogStatus: undefined,
      dialogFormVisible: false,
      reissueDisabled: true,
      reissueFormVisible: false,
      downloadLoading: false,
      discountVisible: false,
      uploadFile: [],
      downloadContent: {
        downloadFile: 'http://pk6b0a7n8.bkt.clouddn.com/coupon_send_template.xlsx',
        downloadFilename: 'coupon_send_template'
      },
      publishCoupon: {
        file: undefined,
        templateId: undefined
      },
      temp: {
        id: undefined,
        templateName: undefined,
        templateType: '',
        orderAmount: undefined,
        couponAmount: null,
        discountStrength: null,
        description: undefined,
        deleteStatus: false
      },
      rules: {
        templateName: [{ required: true, message: '优惠券模板不能为空', trigger: 'blur' }],
        templateType: [{ required: true, message: '模版类型不能为空', trigger: 'blur' }],
        description: [{ required: true, message: '优惠券说明不能为空', trigger: 'blur' }],
        orderAmount: [{ type: 'number', required: true, message: '订单金额只能是整数', trigger: 'blur' },
          { validator: (rule, value, callback) => {
            if (/^[1-9]\d*$/.test(value)) {
              callback()
            } else {
              callback(new Error('订单金额只能是整数'))
            }
          }, trigger: 'change'
          }
        ],
        couponAmount: [{ type: 'number', required: true, message: '满减金额只能是整数', trigger: 'blur' },
          { validator: (rule, value, callback) => {
            if (/^[1-9]\d*$/.test(value)) {
              callback()
            } else {
              callback(new Error('满减金额只能是整数'))
            }
          }, trigger: 'change'
          }
        ],
        discountStrength: [{ type: 'number', required: true, message: '折扣力度不能为空', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (/^[1-9]\d*$/.test(value)) {
                callback()
              } else {
                callback(new Error('折扣力度只能是整数'))
              }
            }, trigger: 'change'
          }
        ]
      },
      reissueRules: {
        file: [
          { validator: (rule, value, callback) => {
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
    actionURL() {
      return process.env.BASE_API + '/admin/upload'
    }
  },
  created() {
    this.getCouponTemplateList()
  },
  methods: {
    getCouponTemplateList() {
      this.listLoading = true
      fetchCouponTemplateList(this.listQuery).then(response => {
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
    getTemplateType(type) {
      return this.templateTypeOptions.filter(v => v.key === type)[0].value
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getCouponTemplateList()
    },
    handleSelectionChange(row) { // 复选框变化出发事件
      if (row.length === 1) {
        this.reissueDisabled = false
        this.publishCoupon.templateId = row[0].id
      } else {
        this.reissueDisabled = true
      }
      console.log(row)
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    handleCreate() {
      this.temp = {}
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleChangeType(val) {
      this.discountVisible = val === 2
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.event = 'add'
          this.temp.createUser = this.$store.state.user.sysCode
          modifyCouponTemplate(this.temp).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            this.getCouponTemplateList()
          }).catch(error => {
            this.$notify({
              title: '成功',
              message: error,
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      if (this.temp.templateType === 2) {
        this.discountVisible = true
        this.temp.discountStrength = this.temp.discountStrength * 100
      } else {
        this.discountVisible = false
      }
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
          modifyCouponTemplate(tempData).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
            this.getCouponTemplateList()
          }).catch(error => {
            this.$message.error(error)
          })
        }
      })
    },
    handleUploadSuccess(respnse) {
      this.publishCoupon.file = respnse.data.url
    },
    handleDownload() {
      window.location.href = process.env.BASE_API + '/admin/download?downloadFile=' + this.downloadContent.downloadFile + '&downloadFilename=' + this.downloadContent.downloadFilename
    },
    handleReissueCoupon() {
      publishCoupon(this.publishCoupon).then(response => {
        this.reissueFormVisible = false
        this.$notify({
          title: '成功',
          message: '发送优惠券成功',
          type: 'success',
          duration: 2000
        })
      }).catch(error => {
        this.$message.error(error)
      })
    }
  }
}
</script>
