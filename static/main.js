Vue.config.debug = true

Vue.use(VueResource)
Vue.use(VueUploader)

Vue.http.options.emulateJSON = true

Vue.filter('preview', function (value) {
  if (value.mimeType.startsWith('image')) {
    return 'http://ocrd95h75.bkt.clouddn.com/' + value.key
  } else {
    return '/static/nopreview.png'
  }
})

var Uploader = Vue.extend({
  template: document.querySelector('#uploader-template').innerHTML,
  data: function () {
    return {
      uploadQueue: []
    }
  },
  methods: {
    'uploadFile': function (event) {
      event.preventDefault()
      var files = event.dataTransfer.files
      for (var i = 0;i < files.length;i++) {
        this.$data.uploadQueue.push({
          status: 'wait',
          file: files[i]
        })
      }
      var formData = new FormData()
      formData.append('file', event.dataTransfer.files[0])
      this.$upload('put', '/file', formData,function(){
        alert('complete')
      },function(event){
        console.log(event.loaded/event.total*100+'%')
      })
    },
    'preventDefault': function (event) {
      event.preventDefault()
    }
  }
})

var App = Vue.extend({
  components: {
    'uploader': Uploader
  }
})
new App({
  el: '#app',
  data: {
    list: []
  },
  ready() {
    this.$http.get('/file').then(function (response) {
      console.log(response)
      this.$set('list', response.data.items)
    })
  }
})
