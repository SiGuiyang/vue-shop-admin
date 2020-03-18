<template>
  <div class="form-config">
    <el-form label-position="top">
      <el-form-item v-if="data.type !== 'grid'"
                    label="字段标识">
        <el-input v-model="data.model" />
      </el-form-item>
      <el-form-item v-if="data.type !== 'grid'"
                    label="字段名称">
        <el-input v-model="data.name" />
      </el-form-item>
      <el-form-item v-if="Object.keys(data).indexOf('width') >= 0"
                    label="宽度">
        <el-input v-model="data.width" />
      </el-form-item>
      <el-form-item v-if="Object.keys(data).indexOf('height') >= 0"
                    label="高度">
        <el-input v-model="data.height" />
      </el-form-item>
      <el-form-item v-if="Object.keys(data).indexOf('size') >= 0"
                    label="大小">
        宽度
        <el-input v-model.number="data.size.width"
                  style="width: 90px;"
                  type="number" />
        高度
        <el-input v-model.number="data.size.height"
                  style="width: 90px;"
                  type="number" />
      </el-form-item>
      <el-form-item v-if="Object.keys(data).indexOf('inline')>=0"
                    label="布局方式">
        <el-radio-group v-model="data.inline">
          <el-radio-button :label="false">块级</el-radio-button>
          <el-radio-button :label="true">行内</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="Object.keys(data).indexOf('showInput')>=0"
                    label="显示输入框">
        <el-switch v-model="data.showInput" />
      </el-form-item>
      <el-form-item v-if="Object.keys(data).indexOf('min')>=0"
                    label="最小值">
        <el-input-number v-model="data.min"
                         :min="0"
                         :max="100"
                         :step="1" />
      </el-form-item>
      <el-form-item v-if="Object.keys(data).indexOf('max')>=0"
                    label="最大值">
        <el-input-number v-model="data.max"
                         :min="0"
                         :max="100"
                         :step="1" />
      </el-form-item>
      <el-form-item v-if="Object.keys(data).indexOf('step')>=0"
                    label="步长">
        <el-input-number v-model="data.step"
                         :min="0"
                         :max="100"
                         :step="1" />
      </el-form-item>
      <el-form-item v-if="data.type === 'select' || data.type === 'imgupload'"
                    label="是否多选">
        <el-switch v-model="data.multiple"
                   @change="handleSelectMultiple" />
      </el-form-item>
      <el-form-item v-if="data.type === 'select'"
                    label="是否可搜索">
        <el-switch v-model="data.filterable" />
      </el-form-item>
      <el-form-item v-if="Object.keys(data).indexOf('allowHalf')>=0"
                    label="允许半选)">
        <el-switch v-model="data.allowHalf" />
      </el-form-item>
      <el-form-item v-if="Object.keys(data).indexOf('showAlpha')>=0"
                    label="支持透明度选择">
        <el-switch v-model="data.showAlpha" />
      </el-form-item>
      <el-form-item v-if="Object.keys(data).indexOf('remoteUrl') >= 0"
                    label="远端数据">
        <el-input v-model="data.remoteUrl"
                  placeholder="请输入访问地址" />
      </el-form-item>
      <el-form-item v-if="Object.keys(data).indexOf('defaultValue')>=0 && (data.type === 'textarea' || data.type === 'input' || data.type === 'rate' || data.type === 'color' || data.type === 'switch')"
                    label="默认值">
        <el-input v-if="data.type === 'textarea'"
                  v-model="data.defaultValue"
                  :rows="5"
                  type="textarea" />
        <el-input v-if="data.type === 'input'"
                  v-model="data.defaultValue" />
        <el-rate v-if="data.type === 'rate'"
                 v-model="data.defaultValue"
                 :max="data.max"
                 :allow-half="data.allowHalf"
                 style="display:inline-block;vertical-align: middle;" />
        <el-button v-if="data.type === 'rate'"
                   type="text"
                   style="display:inline-block;vertical-align: middle;margin-left: 10px;"
                   @click="data.defaultValue=0">清空
        </el-button>
        <el-color-picker v-if="data.type === 'color'"
                         v-model="data.defaultValue"
                         :show-alpha="data.showAlpha" />
        <el-switch v-if="data.type === 'switch'"
                   v-model="data.defaultValue" />
      </el-form-item>
      <template v-if="data.type === 'time' || data.type === 'date'">
        <el-form-item v-if="data.type === 'date'"
                      label="显示类型">
          <el-select v-model="data.type">
            <el-option value="year" />
            <el-option value="month" />
            <el-option value="date" />
            <el-option value="dates" />
            <el-option value="datetime" />
            <el-option value="datetimerange" />
            <el-option value="daterange" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="data.type === 'time'"
                      label="是否为范围选择">
          <el-switch v-model="data.beRange" />
        </el-form-item>
        <el-form-item v-if="data.type === 'date'"
                      label="是否获取时间戳">
          <el-switch v-model="data.timestamp" />
        </el-form-item>
        <el-form-item v-if="(!data.beRange && data.type === 'time') || (data.type !== 'time' && data.type !== 'datetimerange' && data.type !== 'daterange')"
                      label="占位内容">
          <el-input v-model="data.placeholder" />
        </el-form-item>
        <el-form-item v-if="(data.beRange) || data.type === 'datetimerange' || data.type === 'daterange'"
                      label="开始时间占位内容">
          <el-input v-model="data.startPlaceholder" />
        </el-form-item>
        <el-form-item v-if="data.beRange || data.type === 'datetimerange' || data.type === 'daterange'">
          <el-input v-model="data.endPlaceholder"
                    label="结束时间占位内容" />
        </el-form-item>
        <el-form-item label="格式">
          <el-input v-model="data.format" />
        </el-form-item>
        <el-form-item v-if="data.type ==='time' && Object.keys(data).indexOf('beRange')>=0"
                      label="默认值">
          <el-time-picker v-if="!data.beRange"
                          key="1"
                          v-model="data.defaultValue"
                          :arrow-control="data.arrowControl"
                          :value-format="data.format"
                          style="width: 100%;" />
          <el-time-picker v-if="data.beRange"
                          key="2"
                          v-model="data.defaultValue"
                          :arrow-control="data.arrowControl"
                          :value-format="data.format"
                          is-range
                          style="width: 100%;" />
        </el-form-item>
      </template>
      <template v-if="data.type === 'imgupload'">
        <el-form-item label="最大上传数">
          <el-input v-model.number="data.length"
                    type="number" />
        </el-form-item>
        <el-form-item label="使用七牛上传">
          <el-switch v-model="data.isQiniu" />
        </el-form-item>
        <template v-if="data.isQiniu">
          <el-form-item :required="true"
                        label="Domain">
            <el-input v-model="data.domain" />
          </el-form-item>
          <el-form-item :required="true"
                        label="获取七牛Token方法">
            <el-input v-model="data.tokenFunc" />
          </el-form-item>
        </template>
        <template v-else>
          <el-form-item :required="true"
                        label="图片上传地址">
            <el-input v-model="data.action" />
          </el-form-item>
        </template>
      </template>

      <template v-if="data.type === 'grid'">
        <el-form-item label="栅格间隔">
          <el-input v-model.number="data.gutter"
                    type="number" />
        </el-form-item>
        <el-form-item label="列配置项">
          <el-col v-for="(item, index) in data.columns"
                  :key="index">
            <el-input v-model.number="item.span"
                      placeholder="栅格值"
                      size="mini"
                      style="width: 100px;"
                      type="number" />

            <el-button circle
                       type="success"
                       size="mini"
                       icon="el-icon-plus"
                       style="padding: 4px;margin-left: 5px;"
                       @click="handleAddColumn" />
            <el-button circle
                       plain
                       type="danger"
                       size="mini"
                       icon="el-icon-minus"
                       style="padding: 4px;margin-left: 5px;"
                       @click="handleOptionsRemove(index)" />

          </el-col>
        </el-form-item>
        <el-form-item label="水平排列方式">
          <el-select v-model="data.justify">
            <el-option value="start"
                       label="左对齐" />
            <el-option value="end"
                       label="右对齐" />
            <el-option value="center"
                       label="居中" />
            <el-option value="space-around"
                       label="两侧间隔相等" />
            <el-option value="space-between"
                       label="两端对齐" />
          </el-select>
        </el-form-item>
        <el-form-item label="垂直排列方式">
          <el-select v-model="data.align"
                     value="">
            <el-option value="top"
                       label="顶部对齐" />
            <el-option value="middle"
                       label="居中" />
            <el-option value="bottom"
                       label="底部对齐" />
          </el-select>
        </el-form-item>
      </template>

      <template v-if="data.type !== 'grid'">
        <el-form-item label="操作属性">
          <el-checkbox v-if="Object.keys(data).indexOf('readonly')>=0"
                       v-model="data.readonly">完全只读
          </el-checkbox>
          <el-checkbox v-if="Object.keys(data).indexOf('disabled')>=0"
                       v-model="data.disabled">禁用
          </el-checkbox>
          <el-checkbox v-if="Object.keys(data).indexOf('editable')>=0"
                       v-model="data.editable">文本框可输入
          </el-checkbox>
          <el-checkbox v-if="Object.keys(data).indexOf('clearable')>=0"
                       v-model="data.clearable">
            显示清除按钮
          </el-checkbox>
          <el-checkbox v-if="Object.keys(data).indexOf('arrowControl')>=0"
                       v-model="data.arrowControl">
            使用箭头进行时间选择
          </el-checkbox>
          <el-checkbox v-if="Object.keys(data).indexOf('isDelete')>=0"
                       v-model="data.isDelete">删除
          </el-checkbox>
          <el-checkbox v-if="Object.keys(data).indexOf('isEdit')>=0"
                       v-model="data.isEdit">编辑
          </el-checkbox>

        </el-form-item>
        <el-form-item label="校验">
          <div v-if="Object.keys(data).indexOf('required')>=0">
            <el-checkbox v-model="data.required">必填</el-checkbox>
          </div>
          <div v-if="Object.keys(data).indexOf('pattern')>=0">
            <el-input v-model.lazy="data.pattern"
                      size="mini"
                      style=" width: 240px;"
                      placeholder="填写正则表达式" />
          </div>
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>

