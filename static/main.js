Vue.config.debug = true

Vue.use(VueResource)
Vue.use(VueUploader)

Vue.http.options.emulateJSON = true

Vue.filter('filePreview', function (value) {
  if (value.mimeType.startsWith('image')) {
    return 'http://ocrd95h75.bkt.clouddn.com/' + value.key
  } else {
    return '/static/nopreview.png'
  }
})
Vue.filter('localFilePreview', function (value) {
  if (value.file.type.startsWith('image')) {
    return window.URL.createObjectURL(value.file)
  } else {
    return '/static/nopreview.png'
  }
})

new Vue({
  el: '#app',
  data: function () {
    return {
      waitListContainerVisual: false,
      list: [],
      uploadList: [],
      root:{}
    }
  },
  ready() {
    this.loadList()
  },
  methods: {
    /**
     * 获取已上传的文件
     */
    loadList: function () {
      this.$http.get('/file').then(function (response) {
        console.log(response)
        response.data.items.forEach(function(item){
          var path = item.key.split('/')
          var temp_folder=this.root;
          for(var i=0;i<path.length-1;i++){
            
          }
        })
        for (var i = 0;i < response.data.items.length;i++) {
          response.data.items[i].selected = false
          var flag = this.list.some(function (item) {
            return item.key == response.data.items[i].key
          })
          if (!flag) {
            this.list.push(response.data.items[i])
          }
        }

      // this.$set('list', response.data.items)
      })
    },
    /**
     * 添加需要上传的文件
     */
    addFile: function (event) {
      event.preventDefault()
      var files = event.dataTransfer.files
      for (var i = 0;i < files.length;i++) {
        var item = {
          complete: false,
          status: '上传中...',
          progress: 0,
          file: files[i]
        }
        this.startUpload(item)
        this.$data.uploadList.push(item)
        this.showWaitListContainer()
      }
    },
    /**
     * 开始上传
     */
    startUpload: function (item) {
      var file = item.file
      var formData = new FormData()
      formData.append('file', file)
      var self = this
      this.$upload('put', '/file', formData, function (progress) {
        item.progress = progress
        console.log(progress)
      }).then(function (event) {
        item.complete = true
        item.status = '已完成'
        item.progress = 100
        self.loadList()
        console.log('done')
      })
    },
    /**
     * 切换选中状态
     */
    toggleSelectStatus: function (item) {
      item.selected = !item.selected
    },
    /**
     * 清楚所有项目的选中
     */
    clearSelectStatus:function(){
      this.list.forEach(function(item){
        item.selected = false
      })
    },
    /**
     * 全选 
     */
    selectAll:function(){
      this.list.forEach(function(item){
        item.selected = true
      })
    },
    /**
     * 反选
     */
    shiftSelectStatus:function(){
      this.list.forEach(function(item){
        item.selected = !item.selected 
      })
    },
    
    /**
     * 显示上传界面
     */
    showWaitListContainer: function () {
      this.waitListContainerVisual = true
    },
    /**
     * 切换上传界面
     */
    toggleWaitListContainer: function () {
      this.waitListContainerVisual = !this.waitListContainerVisual
    },
    /**
     * 阻止默认事件
     */
    preventDefault: function (event) {
      event.preventDefault()
    }
  },
  computed: {
    waitUploadListCount: function () {
      var list = this.uploadList.filter(function (item) {
        return item.complete === false
      })
      return list.length
    },
    selectedListCount:function(){
      var list = this.list.filter(function (item) {
        return item.selected === true
      })
      return list.length
    }
  }
})
