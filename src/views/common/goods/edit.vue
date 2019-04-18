<template>
  <div class="app-container">
    <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="130px">
      <el-form-item :label="$t('goods.classificationName')" prop="gcsId">
        <el-select v-model="temp.gcsId" :placeholder="$t('goods.classificationName')" clearable class="filter-item">
          <el-option v-for="(item,index) in classifications" :key="index" :label="item.className" :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('goods.goodsName')" prop="goodsName">
        <el-input v-model="temp.goodsName" placeholder="请设置"/>
      </el-form-item>
      <el-form-item :label="$t('goods.goodsType')" prop="goodsType">
        <el-radio-group v-model="temp.goodsType" placeholder="请选择">
          <el-radio v-for="(item,index) in goodsTypeOptions" :key="index" :label="item.type">{{ item.value }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('goods.goodsStatus')" prop="goodsStatus">
        <el-radio-group v-model="temp.goodsStatus" placeholder="请选择">
          <el-radio v-for="(item,index) in goodsStatusOptions" :key="index" :label="item.key">{{ item.value }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('goods.description')" prop="description">
        <el-input v-model="temp.description" placeholder="请设置"/>
      </el-form-item>
      <el-form-item :label="$t('goods.placeOrigin')" prop="placeOrigin">
        <el-input v-model="temp.placeOrigin" placeholder="请设置"/>
      </el-form-item>
      <el-form-item :label="$t('goods.storage')" prop="storage">
        <el-input v-model="temp.storage" placeholder="请设置"/>
      </el-form-item>
      <el-form-item :label="$t('goods.goodsAmount')" prop="goodsAmount">
        <el-input v-model="temp.goodsAmount" placeholder="请设置"/>
      </el-form-item>
      <el-form-item :label="$t('goods.goodsDiscountAmount')" prop="goodsDiscountAmount">
        <el-input v-model="temp.goodsDiscountAmount" placeholder="请设置"/>
      </el-form-item>
      <el-form-item :label="$t('goods.integral')" prop="integral">
        <el-input v-model="temp.integral" placeholder="请设置"/>
      </el-form-item>
      <el-form-item :label="$t('goods.goodsInventory')" prop="goodsInventory">
        <el-input v-model="temp.goodsInventory" placeholder="请设置"/>
      </el-form-item>
      <el-form-item :label="$t('goods.goodsImg')" prop="goodsImg">
        <div style="margin-bottom: 20px">
          <Upload v-model="temp.goodsImg"/>
        </div>
      </el-form-item>
      <el-form-item :label="$t('goods.bannerFirst')" prop="bannerFirst">
        <div style="margin-bottom: 20px">
          <Upload v-model="temp.bannerFirst"/>
        </div>
      </el-form-item>
      <el-form-item :label="$t('goods.bannerSecond')" prop="bannerSecond">
        <div style="margin-bottom: 20px">
          <Upload v-model="temp.bannerSecond"/>
        </div>
      </el-form-item>
      <el-form-item :label="$t('goods.bannerThird')" prop="bannerThird">
        <div style="margin-bottom: 20px">
          <Upload v-model="temp.bannerThird"/>
        </div>
      </el-form-item>
      <el-form-item :label="$t('goods.detailsImgFirst')" prop="detailsImgFirst">
        <div style="margin-bottom: 20px">
          <Upload v-model="temp.detailsImgFirst"/>
        </div>
      </el-form-item>
      <el-form-item :label="$t('goods.detailsImgSecond')" prop="detailsImgSecond">
        <div style="margin-bottom: 20px">
          <Upload v-model="temp.detailsImgSecond"/>
        </div>
      </el-form-item>
      <el-form-item :label="$t('goods.detailsImgThird')" prop="detailsImgThird">
        <div style="margin-bottom: 20px">
          <Upload v-model="temp.detailsImgThird"/>
        </div>
      </el-form-item>
      <el-form-item :label="$t('goods.detailsImgFourth')" prop="detailsImgFourth">
        <div style="margin-bottom: 20px">
          <Upload v-model="temp.detailsImgFourth"/>
        </div>
      </el-form-item>
      <el-form-item :label="$t('goods.detailsImgFifth')" prop="detailsImgFifth">
        <div style="margin-bottom: 20px">
          <Upload v-model="temp.detailsImgFifth"/>
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="goBack()">{{ $t('table.cancel') }}</el-button>
      <template v-if="operationType === 'goods'">
        <el-button type="primary" @click="dialogStatus?createData():updateData()">{{ $t('table.confirm') }}</el-button>
      </template>
      <template v-else-if="operationType === 'fightGroup'">
        <el-button type="primary" @click="handleFightGroupData()">{{ $t('table.confirm') }}</el-button>
      </template>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { modifyGoods, getGoodsInfo } from '@/api/goods'
import { fetchList } from '@/api/classification'
import Upload from '@/components/Upload/singleImage3'

export default {
  name: 'GoodsEdit',
  components: { Upload },
  data() {
    return {
      operationType: undefined,
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
    this.tempRoute = Object.assign({}, this.$route)
    const requestParams = this.$route.params // 获取路由传入的参数
    this.operationType = requestParams.operationType // 操作类型
    this.initData(requestParams)
    this.getClassification()
  },
  methods: {
    initData(requestParams) {
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })

      // 查询时走数据库查询商品信息
      if (requestParams.event === 'info') {
        const params = {}
        this.dialogStatus = false // 修改
        params.goodsId = requestParams.goodsId
        getGoodsInfo(params).then(response => {
          this.temp = Object.assign({}, response.data.goods) // 拷贝
          this.temp = Object.assign(this.temp, response.data.goodsDetail) // 拷贝
          this.temp.goodsDetailId = response.data.goodsDetail.id
        })
      } else {
        this.dialogStatus = true
        this.restForm()
      }
    },
    getClassification() {
      fetchList({}).then(response => {
        this.classifications = response.data
      })
    },
    goBack() {
      window.history.go(-1) // 回退上一级路由
      this.$store.dispatch('delVisitedView', this.tempRoute) // 关闭当前路由
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
    createData() { // 添加商品
      this.temp.event = 'add'
      modifyGoods(this.temp).then(response => {
        this.$notify({
          title: '成功',
          message: '操作成功',
          type: 'success',
          duration: 2000
        })
        this.goBack()
      })
    },
    updateData() { // 修改商品
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const updateDate = Object.assign({}, this.temp)
          updateDate.event = 'modify'
          modifyGoods(updateDate).then(response => {
            this.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success',
              duration: 2000
            })
            this.goBack()
          })
        }
      })
    },
    handleFightGroupData() {

    }
  }
}
</script>
