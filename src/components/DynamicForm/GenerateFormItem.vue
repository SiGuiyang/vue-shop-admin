<template>
  <el-form-item :label="widget.name" :prop="widget.model">
    <template v-if="widget.type === 'input'">
      <el-input
        v-if="widget.dataType === 'number' || widget.dataType === 'integer' || widget.dataType === 'float'"
        :type="widget.dataType"
        v-model.number="dataModel"
        :placeholder="widget.placeholder"
        :style="{width: widget.width}"
        :disabled="widget.disabled"
      />
      <el-input
        v-else
        :type="widget.dataType"
        v-model="dataModel"
        :disabled="widget.disabled"
        :placeholder="widget.placeholder"
        :style="{width: widget.width}"
      />
    </template>

    <template v-if="widget.type === 'textarea'">
      <el-input
        v-model="dataModel"
        :rows="5"
        :disabled="widget.disabled"
        :placeholder="widget.placeholder"
        :style="{width: widget.width}"
        type="textarea"
      />
    </template>

    <template v-if="widget.type === 'number'">
      <el-input-number
        v-model="dataModel"
        :style="{width: widget.width}"
        :step="widget.step"
        :disabled="widget.disabled"
        controls-position="right"
      />
    </template>

    <template v-if="widget.type === 'radio'">
      <el-radio-group
        v-model="dataModel"
        :style="{width: widget.width}"
        :disabled="widget.disabled"
      >
        <el-radio
          v-for="(item, index) in widget.options"
          :key="index"
          :label="item.value"
          :style="{display: widget.inline ? 'inline-block' : 'block'}"
        >
          <template v-if="widget.remote">{{ item.label }}</template>
          <template v-else>{{ widget.showLabel ? item.label : item.value }}</template>
        </el-radio>
      </el-radio-group>
    </template>

    <template v-if="widget.type === 'checkbox'">
      <el-checkbox-group
        v-model="dataModel"
        :style="{width: widget.width}"
        :disabled="widget.disabled"
      >
        <el-checkbox
          v-for="(item, index) in widget.options"
          :style="{display: widget.inline ? 'inline-block' : 'block'}"
          :label="item.value"
          :key="index"
        >
          <template>{{ widget.showLabel ? item.label : item.value }}</template>
        </el-checkbox>
      </el-checkbox-group>
    </template>

    <template v-if="widget.type === 'time'">
      <el-time-picker
        v-model="dataModel"
        :is-range="widget.beRange"
        :placeholder="widget.placeholder"
        :start-placeholder="widget.startPlaceholder"
        :end-placeholder="widget.endPlaceholder"
        :readonly="widget.readonly"
        :disabled="widget.disabled"
        :editable="widget.editable"
        :clearable="widget.clearable"
        :arrow-control="widget.arrowControl"
        :value-format="widget.format"
        :style="{width: widget.width}"
      />
    </template>

    <template v-if="widget.type==='date'">
      <el-date-picker
        v-model="dataModel"
        :type="widget.type"
        :placeholder="widget.placeholder"
        :start-placeholder="widget.startPlaceholder"
        :end-placeholder="widget.endPlaceholder"
        :readonly="widget.readonly"
        :disabled="widget.disabled"
        :editable="widget.editable"
        :clearable="widget.clearable"
        :value-format="widget.timestamp ? 'timestamp' : widget.format"
        :format="widget.format"
        :style="{width: widget.width}"
      />
    </template>

    <template v-if="widget.type ==='rate'">
      <el-rate
        v-model="dataModel"
        :max="widget.max"
        :disabled="widget.disabled"
        :allow-half="widget.allowHalf"
      />
    </template>

    <template v-if="widget.type === 'color'">
      <el-color-picker
        v-model="dataModel"
        :disabled="widget.disabled"
        :show-alpha="widget.showAlpha"
      />
    </template>

    <template v-if="widget.type === 'select'">
      <el-select
        v-model="dataModel"
        :disabled="widget.disabled"
        :multiple="widget.multiple"
        :clearable="widget.clearable"
        :placeholder="widget.placeholder"
        :style="{width: widget.width}"
        :filterable="widget.filterable"
      >
        <el-option
          v-for="item in widget.options"
          :key="item.value"
          :value="item.value"
          :label="widget.showLabel ? item.label : item.value"
        />
      </el-select>
    </template>

    <template v-if="widget.type==='switch'">
      <el-switch
        v-model="dataModel"
        :disabled="widget.disabled"
      />
    </template>

    <template v-if="widget.type==='slider'">
      <el-slider
        v-model="dataModel"
        :min="widget.min"
        :max="widget.max"
        :disabled="widget.disabled"
        :step="widget.step"
        :show-input="widget.showInput"
        :range="widget.beRange"
        :style="{width: widget.width}"
      />
    </template>

    <template v-if="widget.type==='imgupload'">
      <fm-upload
        v-model="dataModel"
        :disabled="widget.disabled"
        :style="{'width': widget.width}"
        :width="widget.size.width"
        :height="widget.size.height"
        :token="widget.token"
        :domain="widget.domain"
        :multiple="widget.multiple"
        :length="widget.length"
        :is-qiniu="widget.isQiniu"
        :is-delete="widget.isDelete"
        :min="widget.min"
        :is-edit="widget.isEdit"
        :action="widget.action"
      />
    </template>

    <template v-if="widget.type === 'editor'">
      <vue-editor
        v-model="dataModel"
        :style="{width: widget.width}"
      />
    </template>

    <template v-if="widget.type === 'cascader'">
      <el-cascader
        v-model="dataModel"
        :disabled="widget.disabled"
        :clearable="widget.clearable"
        :placeholder="widget.placeholder"
        :style="{width: widget.width}"
        :options="widget.remoteOptions"
      />
    </template>

    <template v-if="widget.type === 'text'">
      <span>{{ dataModel }}</span>
    </template>
  </el-form-item>
</template>

<script>
import FmUpload from './Upload'
import { VueEditor } from 'vue2-editor'
import { getDynamicData } from '@/components/DynamicForm/api/dynamicForm'

export default {
  name: 'GenerateFormItem',
  components: {
    FmUpload,
    VueEditor
  },
  props: {
    widget: {
      type: Object,
      default: () => ({})
    },
    models: {
      type: Object,
      default: () => ({})
    },
    rules: {
      type: Object,
      default: () => ({})
    },
    remote: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      dataModel: this.models[this.widget.model]
    }
  },
  watch: {
    dataModel: {
      deep: true,
      handler(val) {
        this.models[this.widget.model] = val
        this.$emit('update:models', {
          ...this.models,
          [this.widget.model]: val
        })
        this.$emit('input-change', val, this.widget.model)
      }
    },
    models: {
      deep: true,
      handler(val) {
        this.dataModel = val[this.widget.model]
      }
    }
  },
  created() {
    console.log(this.widget)
    if (this.widget.remoteUrl) {
      this.handleInit()
    }
  },
  methods: {
    handleInit() {
      const remoteUrl = this.widget.remoteUrl
      if (remoteUrl) {
        const requestUrl = remoteUrl.split('?')[0]
        const params = {
          code: remoteUrl.split('=')[1]
        }
        getDynamicData(requestUrl, params).then(resp => {
          this.widget.options = resp.data
        })
      }
    }
  }
}
</script>
