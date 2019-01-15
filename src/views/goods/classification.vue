<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="$t('goods.classificationName')" v-model="listQuery.classificationName" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;">
      <el-table-column :label="$t('table.id')" prop="id" align="center" width="65">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('goods.classificationName')" width="160" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.className }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('goods.goodsImg')" width="240" align="center">
        <template slot-scope="scope">
          <span><img :src="scope.row.icon"></span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('goods.createTime')" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.operationUser')" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createUser }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" class-name="small-padding fixed-width" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleQuery(scope.row)">{{ $t('table.edit') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="dialogFormTitle" :visible.sync="dialogFormVisible" width="60%">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px">
        <el-form-item :label="$t('goods.classificationName')" prop="className">
          <el-input v-model="temp.className" placeholder="请设置"/>
        </el-form-item>
        <el-form-item :label="$t('goods.goodsImg')" prop="icon">
          <div style="margin-bottom: 20px;">
            <Upload v-model="temp.icon" />
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="updateData()">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchClassificationList, modifyClassification } from '@/api/goods'
import waves from '@/directive/waves' // Waves directive
import Upload from '@/components/Upload/singleImage3'

export default {
  name: 'Classification',
  components: { Upload },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      listLoading: false,
      listQuery: {
        className: undefined
      },
      dialogFormVisible: false,
      dialogFormTitle: '编辑',
      temp: {
        id: undefined,
        className: undefined,
        icon: undefined,
        createUser: undefined
      },
      rules: {
        className: [{ required: true, message: '分类名称不能为空', trigger: 'blur' }],
        icon: [{ required: true, message: '图片不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getClassificationList()
  },
  methods: {
    getClassificationList() { // 商品分类列表
      this.listLoading = true
      fetchClassificationList(this.listQuery).then(response => {
        this.list = response.data

        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      }).catch((error) => {
        this.listLoading = false
        this.$message.error(error)
      })
    },
    handleFilter() { // 搜索
      this.listQuery.page = 1

      this.getClassificationList()
    },
    handleQuery(row) { // 查看分类中的商品
      this.temp = Object.assign({}, row) // copy obj
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      const tempData = Object.assign({}, this.temp)
      tempData.createUser = this.$store.state.user.sysCode
      modifyClassification(tempData).then(() => {
        this.dialogFormVisible = false
        this.$notify({
          title: '成功',
          message: '更新成功',
          type: 'success',
          duration: 2000
        })
        this.getClassificationList()
      }).catch(error => {
        this.$message.error(error)
      })
    }
  }
}
</script>
