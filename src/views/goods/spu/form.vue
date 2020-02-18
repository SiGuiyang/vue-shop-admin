<template>
  <el-dialog :title="dialogFormTitle" :visible.sync="dialogFormVisible" width="60%" @opened="handleOpen">
    <el-form ref="dataForm" :rules="rules" :model="formData" label-position="left" label-width="120px">
      <el-form-item label="spu名称" prop="spuName">
        <el-input v-model="formData.className" placeholder="请设置"/>
      </el-form-item>
      <el-form-item label="二级分类名称" prop="classId">
        <el-cascader :options="goodsClassification" :props="goodsClassificationProps" v-model="formData.classId" show-all-levels="false"/>
      </el-form-item>
      <el-form-item label="序号" prop="sequence">
        <el-input-number :min="min" :max="max" v-model="sequence" label="序号"/>
      </el-form-item>
      <el-form-item label="图标" prop="icon">
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
import { putModify } from '@/api/goods/spu'
import { postTree } from '@/api/goods/classification'
import Upload from '@/components/Upload/singleImage3'

export default {
  components: { Upload },
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
      min: 0,
      max: 100,
      sequence: 0,
      goodsClassification: [],
      goodsClassificationProps: {
        value: 'id',
        label: 'className'
      },
      rules: {
        spuName: [{ required: true, message: 'spu名称不能为空', trigger: 'blur' }],
        classId: [{ required: true, message: '二级分类名称不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.handleClassificationTree()
  },
  methods: {
    handleOpen() {
      this.$refs['dataForm'].clearValidate()
    },
    updateData() {
      const tempData = Object.assign({}, this.formData)
      tempData.createUser = this.$store.state.user.username
      putModify(tempData).then(() => {
        this.dialogFormVisible = false
        this.$message({
          type: 'success',
          message: '操作成功'
        })
        this.$parent.getList()
      })
    },
    handleClassificationTree() {
      postTree({}).then((response) => {
        this.goodsClassification = response.data
        console.log(this.goodsClassification)
      })
    }
  }
}
</script>
