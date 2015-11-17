from threading import Thread
from io import BytesIO
from urllib.parse import urlencode
from os import system
from time import time

import pycurl
import json
import psutil

class Worker(Thread):

  def __init__(self):
    self.timer = {}
    Thread.__init__(self)

  def get_timer(self):
    return self.timer

  def run(self):
    t = time()
    buffer = BytesIO()
    c = pycurl.Curl()
    c.setopt(c.URL, 'http://localhost:7000/boxes')
    c.setopt(c.POSTFIELDS, 'name=Teste1&os_id=1')
    c.setopt(c.WRITEDATA, buffer)
    c.perform()
    c.close()
    self.timer['create'] = time() - t

    body = json.loads(buffer.getvalue().decode('utf-8'))

    t = time();
    buffer = BytesIO()
    c = pycurl.Curl()
    c.setopt(c.URL, 'http://localhost:7000/boxes/' + str(body['id']) + '/start')
    c.setopt(c.WRITEDATA, buffer)
    c.perform()
    c.close()
    self.timer['create'] = time() - t

    body = json.loads(buffer.getvalue().decode('utf-8'))
    self.timer['start'] = time() - t

if __name__ == '__main__':
  w = Worker()
  w.start()

  memory = 0
  processor = 0
  while(w.is_alive()):
    aux = psutil.cpu_percent(interval=1)
    if aux > processor :
      processor = aux

    aux = psutil.virtual_memory().percent
    if aux > memory :
      memory = aux

  print(w.get_timer())
  print(processor)
  print(memory)
