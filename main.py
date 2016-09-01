# -*- coding: utf-8 -*-
import tornado.ioloop
import tornado.web
from tornado.web import StaticFileHandler
from file_handler import FileHandler
def make_app():
    settings = {
        'debug':True
    }
    return tornado.web.Application([
        (r'/file', FileHandler),
        (r'/file/(.*)', FileHandler),
        (r'/static/(.*)', StaticFileHandler, {'path': './static'}),
        (r"/(.*)", StaticFileHandler, { 'path': './static/index.html' })
    ], **settings)

if __name__ == "__main__":
    app = make_app()
    app.listen(8888)
    tornado.ioloop.IOLoop.current().start()