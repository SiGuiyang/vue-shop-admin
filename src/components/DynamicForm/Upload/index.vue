<template>
  <div :id="uploadId"
       class="p-upload-container">
    <draggable v-model="fileList"
               :no-transition-on-drag="true"
               v-bind="{group: uploadId, ghostClass: 'ghost', animation: 200}"
               class="drag-img-list">
      <div v-for="(item) in fileList"
           :id="item.fieldKey"
           :key="item.fieldKey"
           :style="{width: width+'px', height: height+'px'}"
           :class="{uploading: item.status ==='uploading', 'is-success': item.status ==='success', 'is-disabled': disabled}"
           class="upload-file">
        <img :src="item.url"
             alt="">
        <el-progress v-if="item.status === 'uploading'"
                     :width="miniWidth*0.9"
                     :percentage="item.percent"
                     class="upload-progress"
                     type="circle" />
        <label v-if="item.status === 'success'"
               class="item-status">
          <el-button type="success"
                     size="mini"
                     icon="el-icon-check" />
        </label>
        <div v-if="!disabled"
             :style="{height: miniWidth / 4 + 'px'}"
             class="upload-action">
          <el-button :style="{'font-size': miniWidth/8+'px'}"
                     icon="el-icon-view"
                     type="success"
                     size="mini"
                     title="预览"
                     @click="handlePreviewFile(item.fieldKey)" />
          <el-button v-if="isEdit"
                     :style="{'font-size': miniWidth/8+'px'}"
                     icon="el-icon-view"
                     type="success"
                     size="mini"
                     title="替换"
                     @click="handleEdit(item.fieldKey)" />
          <el-button v-if="isDelete && fileList.length > min"
                     :style="{'font-size': miniWidth/8+'px'}"
                     icon="el-icon-view"
                     type="success"
                     size="mini"
                     title="删除"
                     @click="handleRemove(item.fieldKey)" />
        </div>
      </div>
    </draggable>

    <div v-show="(!isQiniu || (isQiniu && token)) && fileList.length < length"
         :class="{'is-disabled': disabled}"
         :style="{width: width+'px', height: height+'px'}"
         class="el-upload el-upload--picture-card"
         @click.self="handleAdd">
      <i :style="{fontSize:miniWidth/4+'px',marginTop: (-miniWidth/8)+'px', marginLeft: (-miniWidth/8)+'px'}"
         class="el-icon-plus"
         @click.self="handleAdd" />
      <input v-if="multiple"
             ref="uploadInput"
             :style="{width: 0, height: 0}"
             class="el-upload__input upload-input"
             accept="image/*"
             name="file"
             type="file"
             multiple
             @change="handleChange">
      <input v-else
             ref="uploadInput"
             :style="{width:0, height: 0}"
             class="el-upload__input upload-input"
             accept="image/*"
             type="file"
             name="file"
             @change="handleChange">
    </div>
  </div>
</template>

<script>
import Viewer from 'viewerjs'
import Draggable from 'vuedraggable'
import * as qiniu from 'qiniu-js'

