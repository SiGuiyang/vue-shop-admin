<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.goodsName"
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
      <router-link v-permission="'ROLE_SUPER_ADMIN'"
                   :to="'/goods/goods/edit/-1/create/goods'">
        <el-button v-waves
                   class="filter-item"
                   type="primary"
                   icon="el-icon-edit">添加</el-button>
      </router-link>
    </div>

    <el-table :key="tableKey"
              v-loading="listLoading"
              :data="list"
              stripe
              fit
              highlight-current-row
              style="width: 100%;">
      <el-table-column label="商品名称"
                       width="120"
                       align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.goodsName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品分类"
                       width="120"
                       align="center">
        <template slot-scope="scope">
          <span>{{ getClassName(scope.row.gcsId) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品类型"
                       width="120"
                       align="center">
        <template slot-scope="scope">
          <span>{{ getGoodsType(scope.row.goodsType) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品编码"
                       width="200"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.goodsCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="价格"
                       width="100"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.goodsAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="折扣价格"
                       width="100"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.goodsDiscountAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品状态"
                       width="100"
                       align="center">
        <template slot-scope="scope">
          <span>{{ getGoodsStatus(scope.row.goodsStatus) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="库存"
                       class-name="status-col"
                       min-width="100"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.goodsInventory }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间"
                       width="200"
                       align="center">operationUser
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       width="100"
                       class-name="small-padding fixed-width"
                       fixed="right"
                       align="center">
        <template slot-scope="scope">
          <router-link v-permission="'ROLE_SUPER_ADMIN'"
                       :to="'/goods/goods/edit/'+scope.row.id+'/info/goods'">
            <el-button type="primary"
                       size="mini">编辑</el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0"
                :total="total"
                :page.sync="listQuery.page"
                :limit.sync="listQuery.pageSize"
                @pagination="getGoodsList" />

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { postGoodsList } from '@/api/goods/goods'
import { postList } from '@/api/goods/classification'
import waves from '@/directive/waves' // Waves directive
import permission from '@/directive/permission'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'GoodsManage',
  components: { Pagination },
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
      ]
    }
  },
  computed: {
    ...mapGetters([
      'goodsTypeOptions'
    ])
  },
  created () {
    this.getClassification()
    this.getGoodsList()
  },
  methods: {
    getGoodsList () { // 商品列表
      this.listLoading = true
      postGoodsList(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.total

        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      }).catch(() => {
        this.listLoading = false
      })
    },
    getClassification () {
      postList({}).then(response => {
        this.classifications = response.data
      })
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
