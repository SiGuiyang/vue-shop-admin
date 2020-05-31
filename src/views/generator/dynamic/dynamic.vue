<template>
  <el-dialog :visible.sync="dialogDynamicVisible"
             :fullscreen="true"
             title="表单配置">
    <dynamic-form ref="dynamicForm"
                  preview
                  clearable
                  @dynamicFormData="handleSubmit">
      <template slot="action" />
    </dynamic-form>
  </el-dialog>
</template>

<script>
import { postFormModelCreate } from '@/api/generate/form'
import DynamicForm from '@/components/DynamicForm'
export default {
  name: 'DynamicViewForm',
  components: { DynamicForm },
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      listLoading: false,
      dialogDynamicVisible: false,
      formVisible: false
    }
  },
  methods: {
    handleSubmit (e) {
      this.formVisible = true
      this.formData = {}

      postFormModelCreate().then(() => {
        this.$notify({
          title: '成功',
          message: '创建成功',
          type: 'success',
          duration: 2000
        })
      })


    }
  }
}
</script>
<style lang="scss">
.btn {
  display: flex;
  justify-content: flex-end;
}
</style>
