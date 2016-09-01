var VueUploader = {}

VueUploader.install = function (Vue, options) {
  Vue.prototype.$upload = function (method, url,formData, file,uploadComplete,uploadProgress,uploadFailed) {
   
    var xhr = new XMLHttpRequest()
    xhr.upload.addEventListener("progress", uploadProgress, false)
    xhr.addEventListener("load", uploadComplete, false)
    xhr.addEventListener("error", uploadFailed, false)
    //xhr.addEventListener("abort", uploadCanceled, false)
    xhr.open('put','/file')
    xhr.send(formData)
  }
}
