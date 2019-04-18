<template>
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
    <el-form ref="dataForm" :rules="rules" :model="formData" label-position="left" label-width="100px" width="50%">
      <el-form-item :label="$t('system.user.sysName')" prop="sysName">
        <el-input v-model="formData.sysName" placeholder="请设置"/>
      </el-form-item>
      <el-form-item :label="$t('system.user.username')" prop="username">
        <el-input v-model="formData.username" placeholder="请设置"/>
      </el-form-item>
      <el-form-item :label="$t('system.user.password')" prop="password">
        <el-input v-model="formData.password" :disabled="passwordDisabled" type="password" placeholder="请设置"/>
      </el-form-item>
      <el-form-item :label="$t('system.user.roleCode')" prop="roleIds">
        <el-select v-model="formData.roleIds" class="filter-item" multiple placeholder="请选择">
          <el-option v-for="(item,index) in roleCodeOptions" :key="index" :label="item.roleName" :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('system.user.avatar')" prop="avatar">
        <div style="margin-bottom: 20px;">
          <Upload v-model="formData.avatar" />
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
      <el-button type="primary" @click="dialogStatus==='create'?handleCreateData():handleUpdateData()">{{ $t('table.confirm') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { modify } from '@/api/sysuser'
import Upload from '@/components/Upload/singleImage3'

export default {
  name: 'Form',
  components: { Upload },
  props: {
    formData: {
      type: Object,
      default: () => ({
        sysName: '',
        username: ''
      })
    },
    roleCodeOptions: {
      type: Array,
      default: () => ([])
    }
  },
  data() {
    return {
      dialogFormVisible: false,
      dialogPvVisible: false,
      passwordDisabled: false,
      dialogStatus: 'create',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      rules: {
        sysName: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
        username: [{ required: true, message: '系统登陆名不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
        roleIds: [{ required: true, message: '角色不能为空', trigger: 'blur' }],
        avatar: [{ required: true, message: '用户头像不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    handleCreateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.formData.createUser = this.$store.state.user.username
          this.formData.loginCode = this.formData.username
          this.formData.event = 'add'
          modify(this.formData).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            this.$parent.getUserList()
          })
        }
      })
    },
    handleUpdateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const formDataData = Object.assign({}, this.formData)
          formDataData.event = 'modify'
          modify(formDataData).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
            this.$parent.getUserList()
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
