<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.goodsName"
                placeholder="SKU名称"
                style="width: 200px;"
                class="filter-item" />
      <el-button v-waves
                 class="filter-item"
                 type="primary"
                 icon="el-icon-search"
                 @click="handleFilter">搜索</el-button>
      <el-button v-waves
                 v-permission="'PAGER_GOODS_SKU_CREATE'"
                 class="filter-item"
                 type="primary"
                 icon="el-icon-edit"
                 @click="handleCreate">创建</el-button>
    </div>

    <el-table :key="tableKey"
              v-loading="listLoading"
              :data="list"
              stripe
              fit
              highlight-current-row
              style="width: 100%;">
      <el-table-column label="SKU名称"
                       width="200"
                       align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.skuName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="编码"
                       width="200"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.skuCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="原价"
                       width="200"
                       align="center">
        <template slot-scope="scope">
          <span class="icon-money">
            <svg-icon icon-class="money" /> {{ scope.row.skuAmount != null ? scope.row.skuAmount: '——' }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="折扣价格"
                       width="200"
                       align="center">
        <template slot-scope="scope">
          <span class="icon-money">
            <svg-icon icon-class="money" /> {{ scope.row.discountAmount != null ? scope.row.discountAmount: '——' }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="库存"
                       class-name="status-col"
                       min-width="200"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.inventory }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间"
                       width="200"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作人"
                       width="200"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.updateUser }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       width="200"
                       class-name="small-padding fixed-width"
                       fixed="right"
                       align="center">
        <template slot-scope="scope">
          <el-button v-permission="'PAGER_GOODS_SKU_MODIFY'"
                     type="primary"
                     size="mini"
                     @click="handleModify(scope.row)">编辑</el-button>
          <el-button v-permission="'PAGER_GOODS_SKU_MODIFY'"
                     type="danger"
                     size="mini"
                     @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>listQuery.pageSize"
                :total="total"
                :page.sync="listQuery.page"
                :limit.sync="listQuery.pageSize"
                @pagination="getSkuList" />

    <sku-form ref="dataForm"
              :form-data="formData" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { postSkuPage, putSkuModify } from '@/api/goods/sku'
import SkuForm from './form'
import waves from '@/directive/waves' // Waves directive
import permission from '@/directive/permission'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'SkuManage',
  components: { SkuForm, Pagination },
  directives: { waves, permission },
  data () {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        pageSize: 20,
        goodsName: undefined,
        goodsType: undefined,
        goodsStatus: undefined,
        gcsId: undefined
      },
      classifications: [],
      goodsStatusOptions: [
        { key: 1, value: '上架' },
        { key: 2, value: '下架' }
      ],
      formData: {}
    }
  },
  computed: {
    ...mapGetters([
      'goodsTypeOptions'
    ])
  },
  created () {
    this.getSkuList()
  },
  methods: {
    getSkuList () { // 商品列表
      this.listLoading = true
      postSkuPage(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.total

        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleFilter () { // 搜索
      this.listQuery.page = 1
      this.getSkuList()
    },
    handleCreate () {
      const _this = this.$refs['dataForm']
      _this.dialogStatus = 'create'
      _this.dialogFormVisible = true
      this.formData.defaultSku = false
      this.formData.images = []
    },
    handleModify (row) { // 编辑
      this.formData = Object.assign({}, row) // copy obj
      const _this = this.$refs['dataForm']
      _this.dialogStatus = 'update'
      _this.dialogFormVisible = true
    },
    handleDelete (row) { // 删除
      const params = {
        id: row.id,
        updateUser: this.$store.state.user.username,
        deleteStatus: true
      }
      putSkuModify(params).then(() => {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        this.getSkuList()
      })
    }
  }
}
</script>
