from django.utils import simplejson as json
from google.appengine.ext import webapp, db
from google.appengine.ext.webapp import template
from google.appengine.ext.webapp.util import run_wsgi_app
import datetime
import logging
import os

DATE_FMT = "%Y-%m-%d %H:%M:%S"

class Message(db.Model):

    person = db.StringProperty()
    message = db.StringProperty()
    timestamp = db.DateTimeProperty(auto_now = True, auto_now_add = True)

    def __json__(self):
        return {'p': str(self.person),
                'm': str(self.message),
                'i': str(self.timestamp.strftime(DATE_FMT))}

def build_msgs(queryset):
    msg_list = []
    for m in queryset:
        msg_list.append(m.__json__())
    msg_list.reverse()
    return msg_list

class MainPage(webapp.RequestHandler):
    def get(self):
        path = os.path.join(os.path.dirname(__file__), 'templates/base.html')
        self.response.out.write(template.render(path, {}))

class MessagePost(webapp.RequestHandler):

    def post(self):
        new_msg = Message()
        new_msg.person = self.request.get("person")
        new_msg.message = self.request.get("message")
        new_msg.put()

        self.response.out.write("You said: %s. This has been recorded." % (self.request.get("message")))

class LoadMsgs(webapp.RequestHandler):
    def get(self):
        msgs = Message.all().order('-timestamp').fetch(9)
        self.response.out.write(json.dumps(build_msgs(msgs)))

    def post(self):
        latest_id = self.request.get("latest")
        date = datetime.datetime.strptime(latest_id, DATE_FMT)
        msgs = Message.all().filter("timestamp >", date - datetime.timedelta(seconds = -1)).order('-timestamp').fetch(5)
        self.response.out.write(json.dumps(build_msgs(msgs)))


application = webapp.WSGIApplication([('/', MainPage),
                                      ('/msg_post', MessagePost),
                                      ('/load_msgs', LoadMsgs)], debug = True)


def main():
    run_wsgi_app(application)

if __name__ == "__main__":
    main()
