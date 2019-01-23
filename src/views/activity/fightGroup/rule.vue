<template>
  <div class="app-container">
    <el-form ref="dataForm" :rules="rules" :model="activityRule" label-position="left" label-width="100px">
      <el-form-item :label="$t('activity.fightGroup.activityName')" prop="activityName" size="medium">
        <el-input v-model="activityRule.activityName" disabled placeholder="请设置"/>
      </el-form-item>
      <el-form-item :label="$t('activity.fightGroup.purchaseLimit')" prop="purchaseLimit">
        <el-input v-model="activityRule.purchaseLimit" placeholder="请设置"/>
      </el-form-item>
      <el-form-item :label="$t('activity.fightGroup.fightCount')" prop="fightCount">
        <el-input v-model="activityRule.fightCount" placeholder="请设置"/>
      </el-form-item>
      <el-form-item :label="$t('activity.fightGroup.description')" prop="description">
        <el-input v-model="activityRule.description" placeholder="请设置" type="textarea"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="goBack()">{{ $t('table.cancel') }}</el-button>
      <el-button v-permission="'/admin/activity/fightGroup/modify'" type="primary" @click="createData()">{{ $t('table.confirm') }}</el-button>
    </div>
  </div>
</template>

<script>
import { fightGroupRuleInfo, modifyFightGroupRule } from '@/api/activity'
import waves from '@/directive/waves' // Waves directive
import permission from '@/directive/permission'
import Upload from '@/components/Upload/singleImage3'

export default {
  name: 'FightGroupActivity',
  components: { Upload },
  directives: { waves, permission },
  data() {
    return {
      activityRule: {
        id: undefined,
        groupId: undefined,
        activityName: undefined,
        purchaseLimit: undefined,
        fightCount: undefined,
        description: undefined
      },
      rules: {
        activityName: [{ required: true, message: '活动标题不能为空', trigger: 'blur' }],
        purchaseLimit: [{ required: true, message: '限购数量不能为空', trigger: 'blur' }],
        fightCount: [{ required: true, message: '成团数量不能为空', trigger: 'blur' }],
        description: [{ required: true, message: '规则说明不能为空', trigger: 'blur' }]
      },
      tempRoute: {}
    }
  },
  created() {
    this.tempRoute = Object.assign({}, this.$route)
    console.log(this.$route.params.id)
    this.initData()
  },
  methods: {
    initData() {
      const params = {}
      params.createUser = this.$store.state.user.sysCode
      params.id = this.$route.params.id
      fightGroupRuleInfo(params).then(response => {
        this.activityRule = response.data
      }).catch(error => {
        this.$message.error(error)
      })
    },
    goBack() {
      window.history.go(-1) // 回退上一级路由
      this.$store.dispatch('delVisitedView', this.tempRoute) // 关闭当前路由
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.activityRule.createUser = this.$store.state.user.sysCode
          modifyFightGroupRule(this.activityRule).then(response => {
            this.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success',
              duration: 2000
            })
            this.goBack()
          }).catch(error => {
            this.$message.error(error)
          })
        }
      })
    }
  }
}
</script>
