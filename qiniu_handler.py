# -*- coding: utf-8 -*-
import qiniu
from base_handler import BaseHandler

class QiniuHandler(BaseHandler):
  
  def get(self, key = None):
    bucket_name = 'iwcan'
    access_key = '1dtmNArgndFM8CpiJ2TosF-V1owxDHDaiELN4LqX'
    secret_key = 'MwpZghS6g1qifWoLYdFZTEYXdczbVinNUW_rCbY8'
    q = qiniu.Auth(access_key, secret_key)
    bucket = qiniu.BucketManager(q)
    if key is None:
      ret, eof, info = bucket.list(bucket_name)
      if ret is None:
          print(info)
      self.write(ret)
    else:
      ret,info = bucket.stat(bucket_name, key)
      if ret is None:
          print(info)
      self.write(ret)
   
    
  
  def put(self):
    self.request.files
    access_key = '1dtmNArgndFM8CpiJ2TosF-V1owxDHDaiELN4LqX'
    secret_key = 'MwpZghS6g1qifWoLYdFZTEYXdczbVinNUW_rCbY8'
    q = qiniu.Auth(access_key, secret_key)
    token = q.upload_token('iwcan', 'test.txt', 3600)
    print(token)
    localfile = r'D:\hello.txt'
    ret, info = qiniu.put_file(token, 'test.txt', localfile)
    print(info)
    self.write('Ok')
