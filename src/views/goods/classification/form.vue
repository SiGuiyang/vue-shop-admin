<template>
  <el-dialog :title="dialogFormTitle"
             :visible.sync="dialogFormVisible"
             width="60%"
             @opened="handleOpen">
    <el-form ref="dataForm"
             :rules="rules"
             :model="formData"
             label-position="left"
             label-width="100px">
      <el-form-item :label="$t('goods.classificationName')"
                    prop="className">
        <el-input v-model="formData.className"
                  placeholder="请设置" />
      </el-form-item>
      <el-form-item label="父级分类">
        <v-tree-select v-model="formData.parentId"
                       :data="classification"
                       value-field-name="id" />
      </el-form-item>
      <el-form-item label="分类banner"
                    prop="bannerIds">
        <el-select v-model="formData.bannerIds"
                   multiple
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
                 @click="updateData()">确认</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { putModify } from '@/api/goods/classification'
import VTreeSelect from 'vue-treeselect'

export default {
  components: { VTreeSelect },
  props: {
    formData: {
      type: Object,
      default: () => ({})
    },
    classification: {
      type: Array,
      default: () => ([])
    },
    bannerList: {
      type: Array,
      default: () => ([])
    }
  },
  data () {
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
    handleOpen () {
      this.$refs['dataForm'].clearValidate()
    },
    updateData () {
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
    }
  }
}
</script>
