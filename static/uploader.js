var VueUploader = {}

VueUploader.install = function (Vue, options) {
  Vue.prototype.$upload = function (method, url, formData, progressChanged) {
    return new Promise(function (resolve, reject) {
      var xhr = new XMLHttpRequest()
      xhr.open(method, url)
      xhr.upload.onprogress = function (event) {
        if (event.lengthComputable) {
          var progress = (event.loaded / event.total * 100 | 0)
          if (progressChanged) {
            progressChanged(progress)
          }
        }
      }
      xhr.onload = function (event) {
        resolve(event)
      }
      xhr.error = function (event) {
        reject(event)
      }
      xhr.send(formData)
    })
  }
}
