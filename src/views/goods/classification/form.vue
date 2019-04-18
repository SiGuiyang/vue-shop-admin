<template>
  <el-dialog :title="dialogFormTitle" :visible.sync="dialogFormVisible" width="60%">
    <el-form ref="dataForm" :rules="rules" :model="formData" label-position="left" label-width="100px">
      <el-form-item :label="$t('goods.classificationName')" prop="className">
        <el-input v-model="formData.className" placeholder="请设置"/>
      </el-form-item>
      <el-form-item :label="$t('goods.goodsImg')" prop="icon">
        <div style="margin-bottom: 20px;">
          <Upload v-model="formData.icon" />
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
      <el-button type="primary" @click="updateData()">{{ $t('table.confirm') }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { modify } from '@/api/classification'
export default {
  props: {
    formData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      dialogFormVisible: false,
      dialogFormTitle: '编辑',
      rules: {
        className: [{ required: true, message: '分类名称不能为空', trigger: 'blur' }],
        icon: [{ required: true, message: '图片不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    updateData() {
      const tempData = Object.assign({}, this.formData)
      tempData.createUser = this.$store.state.user.username
      modify(tempData).then(() => {
        this.dialogFormVisible = false
        this.$notify({
          title: '成功',
          message: '更新成功',
          type: 'success',
          duration: 2000
        })
        this.$parent.getList()
      })
    }
  }
}
</script>
