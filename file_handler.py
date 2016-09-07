# -*- coding: utf-8 -*-
import qiniu
import uuid
import os
import config

from handlers import ApiHandler

class FileHandler(ApiHandler):
  
  def get(self, name = None):

    q = qiniu.Auth(config.access_key, config.secret_key)
    bucket = qiniu.BucketManager(q)
    if name is None:
      ret, eof, info = bucket.list(config.bucket_name)
      if ret is None:
        print(info)
        self.write_error(503)
      else:
        self.write(ret)
    else:
      ret,info = bucket.stat(config.bucket_name, name)
      if ret is None:
        print(info)
        self.write_error(503)
      else:
        self.write(ret)
   
    
  def post(self):
    operation = self.get_body_argument('operation')
    source = self.get_body_argument('source')
    target = self.get_body_argument('target')
    
    q = qiniu.Auth(config.access_key, config.secret_key)
    bucket = qiniu.BucketManager(q)
    if operation == 'copy':
      ret, info = bucket.copy(config.bucket_name,source,config.bucket_name,target)
      if ret is None:
        print(info)
        self.write_error(503)
      else:
        self.write(ret)
    elif operation == 'move':
      ret, info = bucket.move(config.bucket_name,source,config.bucket_name,target)
      if ret is None:
        print(info)
        self.write_error(503)
      else:
        self.write(ret)

  def put(self):
    if self.request.files.get('file') is not None:
      files = self.request.files['file']
      if len(files) > 0:
        file = files[0]
        temp_dir_path = os.path.join(os.getcwd(),'temp')
        if not os.path.exists(temp_dir_path):
          os.mkdir(temp_dir_path)
        ext_name =  file['filename'].split('.')[-1]
        key = str(uuid.uuid1()) + '.' + ext_name
        file_path = os.path.join(temp_dir_path, key)
        temp_file = open(file_path,mode='wb')
        temp_file.write(file["body"])
        temp_file.close()

        q = qiniu.Auth(config.access_key, config.secret_key)
        token = q.upload_token(config.bucket_name, key, 3600)

        ret, info = qiniu.put_file(token, key, file_path)
        if ret is None:
          print(info)
          self.write_error(503)
        else:
          self.write(ret)
        os.remove(file_path)
      else:
        self.write_error(503)

