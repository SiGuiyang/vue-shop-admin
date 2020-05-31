<template>
  <div class="form-config">
    <el-form label-position="top">
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="字段名称">
            <el-input v-model="data.title" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="字段标识">
            <el-input v-model="data.field" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="字段值">
            <el-input v-model="data.value" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否禁用">
            <el-checkbox v-model="data.props.disabled">禁用
            </el-checkbox>
          </el-form-item>
        </el-col>
      </el-row>
      <template v-if="data.type === 'input'">
        <el-form-item label="是否多行文本">
          <el-switch v-model="data.props.textarea"
                     @change="handleSelectMultiple" />
        </el-form-item>
        <el-form-item v-if="data.props.textarea">
          <el-row :gutter="24">
            <el-col :span="6">
              <el-input v-model="data.props.rows"
                        placeholder="请设置行数" />
            </el-col>
            <el-col :span="6">
              <el-input v-model="data.props.autosize.minRows"
                        placeholder="最小行数" />
            </el-col>
            <el-col :span="6">
              <el-input v-model="data.props.autosize.maxRows"
                        placeholder="最大行数" />
            </el-col>
            <el-col :span="6">
              <el-input v-model="data.props.showWordLimit"
                        placeholder="限制数量" />
            </el-col>
          </el-row>
        </el-form-item>
      </template>
      <template v-if="data.type === 'InputNumber'">
        <el-form-item label="最小值">
          <el-input v-model.number="data.props.min" />
        </el-form-item>
        <el-form-item label="最大值">
          <el-input v-model.number="data.props.max" />
        </el-form-item>
        <el-form-item label="精度">
          <el-input v-model="data.props.precision" />
        </el-form-item>
      </template>
      <template v-if="data.type === 'radio' || data.type === 'checkbox' || data.type === 'select'">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="列配置项">
              <el-col v-for="(item, index) in data.options"
                      :key="index">
                <el-input v-model="item.label"
                          placeholder="名称"
                          size="mini"
                          style="width: 100px;" />
                <el-input v-model="item.value"
                          placeholder="值"
                          size="mini"
                          style="width: 100px;" />
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
          </el-col>
          <el-col :span="12">
            <el-form-item label="数据源">
              <el-input v-model="data.datasource" />
            </el-form-item>
          </el-col>
        </el-row>
      </template>
      <template v-if="data.type === 'select'">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="是否多选">
              <el-checkbox v-model="data.props.multiple" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否可搜索">
              <el-checkbox v-model="data.props.filterable" />
            </el-form-item>
          </el-col>
        </el-row>

      </template>
      <el-form-item v-if="data.type === 'rate'">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="最大分值">
              <el-input v-model.number="data.props.max" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否允许半选">
              <el-checkbox v-model="data.props.allowHalf" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="是否显示辅助文字">
              <el-checkbox v-model="data.props.showText" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="辅助文字数组">
              <el-col v-for="(item, index) in data.props.texts"
                      :key="index">
                <el-input v-model="data.props.texts[index]"
                          placeholder="请设置"
                          size="mini"
                          style="width: 100px;" />
                <el-button circle
                           type="success"
                           size="mini"
                           icon="el-icon-plus"
                           style="padding: 4px;margin-left: 5px;"
                           @click="handleTextsAdd" />
                <el-button circle
                           plain
                           type="danger"
                           size="mini"
                           icon="el-icon-minus"
                           style="padding: 4px;margin-left: 5px;"
                           @click="handleTextsRemove(index)" />

              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="是否显示当前分数">
              <el-checkbox v-model="data.props.showScore" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分数">
              <el-rate v-model="data.value"
                       :max="data.max"
                       :allow-half="data.props.allowHalf"
                       style="display:inline-block;vertical-align: middle;" />
              <el-button type="text"
                         style="display:inline-block;vertical-align: middle;margin-left: 10px;"
                         @click="data.value=0">清空
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>

      <template v-if="data.type === 'slider'">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="最小值">
              <el-input v-model.number="data.props.min" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最大值">
              <el-input v-model.number="data.props.max" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="步长	">
              <el-input v-model.number="data.props.step" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否为范围选择">
              <el-checkbox v-model="data.props.range" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="是否竖向模式">
              <el-checkbox v-model="data.props.vertical" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="高度，竖向模式时必填">
              <el-input v-model="data.props.height" />
            </el-form-item>
          </el-col>
        </el-row>
      </template>

      <template v-if="data.type === 'ColorPicker'">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="是否支持透明度">
              <el-checkbox v-model="data.props.showAlpha" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="颜色的格式">
              <el-select v-model="data.props.colorFormat">
                <el-option value="hsl" />
                <el-option value="hsv" />
                <el-option value="hex" />
                <el-option value="rgb" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </template>

      <template v-if="data.type === 'DatePicker' || data.type === 'TimePicker'">
        <el-form-item v-if="data.type === 'DatePicker'"
                      label="时间类型">
          <el-select v-model="data.props.type">
            <el-option value="year"
                       label="年" />
            <el-option value="month"
                       label="月" />
            <el-option value="date"
                       label="日" />
            <el-option value="datetime"
                       label="时间" />
            <el-option value="datetimerange"
                       label="时间范围" />
            <el-option value="daterange"
                       label="日期范围" />
          </el-select>
        </el-form-item>
        <el-form-item label="时间格式">
          <el-select v-model="data.props.format">
            <el-option value="YYYY-MM-dd" />
            <el-option value="YYYY/MM/dd" />
            <el-option value="YYYY年-MM月-dd日" />
            <el-option value="YYYY-MM-dd HH:mm:ss" />
            <el-option value="YYYY-MM-dd HH:mm" />
            <el-option value="HH:mm:ss" />
          </el-select>
        </el-form-item>
      </template>

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
                          v-model="data.value"
                          :arrow-control="data.arrowControl"
                          :value-format="data.format"
                          style="width: 100%;" />
          <el-time-picker v-if="data.beRange"
                          key="2"
                          v-model="data.value"
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

      <template>

        <el-form-item label="校验">
          <div v-if="Object.keys(data).indexOf('required')>=0">
            <el-checkbox v-model="data.required">必填</el-checkbox>
          </div>
          <el-input v-if="data.required"
                    v-model.lazy="data.pattern"
                    placeholder="自定义正则表达式" />
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
          this.data.value = null
        } else {
          if (Object.keys(this.data).indexOf('value') >= 0) {
            this.data.value = ''
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
        if (this.data.options.length > 1) {
          this.data.options.splice(index, 1)
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
    handleTextsRemove (index) {
      if (this.data.props.texts.length > 1) {
        this.data.props.texts.splice(index, 1)
      } else {
        this.$message({
          type: 'warning',
          message: '最后一项无法删除'
        })
      }
    },
    handleAddColumn () {
      this.data.options.push({
        label: '',
        value: ''
      })
    },
    handleTextsAdd () {
      this.data.props.texts.push('')
    },
    generateRule () {
      this.data.rules = []
      Object.keys(this.validator).forEach(key => {
        if (this.validator[key]) {
          this.data.validate.push(this.validator[key])
        }
      })
    },
    handleSelectMultiple (value) {

    },
    validateRequired (val) {
      if (val) {
        this.validator.required = { required: true, message: `${this.data.title}` + '必须填写' }
      } else {
        this.validator.required = null
      }

      this.$nextTick(() => {
        this.generateRule()
      })
    },
    validateDataType (val) {
      if (val) {
        this.validator.type = { type: val, message: this.data.title + '格式不正确' }
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
        this.validator.pattern = { pattern: val, message: this.data.title + '格式不匹配' }
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
