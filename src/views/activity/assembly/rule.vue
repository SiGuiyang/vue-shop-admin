<template>
  <div class="app-container">
    <el-form ref="dataForm" :rules="rules" :model="activityRule" label-position="left" label-width="120px">
      <el-form-item label="活动名称" prop="activityName" size="medium">
        <el-input v-model="activityRule.activityName" disabled placeholder="请设置"/>
      </el-form-item>
      <el-form-item label="每人限购数量" prop="purchaseLimit">
        <el-input v-model="activityRule.purchaseLimit" placeholder="请设置"/>
      </el-form-item>
      <el-form-item label="成团人数" prop="fightCount">
        <el-input v-model="activityRule.fightCount" placeholder="请设置"/>
      </el-form-item>
      <el-form-item label="说明" prop="description">
        <el-input v-model="activityRule.description" placeholder="请设置" type="textarea"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="goBack()">取消</el-button>
      <el-button v-permission="'ROLE_SUPER_ADMIN'" type="primary" @click="createData()">确认</el-button>
    </div>
  </div>
</template>

<script>
import { fightGroupRuleInfo, modifyFightGroupRule } from '@/api/assembly'
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
        activityId: undefined,
        activityName: undefined,
        purchaseLimit: undefined,
        fightCount: undefined,
        description: undefined
      },
      rules: {
        purchaseLimit: [{ required: true, message: '限购数量不能为空', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (/^[1-9]\d*$/.test(value)) {
                callback()
              } else {
                callback(new Error('限购数量只能是整数'))
              }
            }, trigger: 'change'
          }
        ],
        fightCount: [{ required: true, message: '成团数量不能为空', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (/^[1-9]\d*$/.test(value)) {
                callback()
              } else {
                callback(new Error('成团数量只能是整数'))
              }
            }, trigger: 'change'
          }]
      },
      tempRoute: {}
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      const params = {}
      params.createUser = this.$store.state.user.username
      this.tempRoute = this.$route
      params.id = this.$route.params.id
      this.activityRule.activityId = this.$route.params.id
      fightGroupRuleInfo(params).then(response => {
        this.activityRule = response.data
      })
    },
    goBack() {
      window.history.go(-1) // 回退上一级路由
      this.$store.dispatch('delVisitedView', this.tempRoute) // 关闭当前路由
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.activityRule.createUser = this.$store.state.user.username
          modifyFightGroupRule(this.activityRule).then(() => {
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