require('viewerjs/dist/viewer.css')
export default {
  components: {
    Draggable
  },
  props: {
    value: {
      type: Array,
      default: () => []
    },
    width: {
      type: Number,
      default: 100
    },
    height: {
      type: Number,
      default: 100
    },
    token: {
      type: String,
      default: ''
    },
    domain: {
      type: String,
      default: ''
    },
    multiple: {
      type: Boolean,
      default: false
    },
    length: {
      type: Number,
      default: 9
    },
    isQiniu: {
      type: Boolean,
      default: false
    },
    isDelete: {
      type: Boolean,
      default: false
    },
    min: {
      type: Number,
      default: 0
    },
    meitu: {
      type: Boolean,
      default: false
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    action: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      fileList: this.value.map(item => {
        return {
          key: item.fieldKey ? item.fieldKey : new Date().getTime(),
          url: item.url,
          percent: item.percent ? item.percent : 100,
          status: item.status ? item.status : 'success'
        }
      }),
      viewer: null,
      uploadId: 'upload_' + new Date().getTime(),
      editIndex: -1,
      meituIndex: -1
    }
  },
  computed: {
    miniWidth () {
      return this.width > this.height ? this.height : this.width
    }
  },
  mounted () {
    this.$emit('input', this.fileList)
  },
  methods: {
    handleChange () {
      const files = this.$refs.uploadInput.files

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const reader = new FileReader()
        const key = new Date().getTime()
        reader.readAsDataURL(file)
        reader.onload = () => {
          if (this.editIndex >= 0) {
            this.$set(this.fileList, this.editIndex, {
              key,
              url: reader.result,
              percent: 0,
              status: 'uploading'
            })

            this.editIndex = -1
          } else {
            this.fileList.push({
              key,
              url: reader.result,
              percent: 0,
              status: 'uploading'
            })
          }

          this.$nextTick(() => {
            if (this.isQiniu) {
              this.uploadAction2(reader.result, file, key)
            } else {
              this.uploadAction(reader.result, file, key)
            }
          })
        }
      }
      this.$refs.uploadInput.value = []
    },
    uploadAction (res, file, key) {
      console.log(this.fileList.findIndex(item => item.key === key))
      const xhr = new XMLHttpRequest()

      const url = this.action
      xhr.open('POST', url, true)

      const formData = new FormData()
      formData.append('file', file)

      xhr.send(formData)
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          const resData = JSON.parse(xhr.response)
          if (resData && resData.url) {
            this.$set(this.fileList, this.fileList.findIndex(item => item.key === key), {
              ...this.fileList[this.fileList.findIndex(item => item.key === key)],
              url: resData.url,
              percent: 100
            })
            setTimeout(() => {
              this.$set(this.fileList, this.fileList.findIndex(item => item.key === key), {
                ...this.fileList[this.fileList.findIndex(item => item.key === key)],
                status: 'success'
              })
              this.$emit('input', this.fileList)
            }, 200)
          } else {
            this.$set(this.fileList, this.fileList.findIndex(item => item.key === key), {
              ...this.fileList[this.fileList.findIndex(item => item.key === key)],
              status: 'error'
            })
            this.fileList.splice(this.fileList.findIndex(item => item.key === key), 1)
          }
        }
      }
      xhr.onprogress = (res) => {
        console.log('progress', res)
        if (res.total && res.loaded) {
          this.$set(this.fileList[this.fileList.findIndex(item => item.key === key)], 'percent', res.loaded / res.total * 100)
        }
      }
    },
    uploadAction2 (res, file, key) {
      const _this = this
      const observable = qiniu.upload(file, key, this.token, {
        fname: key,
        mimeType: []
      }, {
        useCdnDomain: true,
        region: qiniu.region.z2
      })
      observable.subscribe({
        next (res) {
          _this.$set(_this.fileList[_this.fileList.findIndex(item => item.key === key)], 'percent', parseInt(res.total.percent))
        },
        error (s) {
          _this.$set(_this.fileList, _this.fileList.findIndex(item => item.key === key), {
            ..._this.fileList[_this.fileList.findIndex(item => item.key === key)],
            status: 'error'
          })
          _this.fileList.splice(_this.fileList.findIndex(item => item.key === key), 1)
        },
        complete (res) {
          _this.$set(_this.fileList, _this.fileList.findIndex(item => item.key === key), {
            ..._this.fileList[_this.fileList.findIndex(item => item.key === key)],
            url: _this.domain + res.key,
            percent: 100
          })
          setTimeout(() => {
            _this.$set(_this.fileList, _this.fileList.findIndex(item => item.key === key), {
              ..._this.fileList[_this.fileList.findIndex(item => item.key === key)],
              status: 'success'
            })
            _this.$emit('input', _this.fileList)
          }, 200)
        }
      })
    },
    handleRemove (key) {
      this.fileList.splice(this.fileList.findIndex(item => item.key === key), 1)
    },
    handleEdit (key) {
      this.editIndex = this.fileList.findIndex(item => item.key === key)

      this.$refs.uploadInput.click()
    },
    handleMeitu (key) {
      this.$emit('on-meitu', this.fileList.findIndex(item => item.key === key))
    },
    handleAdd () {
      if (!this.disabled) {
        this.editIndex = -1
        this.$refs.uploadInput.click()
      }
    },
    handlePreviewFile (key) {
      this.viewer && this.viewer.destroy()
      this.uploadId = 'upload_' + new Date().getTime()

      this.$nextTick(() => {
        this.viewer = new Viewer(document.getElementById(this.uploadId))
        this.viewer.view(this.fileList.findIndex(item => item.key === key))
      })
    }
  }
}
</script>
