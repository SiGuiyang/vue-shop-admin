<template>
  <el-dialog :title="textMap[dialogStatus]"
             :visible.sync="dialogFormVisible"
             @open="handleOpen">
    <el-form ref="dataForm"
             :model="formData"
             :rules="rules"
             label-position="top">
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="菜单图标"
                        prop="icon">
            <el-popover placement="bottom-start"
                        width="600"
                        trigger="click">
              <svg-icons ref="iconSelect"
                         @selected="selected" />
              <el-input slot="reference"
                        v-model="formData.icon"
                        placeholder="点击选择图标"
                        readonly>
                <svg-icon v-if="formData.icon"
                          slot="prefix"
                          :icon-class="formData.icon"
                          class="el-input__icon"
                          style="height: 32px;width: 16px;" />
                <i v-else
                   slot="prefix"
                   class="el-icon-search el-input__icon" />
              </el-input>
            </el-popover>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="父级菜单"
                        prop="parentId">
            <treeselect v-model="formData.parentId"
                        :options="menus"
                        placeholder="请选择" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="菜单名称"
                        prop="name">
            <el-input v-model="formData.name"
                      placeholder="请设置" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="序号"
                        prop="sequence">
            <el-input-number v-model="formData.sequence"
                             :min="1"
                             :max="10"
                             label="请设置" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="是否配置路由"
                        prop="router">
            <el-radio-group v-model="formData.router">
              <el-radio :label="yes">是</el-radio>
              <el-radio :label="no">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否隐藏"
                        prop="hidden">
            <el-radio-group v-model="formData.hidden">
              <el-radio :label="yes">是</el-radio>
              <el-radio :label="no">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="请求路径"
                        prop="path">
            <el-input v-model="formData.path"
                      placeholder="请设置" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="组建路径"
                        prop="component">
            <el-input v-model="formData.component"
                      placeholder="请设置" />
          </el-form-item>
        </el-col>
      </el-row>
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
import { add, modify } from '@/api/menu'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import SvgIcons from '@/components/SvgIcons/index'

export default {
  name: 'Form',
  components: { SvgIcons, Treeselect },
  props: {
    formData: {
      type: Object,
      default: () => ({})
    },
    menus: {
      type: Array,
      default: () => ([])
    }
  },
  data () {
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
        name: [{ required: true, message: '菜单不能为空', trigger: 'blur' }],
        sequence: [{ required: true, message: '序号不能为空', trigger: 'blur' }],
        router: [{ required: true, message: '路由不能为空', trigger: 'blur' }],
        hidden: [{ required: true, message: '隐藏不能为空', trigger: 'blur' }]
      },
      yes: true,
      no: false,
      inline: true
    }
  },
  methods: {
    handleOpen () {
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.formData.createUser = this.$store.state.user.username
          this.formData.updateUser = this.$store.state.user.username
          const formDataData = Object.assign({}, this.formData)
          add(formDataData).then(() => {
            this.dialogFormVisible = false
            this.$message({
              message: '创建成功',
              type: 'success'
            })
            this.$parent.getList()
          })
        }
      })
    },
    updateData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          debugger
          const formDataData = Object.assign({}, this.formData)
          modify(formDataData).then(() => {
            this.dialogFormVisible = false
            this.$message({
              message: '更新成功',
              type: 'success'
            })
            this.$parent.getList()
          })
        }
      })
    },
    selected (name) {
      this.formData.icon = name
    }
  }
}
</script>
