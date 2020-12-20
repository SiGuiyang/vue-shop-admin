<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.keyword"
                placeholder="SKU名称"
                style="width: 200px;"
                clearable
                class="filter-item" />
      <el-cascader v-model="listQuery.goodsClassId"
                   :options="goodsClassOption"
                   :props="{value: 'id', label: 'name'}"
                   placeholder="SPU分类"
                   clearable
                   class="filter-item" />
      <el-select v-model="listQuery.goodsType"
                 placeholder="商品类型"
                 clearable
                 class="filter-item">
        <el-option v-for="(goodsType,index) in goodsTypeOptions"
                   :key="index"
                   :label="goodsType.value"
                   :value="goodsType.type" />
      </el-select>
      <el-select v-model="listQuery.state"
                 placeholder="商品状态"
                 clearable
                 class="filter-item">
        <el-option :value="true"
                   label="上架" />
        <el-option :value="false"
                   label="下架" />
      </el-select>
      <el-select v-model="listQuery.publishStatus"
                 placeholder="审核状态"
                 clearable
                 class="filter-item">
        <el-option v-for="(spu,index) in publishStatusOption"
                   :key="index"
                   :label="spu.value"
                   :value="spu.key" />
      </el-select>
      <el-select v-model="listQuery.goodsState"
                 placeholder="是否新品"
                 clearable
                 class="filter-item">
        <el-option :value="true"
                   label="是" />
        <el-option :value="false"
                   label="否" />
      </el-select>
      <el-select v-model="listQuery.recommend"
                 placeholder="是否推荐"
                 clearable
                 class="filter-item">
        <el-option :value="true"
                   label="是" />
        <el-option :value="false"
                   label="否" />
      </el-select>
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
                       width="300"
                       align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.skuName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="编码"
                       width="300"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.skuCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品类型"
                       width="200"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.goodsTypeName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="SPU类别"
                       width="200"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.spuName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品状态"
                       width="200"
                       align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.state"
                     active-text="上架"
                     inactive-text="下架"
                     active-color="#13ce66"
                     inactive-color="#ff4949"
                     @change="handleChangeState(scope.row.skuId)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="审核状态"
                       width="200"
                       align="center">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.publishStatusName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="是否新品"
                       width="200"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.goodsState | stateFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否推荐"
                       width="200"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.recommend | stateFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品单位"
                       width="200"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.unit }}</span>
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
          <span>{{ scope.row.stock }}</span>
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
                       width="300"
                       class-name="small-padding fixed-width"
                       fixed="right"
                       align="center">
        <template slot-scope="scope">

          <el-button v-if="scope.row.publishStatus == 0"
                     type="success"
                     size="small"
                     icon="el-icon-s-operation"
                     @click="handleApprove(scope.row)">审核</el-button>
          <el-button v-else-if="scope.row.publishStatus == 2"
                     type="danger"
                     size="small"
                     icon="el-icon-s-operation"
                     @click="handleApprove(scope.row)">审核拒绝</el-button>
          <el-button v-permission="'PAGER_GOODS_SKU_MODIFY'"
                     type="primary"
                     size="small"
                     icon="el-icon-edit"
                     @click="handleModify(scope.row)">编辑</el-button>
          <el-button v-permission="'PAGER_GOODS_SKU_MODIFY'"
                     type="danger"
                     size="small"
                     icon="el-icon-delete"
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
    <!-- 审核-->
    <approve ref="approveData"
             :approve-data="approveData" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { postGoodsPage, postGoodsState, getGoods, deleteGoods, getApproveDetail } from '@/api/goods/goods'
import { postSpuTree } from '@/api/goods/spu'
import SkuForm from './form'
import Approve from './approve'
import waves from '@/directive/waves' // Waves directive
import permission from '@/directive/permission'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'SkuManage',
  components: { SkuForm, Approve, Pagination },
  directives: { waves, permission },
  filters: {
    stateFilter (code) {
      const codeMap = {
        false: '否',
        true: '是'
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
        pageSize: 10,
        keyword: undefined,
        goodsClassId: [],
        spuId: undefined,
        goodsType: undefined,
        publishStatus: undefined,
        goodsState: undefined,
        state: undefined,
        recommend: undefined
      },
      goodsClassOption: [],
      publishStatusOption: [
        { key: 0, value: '上架申请', type: 'warning' },
        { key: 1, value: '审核通过', type: 'success' },
        { key: 2, value: '审核拒绝', type: 'danger' }
      ],
      formData: {},
      approveData: {}
    }
  },
  computed: {
    ...mapGetters([
      'goodsTypeOptions'
    ])
  },
  created () {
    this.getSkuList()
    this.postGoodsClass()
  },
  methods: {
    postGoodsClass () {
      postSpuTree().then(response => {
        this.goodsClassOption = response.data
      })
    },
    // 商品列表
    getSkuList () {
      this.listLoading = true
      if (this.listQuery.goodsClassId) {
        this.listQuery.goodsClassId = this.listQuery.goodsClassId[this.listQuery.goodsClassId.length - 1]
      }
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
    // 搜索
    handleFilter () {
      this.listQuery.page = 1
      this.getSkuList()
    },
    handleCreate () {
      const _this = this.$refs['dataForm']
      _this.dialogStatus = 'create'
      _this.dialogFormVisible = true
      _this.activeIndex = 0
      this.formData = {}
      this.formData.unit = 'g'
      this.formData.defaultSku = false
      this.formData.images = []
    },
    // 编辑
    handleModify (row) {
      getGoods({ id: row.id }).then(response => {
        const _this = this.$refs['dataForm']
        _this.dialogStatus = 'update'
        _this.dialogFormVisible = true
        this.formData = response.data
      })
    },
    // 更新商品状态
    handleChangeState (skuId) {
      postGoodsState({ skuId: skuId }).then(() => {
        this.$message({
          message: '更新成功',
          type: 'success'
        })
        this.getSkuList()
      })
    },
    // 审核
    handleApprove (row) {
      const _this = this.$refs['approveData']
      getApproveDetail({ skuId: row.skuId, goodsId: row.id }).then(response => {
        _this.approveFormVisible = true

        let description // 审核说明
        let show = false // 显示通过，拒绝按钮
        if (response.data) {
          description = response.data.description
          show = true
        }
        this.approveData = {
          skuName: row.skuName,
          skuId: row.skuId,
          goodsId: row.id,
          description: description,
          show: show
        }
      })

    },
    // 删除
    handleDelete (row) {
      deleteGoods({ id: row.id }).then(() => {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.getSkuList()
      })
    }
  }
}
</script>
