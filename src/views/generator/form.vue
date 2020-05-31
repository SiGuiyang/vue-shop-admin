<template>
  <el-dialog :visible.sync="dialogFormVisible"
             :title="titleTxt"
             width="70%">
    <el-table v-loading="listLoading"
              :data="list"
              stripe
              fit
              highlight-current-row
              style="width: 100%;">
      <el-table-column label="列名称"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.columnName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="列类型"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.dataType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="列注释"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.columnComment }}</span>
        </template>
      </el-table-column>
    </el-table>

    <div slot="footer"
         class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取消</el-button>
      <el-button type="primary"
                 @click="handleSubmit()">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { generatorCode } from '@/api/generate/generator'

export default {
  name: 'Form',
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      listLoading: false,
      dialogFormVisible: false,
      tableName: null,
      tableSchema: null,
      titleTxt: '代码配置'
    }
  },
  methods: {
    handleSubmit () {
      const params = { tableSchema: this.tableSchema, tableName: this.tableName }
      generatorCode(params).then(() => {
        this.$notify({
          title: '成功',
          message: '代码生成成功',
          type: 'success',
          duration: 2000
        })
        this.dialogFormVisible = false
      }).catch(() => {
        this.listLoading = false
      })
    }
  }
}
</script>
