<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name"
                placeholder="商品名称"
                style="width: 200px;"
                class="filter-item" />
      <el-select v-model="listQuery.goodsType"
                 placeholder="商品类型"
                 clearable
                 style="width: 120px"
                 class="filter-item">
        <el-option v-for="(item,index) in goodsTypeOptions"
                   :key="index"
                   :label="item.value"
                   :value="item.type" />
      </el-select>
      <el-select v-model="listQuery.goodsStatus"
                 placeholder="商品状态"
                 clearable
                 style="width: 120px"
                 class="filter-item">
        <el-option v-for="(item,index) in goodsStatusOptions"
                   :key="index"
                   :label="item.value"
                   :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.gcsId"
                 placeholder="商品分类"
                 clearable
                 style="width: 120px"
                 class="filter-item">
        <el-option v-for="(item,index) in classifications"
                   :key="index"
                   :label="item.className"
                   :value="item.id" />
      </el-select>
      <el-button v-waves
                 class="filter-item"
                 type="primary"
                 icon="el-icon-search"
                 @click="handleFilter">搜索</el-button>
      <el-button v-waves
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
      <el-table-column label="商品名称"
                       align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属品牌"
                       width="120"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.brandName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属分类"
                       width="120"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.gcsName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品类型"
                       width="120"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.goodsTypeName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属SPU"
                       width="120"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.spuName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品状态"
                       width="120"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.publishStatusName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否新品"
                       width="120"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.state | stateFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否推荐"
                       width="120"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.recommend | recommendFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品属性"
                       width="120"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.goodsPropertyGroupName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品单位"
                       width="120"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.unit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间"
                       width="200"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       width="200"
                       class-name="small-padding fixed-width"
                       fixed="right"
                       align="center">
        <template slot-scope="scope">
          <el-button type="primary"
                     size="mini"
                     @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="success"
                     size="mini">上架</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>listQuery.pageSize"
                :total="total"
                :page.sync="listQuery.page"
                :limit.sync="listQuery.pageSize"
                @pagination="getGoodsList" />

    <goods-object-form ref="dataForm"
                       :form-data="formData" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import GoodsObjectForm from './form'
import { postGoodsPage } from '@/api/goods/goods'
import waves from '@/directive/waves' // Waves directive
import permission from '@/directive/permission'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'GoodsManage',
  components: { Pagination, GoodsObjectForm },
  directives: { waves, permission },
  filters: {
    recommendFilter (code) {
      const codeMap = {
        false: '非推荐',
        true: '推荐'
      }
      return codeMap[code]
    },
    stateFilter (code) {
      const codeMap = {
        false: '非新品',
        true: '新品'
      }
      return codeMap[code]
    }
  },
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
    this.getGoodsList()
  },
  methods: {
    getGoodsList () { // 商品列表
      this.listLoading = true
      postGoodsPage(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.total

        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleCreate () {
      this.formData = {}
      this.formData.state = false
      this.formData.recommend = false
      const _this = this.$refs['dataForm']
      _this.dialogStatus = 'create'
      _this.dialogFormVisible = true
    },
    handleEdit (row) {
      this.formData = Object.assign({}, row) // copy obj
      const _this = this.$refs['dataForm']
      _this.dialogStatus = 'update'
      _this.dialogFormVisible = true
    },
    getGoodsType (goodsType) {
      return this.$store.state.serviceConst.goodsTypeOptions.filter(gt => gt.type === goodsType)[0].value
    },
    getClassName (gcsId) {
      if (gcsId === undefined || gcsId === null || gcsId === '') {
        return '——'
      }
      if (this.classifications.length === 0) {
        return '——'
      }
      return this.classifications.filter(cl => cl.id === gcsId)[0].className
    },
    getGoodsStatus (status) {
      return this.goodsStatusOptions.filter(gs => gs.key === status)[0].value
    },
    handleFilter () { // 搜索
      this.listQuery.page = 1
      this.getGoodsList()
    }
  }
}
</script>
