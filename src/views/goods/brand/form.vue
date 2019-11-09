<template>
  <el-dialog :title="dialogFormTitle" :visible.sync="dialogFormVisible" width="60%" @opened="handleOpen">
    <el-form ref="dataForm" :rules="rules" :model="formData" label-position="left" label-width="100px">
      <el-form-item label="品牌名称" prop="brandName">
        <el-input v-model="formData.brandName" placeholder="请设置"/>
      </el-form-item>
      <el-form-item label="编号" prop="brandCode">
        <el-input v-model="formData.brandCode" placeholder="请设置"/>
      </el-form-item>
      <el-form-item label="序号" prop="sequence">
        <el-input v-model="formData.sequence" placeholder="请设置"/>
      </el-form-item>
      <el-form-item
        label="所属品牌组"
        prop="brandGroupId">
        <el-select
          v-model="formData.brandGroupId"
          class="filter-item"
          placeholder="请选择">
          <el-option
            v-for="(item,index) in brandGroup"
            :key="index"
            :label="item.brandGroupName"
            :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="图标" prop="icon">
        <div style="margin-bottom: 20px;">
          <Upload v-model="formData.icon" />
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取消</el-button>
      <el-button type="primary" @click="updateData()">确认</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { createOrModify } from '@/api/goods/brand'
import Upload from '@/components/Upload/singleImage3'

export default {
  components: { Upload },
  props: {
    formData: {
      type: Object,
      default: () => ({})
    },
    brandGroup: {
      type: Array,
      default: () => ([])
    }
  },
  data() {
    return {
      dialogStatus: undefined,
      dialogFormVisible: false,
      dialogFormTitle: '编辑',
      rules: {
        brandName: [{ required: true, message: '品牌不能为空', trigger: 'blur' }],
        brandCode: [{ required: true, message: '编号不能为空', trigger: 'blur' }],
        sequence: [{ required: true, message: '序号不能为空', trigger: 'blur' },
          { validator: (rule, value, callback) => {
            if (/^[1-9]\d*|0$/.test(value)) {
              callback()
            } else {
              callback(new Error('序号不正确'))
            }
          }, trigger: 'change'
          }
        ],
        brandGroupId: [{ required: true, message: '品牌组名称不能为空', trigger: 'blur' }],
        icon: [{ required: true, message: '图片不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    handleOpen() {
      this.$refs['dataForm'].clearValidate()
    },
    updateData() {
      const tempData = Object.assign({}, this.formData)
      tempData.createUser = this.$store.state.user.username
      tempData.updateUser = this.$store.state.user.username
      tempData.event = this.dialogStatus === 'create' ? 'add' : 'modify'
      createOrModify(tempData).then(() => {
        this.dialogFormVisible = false
        this.$message({
          type: 'success',
          message: '操作成功'
        })
        this.$parent.getList()
      })
    }
  }
}
</script>
