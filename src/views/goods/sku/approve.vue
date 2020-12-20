<template>
  <el-dialog title="SKU审核"
             :visible.sync="approveFormVisible"
             width="60%"
             @open="handleOpen">
    <el-form ref="dataForm"
             :model="approveData"
             label-position="top"
             label-width="130px">

      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="sku名称"
                        prop="skuName">
            <el-input v-model="approveData.skuName"
                      placeholder="请设置"
                      disabled />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="理由"
                        prop="description">
            <el-input v-model="description"
                      :rows="5"
                      :maxlength="200"
                      :disabled="descriptionDisabled"
                      type="textarea"
                      placeholder="请填写"
                      show-word-limit />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer"
         class="dialog-footer">
      <el-button @click="approveFormVisible = false">取消</el-button>
      <template v-if="!approveData.show">
        <el-button type="danger"
                   @click="handleApprove('REFUSE')">拒绝</el-button>
        <el-button type="primary"
                   @click="handleApprove('PASS')">确认</el-button>
      </template>
    </div>
  </el-dialog>
</template>

<script>

import { postApprove } from '@/api/goods/goods'
export default {
  name: 'Approve',
  props: {
    approveData: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      approveFormVisible: false,
      description: undefined,
      descriptionDisabled: false
    }
  },
  methods: {
    handleOpen () {
      console.log(this.approveData)
      this.description = this.approveData.description
      this.descriptionDisabled = this.approveData.show
    },
    // 审核
    handleApprove (publishStatus) {
      if (publishStatus === 'REFUSE' && (this.description === null || this.description === undefined || this.description === '')) {
        this.$message.error('请填写拒绝理由')
      } else {
        const params = {
          skuId: this.approveData.skuId,
          goodsId: this.approveData.goodsId,
          description: this.description,
          publishStatus: publishStatus,
          createUser: this.$store.state.user.username,
          updateUser: this.$store.state.user.username
        }
        postApprove(params).then(() => {
          this.$message({
            type: 'success',
            message: '审核成功'
          })
          this.approveFormVisible = false
          this.$parent.getSkuList()
        })
      }
    }
  }
}
</script>
