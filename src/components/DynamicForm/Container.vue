<template>
  <el-container>
    <el-aside class="side-left">
      <div class="components-list">
        <template v-if="basicComponents.length">
          <div class="widget-cate">基础组件</div>
          <draggable
            :list="basicComponents"
            :move="handleMove"
            v-bind="{group:{ name:'people', pull:'clone',put:false},sort:false, ghostClass: 'ghost'}"
            tag="div"
          >

            <el-col
              v-for="(item, index) in basicComponents"
              :key="index"
              :class="{'no-put': item.type === 'divider'}"
              class="form-edit-widget-label"
            >
              <a>
                <span>{{ item.name }}</span>
              </a>
            </el-col>
          </draggable>
        </template>

        <template v-if="advanceComponents.length">
          <div class="widget-cate">高级字段</div>
          <draggable
            v-bind="{group:{ name:'people', pull:'clone',put:false},sort:false, ghostClass: 'ghost'}"
            :list="advanceComponents"
            :move="handleMove"
            tag="ul"
          >

            <li
              v-for="(item, index) in advanceComponents"
              :key="index"
              :class="{'no-put': item.type === 'table'}"
              class="form-edit-widget-label"
            >
              <a>
                <span>{{ item.name }}</span>
              </a>
            </li>
          </draggable>
        </template>

        <template v-if="layoutComponents.length">
          <div class="widget-cate">布局字段</div>
          <draggable
            v-bind="{group:{ name:'people', pull:'clone',put:false},sort:false, ghostClass: 'ghost'}"
            :list="layoutComponents"
            :move="handleMove"
            tag="ul"
          >

            <li
              v-for="(item, index) in layoutComponents"
              :key="index"
              class="form-edit-widget-label no-put"
            >
              <a>
                <span>{{ item.name }}</span>
              </a>
            </li>
          </draggable>
        </template>
      </div>
    </el-aside>
    <el-container class="center-container" direction="vertical">
      <el-header class="container-bar">
        <slot name="action"/>
        <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleClear">清空
        </el-button>
        <el-button type="success" size="mini" icon="el-icon-view" @click="handlePreview">预览
        </el-button>
        <el-button type="primary" size="mini" icon="el-icon-view" @click="handleGenerateJson">JSON预览
        </el-button>
        <el-button size="mini" icon="el-icon-view" @click="drawer = true">表单属性
        </el-button>
      </el-header>
      <el-main :class="{'widget-empty': widgetForm.widgets.length === 0}">
        <widget-form
          v-if="!resetJson"
          ref="widgetForm"
          :data="widgetForm"
          :select.sync="widgetFormSelect"/>
      </el-main>
    </el-container>
    <p-dialog
      ref="jsonPreview"
      :visible="jsonVisible"
      :title="jsonTitle"
      width="800px"
      form
      @on-close="jsonVisible = false">
      <div id="jsonEditor" style="height: 400px;width: 100%;">{{ jsonTemplate }}</div>

      <template slot="action">
        <el-button :data-clipboard-text="jsonCopyValue" type="success" class="json-btn" @click="handleSubmit">提 交</el-button>
      </template>
    </p-dialog>
    <p-dialog
      ref="widgetPreview"
      :visible="previewVisible"
      :title="previewTitle"
      width="1000px"
      form
      @on-close="previewVisible = false">
      <generate-form
        v-if="previewVisible"
        ref="generateForm"
        :data="widgetForm"
        :value="widgetModels"
        insite="true"/>
      <template slot="action">
        <el-button type="primary" @click="handleData">获取数据</el-button>
        <el-button @click="handleReset">重置</el-button>
      </template>
    </p-dialog>
    <el-drawer
      :visible.sync="drawer"
      :direction="direction"
      :before-close="handleClose"
      title="表单属性">
      <el-container>
        <el-main>
          <form-config :data="widgetForm.config"/>
        </el-main>
      </el-container>
    </el-drawer>
  </el-container>

</template>

<script>
import Draggable from 'vuedraggable'
import WidgetConfig from './WidgetConfig'
import FormConfig from './FormConfig'
import WidgetForm from './WidgetForm'
import PDialog from './PDialog'
import GenerateForm from './GenerateForm'
import { basicComponents, layoutComponents, advanceComponents } from './widgets.js'
import { postDynamicData } from '@/components/DynamicForm/api/dynamicForm'
export default {
  name: 'DynamicForm',
  components: {
    Draggable,
    WidgetConfig,
    FormConfig,
    WidgetForm,
    PDialog,
    GenerateForm
  },
  props: {
    preview: {
      type: Boolean,
      default: false
    },
    generateCode: {
      type: Boolean,
      default: false
    },
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
  data() {
    return {
      basicComponents,
      layoutComponents,
      advanceComponents,
      resetJson: false,
      widgetForm: {
        widgets: [],
        config: {
          labelWidth: 100,
          labelPosition: 'right',
          size: 'small'
        }
      },
      drawer: false,
      direction: 'rtl',
      widgetFormSelect: null,
      previewVisible: false,
      previewTitle: '预览',
      jsonVisible: false,
      jsonTitle: 'JSON预览',
      codeVisible: false,
      widgetModels: {},
      jsonTemplate: '',
      jsonCopyValue: '',
      jsonClipboard: null,
      jsonEg: `{
        "widgets": [],
        "config": {
          "labelWidth": 100,
          "labelPosition": "top",
          "size": "small"
        }
        }`
    }
  },
  methods: {
    handleClose(done) {
      done()
    },
    handleMove() {
      return true
    },
    handlePreview() {
      this.previewVisible = true
    },
    handleData() {
      this.$refs.generateForm.getData().then(data => {
        this.$alert(data, '').catch(e => {
        })
        this.$refs.widgetPreview.end()
      }).catch(e => {
        this.$refs.widgetPreview.end()
      })
    },
    handleReset() {
      this.$refs.generateForm.reset()
    },
    handleGenerateJson() {
      this.jsonVisible = true
      this.jsonTemplate = this.widgetForm
      this.$nextTick(() => {
        /* global ace */
        const editor = ace.edit('jsonEditor')
        editor.session.setMode('ace/mode/json')
        this.jsonCopyValue = JSON.stringify(this.widgetForm)
      })
    },
    handleClear() {
      this.widgetForm = {
        widgets: [],
        config: {
          labelWidth: 100,
          labelPosition: 'right',
          size: 'small',
          customClass: ''
        }
      }

      this.widgetFormSelect = {}
    },
    handleSubmit() {
      this.jsonCopyValue = JSON.stringify(this.widgetForm)
      this.$prompt('请输入业务编码', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        const params = {
          bizType: value,
          widgets: this.widgetForm.widgets
        }
        postDynamicData(params).then(resp => {
          this.$message({
            type: 'success',
            message: '提交成功'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        })
      })
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
