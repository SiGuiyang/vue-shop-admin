export const basicComponents = [
  {
    type: 'input',
    title: '文本框',
    field: '',
    value: '',
    required: false,
    validate: [],
    col: {
      span: 12
    },
    props: {
      type: 'text', //	类型	string	text，textarea 和其他 原生 input 的 type 值	text
      maxlength: undefined, // 	原生属性，最大输入长度	number	—	—
      minlength: undefined, //  原生属性，最小输入长度	number	—	—
      placeholder: undefined, // 输入框占位文本	string	—	—
      clearable: false, // 是否可清空	boolean	—	false
      disabled: false, //	禁用	boolean	—	false
      size: 'medium', //	输入框尺寸，只在 type!="textarea" 时有效	string	medium / small / mini	—
      prefixIcon: undefined, //	输入框头部图标	string	—	—
      suffixIcon: undefined, //	输入框尾部图标	string	—	—
      rows: 2, // 	输入框行数，只对 type="textarea" 有效	number	—	2
      autosize: false, //	自适应内容高度，只对 type="textarea" 有效，可传入对象，如，{ minRows: 2, maxRows: 6 }	boolean / object	—	false
      autocomplete: 'off', //	原生属性，自动补全	string	on, off	off
      name: undefined, //	原生属性	string	—	—
      readonly: false, //	原生属性，是否只读	boolean	—	false
      max: undefined, //	原生属性，设置最大值	—	—	—
      min: undefined, //	原生属性，设置最小值	—	—	—
      step: undefined, //	原生属性，设置输入字段的合法数字间隔	—	—	—
      resize: undefined, //	控制是否能被用户缩放	string	none, both, horizontal, vertical	—
      autofocus: false, //	原生属性，自动获取焦点	boolean	true, false	false
      form: undefined, //	原生属性	string	—	—
      label: undefined, //	输入框关联的label文字	string	—	—
      tabindex: undefined, //	输入框的tabindex	string	-	-
      validateEvent: true //	输入时是否触发表单的校验	boolean	-	true
    }
  },
  {
    type: 'InputNumber',
    field: 'inputNumber',
    title: '计数器',
    value: 1,
    required: false,
    validate: [],
    col: {
      span: 12
    },
    props: {
      min: 0, // 设置计数器允许的最小值	number	—	-Infinity
      max: 100, // 设置计数器允许的最大值	number	—	Infinity
      step: 1, //	计数器步长	number	—	1
      precision: 0, //	数值精度	number	—	—
      size: 'large', //	计数器尺寸	string	large, small	—
      disabled: false, //	是否禁用计数器	boolean	—	false
      controls: true, //	是否使用控制按钮	boolean	—	true
      controlsPosition: 'right', //	控制按钮位置	string	right	-
      name: undefined, // 	原生属性	string	—	—
      label: undefined, //	输入框关联的label文字	string	—	—
      placeholder: undefined // 输入框默认 placeholder	string	-	-
    }
  },
  {
    type: 'radio',
    title: '单选框',
    field: 'radio',
    value: '0',
    disabled: false,
    required: false,
    validate: [],
    col: {
      span: 12
    },
    options: [
      { value: '0', label: '不包邮', disabled: false },
      { value: '1', label: '包邮', disabled: true }
    ],
    props: {
      size: 'medium', // 单选框组尺寸，仅对按钮形式的 Radio 或带有边框的 Radio 有效	string	medium / small / mini	—
      disabled: false,	// 是否禁用	boolean	—	false
      textColor: '#ffffff', //按钮形式的 Radio 激活时的文本颜色	string	—	#ffffff
      fill: '#409EFF'	// 按钮形式的 Radio 激活时的填充色和边框色	string	—	
    }
  },
  {
    type: 'checkbox',
    title: '复选框',
    field: 'checkbox',
    value: undefined,
    disabled: false,
    required: false,
    validate: [],
    col: {
      span: 12
    },
    options: [
      { value: '1', label: '好用', disabled: true },
      { value: '2', label: '方便', disabled: false },
      { value: '3', label: '实用', disabled: false },
      { value: '4', label: '有效', disabled: false }
    ],
    props: {
      size: 'medium',	// 多选框组尺寸，仅对按钮形式的 Checkbox 或带有边框的 Checkbox 有效	string	medium / small / mini	—
      disabled: false,	// 是否禁用	boolean	—	false
      min: null,	// 可被勾选的 checkbox 的最小数量	number	—	—
      max: null,	// 可被勾选的 checkbox 的最大数量	number	—	—
      'text-color': '#ffffff', // 按钮形式的 Checkbox 激活时的文本颜色	string	—	
      fill: '#409EFF'
    }
  },
  {
    type: 'select',
    title: '下拉选择器',
    field: '',
    value: '',
    required: false,
    validate: [],
    col: {
      span: 12
    },
    options: [
      { 'value': '1', 'label': '1', 'disabled': false },
      { 'value': '2', 'label': '2', 'disabled': false }
    ],
    props: {
      multiple: false,	// 是否多选	boolean	—	false
      disabled: false, //	是否禁用	boolean	—	false
      valueKey: '', // 作为 value 唯一标识的键名，绑定值为对象类型时必填	string	—	value
      size: 'medium', //	输入框尺寸	string	medium/small/mini	—
      clearable: false, //	是否可以清空选项	boolean	—	false
      collapseTags: false, //	多选时是否将选中值按文字的形式展示	boolean	—	false
      multipleLimit: 0, //	多选时用户最多可以选择的项目数，为 0 则不限制	number	—	0
      name: undefined, //	select input 的 name 属性	string	—	—
      autocomplete: 'off', //	select input 的 autocomplete 属性	string	—	off
      placeholder: '', //	占位符	string	—	请选择
      filterable: false, //	是否可搜索	boolean	—	false
      allowCreate: false, //	是否允许用户创建新条目，需配合 filterable 使用	boolean	—	false
      filterMethod: undefined, //	自定义搜索方法	function	—	—
      remote: false, //	是否为远程搜索	boolean	—	false
      remoteMethod: undefined, //	远程搜索方法	function	—	—
      loading: false, //	是否正在从远程获取数据	boolean	—	false
      loadingText: undefined, //	远程加载时显示的文字	string	—	加载中
      noMatchText: undefined, //	搜索条件无匹配时显示的文字	string	—	无匹配数据
      noDataText: undefined, //	选项为空时显示的文字	string	—	无数据
      popperClass: undefined, //	Select 下拉框的类名	string	—	—
      reserveKeyword: false, //	多选且可搜索时，是否在选中一个选项后保留当前的搜索关键词	boolean	—	false
      defaultFirstOption: false, //	在输入框按下回车，选择第一个匹配项。需配合 filterable或 remote 使用	boolean	-	false
      popperAppendToBody: true, //	是否将弹出框插入至 body 元素。在弹出框的定位出现问题时，可将该属性设置为 false	boolean	-	true
      automaticDropdown: false //	对于不可搜索的 Select，是否在输入框获得焦点后自动弹出选项菜单	boolean	-	false
    }
  },
  {
    type: 'switch',
    title: '开关',
    field: 'switch',
    value: false,
    required: false,
    validate: [],
    col: {
      span: 12
    },
    props: {
      disabled: false, // 	是否禁用	boolean	—	false
      width: 40, //	switch 的宽度（像素）	number	—	40
      activeIconClass: undefined, //	switch 打开时所显示图标的类名，设置此项会忽略 active- text	string	—	—
      inactiveIconClass: undefined, //	switch 关闭时所显示图标的类名，设置此项会忽略 inactive- text	string	—	—
      activeText: undefined, //	switch 打开时的文字描述	string	—	—
      inactiveText: undefined, //	switch 关闭时的文字描述	string	—	—
      activeValue: undefined, //	switch 打开时的值	boolean / string / number	—	true
      inactiveValue: false, //	switch 关闭时的值	boolean / string / number	—	false
      activeColor: '#409EFF', //	switch 打开时的背景色	string	—	
      inactiveColor: '#C0CCDA', //	switch 关闭时的背景色	string	—	
      name: undefined //	switch 对应的 name 属性	string	—	—
    }
  },
  {
    type: 'cascader',
    title: '级联选择器',
    field: 'cascader',
    value: [],
    validate: [],
    col: {
      span: 12
    },
    props: {
      options: [], //	可选项数据源，键名可通过 props 属性配置	array	—	—
      props: {}, //	配置选项，具体见下表	object	—	—
      separator: '/', //	选项分隔符	string	—	斜杠'/'
      popperClass: undefined, //	自定义浮层类名	string	—	—
      placeholder: undefined, //	输入框占位文本	string	—	请选择
      disabled: false, //	是否禁用	boolean	—	false
      clearable: false, // 是否支持清空选项	boolean	—	false
      expandTrigger: 'click', //	次级菜单的展开方式	string	click / hover	click
      showAllLevels: true, //	输入框中是否显示选中值的完整路径	boolean	—	true
      filterable: false, //	是否可搜索选项	boolean	—	—
      debounce: 300, //	搜索关键词输入的去抖延迟，毫秒	number	—	300
      changeOnSelect: false, // 	是否允许选择任意一级的选项	boolean	—	false
      size: 'medium', //	尺寸	string	medium / small / mini	—
      beforeFilter: undefined //	筛选之前的钩子，参数为输入的值，若返回 false 或者返回 Promise 且被 reject，则停止筛选	function(value)	—	—
    }

  },
  {
    type: 'DatePicker',
    field: 'datePicker',
    title: '日期选择器',
    value: ['2018-02-20', new Date()],
    required: false,
    validate: [],
    col: {
      span: 12
    },
    props: {
      readonly: false, //	完全只读	boolean	—	false
      disabled: false, // 	禁用	boolean	—	false
      editable: true, //	文本框可输入	boolean	—	true
      clearable: true, //	是否显示清除按钮	boolean	—	true
      size: 'large', // 	输入框尺寸	string	large, small, mini	—
      placeholder: undefined, //	非范围选择时的占位内容	string	—	—
      startPlaceholder: undefined, //	范围选择时开始日期的占位内容	string	—	—
      endPlaceholder: undefined, //	范围选择时结束日期的占位内容	string	—	—
      type: 'datetime', //	显示类型	string	year/month/date/dates/ week/datetime/datetimerange/daterange	date
      format: 'yyyy-MM-dd', //	显示在输入框中的格式	string	见日期格式
      align: 'left', //	对齐方式	string	left, center, right	left
      popperClass: undefined, //	DatePicker 下拉框的类名	string	—	—
      pickerOptions: {}, // 	当前时间日期选择器特有的选项参考下表	object	—	{}
      rangeSeparator: '-', //	选择范围时的分隔符	string	—	'-'
      defaultValue: new Date(), //	可选，选择器打开时默认显示的时间	Date	可被new Date()解析	—
      defaultTime: undefined, //	范围选择时选中日期所使用的当日内具体时刻	string[]	数组，长度为 2，每项值为字符串，形如12: 00: 00，第一项指定开始日期的时刻，第二项指定结束日期的时刻，不指定会使用时刻 00: 00: 00	—
      valueFormat: undefined, // 	可选，绑定值的格式。不指定则绑定值为 Date 对象	string	见日期格式	—
      name: undefined, //	原生属性	string	—	—
      unlinkPanels: false, //	在范围选择器里取消两个日期面板之间的联动	boolean	—	false
      prefixIcon: 'el-icon-date', //	自定义头部图标的类名	string	—	el - icon - date
      clearIcon: 'el-icon-circle-close', //	自定义清空图标的类名	string	—	el - icon - circle - close
      validateEvent: true // 输入时是否触发表单的校验	boolean - true
    }
  },
  {
    type: 'TimePicker',
    field: 'timePicker',
    title: '时间选择器',
    value: [],
    required: false,
    validate: [],
    col: {
      span: 12
    },
    props: {
      readonly: false, //	完全只读	boolean	—	false
      disabled: false, //	禁用	boolean	—	false
      editable: true, //	文本框可输入	boolean	—	true
      clearable: true, //	是否显示清除按钮	boolean	—	true
      size: 'medium', //	输入框尺寸	string	medium / small / mini	—
      placeholder: undefined, //	非范围选择时的占位内容	string	—	—
      startPlaceholder: undefined, //	范围选择时开始日期的占位内容	string	—	—
      endPlaceholder: undefined, //	范围选择时开始日期的占位内容	string	—	—
      isRange: false, //	是否为时间范围选择，仅对<el-time-picker>有效	boolean	—	false
      arrowControl: false, //	是否使用箭头进行时间选择，仅对<el-time-picker>有效	boolean	—	false
      align: 'left', //	对齐方式	string	left / center / right	left
      popperClass: undefined,	// TimePicker 下拉框的类名	string	—	—
      pickerOptions: {},	// 当前时间日期选择器特有的选项参考下表	object	—	{}
      rangeSeparator: '-', //	选择范围时的分隔符	string	-	'-'
      valueFormat: new Date(), //	可选，仅TimePicker时可用，绑定值的格式。不指定则绑定值为 Date 对象	string	见日期格式	—
      defaultValue: undefined, 	// 可选，选择器打开时默认显示的时间	Date(TimePicker) / string(TimeSelect)	可被new Date()解析(TimePicker) / 可选值(TimeSelect)	—
      name: undefined, //	原生属性	string	—	—
      prefixIcon: 'el-icon-time',	// 自定义头部图标的类名	string	—	el-icon-time
      clearIcon: 'el-icon-circle-close' //	自定义清空图标的类名	string	—	el-icon-circle-close
    }

  },
  {
    type: 'ColorPicker',
    field: 'colorPicker',
    title: '颜色',
    value: '#ff7271',
    required: false,
    col: {
      span: 12
    },
    props: {
      disabled: false, //	是否禁用	boolean	—	false
      size: 'medium', //	尺寸	string	—	medium / small / mini
      showAlpha: false, //	是否支持透明度选择	boolean	—	false
      colorFormat: 'hex', //	写入 v-model 的颜色的格式	string	hsl / hsv / hex / rgb	hex（show-alpha 为 false）/ rgb（show-alpha 为 true）
      popperClass: undefined, //	ColorPicker 下拉框的类名	string	—	—
      predefine: undefined //	预定义颜色	array	—	—
    }
  },
  {
    type: 'upload',
    field: 'upload',
    title: '上传组件',
    value: [],
    required: false,
    validate: [],
    col: {
      span: 12
    },
    props: {
      action: undefined, //	必选参数，上传的地址	string	—	—
      uploadType: 'file', //	上传文件类型	String	image（图片上传），file（文件上传）	—
      headers: undefined, //	设置上传的请求头部	object	—	—
      multiple: true, //	是否支持多选文件	boolean	—	—
      data: undefined, //	上传时附带的额外参数	object	—	—
      name: 'file', //	上传的文件字段名	string	—	file
      withCredentials: false, //	支持发送 cookie 凭证信息	boolean	—	false
      showFileList: true, //	是否显示已上传文件列表	boolean	—	true
      drag: true, //	是否启用拖拽上传	boolean	—	false
      accept: undefined, //	接受上传的文件类型（thumbnail-mode 模式下此参数无效）	string	—	—
      onPreview: undefined, //	点击文件列表中已上传的文件时的钩子	function(file)	—	—
      onRemove: undefined, // 	文件列表移除文件时的钩子	function(file, fileList)	—	—
      onSuccess: undefined, //	文件上传成功时的钩子	function(response, file, fileList)	—	—
      onError: undefined, //	文件上传失败时的钩子	function(err, file, fileList)	—	—
      onProgress: undefined, //	文件上传时的钩子	function(event, file, fileList)	—	—
      onChange: undefined, //	文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用	function(file, fileList)	—	—
      beforeUpload: undefined, //	上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。	function(file)	—	—
      beforeRemove: undefined, //	删除文件之前的钩子，参数为上传的文件和文件列表，若返回 false 或者返回 Promise 且被 reject，则停止上传。	function(file, fileList)	—	—
      listType: 'text', //	文件列表的类型	string	text/picture/picture-card	text
      autoUpload: true, // 	是否在选取文件后立即进行上传	boolean	—	true
      fileList: [], //	上传的文件列表, 例如: [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}]	array	—	[]
      httpRequest: undefined, //	覆盖默认的上传行为，可以自定义上传的实现	function	—	—
      disabled: false, //	是否禁用	boolean	—	false
      limit: 100, // 最大允许上传个数	number	—	—
      onExceed: undefined, //	文件超出个数限制时的钩子	function(files, fileList)	—	-
      modalTitle: undefined// 	图片预览弹出框标题文字	String	预览
    }
  },
  {
    type: 'rate',
    field: 'rate',
    title: '评分',
    value: 0,
    required: false,
    validate: [],
    props: {
      max: 5, //	最大分值	number	—	5
      disabled: false, // 	是否为只读	boolean	—	false
      allowHalf: false, //	是否允许半选	boolean	—	false
      lowThreshold: 2,	// 低分和中等分数的界限值，值本身被划分在低分中	number	—	2
      highThreshold: 4,	// 高分和中等分数的界限值，值本身被划分在高分中	number	—	4
      colors: ['#F7BA2A', '#F7BA2A', '#F7BA2A'], //	icon 的颜色数组，共有 3 个元素，为 3 个分段所对应的颜色	array	—	
      voidColor: '#C6D1DE', // 	未选中 icon 的颜色	string	—	
      disabledVoidColor: '#EFF2F7', //	只读时未选中 icon 的颜色	string	—	
      iconClasses: ['el-icon-star-on', 'el-icon-star-on', 'el-icon-star-on'], //	icon 的类名数组，共有 3 个元素，为 3 个分段所对应的类名	array	—
      voidIconClass: 'off', //	未选中 icon 的类名	string	—	el- icon - star - off
      disabledVoidIconClass: 'on', //	只读时未选中 icon 的类名	string	—	el- icon - star - on
      showText: false, //	是否显示辅助文字，若为真，则会从 texts 数组中选取当前分数对应的文字内容	boolean	—	false
      showScore: false, //	是否显示当前分数，show - score 和 show - text 不能同时为真	boolean	—	false
      textColor: '#1F2D3D', //辅助文字的颜色	string	—	
      texts: ['极差', '失望', '一般', '满意', '惊喜'], //	辅助文字数组	array	—
      scoreTemplate: undefined //	分数显示模板	string	—	{ value }
    }
  },
  {
    type: 'slider',
    field: 'slider',
    title: '滑块',
    value: [0, 52],
    required: false,
    validate: [],
    props: {
      min: 0, //	最小值	number	—	0
      max: 100, //	最大值	number	—	100
      disabled: false, //	是否禁用	boolean	—	false
      step: -1, //	步长	number	—	1
      showInput: false, //是否显示输入框，仅在非范围选择时有效	boolean	—	false
      showInputControls: true, //	在显示输入框的情况下，是否显示输入框的控制按钮	boolean	—	true
      inputSize: 'small', //	输入框的尺寸	string	large / medium / small / mini	small
      showStops: false, //	是否显示间断点	boolean	—	false
      showTooltip: true, //	是否显示 tooltip	boolean	—	true
      formatTooltip: undefined, // 格式化 tooltip message	function(value)	—	—
      range: true, //	是否为范围选择	boolean	—	false
      vertical: false,	// 是否竖向模式	boolean	—	false
      height: undefined, // 	Slider 高度，竖向模式时必填	string	—	—
      label: undefined, //	屏幕阅读器标签	string	—	—
      debounce: 300, //	输入时的去抖延迟，毫秒，仅在show-input等于true时有效	number	—	300
      tooltipClass: undefined //	tooltip 的自定义类名	string	—	—
    }
  },
  {
    type: 'tree',
    title: '树形组件',
    field: 'tree',
    value: [],
    required: false,
    validate: [],
    props: {
      data: [], // 展示数据	array	—	—
      emptyText: undefined, //	内容为空的时候展示的文本	String	—	—
      nodeKey: undefined, //	每个树节点用来作为唯一标识的属性，整棵树应该是唯一的	String	—	—
      props: {}, //	配置选项，具体看下表	object	—	—
      renderAfterExpand: true, //	是否在第一次展开某个树节点后才渲染其子节点	boolean	—	true
      load: undefined, //	加载子树数据的方法，仅当 lazy 属性为true 时生效	function (node, resolve) —	—
      renderContent: undefined, //	树节点的内容区的渲染 Function	Function (h, { node, data, store }	—	—
      highlightCurrent: false, //	是否高亮当前选中节点，默认值是 false。	boolean	—	false
      defaultExpandAll: false, //	是否默认展开所有节点	boolean	—	false
      expandOnClickNode: true, //	是否在点击节点的时候展开或者收缩节点， 默认值为 true，如果为 false，则只有点箭头图标的时候才会展开或者收缩节点。	boolean	—	true
      checkOnClickNode: false, // 	是否在点击节点的时候选中节点，默认值为 false，即只有在点击复选框时才会选中节点。	boolean	—	false
      autoExpandParent: true, //	展开子节点的时候是否自动展开父节点	boolean	—	true
      defaultExpandedKeys: [], //	默认展开的节点的 key 的数组	array	—	—
      showCheckbox: false, //	节点是否可被选择	boolean	—	false
      checkStrictly: false, //在显示复选框的情况下，是否严格的遵循父子不互相关联的做法，默认为 false	boolean	—	false
      defaultCheckedKeys: [], //	默认勾选的节点的 key 的数组	array	—	—
      currentNodeKey: undefined, //	当前选中的节点	string, number	—	—
      filterNodeMethod: undefined, //	对树节点进行筛选时执行的方法，返回 true 表示这个节点可以显示，返回 false 则表示这个节点会被隐藏	Function(value, data, node) —	—
      accordion: false, //	是否每次只打开一个同级树节点展开	boolean	—	false
      indent: 16, //	相邻级节点间的水平缩进，单位为像素	number	—	16
      iconClass: undefined, //	自定义树节点的图标	string	- -
      lazy: false, //	是否懒加载子节点，需与 load 方法结合使用	boolean	—	false
      draggable: false, //是否开启拖拽节点功能	boolean	—	false
      allowDrag: undefined, // 判断节点能否被拖拽	Function(node) —	—
      allowDrop: undefined // 	拖拽时判定目标节点能否被放置。type 参数有三种情况：'prev'、'inner' 和 'next'，分别表示放置在目标节点前、插入至目标节点和放置在目标节点后	Function (draggingNode, dropNode, type) —	—
    }
  }

]

export const advanceComponents = [
  {
    type: 'imgupload',
    title: '图片上传',
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
    title: '富文本',
    defaultValue: '',
    width: ''
  }
]

export const layoutComponents = [
  {
    type: 'grid',
    title: '一行一列',
    columns: [
      {
        span: 24,
        list: []
      }
    ],
    gutter: 0,
    justify: 'start',
    align: 'top'
  },
  {
    type: 'grid',
    title: '一行两列',
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
