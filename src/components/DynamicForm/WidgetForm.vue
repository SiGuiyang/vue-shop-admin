<template>
  <div class="widget-form-container">
    <div v-if="data.widgets.length === 0"
         class="form-container">从右侧拖拽来添加表单字段</div>
    <el-form label-position="top">
      <draggable v-model="data.widgets"
                 v-bind="{group:'people', ghostClass: 'ghost',animation: 200, handle: '.drag-widget'}"
                 @add="handleWidgetAdd">
        <transition-group name="fade"
                          tag="div"
                          class="widget-form-list">
          <template v-for="(element, index) in data.widgets">
            <template v-if="element.type === 'grid'">
              <el-row v-if="element && element.key"
                      :key="element.key"
                      :class="{active: selectWidget.key === element.key}"
                      :gutter="element.gutter ? element.gutter : 0"
                      :justify="element.justify"
                      :align="element.align"
                      type="flex"
                      class="widget-col widget-view"
                      @click.native="handleSelectWidget(index)">
                <el-col v-for="(col, colIndex) in element.columns"
                        :key="colIndex"
                        :span="col.span ? col.span : 0">

                  <draggable v-model="col.list"
                             :no-transition-on-drag="true"
                             v-bind="{group:'people', ghostClass: 'ghost',animation: 200, handle: '.drag-widget'}"
                             @add="handleWidgetColAdd($event, element, colIndex)">
                    <transition-group name="fade"
                                      tag="div"
                                      class="widget-col-list">
                      <widget-form-item v-for="(el, i) in col.list"
                                        :key="el.key"
                                        :element="el"
                                        :select.sync="selectWidget"
                                        :index="i"
                                        :data="col" />
                    </transition-group>
                  </draggable>
                </el-col>
                <div v-if="selectWidget.key === element.key"
                     class="widget-view-action">
                  <el-button type="success"
                             size="mini"
                             circle
                             icon="el-icon-setting"
                             @click="drawer = true" />
                  <el-button type="danger"
                             size="mini"
                             circle
                             icon="el-icon-delete"
                             @click.stop="handleWidgetDelete(index)" />
                </div>
              </el-row>
            </template>
            <template v-else>
              <widget-form-item v-if="element && element.key"
                                :key="element.key"
                                :element="element"
                                :select.sync="selectWidget"
                                :index="index"
                                :data="data" />
            </template>
          </template>
        </transition-group>
      </draggable>
    </el-form>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import WidgetFormItem from './WidgetFormItem'

export default {
  name: 'WidgetForm',
  components: {
    Draggable,
    WidgetFormItem
  },
  props: {
    data: {
      type: Object,
      default: () => ({})
    },
    select: {
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
    document.body.ondrop = function (event) {
      const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1
      if (isFirefox) {
        event.preventDefault()
        event.stopPropagation()
      }
    }
    this.scrollHeight = window.innerHeight * 0.9 + 'px'
  },
  methods: {
    handleClose (done) {
      done()
    },
    handleSelectWidget (index) {
      this.selectWidget = this.data.widgets[index]
    },
    handleWidgetAdd (evt) {
      const newIndex = evt.newIndex

      // 为拖拽到容器的元素添加唯一 key
      const key = new Date().getTime()
      this.$set(this.data.widgets, newIndex, {
        ...this.data.widgets[newIndex],
        key,
        // 绑定键值
        field: this.data.widgets[newIndex].type + '_' + key,
        rules: []
      })

      if (this.data.widgets[newIndex].type === 'radio' || this.data.widgets[newIndex].type === 'checkbox' || this.data.widgets[newIndex].type === 'select') {
        this.$set(this.data.widgets, newIndex, {
          ...this.data.widgets[newIndex],
          options: this.data.widgets[newIndex].options.map(item => ({
            ...item
          }))
        })
      }

      if (this.data.widgets[newIndex].type === 'grid') {
        this.$set(this.data.widgets, newIndex, {
          ...this.data.widgets[newIndex],
          columns: this.data.widgets[newIndex].columns.map(item => ({ ...item }))
        })
      }

      this.selectWidget = this.data.widgets[newIndex]
    },
    handleWidgetColAdd ($event, row, colIndex) {
      const newIndex = $event.newIndex
      const oldIndex = $event.oldIndex
      const item = $event.item

      // 防止布局元素的嵌套拖拽
      if (item.className.indexOf('data-grid') >= 0) {
        // 如果是列表中拖拽的元素需要还原到原来位置
        item.tagName === 'DIV' && this.data.widgets.splice(oldIndex, 0, row.columns[colIndex].list[newIndex])

        row.columns[colIndex].list.splice(newIndex, 1)

        return false
      }

      const key = new Date().getTime()

      this.$set(row.columns[colIndex].list, newIndex, {
        ...row.columns[colIndex].list[newIndex],
        options: {
          ...row.columns[colIndex].list[newIndex].options
        },
        key,
        // 绑定键值
        field: row.columns[colIndex].list[newIndex].type + '_' + key,
        validate: []
      })

      if (row.columns[colIndex].list[newIndex].type === 'radio' || row.columns[colIndex].list[newIndex].type === 'checkbox' || row.columns[colIndex].list[newIndex].type === 'select') {
        this.$set(row.columns[colIndex].list, newIndex, {
          ...row.columns[colIndex].list[newIndex],
          options: row.columns[colIndex].list[newIndex].options.map(item => ({
            ...item
          }))
        })
      }

      this.selectWidget = row.columns[colIndex].list[newIndex]
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
    }
  }
}
</script>
