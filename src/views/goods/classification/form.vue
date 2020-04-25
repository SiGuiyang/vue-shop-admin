<template>
  <el-dialog :title="dialogFormTitle"
             :visible.sync="dialogFormVisible"
             width="60%"
             @opened="handleOpen">
    <el-form ref="dataForm"
             :rules="rules"
             :model="formData"
             label-position="top"
             label-width="100px">
      <el-form-item label="分类名称"
                    prop="className">
        <el-input v-model="formData.className"
                  placeholder="请设置" />
      </el-form-item>
      <el-form-item label="父级分类">
        <treeselect v-model="formData.parentId"
                    :options="classificationList"
                    :normalizer="classificationNormalizer"
                    value-field-name="id"
                    placeholder="请选择" />
      </el-form-item>
      <el-form-item label="分类banner"
                    prop="bannerId">
        <el-select v-model="formData.bannerId"
                   class="filter-item"
                   placeholder="请选择">
          <el-option v-for="(item,index) in bannerList"
                     :key="index"
                     :label="item.title"
                     :value="item.id" />
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer"
         class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取消</el-button>
      <el-button type="primary"
                 @click="dialogStatus==='create'?createData():updateData()">确认</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { postCreate, putModify, postClassificationTree } from '@/api/goods/classification'
import { postBannerList } from '@/api/activity/banner'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  components: { Treeselect },
  props: {
    formData: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      dialogFormVisible: false,
      dialogStatus: 'create',
      dialogFormTitle: '编辑',
      bannerList: [], // banner 列表
      classificationList: [], // 分类列表
      rules: {
        className: [{ required: true, message: '分类名称不能为空', trigger: 'blur' }],
        icon: [{ required: true, message: '图片不能为空', trigger: 'blur' }]
      },
      classificationNormalizer (node) {
        console.log(node)
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
      this.handleClassification()
      this.handleBanner()
    },
    handleClassification () { // 分类树形结构
      postClassificationTree().then(response => {
        this.classificationList = response.data
      })
    },
    handleBanner () { // banner 列表
      postBannerList({}).then((response) => {
        this.bannerList = response.data
      })
    },
    createData () {
      const tempData = Object.assign({}, this.formData)
      tempData.updateUser = this.$store.state.user.username
      tempData.createUser = this.$store.state.user.username
      postCreate(tempData).then(() => {
        this.dialogFormVisible = false
        this.$notify({
          type: 'success',
          title: '成功',
          message: '创建成功',
          duration: 2000
        })
        this.$parent.getList()
      })
    },
    updateData () {
      const tempData = Object.assign({}, this.formData)
      tempData.createUser = this.$store.state.user.username
      putModify(tempData).then(() => {
        this.dialogFormVisible = false
        this.$notify({
          type: 'success',
          title: '成功',
          message: '更新成功',
          duration: 2000
        })
        this.$parent.getList()
      })
    }
  }
}
</script>
