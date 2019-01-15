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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="130px">
        <el-form-item :label="$t('goods.classificationName')" prop="gcsId">
          <el-select v-model="temp.gcsId" :placeholder="$t('goods.classificationName')" clearable class="filter-item">
            <el-option v-for="(item,index) in classifications" :key="index" :label="item.className" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('goods.goodsName')" prop="goodsName">
          <el-input v-model="temp.goodsName" placeholder="请设置" />
        </el-form-item>
        <el-form-item :label="$t('goods.goodsType')" prop="goodsType">
          <el-radio-group v-model="temp.goodsType" placeholder="请选择">
            <el-radio v-for="(item,index) in goodsTypeOptions" :key="index" :label="item.type">{{ item.value }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('goods.goodsStatus')" prop="goodsStatus">
          <el-radio-group v-model="temp.goodsStatus" placeholder="请选择">
            <el-radio v-for="(item,index) in goodsStatusOptions" :key="index" :label="item.key">{{ item.value }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('goods.description')" prop="description">
          <el-input v-model="temp.description" placeholder="请设置" />
        </el-form-item>
        <el-form-item :label="$t('goods.placeOrigin')" prop="placeOrigin">
          <el-input v-model="temp.placeOrigin" placeholder="请设置" />
        </el-form-item>
        <el-form-item :label="$t('goods.storage')" prop="storage">
          <el-input v-model="temp.storage" placeholder="请设置" />
        </el-form-item>
        <el-form-item :label="$t('goods.goodsAmount')" prop="goodsAmount">
          <el-input v-model="temp.goodsAmount" placeholder="请设置" />
        </el-form-item>
        <el-form-item :label="$t('goods.goodsDiscountAmount')" prop="goodsDiscountAmount">
          <el-input v-model="temp.goodsDiscountAmount" placeholder="请设置" />
        </el-form-item>
        <el-form-item :label="$t('goods.integral')" prop="integral">
          <el-input v-model="temp.integral" placeholder="请设置" />
        </el-form-item>
        <el-form-item :label="$t('goods.goodsInventory')" prop="goodsInventory">
          <el-input v-model="temp.goodsInventory" placeholder="请设置" />
        </el-form-item>
        <el-form-item :label="$t('goods.goodsImg')" prop="goodsImg">
          <div style="margin-bottom: 20px">
            <Upload v-model="temp.goodsImg" />
          </div>
        </el-form-item>
        <el-form-item :label="$t('goods.bannerFirst')" prop="bannerFirst">
          <div style="margin-bottom: 20px">
            <Upload v-model="temp.bannerFirst" />
          </div>
        </el-form-item>
        <el-form-item :label="$t('goods.bannerSecond')" prop="bannerSecond">
          <div style="margin-bottom: 20px">
            <Upload v-model="temp.bannerSecond" />
          </div>
        </el-form-item>
        <el-form-item :label="$t('goods.bannerThird')" prop="bannerThird">
          <div style="margin-bottom: 20px">
            <Upload v-model="temp.bannerThird" />
          </div>
        </el-form-item>
        <el-form-item :label="$t('goods.detailsImgFirst')" prop="detailsImgFirst">
          <div style="margin-bottom: 20px">
            <Upload v-model="temp.detailsImgFirst" />
          </div>
        </el-form-item>
        <el-form-item :label="$t('goods.detailsImgSecond')" prop="detailsImgSecond">
          <div style="margin-bottom: 20px">
            <Upload v-model="temp.detailsImgSecond" />
          </div>
        </el-form-item>
        <el-form-item :label="$t('goods.detailsImgThird')" prop="detailsImgThird">
          <div style="margin-bottom: 20px">
            <Upload v-model="temp.detailsImgThird" />
          </div>
        </el-form-item>
        <el-form-item :label="$t('goods.detailsImgFourth')" prop="detailsImgFourth">
          <div style="margin-bottom: 20px">
            <Upload v-model="temp.detailsImgFourth" />
          </div>
        </el-form-item>
        <el-form-item :label="$t('goods.detailsImgFifth')" prop="detailsImgFifth">
          <div style="margin-bottom: 20px">
            <Upload v-model="temp.detailsImgFifth" />
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="dialogStatus?createData():updateData()">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { fetchGoodsList, fetchClassificationList, modifyGoods, getGoodsInfo } from '@/api/goods'
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
      textMap: {
        true: '编辑商品',
        false: '新增商品'
      },
      dialogFormVisible: false,
      dialogStatus: false,
      temp: {
        id: undefined,
        goodsDetailId: undefined,
        gcsId: undefined,
        goodsName: undefined,
        goodsCode: undefined,
        goodsStatus: undefined,
        goodsType: undefined,
        goodsAmount: undefined,
        goodsDiscountAmount: undefined,
        description: undefined,
        integral: undefined,
        goodsInventory: undefined,
        placeOrigin: undefined,
        storage: undefined,
        goodsImg: '',
        bannerFirst: '',
        bannerSecond: '',
        bannerThird: '',
        detailsImgFirst: '',
        detailsImgSecond: '',
        detailsImgThird: '',
        detailsImgFourth: '',
        detailsImgFifth: ''
      },
      classifications: [],
      goodsStatusOptions: [
        { key: 1, value: '上架' },
        { key: 2, value: '下架' }
      ],
      rules: {
        gcsId: [{ required: true, message: '分类名称不能为空', trigger: 'blur' }],
        goodsName: [{ required: true, message: '商品名称不能为空', trigger: 'blur' }],
        goodsType: [{ required: true, message: '商品类型不能为空', trigger: 'blur' }],
        goodsStatus: [{ required: true, message: '商品状态不能为空', trigger: 'blur' }],
        description: [{ required: true, message: '商品简介不能为空', trigger: 'blur' }],
        placeOrigin: [{ required: true, message: '商品产地不能为空', trigger: 'blur' }],
        storage: [{ required: true, message: '商品存储不能为空', trigger: 'blur' }],
        goodsAmount: [{ required: true, message: '商品原价不能为空', trigger: 'blur' }],
        goodsDiscountAmount: [{ required: true, message: '商品优惠券价格不能为空', trigger: 'blur' }],
        integral: [{ required: true, message: '商品积分不能为空', trigger: 'blur' }],
        goodsInventory: [{ required: true, message: '商品库存不能为空', trigger: 'blur' }],
        goodsImg: [{ required: true, message: '商品图片不能为空', trigger: 'blur' }],
        bannerFirst: [{ required: true, message: '商品详情页图片不能为空', trigger: 'blur' }]

      }
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
      return this.$store.state.goodsTypeOptions.filter(gt => gt.type === goodsType)[0].value
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
      this.restForm()
      this.dialogFormVisible = true
      this.dialogStatus = true
    },
    createData() { // 添加商品
      this.temp.event = 'add'
      modifyGoods(this.temp).then(response => {
        this.dialogFormVisible = false
        this.$notify({
          title: '成功',
          message: '操作成功',
          type: 'success',
          duration: 2000
        })
        this.getGoodsList()
      }).catch(error => {
        this.$message.error(error)
      })
    },
    updateData() { // 修改商品
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const updateDate = Object.assign({}, this.temp)
          updateDate.event = 'modify'
          modifyGoods(updateDate).then(response => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success',
              duration: 2000
            })
          }).catch(error => {
            this.$message.error(error)
          })
        }
      })
    },
    restForm() {
      this.temp.id = undefined
      this.temp.goodsDetailId = undefined
      this.temp.gcsId = undefined
      this.temp.goodsName = undefined
      this.temp.goodsCode = undefined
      this.temp.goodsStatus = undefined
      this.temp.goodsType = undefined
      this.temp.goodsAmount = undefined
      this.temp.goodsDiscountAmount = undefined
      this.temp.description = undefined
      this.temp.integral = undefined
      this.temp.goodsInventory = undefined
      this.temp.placeOrigin = undefined
      this.temp.storage = undefined
      this.temp.goodsImg = ''
      this.temp.bannerFirst = ''
      this.temp.bannerSecond = ''
      this.temp.bannerThird = ''
      this.temp.detailsImgFirst = ''
      this.temp.detailsImgSecond = ''
      this.temp.detailsImgThird = ''
      this.temp.detailsImgFourth = ''
      this.temp.detailsImgFifth = ''
    },
    handleQuery(row) { // 编辑
      this.dialogFormVisible = true
      this.dialogStatus = false
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      const params = {}
      params.goodsId = row.id
      getGoodsInfo(params).then(response => {
        this.temp = Object.assign({}, response.data.goods) // 拷贝
        this.temp = Object.assign(this.temp, response.data.goodsDetail) // 拷贝
        this.temp.goodsDetailId = response.data.goodsDetail.id
      }).catch(error => {
        this.$message.error(error)
      })
    }
  }
}
</script>
