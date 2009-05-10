#!/usr/bin/env python
# instamarks - web landmarks - from http://www.clusterify.com/projects/list/fsavard/7/
import wsgiref.handlers

from google.appengine.ext import db
from google.appengine.ext import webapp
from google.appengine.ext.webapp import template

import os

class Landmark(db.Model):
  user = db.UserProperty()
  id = db.IntegerProperty()
  url = db.StringProperty()
  text = db.TextProperty()
  x = db.IntegerProperty()
  y = db.IntegerProperty()

class MainHandler(webapp.RequestHandler):

  def get(self):
    path = os.path.join(os.path.dirname(__file__), 'index.html')
    self.response.out.write(template.render(path, {'host':self.request.host}))

def main():

  application = webapp.WSGIApplication([('/', MainHandler)],
                                       debug=True)
  wsgiref.handlers.CGIHandler().run(application)


if __name__ == '__main__':
  main()
