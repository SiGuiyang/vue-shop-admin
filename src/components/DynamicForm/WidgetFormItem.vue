<template>
  <el-form-item v-if="element && element.key"
                :class="{active: selectWidget.key === element.key, 'is_req': element.required}"
                :label="element.name"
                class="widget-view "
                @click.native.stop="handleSelectWidget(index)">
    <template v-if="element.type === 'input'">
      <el-input v-model="element.defaultValue"
                :style="{width: element.width}"
                :placeholder="element.placeholder"
                :disabled="element.disabled" />
    </template>

    <template v-if="element.type === 'textarea'">
      <el-input v-model="element.defaultValue"
                :rows="5"
                :style="{width: element.width}"
                :disabled="element.disabled"
                :placeholder="element.placeholder"
                type="textarea" />
    </template>

    <template v-if="element.type === 'number'">
      <el-input-number v-model="element.defaultValue"
                       :disabled="element.disabled"
                       :controls-position="element.controlsPosition"
                       :style="{width: element.width}" />
    </template>

    <template v-if="element.type === 'radio'">
      <el-radio-group v-model="element.defaultValue"
                      :style="{width: element.width}"
                      :disabled="element.disabled">
        <el-radio v-for="(item) in element.options"
                  :key="item.value"
                  :style="{display: element.inline ? 'inline-block' : 'block'}"
                  :label="item.value">
          {{ element.showLabel ? item.label : item.value }}
        </el-radio>
      </el-radio-group>
    </template>

    <template v-if="element.type === 'checkbox'">
      <el-checkbox-group v-model="element.defaultValue"
                         :style="{width: element.width}"
                         :disabled="element.disabled">
        <el-checkbox v-for="(item) in element.options"
                     :key="item.value"
                     :style="{display: element.inline ? 'inline-block' : 'block'}"
                     :label="item.value">
          {{ element.showLabel ? item.label : item.value }}
        </el-checkbox>
      </el-checkbox-group>
    </template>

    <template v-if="element.type === 'time'">
      <el-time-picker v-model="element.defaultValue"
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

    <template v-if="element.type === 'date'">
      <el-date-picker v-model="element.defaultValue"
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

    <template v-if="element.type === 'rate'">
      <el-rate v-model="element.defaultValue"
               :max="element.max"
               :disabled="element.disabled"
               :allow-half="element.allowHalf" />
    </template>

    <template v-if="element.type === 'color'">
      <el-color-picker v-model="element.defaultValue"
                       :disabled="element.disabled"
                       :show-alpha="element.showAlpha" />
    </template>

    <template v-if="element.type === 'select'">
      <el-select v-model="element.defaultValue"
                 :disabled="element.disabled"
                 :multiple="element.multiple"
                 :clearable="element.clearable"
                 :placeholder="element.placeholder"
                 :style="{width: element.width}">
        <el-option v-for="item in element.options"
                   :key="item.value"
                   :value="item.value"
                   :label="element.showLabel?item.label:item.value" />
      </el-select>
    </template>

    <template v-if="element.type === 'switch'">
      <el-switch v-model="element.defaultValue"
                 :disabled="element.disabled" />
    </template>

    <template v-if="element.type === 'slider'">
      <el-slider v-model="element.defaultValue"
                 :min="element.min"
                 :max="element.max"
                 :disabled="element.disabled"
                 :step="element.step"
                 :show-input="element.showInput"
                 :range="element.beRange"
                 :style="{width: element.width}" />
    </template>

    <template v-if="element.type === 'imgupload'">
      <fm-upload v-model="element.defaultValue"
                 :disabled="element.disabled"
                 :style="{'width': element.width}"
                 :width="element.size.width"
                 :height="element.size.height"
                 token="xxx"
                 domain="xxx" />
    </template>

    <template v-if="element.type === 'cascader'">
      <el-cascader v-model="element.defaultValue"
                   :disabled="element.disabled"
                   :clearable="element.clearable"
                   :placeholder="element.placeholder"
                   :style="{width: element.width}"
                   :options="element.options" />
    </template>

    <template v-if="element.type === 'editor'">
      <vue-editor v-model="element.defaultValue"
                  :style="{width: element.width}" />
    </template>

    <template v-if="element.type === 'text'">
      <span>{{ element.defaultValue }}</span>
    </template>

    <div v-if="selectWidget.key === element.key"
         class="widget-view-action">
      <el-button type="success"
                 size="mini"
                 circle
                 icon="el-icon-setting"
                 @click="drawer = true" />
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
    <el-drawer :visible.sync="drawer"
               :direction="direction"
               :before-close="handleClose"
               title="字段属性">
      <el-scrollbar :style="{height: scrollHeight}"
                    wrap-class="scrollbar-wrap"
                    class="widget-form-scrollbar">
        <widget-config :data="selectWidget" />
      </el-scrollbar>
    </el-drawer>
  </el-form-item>
</template>

<script>
import FmUpload from './Upload'
import WidgetConfig from './WidgetConfig'
import { VueEditor } from 'vue2-editor'

export default {
  name: 'WidgetFormItem',
  components: {
    FmUpload,
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
      drawer: false,
      direction: 'rtl',
      scrollHeight: '0px'
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
  mounted () {
    this.scrollHeight = window.innerHeight * 0.9 + 'px'
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

<style scoped>
.widget-form-scrollbar {
  height: 100%;
}
</style>
