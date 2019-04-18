<template>
  <div v-click-out-side="handleCloseTree" ref="atsTree" class="ats-tree">
    <div class="ats-input" @mouseenter="hovering=true" @mouseleave="hovering=false">
      <div v-if="!multiple" class="ats-input-single">
        <i
          :class="{'is-reverse':treeVisible,'el-icon-circle-close':showCloseIcon}"
          class="el-input__icon el-icon-caret-bottom"
          @click="handleCloseTree(!treeVisible)"/>
        <input
          v-model="treeSelected"
          :placeholder="placetext"
          type="text"
          class="el-input__inner"
          @input="handleFilter"
          @focus="treeVisible=true"
          @blur="handleAutoComplete">
      </div>

      <div v-if="multiple" class="ats-input-multiple el-input__inner">
        <i
          :class="{'is-reverse':treeVisible}"
          class="el-input__icon el-icon-caret-bottom"
          @click="handleCloseTree(!treeVisible)"/>
        <div class="ats-labels">
          <div class="el-select__tags" @click.prevent="handleCloseTree(true)">
            <el-tag
              v-for="item in checkedItems"
              :key="item.id"
              :closable="true"
              :title="handleTitleVisible(item[treeProps.label])"
              type="primary"
              class="el-tag--primary"
              @close="handleDelItem(item,$event)">
              {{ item[treeProps.label] | showEllips }}
            </el-tag>
          </div>
          <input
            ref="multipleInput"
            :placeholder="placetext"
            v-model="treeSelected"
            type="text"
            @input="handleFilter"
            @focus="treeVisible=true"
            @blur="handleAutoComplete">
        </div>
      </div>
    </div>
    <el-scrollbar v-show="treeVisible" ref="treeScrollbar" class="ats-tree-scrollbar">
      <div class="ats-tree-wrapper">
        <ul class="ats-tree-nodes">
          <tree-node
            v-for="child in treeNodes[treeProps.children]"
            :node="child"
            :key="child.id"
            :multiple="multiple"
            :current-node-id="currentNodeId"
            :tree-props="treeProps"
            :event-hub="eventHub"
            :query="query"
            :is-quering="isQuering"/>
        </ul>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import Vue from 'vue'
import { Tag, Scrollbar } from 'element-ui'
import treeNode from './treeNode'
import ClickOutSide from './clickOutSide'
import debounce from 'throttle-debounce/throttle'
import { objArrDeepCopy } from './tools'

