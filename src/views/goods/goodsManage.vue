<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="$t('goods.goodsName')" v-model="listQuery.goodsName" style="width: 200px;" class="filter-item" />
      <el-select v-model="listQuery.goodsType" :placeholder="$t('goods.goodsType')" clearable style="width: 120px" class="filter-item">
        <el-option v-for="(item,index) in goodsTypeOptions" :key="index" :label="item.value" :value="item.type"/>
      </el-select>
      <el-select v-model="listQuery.goodsStatus" :placeholder="$t('goods.goodsStatus')" clearable style="width: 120px" class="filter-item">
        <el-option v-for="(item,index) in goodsStatusOptions" :key="index" :label="item.value" :value="item.key"/>
      </el-select>
      <el-select v-model="listQuery.gcsId" :placeholder="$t('goods.classificationName')" clearable style="width: 120px" class="filter-item">
        <el-option v-for="(item,index) in classifications" :key="index" :label="item.className" :value="item.id"/>
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;">
      <el-table-column :label="$t('table.id')" type="selection" align="center" min-width="65" />
      <el-table-column :label="$t('goods.goodsName')" width="120" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.goodsName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('goods.classificationName')" width="120" align="center">
        <template slot-scope="scope">
          <span>{{ getClassName(scope.row.gcsId) }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('goods.goodsType')" width="120" align="center">
        <template slot-scope="scope">
          <span>{{ getGoodsType(scope.row.goodsType) }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('goods.goodsCode')" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.goodsCode }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('goods.goodsAmount')" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.goodsAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('goods.goodsDiscountAmount')" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.goodsDiscountAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('goods.goodsStatus')" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ getGoodsStatus(scope.row.goodsStatus) }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('goods.goodsInventory')" class-name="status-col" min-width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.goodsInventory }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('goods.createTime')" width="200" align="center">operationUser
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" width="100" class-name="small-padding fixed-width" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleQuery(scope.row)">{{ $t('table.edit') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getGoodsList" />

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { fetchGoodsList, fetchClassificationList } from '@/api/goods'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import Upload from '@/components/Upload/singleImage3'

export default {
  name: 'GoodsManage',
  components: { Pagination, Upload },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        pageSize: 10,
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
  created() {
    this.getClassification()
    this.getGoodsList()
  },
  methods: {
    getGoodsList() { // 商品列表
      this.listLoading = true
      fetchGoodsList(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.total

        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      }).catch((error) => {
        this.$message.error(error)
        this.listLoading = false
      })
    },
    getClassification() {
      fetchClassificationList({}).then(response => {
        this.classifications = response.data
      }).catch(error => {
        this.$message.error(error)
      })
    },
    getGoodsType(goodsType) {
      return this.$store.state.serviceConst.goodsTypeOptions.filter(gt => gt.type === goodsType)[0].value
    },
    getClassName(gcsId) {
      if (gcsId === undefined || gcsId === null || gcsId === '') {
        return '——'
      }
      if (this.classifications.length === 0) {
        return '——'
      }
      return this.classifications.filter(cl => cl.id === gcsId)[0].className
    },
    getGoodsStatus(status) {
      return this.goodsStatusOptions.filter(gs => gs.key === status)[0].value
    },
    handleFilter() { // 搜索
      this.listQuery.page = 1
      this.getGoodsList()
    },
    handleCreate() { // 添加商品
      this.$router.push({
        name: 'GoodsEdit',
        params: {
          data: {},
          event: 'add',
          operationType: 'goods'
        }
      })
    },
    handleQuery(row) { // 编辑
      this.$router.push({
        name: 'GoodsEdit',
        params: {
          goodsId: row.id,
          event: 'info',
          operationType: 'goods'
        }
      })
    }
  }
}
</script>
