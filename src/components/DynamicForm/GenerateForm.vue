<template>
  <div>
    <el-form
      ref="generateForm"
      :size="data.config.size"
      :model="models"
      :rules="rules"
      :label-position="data.config.labelPosition"
      :label-width="data.config.labelWidth + 'px'"
      label-suffix=":"
    >
      <template v-for="item in data.widgets">
        <template v-if="item.type === 'grid'">
          <el-row
            :key="item.key"
            :gutter="item.gutter ? item.gutter : 0"
            :justify="item.justify"
            :align="item.align"
            type="flex"
          >
            <el-col v-for="(col, colIndex) in item.columns" :key="colIndex" :span="col.span">
              <template v-for="citem in col.list">
                <generate-form-item
                  :key="citem.key"
                  :models.sync="models"
                  :remote="remote"
                  :rules="rules"
                  :widget="citem"
                  @input-change="onInputChange"
                />
              </template>
            </el-col>
          </el-row>
        </template>
        <template v-else>
          <generate-form-item
            :key="item.key"
            :models.sync="models"
            :rules="rules"
            :widget="item"
            :remote="remote"
            @input-change="onInputChange"
          />
        </template>
      </template>
    </el-form>
  </div>
</template>

<script>
import GenerateFormItem from './GenerateFormItem'

export default {
  name: 'GenerateForm',
  components: {
    GenerateFormItem
  },
  props: {
    data: {
      type: Object,
      default: () => ({})
    },
    remote: {
      type: Object,
      default: () => ({})
    },
    value: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      models: {},
      rules: {}
    }
  },
  watch: {
    data: {
      deep: true,
      handler(val) {
        this.generateModel(val.list)
      }
    },
    value: {
      deep: true,
      handler(val) {
        this.models = { ...this.models, ...val }
      }
    }
  },
  created() {
    this.generateModel(this.data.widgets)
  },
  methods: {
    generateModel(genList) {
      for (let i = 0; i < genList.length; i++) {
        if (genList[i].type === 'grid') {
          genList[i].columns.forEach(item => {
            this.generateModel(item.list)
          })
        } else {
          if (this.value && Object.keys(this.value).indexOf(genList[i].model) >= 0) {
            this.models[genList[i].model] = this.value[genList[i].model]
          } else {
            this.models[genList[i].model] = genList[i].defaultValue
          }

          if (this.rules[genList[i].model]) {
            this.rules[genList[i].model] = [...this.rules[genList[i].model], ...genList[i].rules.map(item => {
              if (item.pattern) {
                return { ...item, pattern: this.eval(item.pattern) }
              } else {
                return { ...item }
              }
            })]
          } else {
            this.rules[genList[i].model] = [...genList[i].rules.map(item => {
              if (item.pattern) {
                return { ...item, pattern: this.eval(item.pattern) }
              } else {
                return { ...item }
              }
            })]
          }
        }
      }
    },
    evil(fn) {
      const Fn = Function
      return Fn
    },
    getData() {
      return new Promise((resolve, reject) => {
        this.$refs.generateForm.validate(valid => {
          console.log(this.models)
          if (valid) {
            resolve(this.models)
          } else {
            reject(new Error('表单数据校验失败').message)
          }
        })
      })
    },
    reset() {
      this.$refs.generateForm.resetFields()
    },
    onInputChange(value, field) {
      this.$emit('on-change', field, value, this.models)
    },
    refresh() {

    }
  }
}
</script>

