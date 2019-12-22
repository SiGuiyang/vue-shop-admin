export const basicComponents = [
  {
    type: 'input',
    name: '文本框',
    width: '100%',
    defaultValue: '',
    required: false,
    dataType: 'string',
    pattern: '',
    placeholder: '',
    disabled: false
  },
  {
    type: 'textarea',
    name: '文本域',
    width: '100%',
    defaultValue: '',
    required: false,
    disabled: false,
    pattern: '',
    placeholder: ''
  },
  {
    type: 'number',
    name: '计数器',
    width: '',
    required: false,
    defaultValue: 0,
    min: '',
    max: '',
    step: 1,
    disabled: false,
    controlsPosition: ''
  },
  {
    type: 'radio',
    name: '单选框',
    inline: false,
    defaultValue: '',
    showLabel: false,
    remoteUrl: '',
    options: [], // { label: '', value: 'Option 1' }
    required: false,
    width: '',
    props: {
      value: 'value',
      label: 'label'
    },
    disabled: false
  },
  {
    type: 'checkbox',
    name: '复选框',
    inline: false,
    defaultValue: [],
    showLabel: false,
    remoteUrl: '',
    options: [], // { label: '', value: 'Option 1' }
    required: false,
    width: '',
    props: {
      value: 'value',
      label: 'label'
    },
    disabled: false
  },
  {
    type: 'time',
    name: '时间选择器',
    defaultValue: '21:19:56',
    readonly: false,
    disabled: false,
    editable: true,
    clearable: true,
    placeholder: '',
    startPlaceholder: '',
    endPlaceholder: '',
    beRange: false,
    arrowControl: true,
    format: 'HH:mm:ss',
    required: false,
    width: ''
  },
  {
    type: 'date',
    name: '日期控件',
    defaultValue: '',
    readonly: false,
    disabled: false,
    editable: true,
    clearable: true,
    placeholder: '',
    startPlaceholder: '',
    endPlaceholder: '',
    format: 'yyyy-MM-dd',
    timestamp: false,
    required: false,
    width: ''
  },
  {
    type: 'rate',
    name: '评分',
    defaultValue: null,
    max: 5,
    disabled: false,
    allowHalf: false,
    required: false
  },
  {
    type: 'color',
    name: '颜色选择器',
    defaultValue: '',
    disabled: false,
    showAlpha: false,
    required: false
  },
  {
    type: 'select',
    name: '下拉选择器',
    defaultValue: '',
    multiple: false,
    disabled: false,
    clearable: false,
    placeholder: '',
    required: false,
    showLabel: false,
    width: '',
    remoteUrl: '',
    options: [], // { label: '', value: 'Option 1' }
    filterable: false,
    props: {
      value: 'value',
      label: 'label'
    }
  },
  {
    type: 'switch',
    name: '开关',
    defaultValue: false,
    required: false,
    disabled: false
  },
  {
    type: 'slider',
    name: '滑块',
    defaultValue: 0,
    disabled: false,
    required: false,
    min: 0,
    max: 100,
    step: 1,
    showInput: false,
    beRange: false,
    width: ''
  }
]

export const advanceComponents = [
  {
    type: 'imgupload',
    name: '图片上传',
    defaultValue: [],
    size: {
      width: 100,
      height: 100
    },
    width: '',
    tokenFunc: 'funcGetToken',
    token: '',
    domain: 'http://pfp81ptt6.bkt.clouddn.com/',
    disabled: false,
    length: 8,
    multiple: false,
    isQiniu: false,
    isDelete: false,
    min: 0,
    isEdit: false,
    action: 'https://jsonplaceholder.typicode.com/photos/'
  },
  {
    type: 'editor',
    name: '富文本',
    defaultValue: '',
    width: ''
  },
  {
    type: 'cascader',
    name: '级联选择器',
    defaultValue: [],
    width: '',
    placeholder: '',
    disabled: false,
    clearable: false,
    remoteUrl: '',
    options: [],
    props: {
      value: 'value',
      label: 'label',
      children: 'children'
    }
  }
]

export const layoutComponents = [
  {
    type: 'grid',
    name: '布局选择器',
    columns: [
      {
        span: 12,
        list: []
      },
      {
        span: 12,
        list: []
      }
    ],
    gutter: 0,
    justify: 'start',
    align: 'top'
  }
]
