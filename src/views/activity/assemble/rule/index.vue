<template>
  <div class="app-container">
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
      <el-form-item label="每人限购数量"
                    prop="purchaseLimit">
        <el-input v-model="activityRule.purchaseLimit"
                  placeholder="请设置" />
      </el-form-item>
      <el-form-item label="成团人数"
                    prop="assembleCount">
        <el-input v-model="activityRule.assembleCount"
                  placeholder="请设置" />
      </el-form-item>
      <el-form-item label="说明"
                    prop="description">
        <el-input v-model="activityRule.description"
                  :rows="5"
                  type="textarea"
                  :maxlength="200"
                  placeholder="请设置"
                  show-word-limit />
      </el-form-item>
    </el-form>
    <div slot="footer"
         class="dialog-footer">
      <el-button @click="goBack()">取消</el-button>
      <el-button v-permission="'PAGER_ACTIVITY_ASSEMBLY_RULE_CREATE'"
                 type="primary"
                 @click="createData()">确认
      </el-button>
    </div>
  </div>
</template>

<script>
import { getRuleInfo, putModifyRule } from '@/api/activity/assemble'
import waves from '@/directive/waves' // Waves directive
import permission from '@/directive/permission'

export default {
  name: 'FightGroupActivity',
  directives: { waves, permission },
  data () {
    return {
      showWordLimit: true,
      activityRule: {
        id: undefined,
        activityId: undefined,
        activityName: undefined,
        purchaseLimit: undefined,
        assembleCount: undefined,
        description: undefined
      },
      rules: {
        purchaseLimit: [{ required: true, message: '限购数量不能为空', trigger: 'blur' }],
        assembleCount: [{ required: true, message: '成团数量不能为空', trigger: 'blur' }]
      },
      tempRoute: {}
    }
  },
  created () {
    this.initData()
  },
  methods: {
    initData () {
      this.tempRoute = this.$route
      getRuleInfo({ ruleId: this.$route.params.id }).then(response => {
        this.activityRule = response.data
      })
    },
    goBack () {
      window.history.go(-1) // 回退上一级路由
      this.$store.dispatch('delVisitedView', this.tempRoute) // 关闭当前路由
    },
    createData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.activityRule.createUser = this.$store.state.user.username
          putModifyRule(this.activityRule).then(() => {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            this.goBack()
          })
        }
      })
    }
  }
}
</script>
