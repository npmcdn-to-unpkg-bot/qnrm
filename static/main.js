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
      list: [],
      uploadList: []
    }
  },
  ready() {
    this.loadList()
  },
  methods: {
    loadList: function () {
      this.$http.get('/file').then(function (response) {
        console.log(response)

        for (var i = 0;i < response.data.items.length;i++) {
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
    addFile: function (event) {
      event.preventDefault()
      var files = event.dataTransfer.files
      for (var i = 0;i < files.length;i++) {
        var item = {
          complete: false,
          status:'上传中...',
          progress: 0,
          file: files[i]
        }
        this.startUpload(item)
        this.$data.uploadList.push(item)
      }
    },
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
        item.status='已完成'
        item.progress = 100
        self.loadList()
        console.log('done')
      })
    },
    preventDefault: function (event) {
      event.preventDefault()
    }
  }
})
