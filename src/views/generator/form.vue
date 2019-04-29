<template>
  <el-dialog :visible.sync="dialogFormVisible" title="代码配置" width="70%">
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;">
      <el-table-column label="列名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.columnName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="列类型" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.dataType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="表格列标题" align="center">
        <template slot-scope="scope">
          <el-input v-model="list[scope.$index].columnTitle"/>
        </template>
      </el-table-column>
      <el-table-column label="列表查询" align="center">
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.queryDisplay === 'true' ? '查询': '不查询'" placement="top">
            <el-switch
              v-model="list[scope.$index].queryDisplay"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-value="true"
              inactive-value="false"/>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="列表显示" align="center">
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.columnDisplay === 'true' ? '显示': '不显示'" placement="top">
            <el-switch
              v-model="list[scope.$index].columnDisplay"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-value="true"
              inactive-value="false"/>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
      <el-button type="primary" @click="handleSubmit()">{{ $t('table.confirm') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { generatorCode } from '@/api/generator'
export default {
  name: 'Form',
  props: {
    list: {
      type: Array,
      default: () => []
    },
    tableName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      listLoading: false,
      dialogFormVisible: false
    }
  },
  created() {
  },
  methods: {
    handleSubmit() {
      const params = { columns: JSON.stringify(this.list), tableName: this.tableName }
      generatorCode(params).then(() => {
        this.$message({
          type: 'success',
          message: '代码生成成功'
        })
        this.dialogFormVisible = false
      }).catch(() => {
        this.listLoading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
