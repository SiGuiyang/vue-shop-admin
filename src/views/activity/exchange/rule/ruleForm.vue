<template>
  <el-dialog :title="textMap[dialogStatus]"
             :visible.sync="dialogFormVisible"
             width="60%">
    <el-form ref="dataForm"
             :rules="rules"
             :model="activityRule"
             label-position="top"
             label-width="120px">
      <el-form-item label="活动名称"
                    prop="activityName"
                    size="medium">
        <el-input v-model="activityRule.activityName"
                  disabled
                  placeholder="请设置" />
      </el-form-item>
      <el-form-item label="规则名称"
                    prop="ruleName">
        <el-input v-model="activityRule.ruleName"
                  placeholder="请设置" />
      </el-form-item>
      <el-form-item label="最低限额"
                    prop="orderAmount">
        <el-input v-model="activityRule.orderAmount"
                  placeholder="请设置">
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer"
         class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取消</el-button>
      <el-button type="primary"
                 @click="dialogStatus === 'create'? createData(): updateData()">确认
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addRule, modifyRule } from '@/api/activity/exchange'
import waves from '@/directive/waves' // Waves directive
import permission from '@/directive/permission'

export default {
  name: 'FightGroupActivity',
  directives: { waves, permission },
  props: {
    activityRule: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      textMap: {
        update: '编辑',
        create: '新建'
      },
      dialogStatus: 'update',
      dialogFormVisible: false,
      rules: {
        ruleName: [{ required: true, message: '规则名称不能为空', trigger: 'blur' }],
        orderAmount: [{ required: true, message: '最低限额不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    createData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.activityRule.createUser = this.$store.state.user.username
          this.activityRule.updateUser = this.$store.state.user.username
          addRule(this.activityRule).then(() => {
            this.$message({
              message: '创建成功',
              type: 'success'
            })
            this.dialogFormVisible = false
            this.$parent.handleRuleList()
          })
        }
      })
    },
    updateData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.activityRule.updateUser = this.$store.state.user.username
          modifyRule(this.activityRule).then(() => {
            this.$message({
              message: '更新成功',
              type: 'success'
            })
            this.dialogFormVisible = false
            this.$parent.handleRuleList()
          })
        }
      })
    }
  }
}
</script>
