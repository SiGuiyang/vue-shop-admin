<template>
  <el-dialog :title="dialogFormTitle"
             :visible.sync="dialogFormVisible"
             width="60%"
             @opened="handleOpen">
    <el-form ref="dataForm"
             :rules="rules"
             :model="formData"
             label-position="top"
             label-width="120px">
      <el-form-item label="spu名称"
                    prop="spuName">
        <el-input v-model="formData.spuName"
                  placeholder="请设置" />
      </el-form-item>
      <el-form-item label="二级分类名称"
                    prop="classificationId">
        <treeselect v-model="formData.classificationId"
                    :options="goodsClassification"
                    :normalizer="spuNormalizer"
                    value-field-name="id"
                    placeholder="请选择" />
      </el-form-item>
      <el-form-item label="序号"
                    prop="sequence">
        <el-input-number v-model="formData.sequence"
                         :min="min"
                         :max="max"
                         label="序号" />
      </el-form-item>
      <el-form-item label="图标"
                    prop="icon">
        <div style="margin-bottom: 20px;">
          <Upload v-model="formData.icon" />
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer"
         class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取消</el-button>
      <el-button type="primary"
                 @click="dialogStatus==='create'?createData():updateData()">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { postCreate, putModify } from '@/api/goods/spu'
import { postClassificationTree } from '@/api/goods/classification'
import Upload from '@/components/Upload/singleImage3'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  components: { Upload, Treeselect },
  props: {
    formData: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      dialogFormVisible: false,
      dialogFormTitle: '编辑',
      dialogStatus: 'create',
      min: 0,
      max: 100,
      sequence: 0,
      goodsClassification: [],
      rules: {
        spuName: [{ required: true, message: 'spu名称不能为空', trigger: 'blur' }],
        classificationId: [{ required: true, message: '二级分类名称不能为空', trigger: 'blur' }]
      },
      spuNormalizer (node) {
        return {
          id: node.id,
          label: node.className,
          chilren: node.chilren
        }
      }
    }
  },
  methods: {
    handleOpen () {
      this.$refs['dataForm'].clearValidate()
      this.handleClassificationTree()
    },
    createData () {
      const tempData = Object.assign({}, this.formData)
      tempData.createUser = this.$store.state.user.username
      tempData.updateUser = this.$store.state.user.username
      postCreate(tempData).then(() => {
        this.dialogFormVisible = false
        this.$message({
          type: 'success',
          message: '操作成功'
        })
        this.$parent.getList()
      })
    },
    updateData () {
      const tempData = Object.assign({}, this.formData)
      tempData.updateUser = this.$store.state.user.username
      putModify(tempData).then(() => {
        this.dialogFormVisible = false
        this.$message({
          type: 'success',
          message: '操作成功'
        })
        this.$parent.getList()
      })
    },
    handleClassificationTree () {
      postClassificationTree().then((response) => {
        this.goodsClassification = response.data
      })
    }
  }
}
</script>
