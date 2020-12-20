<template>
  <el-dialog :title="textMap[dialogStatus]"
             :visible.sync="dialogFormVisible"
             width="60%"
             @open="handleOpen">
    <el-steps :active="activeIndex"
              finish-status="success"
              simple
              style="margin-top: 20px">
      <el-step title="商品信息"></el-step>
      <el-step title="SKU信息"></el-step>
    </el-steps>
    <el-form ref="dataForm"
             :rules="rules"
             :model="formData"
             label-position="top"
             label-width="130px">
      <template v-if="activeIndex === 0">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="SPU分类"
                          prop="goodsClassId">
              <el-cascader v-model="formData.goodsClassId"
                           :options="spuOption"
                           :props="{value: 'id', label: 'name', checkStrictly: true}"
                           placeholder="SPU分类"
                           clearable
                           class="filter-select" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商品类型"
                          prop="goodsType">
              <el-select v-model="formData.goodsType"
                         placeholder="请选择"
                         clearable
                         class="filter-select">
                <el-option v-for="(goodsType,index) in goodsTypeOptions"
                           :key="index"
                           :label="goodsType.value"
                           :value="goodsType.type" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="单位"
                          prop="unit">
              <el-input v-model="formData.unit"
                        placeholder="请设置"
                        disabled />
            </el-form-item>
          </el-col>

        </el-row>

        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="开始时间"
                          prop="beginTime">
              <el-date-picker v-model="formData.beginTime"
                              type="date"
                              placeholder="选择日期"
                              format="yyyy 年 MM 月 dd 日"
                              value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="过期时间"
                          prop="endTime">
              <el-date-picker v-model="formData.endTime"
                              type="date"
                              placeholder="选择日期"
                              format="yyyy 年 MM 月 dd 日"
                              value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="是否新品"
                          prop="goodsState">
              <el-radio-group v-model="formData.goodsState">
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
        </el-row>
      </template>
      <template v-if="activeIndex === 1">
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
            <el-form-item label="含重量"
                          prop="weight">
              <el-input v-model="formData.weight"
                        placeholder="请设置" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入库量"
                          prop="stock">
              <el-input v-model="formData.stock"
                        placeholder="请设置" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="SKU图片集"
                          prop="images">
              <multi-image v-model="formData.images" />
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
      </template>
    </el-form>
    <div slot="footer"
         class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取消</el-button>
      <el-button v-if="activeIndex == 0 "
                 type="primary"
                 @click="nextStep">下一步</el-button>
      <el-button v-if="activeIndex > 0 "
                 @click="nextStep">上一步</el-button>
      <el-button v-if="activeIndex == 1"
                 type="primary"
                 @click="dialogStatus === 'create'?createData():updateData()">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { postCreateGoods, putModifyGoods } from '@/api/goods/goods'
import { postSpuTree } from '@/api/goods/spu'
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
      activeIndex: 0,
      goodsLoading: false,
      spuOption: [], // spu类别
      rules: {
        goodsClassId: [{ required: true, message: 'SPU分类不能为空', trigger: 'blur' }],
        goodsType: [{ required: true, message: '商品类型不能为空', trigger: 'blur' }],
        beginTime: [{ required: true, message: '开始时间不能为空', trigger: 'blur' }],
        endTime: [{ required: true, message: '过期时间不能为空', trigger: 'blur' }],
        skuName: [{ required: true, message: 'sku名称不能为空', trigger: 'blur' }],
        skuAmount: [{ required: true, message: '商品原价不能为空', trigger: 'blur' }],
        weight: [{ required: true, message: '含重量不能为空', trigger: 'blur' }],
        stock: [{ required: true, message: '入库量不能为空', trigger: 'blur' }],
        images: [{ required: true, message: '图片集不能为空', trigger: 'blur' }],
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
      postSpuTree({}).then(response => {
        this.spuOption = response.data
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
          tempData.goodsClassId = this.formData.goodsClassId[this.formData.goodsClassId.length - 1]
          postCreateGoods(tempData).then(() => {
            this.dialogFormVisible = false
            this.$message({
              message: '创建成功',
              type: 'success'
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
          tempData.goodsClassId = this.formData.goodsClassId[this.formData.goodsClassId.length - 1]
          putModifyGoods(tempData).then(() => {
            this.dialogFormVisible = false
            this.$message({
              message: '更新成功',
              type: 'success'
            })
            this.$parent.getSkuList()
          })
        }
      })
    },
    nextStep () {
      if (this.activeIndex++ > 0) this.activeIndex = 0
    }
  }
}
</script>

<style scoped>
.filter-select {
  display: block;
}
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100%;
}
</style>
