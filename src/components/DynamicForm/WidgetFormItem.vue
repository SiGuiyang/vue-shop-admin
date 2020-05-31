<template>
  <el-form-item v-if="element && element.key"
                :class="{active: selectWidget.key === element.key, 'is_req': element.required}"
                :label="element.title"
                class="widget-view "
                @click.native.stop="handleSelectWidget(index)">
    <template v-if="element.type === 'input'">
      <el-input v-model="element.value"
                :type="element.props.type"
                :maxlength="element.props.maxlength"
                :minlength="element.props.minlength"
                :prefix-icon="element.props.prefixIcon"
                :suffix-icon="element.props.suffixIcon"
                :rows="element.props.rows"
                :show-word-limit="element.props.showWordLimit"
                :show-password="element.props.showPassword"
                :style="{width: element.width}"
                :placeholder="element.props.placeholder"
                :clearable="true"
                :disabled="element.props.disabled" />
    </template>

    <template v-if="element.type === 'InputNumber'">
      <el-input-number v-model="element.value"
                       :disabled="element.props.disabled"
                       :min="element.props.min"
                       :max="element.props.max"
                       :step="element.props.step"
                       :precision="element.props.precision"
                       :controls-position="element.controlsPosition"
                       :placeholder="element.props.placeholder" />
    </template>

    <template v-if="element.type === 'radio'">
      <el-radio-group v-model="element.value"
                      :disabled="element.props.disabled">
        <el-radio v-for="(item) in element.options"
                  :key="item.value"
                  :label="item.value">
          {{ item.label }}
        </el-radio>
      </el-radio-group>
    </template>

    <template v-if="element.type === 'checkbox'">
      <el-checkbox-group v-model="element.value"
                         :disabled="element.props.disabled">
        <el-checkbox v-for="(item) in element.options"
                     :key="item.value"
                     :value="item.value"
                     :label="item.value">
          {{ item.label }}
        </el-checkbox>
      </el-checkbox-group>
    </template>

    <template v-if="element.type === 'switch'">
      <el-switch v-model="element.value"
                 :disabled="element.props.disabled" />
    </template>

    <template v-if="element.type === 'select'">
      <el-select v-model="element.value"
                 :disabled="element.props.disabled"
                 :multiple="element.props.multiple"
                 :clearable="element.props.learable"
                 :placeholder="element.props.placeholder"
                 :multiple-limit="element.props.multipleLimit"
                 :filterable="element.props.filterable">
        <el-option v-for="item in element.options"
                   :key="item.value"
                   :value="item.value"
                   :label="item.label" />
      </el-select>
    </template>

    <template v-if="element.type === 'cascader'">
      <el-cascader v-model="element.value"
                   :disabled="element.disabled"
                   :clearable="element.clearable"
                   :placeholder="element.placeholder"
                   :style="{width: element.width}"
                   :options="element.options" />
    </template>

    <template v-if="element.type === 'DatePicker'">
      <el-time-picker v-model="element.value"
                      :is-range="element.beRange"
                      :placeholder="element.placeholder"
                      :start-placeholder="element.startPlaceholder"
                      :end-placeholder="element.endPlaceholder"
                      :readonly="element.readonly"
                      :disabled="element.disabled"
                      :editable="element.editable"
                      :clearable="element.clearable"
                      :arrow-control="element.arrowControl"
                      :style="{width: element.width}" />
    </template>

    <template v-if="element.type === 'TimePicker'">
      <el-date-picker v-model="element.value"
                      :type="element.type"
                      :is-range="element.beRange"
                      :placeholder="element.placeholder"
                      :start-placeholder="element.startPlaceholder"
                      :end-placeholder="element.endPlaceholder"
                      :readonly="element.readonly"
                      :disabled="element.disabled"
                      :editable="element.editable"
                      :clearable="element.clearable"
                      :style="{width: element.width}" />
    </template>

    <template v-if="element.type === 'ColorPicker'">
      <el-color-picker v-model="element.value"
                       :disabled="element.props.disabled"
                       :show-alpha="element.props.showAlpha"
                       :color-format="element.props.colorFormat" />
    </template>

    <template v-if="element.type === 'rate'">
      <el-rate v-model="element.value"
               :max="element.props.max"
               :disabled="element.props.disabled"
               :allow-half="element.props.allowHalf"
               :show-text="element.props.showText"
               :show-score="element.props.showScore"
               :texts="element.props.texts" />
    </template>

    <template v-if="element.type === 'slider'">
      <el-slider v-model="element.value"
                 :min="element.props.min"
                 :max="element.props.max"
                 :disabled="element.props.disabled"
                 :step="element.props.step"
                 :show-input="element.props.showInput"
                 :range="element.props.range"
                 :vertical="element.props.vertical"
                 :height="element.props.height" />
    </template>

    <template v-if="element.type === 'tree'">
      <el-slider v-model="element.value"
                 :min="element.min"
                 :max="element.max"
                 :disabled="element.disabled"
                 :step="element.step"
                 :show-input="element.showInput"
                 :range="element.beRange"
                 :style="{width: element.width}" />
    </template>

    <template v-if="element.type === 'upload'">
      <el-upload v-model="element.value"
                 :action="element.props.action"
                 :upload-type="element.props.uploadType"
                 :show-file-list="element.props.showFileList"
                 :list-type="element.props.listType"
                 :file-list="element.props.fileList"
                 :with-credentials="element.props.withCredentials"
                 :auto-upload="element.props.autoUpload"
                 :multiple="element.props.multiple"
                 :drag="element.props.drag"
                 :accept="element.props.accept"
                 :limit="element.props.limit"
                 :disabled="element.props.disabled" />
    </template>

    <template v-if="element.type === 'editor'">
      <vue-editor v-model="element.value"
                  :style="{width: element.width}" />
    </template>

    <div v-if="selectWidget.key === element.key"
         class="widget-view-action">
      <el-button type="success"
                 size="mini"
                 circle
                 icon="el-icon-setting"
                 @click="dialogWidgetDisabled = true" />
      <el-button type="warning"
                 size="mini"
                 circle
                 icon="el-icon-star-off"
                 @click.stop="handleWidgetClone(index)" />
      <el-button type="danger"
                 size="mini"
                 circle
                 icon="el-icon-delete"
                 @click.stop="handleWidgetDelete(index)" />
    </div>

    <div v-if="selectWidget.key === element.key"
         class="widget-view-drag">
      <svg-icon icon-class="drag" />
    </div>
    <el-dialog :visible.sync="dialogWidgetDisabled"
               :close="handleClose"
               append-to-body
               title="字段属性">
      <widget-config :data="selectWidget" />
    </el-dialog>
  </el-form-item>
