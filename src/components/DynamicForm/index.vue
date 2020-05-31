<template>
  <el-container>
    <el-container class="center-container"
                  direction="vertical">
      <el-header class="container-bar">
        <slot name="action" />
        <el-button type="danger"
                   size="mini"
                   icon="el-icon-delete"
                   @click="handleClear">清空
        </el-button>
        <el-button type="primary"
                   size="mini"
                   icon="el-icon-view"
                   @click="handleGenerateJson">JSON预览
        </el-button>
        <el-button type="success"
                   size="mini"
                   @click="handleSubmit()">提交</el-button>
      </el-header>
      <el-main :class="{'widget-empty': widgetForm.widgets.length === 0}">
        <widget-form v-if="!resetJson"
                     ref="widgetForm"
                     :data="widgetForm"
                     :select.sync="widgetFormSelect" />
      </el-main>
    </el-container>
    <el-aside class="side">
      <div class="components-list">
        <template v-if="basicComponents.length">
          <div class="widget-cate">基础组件</div>
          <draggable :list="basicComponents"
                     :move="handleMove"
                     v-bind="{group:{ name:'people', pull:'clone',put:false},sort:false, ghostClass: 'ghost'}"
                     tag="div">

            <el-col v-for="(item, index) in basicComponents"
                    :key="index"
                    :class="{'no-put': item.type === 'divider'}"
                    class="form-edit-widget-label">
              <a>
                <span>{{ item.title }}</span>
              </a>
            </el-col>
          </draggable>
        </template>

        <template v-if="advanceComponents.length">
          <div class="widget-cate">高级字段</div>
          <draggable v-bind="{group:{ name:'people', pull:'clone',put:false},sort:false, ghostClass: 'ghost'}"
                     :list="advanceComponents"
                     :move="handleMove"
                     tag="ul">

            <li v-for="(item, index) in advanceComponents"
                :key="index"
                :class="{'no-put': item.type === 'table'}"
                class="form-edit-widget-label">
              <a>
                <span>{{ item.title }}</span>
              </a>
            </li>
          </draggable>
        </template>

        <template v-if="layoutComponents.length">
          <div class="widget-cate">布局字段</div>
          <draggable v-bind="{group:{ name:'people', pull:'clone',put:false},sort:false, ghostClass: 'ghost'}"
                     :list="layoutComponents"
                     :move="handleMove"
                     tag="ul">

            <li v-for="(item, index) in layoutComponents"
                :key="index"
                class="form-edit-widget-label no-put">
              <a>
                <span>{{ item.title }}</span>
              </a>
            </li>
          </draggable>
        </template>
      </div>
    </el-aside>
    <el-dialog :title="jsonTitle"
               :visible.sync="jsonVisible"
               :close-on-click-modal="false"
               width="60%"
               append-to-body
               center>
      <json-editor v-model="jsonTemplate"></json-editor>
    </el-dialog>
  </el-container>

</template>

<script>
import Draggable from 'vuedraggable'
import WidgetForm from './WidgetForm'
import jsonEditor from '@/components/JsonEditor'
import { basicComponents, layoutComponents, advanceComponents } from './widgets.js'
import './styles/cover.scss'
import './styles/index.scss'
export default {
  name: 'DynamicForm',
  components: {
    Draggable,
    WidgetForm,
    jsonEditor
  },
  props: {
    generateJson: {
      type: Boolean,
      default: false
    },
    upload: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      basicComponents,
      layoutComponents,
      advanceComponents,
      resetJson: false,
      widgetForm: {
        widgets: []
      },
      widgetFormSelect: null,
      previewVisible: false,
      previewTitle: '预览',
      jsonVisible: false,
      jsonTitle: 'JSON预览',
      codeVisible: false,
      widgetModels: {},
      jsonTemplate: '',
      jsonCopyValue: '',
      jsonEg: `{
        "widgets": []
        }`
    }
  },
  methods: {
    handleMove () {
      return true
    },
    handleGenerateJson () {
      this.jsonVisible = true
      this.jsonTemplate = this.widgetForm
      this.$nextTick(() => {
        this.jsonCopyValue = JSON.stringify(this.widgetForm)
      })
    },
    handleClear () {
      this.widgetForm = {
        widgets: []
      }

      this.widgetFormSelect = {}
    },
    handleSubmit () {
      this.$emit('dynamicFormData', JSON.stringify(this.widgetForm))
    }
  }
}
</script>

<style lang="scss">
.widget-empty {
  background-position: 50%;
}

.container-bar {
  padding: 20px;
  height: 43px;
}
</style>