Vue.component(Scrollbar.name, Scrollbar)
Vue.component(Tag.name, Tag)
export default {
  name: 'Tree',
  components: {
    treeNode
  },
  directives: { ClickOutSide },
  filters: {
    // 截取前18个字节
    showEllips(str) {
      if (!str) return ''
      let tempLen = 0
      for (let i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 255) {
          tempLen += 2
        } else {
          tempLen += 1
        }
        if (tempLen >= 15) {
          str = str.substring(0, i) + '...'
          break
        }
      }
      return str
    }
  },
  props: {
    treeData: {
      type: Array,
      default: () => ([])
    },
    treeProps: {
      type: Object,
      default: () => ({
        label: 'label',
        children: 'children'
      })
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    multiple: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      treeNodes: {
        [this.treeProps.children]: objArrDeepCopy(this.treeData, { visible: true }),
        visible: true
      },
      placetext: this.placeholder,
      currentNodeId: 0,
      currentSelected: 0,
      treeSelected: '',
      treeVisible: false,
      eventHub: new Vue(),
      isQuering: false,
      query: '',
      checkedItems: [],
      checkedKeys: [],
      isDefault: true,
      error: {
        message: '',
        data: ''
      },
      hovering: false
    }
  },
  computed: {
    showCloseIcon() {
      return this.hovering && this.value !== undefined && this.value !== '' && !this.multiple
    }
  },
  watch: {
    value(val) {
      if (this.isDefault) {
        this.setDefaultValue()
      }
    },
    treeData(val) {
      if (val) {
        this.treeNodes = {
          [this.treeProps.children]: objArrDeepCopy(val, { visible: true }),
          visible: true
        }
        if (this.isDefault) {
          this.setDefaultValue()
        }
      }
    },
    checkedKeys(val) {
      if (val.length) {
        this.placetext = ''
      } else {
        this.placetext = this.placeholder
      }
      if (this.multiple) {
        setTimeout(function() {
          this.resetTreeTop()
        }.bind(this), 400)
        if (!this.isDefault) {
          this.setInputFocus()
        }
      }
    }
  },
  created() {
    this.eventHub.$on('node-click', this.handleNodeClick)
  },
  updated() {
    this.isDefault = true
  },
  methods: {
    resetValue() {
      if (this.multiple) {
        this.checkedItems = []
        this.checkedKeys = []
        this.$emit('setSelectedId', [])
      } else {
        this.treeSelected = ''
        this.currentNodeId = ''
        this.$emit('setSelectedId', '')
      }
    },
    handleCloseTree(val) {
      if (this.showCloseIcon) {
        this.resetValue()
      } else {
        if (val === undefined) {
          this.treeVisible = false
        } else {
          this.treeVisible = val
        }
        if (this.multiple) {
          this.treeSelected = ''
          this.handleFilter()
          if (val) {
            this.setInputFocus()
          }
        }
      }
    },
    handleNodeClick(node, event) {
      if (event) {
        this.isDefault = false
      }
      if (this.multiple) {
        if (!this.hasSameItem(this.checkedItems, node)) {
          this.handleAddItem(node)
          this.$emit('setSelectedId', this.checkedKeys)
        } else {
          this.handleDelItem(node, event)
        }
      } else {
        this.currentNodeId = node.id
        this.treeSelected = node[this.treeProps.label]
        this.currentSelected = this.treeSelected
        this.$emit('setSelectedId', node.id)
      }
    },
    setDefaultValue() {
      if (!this.multiple) {
        this.setSelected(this.value)
      } else {
        this.setCheckedKeys(this.value)
      }
    },
    // 单选设置初始值
    setSelected(val) {
      const self = this
      const treeNodes = self.treeNodes
      self.resetValue()
      self.findTreeItem(val, treeNodes)
      if (!this.currentNodeId) {
        this.setErrorMessage(val)
      }
    },
    // 多选设置初始值
    setCheckedKeys(val) {
      const self = this
      const treeNodes = this.treeNodes
      this.resetValue()
      val.forEach(function(id) {
        self.findTreeItem(id, treeNodes)
      })
      this.getNotExistedItem(val, this.checkedKeys)
    },
    findTreeItem(id, treeNodes) {
      const self = this
      const childNodes = treeNodes[self.treeProps.children]
      for (let i = 0; i < childNodes.length; i++) {
        if (childNodes[i].id === id) {
          if (self.multiple) {
            self.handleAddItem(childNodes[i])
          } else {
            self.handleNodeClick(childNodes[i])
          }
          break
        } else {
          self.findTreeItem(id, childNodes[i])
        }
      }
    },
    handleFilter: debounce(1000, function() {
      this.isQuering = true
      if (this.isQuering) {
        this.query = this.treeSelected
        this.treeFilterMethod(this.treeNodes)
      }
    }),
    treeFilterMethod(node) {
      const self = this
      const childNodes = node[self.treeProps.children]
      childNodes.forEach((child) => {
        child.visible = child[self.treeProps.label].toLowerCase().indexOf(self.query.toLowerCase()) > -1
        self.treeFilterMethod(child)
      })
      if (!node.visible && childNodes.length) {
        let allHidden = true
        childNodes.forEach((child) => {
          if (child.visible) allHidden = false
        })
        node.visible = allHidden === false
      }
      if (node.visible) {
        this.$set(node, 'expanded', true)
        if (self.query === '') {
          node.expanded = false
        }
      }
    },
    handleAutoComplete() {
      setTimeout(function() {
        this.query = ''
        if (this.currentNodeId) {
          this.treeSelected = this.currentSelected
        } else if (!this.multiple) {
          this.treeSelected = ''
          this.handleFilter()
        }
        if (this.isQuery) {
          this.treeVisible = false
        }
        this.isQuery = false
      }.bind(this), 250)
    },
    handleAddItem(item) {
      this.checkedItems.push(item)
      this.checkedKeys.push(item.id)
      this.$set(item, 'checked', true)
    },
    handleDelItem(item, event) {
      if (event) {
        this.isDefault = false
      }
      this.checkedKeys.splice(this.checkedKeys.indexOf(item.id), 1)
      this.checkedItems.splice(this.checkedItems.indexOf(item), 1)
      this.$set(item, 'checked', false)
      this.$emit('setSelectedId', this.checkedKeys)
    },
    hasSameItem(obj, item) {
      return obj.indexOf(item) > -1
    },
    getNotExistedItem(all, part) {
      const notExisted = []
      all.forEach((item) => {
        if (!(part.indexOf(item) > -1)) {
          notExisted.push(item)
        }
      })
      this.setErrorMessage(notExisted)
    },
    setErrorMessage(data) {
      if (!data || !data.toString()) return
      const errorText = (data instanceof Array) ? data.toString() : data
      this.error.message = '发现不存在的部门id:' + errorText
      this.error.data = data
      this.$emit('errorCallback', this.error)
    },
    resetTreeTop() {
      this.$nextTick(function() {
        const inputMultiple = this.$refs.atsTree.querySelector('.ats-input-multiple')
        const treeScrollbar = this.$refs.atsTree.querySelector('.ats-tree-scrollbar')
        const inputMultipleHeight = inputMultiple.offsetHeight
        treeScrollbar.style.top = (inputMultipleHeight + 5) + 'px'
      })
    },
    setInputFocus() {
      const multipleInput = this.$refs.multipleInput
      multipleInput.focus()
    },
    handleTitleVisible(str) {
      if (!str) return ''
      let tempLen = 0
      for (let i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 255) {
          tempLen += 2
        } else {
          tempLen += 1
        }
      }
      if (tempLen >= 15) {
        return str
      } else {
        return ''
      }
    }
  }
}
</script>

