<template>
  <el-dialog :title="textMap[dialogStatus]"
             :visible.sync="dialogFormVisible"
             width="60%"
             @open="handleOpen">
    <el-form ref="dataForm"
             :rules="rules"
             :model="formData"
             label-position="top"
             label-width="130px">
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="SKU名称"
                        prop="skuName">
            <el-input v-model="formData.skuName"
                      placeholder="请设置" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="编码"
                        prop="skuCode">
            <el-input v-model="formData.skuCode"
                      :disabled="true"
                      placeholder="系统自动生成" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="所属商品信息"
                        prop="goodsId">
            <el-select v-model="formData.goodsId"
                       :remote-method="handleGoods"
                       :loading="goodsLoading"
                       placeholder="请选择"
                       clearable
                       filterable
                       remote
                       class="filter-item filter-select">
              <el-option v-for="(goods,index) in goodsOptions"
                         :key="index"
                         :label="goods.name"
                         :value="goods.id" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="原价"
                        prop="skuAmount">
            <el-input v-model="formData.skuAmount"
                      placeholder="请设置">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="折扣价"
                        prop="discountAmount">
            <el-input v-model="formData.discountAmount"
                      placeholder="请设置">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="入库量"
                        prop="inventory">
            <el-input v-model="formData.inventory"
                      placeholder="请设置" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="默认展示"
                        prop="defaultSku">
            <el-radio-group v-model="formData.defaultSku">
              <el-radio-button :label="true">是</el-radio-button>
              <el-radio-button :label="false">否</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-form-item label="SKU图片集"
                      prop="images">
          <multi-image v-model="formData.images" />
        </el-form-item>
      </el-row>
      <el-row :gutter="24">
      </el-row>
      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="说明"
                        prop="description">
            <vue-editor id="editor"
                        v-model="formData.description"
                        :use-custom-image-handler="true"
                        @image-added="handleImageAdded" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer"
         class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取消</el-button>
      <el-button type="primary"
                 @click="dialogStatus === 'create'?createData():updateData()">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { postGoodsPage } from '@/api/goods/goods'
import { postSkuCreate, putSkuModify } from '@/api/goods/sku'
import { postPropertyGroupPage } from '@/api/goods/propertyGroup'
import { postClassificationList } from '@/api/goods/classification'
import { postBrandList } from '@/api/goods/brand'
import MultiImage from '@/components/Upload/multiImage'
import { uploadFile } from '@/api/common'
import { VueEditor } from 'vue2-editor'
export default {
  name: 'SkuForm',
  components: { MultiImage, VueEditor },
  props: {
    formData: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      textMap: {
        update: '编辑SKU商品',
        create: '创建SKU商品'
      },
      dialogStatus: 'update',
      dialogFormVisible: false,
      gcsLoading: false,
      brandLoading: false,
      goodsLoading: false,
      goodsOptions: [], // 商品分类
      brandOption: [], // 品牌
      propertyGroupOption: [], // 商品属性组
      goodsStatusOptions: [
        { key: 1, value: '上架' },
        { key: 2, value: '下架' }
      ],
      rules: {
        skuName: [{ required: true, message: 'sku名称不能为空', trigger: 'blur' }],
        goodsId: [{ required: true, message: '商品信息不能为空', trigger: 'blur' }],
        skuAmount: [{ required: true, message: '商品原价不能为空', trigger: 'blur' }],
        inventory: [{ required: true, message: '入库量不能为空', trigger: 'blur' }],
        images: [{ required: true, message: '图片集不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters([
      'goodsTypeOptions'
    ])
  },
  methods: {
    handleOpen () {
      postBrandList({ page: 1, pageSize: 10 }).then(response => {
        this.brandOption = response.data
      })
      postClassificationList({ page: 1, pageSize: 10 }).then(response => {
        this.classificationOption = response.data
      })
      this.handleGoods(null)
    },
    handleGoods (keyword) { // 商品二级分类
      this.goodsLoading = true
      const params = {
        page: 1,
        pageSize: 10,
        name: keyword
      }
      postGoodsPage(params).then(response => {
        this.goodsOptions = response.data
        setTimeout(() => {
          this.goodsLoading = false
        }, 200)
      })
    },
    handleRemoteBrand (keyword) { // 商品品牌
      this.brandLoading = true
      const params = {
        page: 1,
        pageSize: 10,
        brandName: keyword
      }
      postBrandList(params).then(response => {
        this.brandOption = response.data
        setTimeout(() => {
          this.brandLoading = false
        }, 200)
      })
    },
    handleRemotePropertyGroup (keyword) { // 商品属性组
      this.propertyGroupLoading = false
      const params = {
        page: 1,
        pageSize: 10,
        brandName: keyword
      }
      postPropertyGroupPage(params).then(response => {
        this.propertyGroupOption = response.data
        setTimeout(() => {
          this.propertyGroupLoading = false
        }, 200)
      })
    },
    handleImageAdded (file, Editor, cursorLocation, resetUploader) { // 富文本上传文件
      const formData = new FormData()
      formData.append('file', file)
      uploadFile(formData).then(response => {
        // 把获取到的图片url 插入到鼠标所在位置 回显图片
        Editor.insertEmbed(cursorLocation, 'image', response.data.url)
        resetUploader()
      })
    },
    createData () { // 添加商品
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.formData.createUser = this.$store.state.user.username
          this.formData.updateUser = this.$store.state.user.username
          const tempData = Object.assign({}, this.formData)
          postSkuCreate(tempData).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            this.$parent.getSkuList()
          })
        }
      })

    },
    updateData () { // 修改商品
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.formData.updateUser = this.$store.state.user.username
          const tempData = Object.assign({}, this.formData)
          putSkuModify(tempData).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
            this.$parent.getSkuList()
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.filter-select {
  display: block;
}
</style>
