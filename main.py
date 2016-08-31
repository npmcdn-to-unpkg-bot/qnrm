# -*- coding: utf-8 -*-
import tornado.ioloop
import tornado.web
from main_handler import MainHandler
from qiniu_handler import QiniuHandler
def make_app():
    return tornado.web.Application([
        (r"/", MainHandler),
        (r'/file', QiniuHandler),
        (r'/file/(.*)', QiniuHandler)
    ])

if __name__ == "__main__":
    app = make_app()
    app.listen(8888)
    tornado.ioloop.IOLoop.current().start()