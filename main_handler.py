# -*- coding: utf-8 -*-
from tornado.httpclient import AsyncHTTPClient
from tornado.web import asynchronous
from base_handler import BaseHandler

class MainHandler(BaseHandler):

  def get(self):
    self.render('index.html')