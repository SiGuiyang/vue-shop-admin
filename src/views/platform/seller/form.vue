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
      <el-form-item label="品牌名称"
                    prop="brandName">
        <el-input v-model="formData.brandName"
                  placeholder="请设置" />
      </el-form-item>
      <el-form-item label="编号"
                    prop="brandCode">
        <el-input v-model="formData.brandCode"
                  placeholder="请设置" />
      </el-form-item>
      <el-form-item label="序号"
                    prop="sequence">
        <el-input v-model="formData.sequence"
                  placeholder="请设置" />
      </el-form-item>
      <el-form-item label="所属品牌组"
                    prop="brandGroupId">
        <el-cascader v-model="formData.brandGroupId"
                     :props="props"
                     :options="brandGroupList" />
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
                 @click="dialogStatus==='create'?createData():updateData()">确认</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { postCreate, putModify } from '@/api/goods/brand'
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
  data () {
    return {
      dialogStatus: undefined,
      dialogFormVisible: false,
      dialogFormTitle: '编辑',
      rules: {
        brandName: [{ required: true, message: '品牌不能为空', trigger: 'blur' }],
        brandCode: [{ required: true, message: '编号不能为空', trigger: 'blur' }],
        sequence: [{ required: true, message: '序号不能为空', trigger: 'blur' }],
        brandGroupId: [{ required: true, message: '品牌组名称不能为空', trigger: 'blur' }],
        icon: [{ required: true, message: '图片不能为空', trigger: 'blur' }]
      },
      brandGroupList: [{
        value: 'zhinan',
        label: '指南',
        children: [{
          value: 'shejiyuanze',
          label: '设计原则',
          children: [{
            value: 'yizhi',
            label: '一致'
          }, {
            value: 'fankui',
            label: '反馈'
          }, {
            value: 'xiaolv',
            label: '效率'
          }, {
            value: 'kekong',
            label: '可控'
          }]
        }, {
          value: 'daohang',
          label: '导航',
          children: [{
            value: 'cexiangdaohang',
            label: '侧向导航'
          }, {
            value: 'dingbudaohang',
            label: '顶部导航'
          }]
        }]
      }],
      props: {
        multiple: true,
        lazy: true,
        lazyLoad (node, resolve) {
          const { level } = node
          console.log(level)
        }
      }
    }
  },
  methods: {
    handleOpen () {
      this.$refs['dataForm'].clearValidate()
    },
    createData () {
      const tempData = Object.assign({}, this.formData)
      tempData.createUser = this.$store.state.user.username
      tempData.updateUser = this.$store.state.user.username
      postCreate(tempData).then(() => {
        this.dialogFormVisible = false
        this.$notify({
          title: '成功',
          message: '创建成功',
          type: 'success',
          duration: 2000
        })
        this.$parent.getList()
      })
    },
    updateData () {
      const tempData = Object.assign({}, this.formData)
      tempData.updateUser = this.$store.state.user.username
      putModify(tempData).then(() => {
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