</template>

<script>
import WidgetConfig from './WidgetConfig'
import { VueEditor } from 'vue2-editor'

export default {
  title: 'WidgetFormItem',
  components: {
    WidgetConfig,
    VueEditor
  },
  props: {
    element: {
      type: Object,
      default: () => ({})
    },
    select: {
      type: Object,
      default: () => ({})
    },
    index: {
      type: Number,
      default: () => ({})
    },
    data: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      selectWidget: this.select,
      dialogWidgetDisabled: false
    }
  },
  watch: {
    select (val) {
      this.selectWidget = val
    },
    selectWidget: {
      handler (val) {
        this.$emit('update:select', val)
      },
      deep: true
    }
  },
  methods: {
    handleClose (done) {
      done()
    },
    handleSelectWidget (index) {
      this.selectWidget = this.data.widgets[index]
    },
    handleWidgetDelete (index) {
      if (this.data.widgets.length - 1 === index) {
        if (index === 0) {
          this.selectWidget = {}
        } else {
          this.selectWidget = this.data.widgets[index - 1]
        }
      } else {
        this.selectWidget = this.data.widgets[index + 1]
      }

      this.$nextTick(() => {
        this.data.widgets.splice(index, 1)
      })
    },
    handleWidgetClone (index) {
      let cloneData = {
        ...this.data.widgets[index],
        key: new Date().getTime()
      }

      if (this.data.widgets[index].type === 'radio' || this.data.widgets[index].type === 'checkbox') {
        cloneData = {
          ...cloneData,
          options: this.data.widgets[index].options.map(item => ({ ...item }))
        }
      }
      this.$nextTick(() => {
        this.data.widgets.splice(index, 0, cloneData)
        this.selectWidget = this.data.widgets[index + 1]
      })
    }
  }
}
</script>
