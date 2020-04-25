<template>
  <div class="app-container">
    <el-form ref="dataForm"
             :rules="rules"
             :model="goodsData"
             label-position="top"
             label-width="130px">
      <el-form-item label="分类名称"
                    prop="gcsId">
        <el-select v-model="goodsData.gcsId"
                   placeholder="分类名称"
                   clearable
                   class="filter-item">
          <el-option v-for="(item,index) in classifications"
                     :key="index"
                     :label="item.className"
                     :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="商品名称"
                    prop="goodsName">
        <el-input v-model="goodsData.goodsName"
                  placeholder="请设置" />
      </el-form-item>
      <el-form-item label="商品类型"
                    prop="goodsType">
        <el-radio-group v-model="goodsData.goodsType"
                        :disabled="goodsTypeDisabled"
                        placeholder="请选择">
          <el-radio v-for="(item,index) in goodsTypeOptions"
                    :key="index"
                    :label="item.type">{{ item.value }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="商品状态"
                    prop="goodsStatus">
        <el-radio-group v-model="goodsData.goodsStatus"
                        placeholder="请选择">
          <el-radio v-for="(item,index) in goodsStatusOptions"
                    :key="index"
                    :label="item.key">{{ item.value }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="产地"
                    prop="placeOrigin">
        <el-input v-model="goodsData.placeOrigin"
                  placeholder="请设置" />
      </el-form-item>
      <el-form-item label="储存方式"
                    prop="storage">
        <el-input v-model="goodsData.storage"
                  placeholder="请设置" />
      </el-form-item>
      <el-form-item label="商品价格"
                    prop="goodsAmount">
        <el-input v-model="goodsData.goodsAmount"
                  placeholder="请设置" />
      </el-form-item>
      <el-form-item label="商品折扣价格"
                    prop="goodsDiscountAmount">
        <el-input v-model="goodsData.goodsDiscountAmount"
                  placeholder="请设置" />
      </el-form-item>
      <el-form-item label="商品积分"
                    prop="integral">
        <el-input v-model="goodsData.integral"
                  placeholder="请设置" />
      </el-form-item>
      <el-form-item label="商品库存"
                    prop="goodsInventory">
        <el-input v-model="goodsData.goodsInventory"
                  placeholder="请设置" />
      </el-form-item>
      <el-form-item label="商品简介"
                    prop="description">
        <el-input v-model="goodsData.description"
                  type="textarea"
                  placeholder="请设置" />
      </el-form-item>
      <el-form-item label="商品LOGO"
                    prop="goodsImg">
        <div style="margin-bottom: 20px">
          <Upload v-model="goodsData.goodsImg" />
        </div>
      </el-form-item>
      <el-form-item label="商品banner第一页"
                    prop="bannerFirst">
        <div style="margin-bottom: 20px">
          <Upload v-model="goodsData.bannerFirst" />
        </div>
      </el-form-item>
      <el-form-item label="商品banner第二页"
                    prop="bannerSecond">
        <div style="margin-bottom: 20px">
          <Upload v-model="goodsData.bannerSecond" />
        </div>
      </el-form-item>
      <el-form-item label="商品banner第三页"
                    prop="bannerThird">
        <div style="margin-bottom: 20px">
          <Upload v-model="goodsData.bannerThird" />
        </div>
      </el-form-item>
      <el-form-item label="商品详情图一"
                    prop="detailsImgFirst">
        <div style="margin-bottom: 20px">
          <Upload v-model="goodsData.detailsImgFirst" />
        </div>
      </el-form-item>
      <el-form-item label="商品详情图二"
                    prop="detailsImgSecond">
        <div style="margin-bottom: 20px">
          <Upload v-model="goodsData.detailsImgSecond" />
        </div>
      </el-form-item>
      <el-form-item label="商品详情图三"
                    prop="detailsImgThird">
        <div style="margin-bottom: 20px">
          <Upload v-model="goodsData.detailsImgThird" />
        </div>
      </el-form-item>
      <el-form-item label="商品详情图四"
                    prop="detailsImgFourth">
        <div style="margin-bottom: 20px">
          <Upload v-model="goodsData.detailsImgFourth" />
        </div>
      </el-form-item>
      <el-form-item label="商品详情图五"
                    prop="detailsImgFifth">
        <div style="margin-bottom: 20px">
          <Upload v-model="goodsData.detailsImgFifth" />
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer"
         class="dialog-footer">
      <el-button @click="goBack()">取消</el-button>
      <template v-if="operationType === 'goods'">
        <el-button type="primary"
                   @click="dialogStatus === 'create'?createData():updateData()">确认</el-button>
      </template>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { postAddGoods, putModifyGoods, postGoodsInfo } from '@/api/goods/goods'
import { postList } from '@/api/goods/classification'
import Upload from '@/components/Upload/singleImage3'

export default {
  name: 'GoodsEdit',
  components: { Upload },
  data () {
    return {
      operationType: undefined,
      dialogStatus: undefined,
      goodsTypeDisabled: false,
      goodsData: {
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
  created () {
    this.tempRoute = Object.assign({}, this.$route)
    const requestParams = this.$route.params // 获取路由传入的参数
    this.operationType = requestParams.operationType // 操作类型
    this.restEvent(requestParams.event)
    this.initData(requestParams)
    this.getClassification()
  },
  methods: {
    initData (requestParams) {
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      // 查询时走数据库查询商品信息
      const params = {}
      params.goodsId = requestParams.id
      postGoodsInfo(params).then(response => {
        this.goodsData = Object.assign({}, response.data.goods) // 拷贝
        this.goodsData = Object.assign(this.goodsData, response.data.goodsDetail) // 拷贝
        const goodsDetail = response.data.goodsDetail
        this.goodsData.goodsDetailId = (goodsDetail === null || goodsDetail === undefined) ? undefined : goodsDetail.id
      })
    },
    getClassification () {
      postList({}).then(response => {
        this.classifications = response.data
      })
    },
    goBack () {
      window.history.go(-1) // 回退上一级路由
      this.$store.dispatch('delVisitedView', this.tempRoute) // 关闭当前路由
    },
    restForm () {
      this.goodsData.id = undefined
      this.goodsData.goodsDetailId = undefined
      this.goodsData.gcsId = undefined
      this.goodsData.goodsName = undefined
      this.goodsData.goodsCode = undefined
      this.goodsData.goodsStatus = undefined
      this.goodsData.goodsType = undefined
      this.goodsData.goodsAmount = undefined
      this.goodsData.goodsDiscountAmount = undefined
      this.goodsData.description = undefined
      this.goodsData.integral = undefined
      this.goodsData.goodsInventory = undefined
      this.goodsData.placeOrigin = undefined
      this.goodsData.storage = undefined
      this.goodsData.goodsImg = undefined
      this.goodsData.bannerFirst = undefined
      this.goodsData.bannerSecond = undefined
      this.goodsData.bannerThird = undefined
      this.goodsData.detailsImgFirst = undefined
      this.goodsData.detailsImgSecond = undefined
      this.goodsData.detailsImgThird = undefined
      this.goodsData.detailsImgFourth = undefined
      this.goodsData.detailsImgFifth = undefined
    },
    restEvent (event) {
      if (event === 'create') {
        this.dialogStatus = 'create'
        this.goodsTypeDisabled = false
      } else {
        this.dialogStatus = 'update'
        this.goodsTypeDisabled = true
      }
    },
    createData () { // 添加商品
      postAddGoods(this.goodsData).then(() => {
        this.$message({
          type: 'success',
          message: '操作成功'
        })
        this.goBack()
      })
    },
    updateData () { // 修改商品
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const updateDate = Object.assign({}, this.goodsData)
          putModifyGoods(updateDate).then(() => {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            this.goBack()
          })
        }
      })
    }
  }
}
</script>