<script>

export default {
  name: 'WidgetConfig',
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      validator: {
        type: null,
        required: null,
        pattern: null,
        beRange: null,
        length: null
      }
    }
  },
  watch: {
    'data.beRange': function (val) {
      if (typeof val !== 'undefined') {
        if (val) {
          this.data.defaultValue = null
        } else {
          if (Object.keys(this.data).indexOf('defaultValue') >= 0) {
            this.data.defaultValue = ''
          }
        }
      }
    },
    'data.required': function (val) {
      this.validateRequired(val)
    },
    'data.dataType': function (val) {
      this.validateDataType(val)
    },
    'data.pattern': function (val) {
      this.validatePattern(val)
    },
    'data.name': function (val) {
      if (this.data) {
        this.validateRequired(this.data.required)
        this.validateDataType(this.data.dataType)
        this.validatePattern(this.data.pattern)
      }
    }
  },
  methods: {
    handleOptionsRemove (index) {
      if (this.data.type === 'grid') {
        if (this.data.columns.length > 1) {
          this.data.columns.splice(index, 1)
        } else {
          this.$message({
            type: 'warning',
            message: '最后一项无法删除'
          })
        }
      } else {
        if (this.data.options.length > 1) {
          this.data.options.splice(index, 1)
        } else {
          this.$message({
            type: 'warning',
            message: '最后一项无法删除'
          })
        }
      }
    },
    handleAddColumn () {
      this.data.columns.push({
        span: '',
        list: []
      })
    },
    generateRule () {
      this.data.rules = []
      Object.keys(this.validator).forEach(key => {
        if (this.validator[key]) {
          this.data.rules.push(this.validator[key])
        }
      })
    },
    handleSelectMultiple (value) {
      if (value) {
        if (this.data.defaultValue) {
          this.data.defaultValue = [this.data.defaultValue]
        } else {
          this.data.defaultValue = []
        }
      } else {
        if (this.data.defaultValue.length > 0) {
          this.data.defaultValue = this.data.defaultValue[0]
        } else {
          this.data.defaultValue = ''
        }
      }
    },
    validateRequired (val) {
      if (val) {
        this.validator.required = { required: true, message: `${this.data.name}` + '必须填写' }
      } else {
        this.validator.required = null
      }

      this.$nextTick(() => {
        this.generateRule()
      })
    },
    validateDataType (val) {
      if (val) {
        this.validator.type = { type: val, message: this.data.name + '格式不正确' }
      } else {
        this.validator.type = null
      }

      this.generateRule()
    },
    validatePattern (val) {
      if (!this.show) {
        return false
      }

      if (val) {
        this.validator.pattern = { pattern: val, message: this.data.name + '格式不匹配' }
      } else {
        this.validator.pattern = null
      }

      this.generateRule()
    }
  }
}
</script>

<style scoped>
.form-config {
  padding: 0 20px;
}
</style>
