# -*- coding: utf-8 -*-
import qiniu
from base_handler import BaseHandler

class QiniuHandler(BaseHandler):
  
  def get(self, name = None):
    bucket_name = 'iwcan'
    access_key = '1dtmNArgndFM8CpiJ2TosF-V1owxDHDaiELN4LqX'
    secret_key = 'MwpZghS6g1qifWoLYdFZTEYXdczbVinNUW_rCbY8'
    q = qiniu.Auth(access_key, secret_key)
    bucket = qiniu.BucketManager(q)
    if name is None:
      ret, eof, info = bucket.list(bucket_name)
      if ret is None:
        print(info)
        self.write_error(404,[''])
      else:
        self.write(ret)
    else:
      ret,info = bucket.stat(bucket_name, name)
      if ret is None:
        print(info)
        self.write_error(503,[''])
      else:
        self.write(ret)
   
    
  
  def put(self):
    
    access_key = '1dtmNArgndFM8CpiJ2TosF-V1owxDHDaiELN4LqX'
    secret_key = 'MwpZghS6g1qifWoLYdFZTEYXdczbVinNUW_rCbY8'
    q = qiniu.Auth(access_key, secret_key)
    token = q.upload_token('iwcan', 'test.txt', 3600)
    print(token)
    localfile = r'D:\hello.txt'
    ret, info = qiniu.put_file(token, 'test.txt', localfile)
    if ret is None:
      print(info)
      self.write_error(503,[''])
    else:
      self.write(ret)
    self.write('Ok')
