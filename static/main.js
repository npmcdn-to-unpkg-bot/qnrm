Vue.config.debug = true
Vue.config.devtools = true

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
      uploadList: [],
      path: [],
      root: {
        name: 'root',
        type: 'folder',
        list: []
      },
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
      /**
       * 构建目录结构
       */
      function buildFolder (parent, path) {
        if (path.length == 0) {
          return parent
        }
        var name = path.shift()
        var flag = parent.list.some(function (item) {
          return item.name == name
        })
        // 获得当前的目录
        var folder = {}
        if (flag) {
          folder = parent.list.find(function (item) {
            return item.name == name && item.type === 'folder'
          })
        } else {
          folder = {
            parent: parent,
            name: name,
            type: 'folder',
            list: [],
            selected: false,
            mark: false
          }
          parent.list.push(folder)
        }
        return buildFolder(folder, path)
      }
      this.$http.get('/file').then(function (response) {
        this.root.list = []
        for (var i = 0;i < response.data.items.length;i++) {
          var item = response.data.items[i]
          var path = item.key.split('/')
          var name = path.pop()
          console.log(path + '|' + name)
          var folder = buildFolder(this.root, path)
          folder.list.push({
            parent: folder,
            name: name,
            type: 'file',
            key: item.key,
            size: item.fsize,
            time: item.putTime,
            mimeType: item.mimeType,
            hash: item.hash,
            selected: false,
            mark: false
          })
        }
      // this.$log(this.root)
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
    up:function(){
      this.path.shift()
    },
    copyMarkedItem:function(targetFolder){
      this.markedList.forEach(function(item){
        this.copy(item,targetFolder)
      })
    },
    copy: function (item, targetFolder) {
      function getFullPath (item) {
        if (item.parent) {
          return getFullPath(item.parent) + '/' + item.name
        } else {
          return ''
        }
      }
      var source = item.key
      var target = getFullPath(targetFolder) + '/' + item.name
      console.log(item.name)
      console.log(target)
      // return this.$http.post('/file',{
      //   operation:'copy'

      // }).then(function (response) {

    // })
    },
    /**
     * 切换选中状态
     */
    toggleSelectStatus: function (item, event) {
      if (event.ctrlKey) {
        item.selected = !item.selected
      } else {
        this.clearSelectStatus()
        item.selected = true
      }
    },
    /**
     * 清楚所有项目的选中
     */
    clearSelectStatus: function () {
      this.list.forEach(function (item) {
        item.selected = false
      })
    },
    /**
     * 全选 
     */
    selectAll: function () {
      this.list.forEach(function (item) {
        item.selected = true
      })
    },
    /**
     * 反选
     */
    shiftSelectStatus: function () {
      this.list.forEach(function (item) {
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
    },
    /**
     * 打开文件夹
     */
    openFolder: function (item) {
      if (item.type === 'folder') {
        this.path.push(item.name)
      }
    },
    /**
     * 处理按键事件
     */
    keyMap: function (event) {
      if (event.type === 'keyup' && event.ctrlKey) {
        if (event.keyCode === 65) {
          this.selectAll()
        }
      }
    },
    /**
     * 标记选中文件(准备移动或复制)
     */
    markSelectedItem: function () {
      this.clearMark()
      this.selectedList.forEach(function (item) {
        item.mark = true
      })
    },
    /**
     * 清除所有标记
     */
    clearMark: function () {
      this.list.forEach(function (item) {
        item.mark = false
      })
    }
  },
  computed: {
    /**
     * 当前目录下的文件列表
     */
    list: function () {
      var tempFolder = this.root
      for (var i = 0;i < this.path.length;i++) {
        var foldername = this.path[i]
        tempFolder = tempFolder.list.find(function (item) {
          return item.name === foldername && item.type === 'folder'
        })
      }
      if (tempFolder === undefined) {
        return []
      } else {
        return tempFolder.list
      }
    },
    /**
     * 当前目录的文件夹数
     */
    folderCount: function () {
      return this.list.filter(function (item) {
        return item.type === 'folder'
      }).length
    },
    /**
     * 当前目录文件数
     */
    fileCount: function () {
      return this.list.filter(function (item) {
        return item.type === 'file'
      }).length
    },
    /**
     * 等待上传的文件数量
     */
    waitUploadListCount: function () {
      var list = this.uploadList.filter(function (item) {
        return item.complete === false
      })
      return list.length
    },
    /**
     * 以选择的文件列表
     */
    selectedList: function () {
      return this.list.filter(function (item) {
        return item.selected === true
      })
    },
    markedList: function () {
      return this.list.filter(function (item) {
        return item.mark === true
      })
    }
  }
})
