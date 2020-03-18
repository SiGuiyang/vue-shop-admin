<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.goodsName"
                placeholder="商品名称"
                style="width: 200px;"
                class="filter-item" />
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
                 type="success"
                 icon="el-icon-search"
                 @click="handleQuery">查看活动商品
      </el-button>
    </div>

    <el-table :key="tableKey"
              v-loading="listLoading"
              :data="list"
              border
              fit
              highlight-current-row
              style="width: 100%;">
      <el-table-column label="商品名称"
                       width="120"
                       align="center">
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
          <span>{{ scope.row.type }}</span>
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
          <span class="icon-money">
            <svg-icon icon-class="money" />{{ scope.row.goodsAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="折扣价格"
                       width="100"
                       align="center">
        <template slot-scope="scope">
          <span class="icon-money">
            <svg-icon icon-class="money" />{{ scope.row.goodsDiscountAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品状态"
                       width="100"
                       align="center">
        <template slot-scope="scope">
          <el-tag type="success">{{ getGoodsStatus(scope.row.goodsStatus) }}</el-tag>
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
                       width="180"
                       class-name="small-padding fixed-width"
                       fixed="right"
                       align="center">
        <template slot-scope="scope">
          <el-button v-if="scope.row.join"
                     :disabled="disabled"
                     type="warning"
                     size="small"
                     @click="handleActivityGoods(scope.row.id)">已参与活动
          </el-button>
          <el-button v-else
                     type="success"
                     size="small"
                     @click="handleActivityGoods(scope.row.id)">参与活动</el-button>
          <router-link v-permission="'ROLE_SUPER_ADMIN'"
                       :to="'/goods/goods/edit/'+scope.row.id+'/info/goods'">
            <el-button type="primary"
                       size="small">编辑</el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0"
                :total="total"
                :page.sync="listQuery.page"
                :limit.sync="listQuery.pageSize"
                @pagination="getGoodsList" />

    <activity-goods ref="goodsForm"
                    :goods-data="goodsData" />
  </div>
</template>

<script>
import { postGoodsList } from '@/api/goods/goods'
import { postList } from '@/api/goods/classification'
import { getAssembleGoods, modifyAssembleGoods } from '@/api/activity/assemble'
import waves from '@/directive/waves' // Waves directive
import permission from '@/directive/permission'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import ActivityGoods from './activityGoods'

export default {
  name: 'GoodsManage',
  components: { Pagination, ActivityGoods },
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
        goodsType: 3,
        goodsStatus: undefined,
        activityId: undefined
      },
      classifications: [],
      goodsStatusOptions: [
        { key: 1, value: '上架' },
        { key: 2, value: '下架' }
      ],
      goodsData: {},
      disabled: true
    }
  },
  created () {
    this.getClassification()
    this.getGoodsList()
    this.listQuery.activityId = this.$route.params.id
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
    },
    handleQuery () {
      getAssembleGoods({ activityId: this.listQuery.activityId }).then(response => {
        const _this = this.$refs['goodsForm']
        _this.dialogFormVisible = true
        this.goodsData = response.data
      })
    },
    handleActivityGoods (goodsId) { // 设置拼团活动商品
      modifyAssembleGoods({ activityId: this.listQuery.activityId, goodsId: goodsId }).then(() => {
        this.$message({
          type: 'success',
          message: '操作成功'
        })
        this.getGoodsList()
      })
    }
  }
}
</script>

<style scoped>
.icon-money {
  color: #f4516c;
}
</style>
