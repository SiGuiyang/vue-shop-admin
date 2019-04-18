<template>
  <li :class="{'is-expanded':node.expanded}" class="ats-tree-node" @click.stop="handleClick(node,$event)">
    <div v-show="node.visible" :style="{ 'padding-left': (node[treeProps.level] - 1) * 16 + 'px' }" :class="{'is-current':currentNodeId===node.id,'is-checked':node.checked}" class="ats-tree-node__content">
      <div class="ats-tree-node__icon icon">
        <span
          v-if="node[treeProps.children]&&node[treeProps.children].length"
          :class="{ expanded: node.expanded }"
          class="ats-tree-node__expand-icon icon"/>
      </div>
      <span
        :title="handleTitleVisible(node[treeProps.label])"
        class="ats-tree-node__label">{{ node[treeProps.label] }}</span>
    </div>
    <ul v-if="node.expanded" class="ats-tree-node__children">
      <tree-node
        v-for="child in node[treeProps.children]"
        :node="child"
        :key="child.id"
        :tree-props="treeProps"
        :current-node-id="currentNodeId"
        :event-hub="eventHub"
        :query="query"
        :is-quering="isQuering"/>
    </ul>
  </li>
</template>

<script>
export default {
  name: 'TreeNode',
  props: {
    node: {
      type: Object,
      default: () => ({})
    },
    treeProps: {
      type: Object,
      default: () => ({
        label: 'label',
        children: 'children'
      })
    },
    multiple: {
      type: Boolean,
      default: false
    },
    currentNodeId: {
      type: Number,
      default: 0
    },
    eventHub: {
      type: Object,
      default: () => ({})
    },
    query: {
      type: String,
      default: ''
    },
    isQuering: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  methods: {
    handleClick(node, event) {
      const targetClass = event.target.getAttribute('class')
      if (node.expanded) {
        this.$set(node, 'expanded', false)
      } else {
        this.$set(node, 'expanded', true)
      }
      if (!(targetClass.indexOf('icon') > -1)) {
        this.eventHub.$emit('node-click', node, event)
      }
    },
    handleTitleVisible(title) {
      const titleLen = title.replace(/[^\x00-\xff]/g, '..').length
      if (titleLen > 28) {
        return title
      } else {
        return ''
      }
    }
  }
}
</script>

<style lang="scss">
  .ats-tree-node {
    .ats-tree-node__content {
      text-indent: 5px;
      line-height: 36px;
      height: 36px;
      cursor: pointer;
      white-space: nowrap;

      &:hover {
        background: rgb(228, 232, 241);
      }

      &.is-current {
        background-color: rgb(4, 137, 224);
        color: #fff;
      }

      .ats-tree-node__icon {
        display: inline-block;
        width: 22px;
        height: 36px;
        vertical-align: top;
      }

      .ats-tree-node__expand-icon {
        display: inline-block;
        vertical-align: middle;
        cursor: pointer;
        width: 0;
        height: 0;
        margin-left: 10px;
        border: 6px solid transparent;
        border-right-width: 0;
        border-left-color: rgb(151, 169, 190);
        border-left-width: 7px;
        transform: rotate(0);
        transition: transform .3s ease-in-out;

        &.expanded {
          transform: rotate(90deg);
        }
      }

      .ats-tree-node__label {
        max-width: 230px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: inline-block;
      }
    }

    .ats-tree-node__content.is-checked .ats-tree-node__label {
      &::after {
        color: #20a0ff;
        content: "\E608";
        font-family: element-icons;
        right: 10px;
        font-size: 11px;
        position: absolute;
        -webkit-font-smoothing: antialiased;
      }
    }
  }
</style>
