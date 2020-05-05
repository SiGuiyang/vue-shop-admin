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
          <el-form-item label="商品名称"
                        prop="name">
            <el-input v-model="formData.name"
                      placeholder="请设置" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属品牌"
                        prop="brandId">
            <el-select v-model="formData.brandId"
                       :remote-method="handleRemoteBrand"
                       :loading="brandLoading"
                       placeholder="品牌名称"
                       clearable
                       filterable
                       remote
                       class="filter-item filter-select">
              <el-option v-for="(brand,index) in brandOption"
                         :key="index"
                         :label="brand.brandName"
                         :value="brand.id" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="所属分类"
                        prop="gcsId">
            <el-select v-model="formData.gcsId"
                       :remote-method="handleRemoteGcs"
                       :loading="gcsLoading"
                       placeholder="请选择"
                       clearable
                       filterable
                       remote
                       class="filter-item filter-select">
              <el-option v-for="(classification,index) in classificationOption"
                         :key="index"
                         :label="classification.className"
                         :value="classification.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="商品属性组"
                        prop="gcsId">
            <el-select v-model="formData.goodsPropertyGroupId"
                       :remote-method="handleRemotePropertyGroup"
                       :loading="propertyGroupLoading"
                       placeholder="请选择"
                       clearable
                       filterable
                       remote
                       class="filter-item filter-select">
              <el-option v-for="(propertyGroup,index) in propertyGroupOption"
                         :key="index"
                         :label="propertyGroup.propertyGroupName"
                         :value="propertyGroup.id" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="商品类型"
                        prop="goodsType">
            <el-select v-model="formData.goodsType"
                       placeholder="请选择"
                       clearable
                       class="filter-item filter-select">
              <el-option v-for="(goodsType,index) in goodsTypeOptions"
                         :key="index"
                         :label="goodsType.value"
                         :value="goodsType.type" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属SPU"
                        prop="spuId">
            <el-select v-model="formData.spuId"
                       :remote-method="handleRemoteSpu"
                       :loading="spuLoading"
                       placeholder="请选择"
                       clearable
                       filterable
                       remote
                       class="filter-item filter-select">
              <el-option v-for="(spu,index) in spuOption"
                         :key="index"
                         :label="spu.spuName"
                         :value="spu.id" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="是否新品"
                        prop="state">
            <el-radio-group v-model="formData.state">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否推荐"
                        prop="recommend">
            <el-radio-group v-model="formData.recommend">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="单位"
                        prop="unit">
            <el-input v-model="formData.unit"
                      placeholder="请设置" />
          </el-form-item>
        </el-col>
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
import { postCreateGoods, putModifyGoods } from '@/api/goods/goods'
import { postPropertyGroupPage } from '@/api/goods/propertyGroup'
import { postClassificationList } from '@/api/goods/classification'
import { postBrandList } from '@/api/goods/brand'
import { postSpuPage } from '@/api/goods/spu'
import { uploadFile } from '@/api/common'
import { VueEditor } from 'vue2-editor'

export default {
  name: 'GoodsObjectForm',
  components: { VueEditor },
  props: {
    formData: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      textMap: {
        update: '编辑商品信息',
        create: '创建商品信息'
      },
      dialogStatus: 'update',
      dialogFormVisible: false,
      gcsLoading: false,
      brandLoading: false,
      propertyGroupLoading: false,
      classificationOption: [], // 商品分类
      brandOption: [], // 品牌
      propertyGroupOption: [], // 商品属性组
      spuLoading: false,
      spuOption: [],
      htmlContent: '', // 富文本内容
      rules: {
        gcsId: [{ required: true, message: '分类名称不能为空', trigger: 'blur' }],
        name: [{ required: true, message: '商品名称不能为空', trigger: 'blur' }],
        goodsType: [{ required: true, message: '商品类型不能为空', trigger: 'blur' }],
        brandId: [{ required: true, message: '所属品牌不能为空', trigger: 'blur' }],
        spuId: [{ required: true, message: '所属SPU不能为空', trigger: 'blur' }],
        unit: [{ required: true, message: '单位不能为空', trigger: 'blur' }],
        description: [{ required: true, message: '商品说明不能为空', trigger: 'blur' }]
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
      this.handleRemoteBrand(null)
      this.handleRemoteGcs(null)
      this.handleRemotePropertyGroup(null)
      this.handleRemoteSpu(null)
    },
    handleRemoteGcs (keyword) { // 商品二级分类
      this.gcsLoading = true
      const params = {
        page: 1,
        pageSize: 10,
        className: keyword
      }
      postClassificationList(params).then(response => {
        this.classificationOption = response.data
        setTimeout(() => {
          this.gcsLoading = false
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
      this.propertyGroupLoading = true
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
    handleRemoteSpu (keyword) {
      this.spuLoading = true
      const params = {
        page: 1,
        pageSize: 10,
        spuName: keyword
      }
      postSpuPage(params).then(response => {
        this.spuOption = response.data
        setTimeout(() => {
          this.spuLoading = false
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
          postCreateGoods(tempData).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            this.$parent.getGoodsList()
          })
        }
      })

    },
    updateData () { // 修改商品
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.formData.updateUser = this.$store.state.user.username
          const tempData = Object.assign({}, this.formData)
          putModifyGoods(tempData).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
            this.$parent.getGoodsList()
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
