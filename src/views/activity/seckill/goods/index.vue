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
            <svg-icon icon-class="money" />{{ scope.row.goodsAmount }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="折扣价格"
                       width="100"
                       align="center">
        <template slot-scope="scope">
          <span class="icon-money">
            <svg-icon icon-class="money" />{{ scope.row.goodsDiscountAmount }}
          </span>
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
                       width="340"
                       class-name="small-padding fixed-width"
                       fixed="right"
                       align="center">
        <template slot-scope="scope">
          <router-link v-permission="'ROLE_SUPER_ADMIN'"
                       :to="'/goods/goods/edit/'+scope.row.id+'/info/goods'">
            <el-button type="primary"
                       size="small">编辑</el-button>
          </router-link>
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
          <el-button type="warning"
                     size="small"
                     @click="handleClickRuleGoods(scope.row.id)">添加规则</el-button>
          <el-button type="primary"
                     size="small"
                     @click="handleRule(scope.row.id)">查看规则</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0"
                :total="total"
                :page.sync="listQuery.page"
                :limit.sync="listQuery.pageSize"
                @pagination="getGoodsList" />

    <el-dialog :visible.sync="dialogRuleVisible"
               title="添加换购商品规则"
               width="40%">
      <el-select v-model="selectedRuleId"
                 clearable
                 placeholder="请选择">
        <el-option v-for="item in ruleData"
                   :key="item.id"
                   :value="item.id"
                   :label="item.ruleName" />
      </el-select>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogRuleVisible = false">取消</el-button>
        <el-button v-permission="'ROLE_SUPER_ADMIN'"
                   type="primary"
                   @click="handleRuleGoods">确认</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogRuleInfoVisible"
               title="换购商品规则详情"
               width="40%">
      <el-collapse v-model="activeRule"
                   accordion>
        <el-collapse-item title="活动规则详情"
                          name="1">
          <div>活动名称：<span>{{ activeRuleForm.activityName }}</span></div>
          <div>规则名称：<span>{{ activeRuleForm.ruleName }}</span></div>
          <div>最低限额：
            <span class="icon-money">
              <svg-icon icon-class="money"></svg-icon>
              {{ activeRuleForm.orderAmount }}
            </span>
          </div>
          <div>创建时间：<span>{{ activeRuleForm.createTime }}</span></div>
          <div>状态：<span>{{ activeRuleForm.deleteStatus? '禁用': '启用' }}</span></div>
        </el-collapse-item>
      </el-collapse>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogRuleInfoVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { postGoodsList } from '@/api/goods/goods'
import { getRuleList, modifyGoodsRule, getGoodsRuleInfo } from '@/api/activity/exchange'
import { postList } from '@/api/goods/classification'
import { getAssembleGoods, modifyAssembleGoods } from '@/api/activity/assemble'
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
        goodsType: 5,
        goodsStatus: undefined,
        activityId: undefined
      },
      classifications: [],
      goodsStatusOptions: [
        { key: 1, value: '上架' },
        { key: 2, value: '下架' }
      ],
      goodsData: {},
      disabled: true,
      dialogRuleVisible: false,
      ruleData: [],
      selectedGoodsId: undefined,
      selectedRuleId: undefined,
      dialogRuleInfoVisible: false,
      activeRule: '1',
      activeRuleForm: {}
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
    },
    handleClickRuleGoods (goodsId) { // 商品
      this.selectedGoodsId = goodsId
      getRuleList(this.listQuery).then(response => {
        this.ruleData = response.data
        this.dialogRuleVisible = true
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleRuleGoods () {
      const params = {
        activityId: this.listQuery.activityId,
        ruleId: this.selectedRuleId,
        goodsId: this.selectedGoodsId
      }
      modifyGoodsRule(params).then(() => {
        this.$message({
          type: 'success',
          message: '操作成功'
        })
        this.dialogRuleVisible = false
      })
    },
    handleRule (goodsId) {
      getGoodsRuleInfo({ activityId: this.listQuery.activityId, goodsId: goodsId }).then(response => {
        this.activeRuleForm = response.data
        this.dialogRuleInfoVisible = true
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
