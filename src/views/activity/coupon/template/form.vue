<template>
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="50%">
    <el-form ref="dataForm" :rules="rules" :model="formData" label-position="left" label-width="120px">
      <el-form-item :label="$t('activity.coupon.templateName')" prop="templateName">
        <el-input v-model="formData.templateName" placeholder="请设置"/>
      </el-form-item>
      <el-form-item :label="$t('activity.coupon.templateType')" prop="templateType">
        <el-select v-model="formData.templateType" class="filter-item" placeholder="请选择" @change="handleChangeType">
          <el-option v-for="(item,index) in templateTypeOptions" :key="index" :label="item.value" :value="item.key"/>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('activity.coupon.orderAmount')" prop="orderAmount">
        <el-input v-model.number="formData.orderAmount" placeholder="请设置"/>
      </el-form-item>
      <el-form-item v-if="!discountVisible" :label="$t('activity.coupon.couponAmount')" prop="couponAmount">
        <el-input v-model.number="formData.couponAmount" placeholder="请设置"/>
      </el-form-item>
      <el-form-item
        v-if="discountVisible"
        :label="$t('activity.coupon.discountStrength')"
        prop="discountStrength">
        <el-input v-model.number="formData.discountStrength" placeholder="请设置"/>
      </el-form-item>
      <el-form-item :label="$t('activity.coupon.description')" prop="description">
        <el-input :autosize="{ minRows: 4, maxRows: 8}" v-model="formData.description" type="textarea" placeholder="请添加说明"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
      <el-button v-permission="'ROLE_SUPER_ADMIN'" type="primary" @click="dialogStatus==='create'?createData():updateData()">{{ $t('table.confirm') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { postAddTemplate, putModifyTemplate } from '@/api/activity/couponTemplate'
import permission from '@/directive/permission'
import waves from '@/directive/waves' // Waves directive

export default {
  directives: { permission, waves },
  props: {
    formData: {
      type: Object,
      default: () => ({})
    },
    templateTypeOptions: {
      type: Array,
      default: () => ([])
    }
  },
  data() {
    return {
      textMap: {
        update: '编辑',
        create: '新建优惠券模板'
      },
      dialogStatus: undefined,
      dialogFormVisible: false,
      discountVisible: false,
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
      }
    }
  },
  methods: {
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.formData.createUser = this.$store.state.user.username
          postAddTemplate(this.formData).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            this.$parent.getCouponTemplateList()
          })
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.formData)
          putModifyTemplate(tempData).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
            this.$parent.getCouponTemplateList()
          })
        }
      })
    },
    handleChangeType(val) {
      this.discountVisible = val === 2
    }
  }
}
</script>

<style scoped>

</style>