<style lang="scss">
  .ats-tree {
    display: inline-block;
    position: relative;

    .ats-input {
      position: relative;

      .el-icon-caret-bottom {
        cursor: pointer;

        &.is-reverse {
          transform: rotateZ(180deg);
        }
      }
    }

    .el-input__inner {
      width: 360px;
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      background-color: #fff;
      background-image: none;
      border-radius: 4px;
      border: 1px solid rgb(191, 204, 217);
      box-sizing: border-box;
      color: rgb(31, 46, 61);
      display: block;
      font-size: inherit;
      height: 36px;
      line-height: 1;
      outline: 0;
      padding: 3px 10px;
      transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
    }

    .ats-input-multiple {
      height: auto;
    }

    .ats-input-multiple input {
      line-height: 1;
      height: 28px;
      box-sizing: border-box;
      outline: none;
      border: 0px;
      position: relative;
      right: 35px;
      left: 0;
      width: 320px;
    }

    .ats-input-multiple .el-select__tags {
      position: relative;
      height: auto;
      top: auto;
      transform: none;
      width: 320px;

      &:hover {
        cursor: pointer;
      }
    }

    .ats-input-multiple .el-select__tags .el-tag {
      margin: 5px;
      max-width: 150px;
      overflow: hidden;
      text-overflow: ellipsis;
      vertical-align: top;
    }

    .ats-input-multiple input:focus {
      outline: none;
    }

    .ats-tree-scrollbar {
      top: 40px;
      min-width: 360px;
      min-height: 300px;
      position: absolute;
      z-index: 1001;
      background: #fff;
      border: 1px solid #d1dbe5;

      .el-scrollbar__view {
        height: 500px;
      }

      transition: all 0.1s linear;
    }

    .ats-tree-wrapper {
      background-color: #fff;
    }
    .ats-tree{
      vertical-align: top;
      margin-left: 300px;
    }
    li{
      list-style: none
    }
  }
</style>
