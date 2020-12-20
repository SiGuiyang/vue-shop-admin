<template>
  <el-dialog :title="textMap[dialogStatus]"
             :visible.sync="dialogFormVisible"
             width="50%">
    <el-form ref="dataForm"
             :rules="rules"
             :model="formData"
             label-position="top"
             label-width="120px">
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="模板名称"
                        prop="templateName">
            <el-input v-model="formData.templateName"
                      placeholder="请设置" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="模板类型"
                        prop="templateType">
            <el-select v-model="formData.templateType"
                       class="filter-item"
                       placeholder="请选择"
                       @change="handleChangeType">
              <el-option v-for="(item,index) in templateTypeOptions"
                         :key="index"
                         :label="item.value"
                         :value="item.type" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="订单满减金额"
                        prop="orderAmount">
            <el-input v-model.number="formData.orderAmount"
                      placeholder="请设置">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item v-if="!discountVisible"
                        label="优惠金额"
                        prop="couponAmount">
            <el-input v-model.number="formData.couponAmount"
                      placeholder="请设置">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item v-if="discountVisible"
                        label="折扣力度"
                        prop="discountStrength">
            <el-input v-model.number="formData.discountStrength"
                      placeholder="请设置">
              <template slot="append">折</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="说明"
                    prop="description">
        <el-input v-model="formData.description"
                  :autosize="{ minRows: 4, maxRows: 8}"
                  type="textarea"
                  placeholder="请添加说明" />
      </el-form-item>
    </el-form>
    <div slot="footer"
         class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取消</el-button>
      <el-button type="primary"
                 @click="dialogStatus==='create'?createData():updateData()">确认
      </el-button>
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
  data () {
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
        orderAmount: [{ type: 'number', required: true, message: '订单金额只能是整数', trigger: 'blur' }],
        couponAmount: [{ type: 'number', required: true, message: '满减金额只能是整数', trigger: 'blur' }],
        discountStrength: [{ type: 'number', required: true, message: '折扣力度不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    createData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.formData.createUser = this.$store.state.user.username
          this.formData.updateUser = this.$store.state.user.username
          postAddTemplate(this.formData).then(() => {
            this.dialogFormVisible = false
            this.$message({
              message: '创建成功',
              type: 'success'
            })
            this.$parent.getCouponTemplateList()
          })
        }
      })
    },
    updateData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.formData)
          tempData.updateUser = this.$store.state.user.username
          putModifyTemplate(tempData).then(() => {
            this.dialogFormVisible = false
            this.$message({
              message: '更新成功',
              type: 'success'
            })
            this.$parent.getCouponTemplateList()
          })
        }
      })
    },
    handleChangeType (val) {
      this.discountVisible = val === 2
    }
  }
}
</script>

<style scoped>
</style>
