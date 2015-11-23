from threading import Thread
from io import BytesIO
from urllib.parse import urlencode
from os import system
from time import time

import pycurl
import json
import psutil

HOST = 'localhost'
PORT = '7000'

class Worker(Thread):

  def __init__(self, data):
    self.timer = {}
    self.identifier = None
    self.data = data
    Thread.__init__(self)

  def get_timer(self):
    return self.timer

  def get_id(self):
    return self.identifier

  def run(self):
    t = time()
    data = self.data
    buffer = BytesIO()
    c = pycurl.Curl()
    c.setopt(c.URL, 'http://' + HOST + ':' + PORT + '/boxes')
    c.setopt(c.POSTFIELDS, 'name=' + data['name'] + '&os_id=' + data['os_id'] + '&memory='+data['memory'])
    c.setopt(c.WRITEDATA, buffer)
    c.perform()
    c.close()
    self.timer['create'] = time() - t

    body = json.loads(buffer.getvalue().decode('utf-8'))
    self.identifier = body['id']

    t = time();
    buffer = BytesIO()
    c = pycurl.Curl()
    c.setopt(c.URL, 'http://' + HOST + ':' + PORT + '/boxes/' + str(body['id']) + '/start')
    c.setopt(c.WRITEDATA, buffer)
    c.perform()
    c.close()

    self.timer['start'] = time() - t

if __name__ == '__main__':
  machines = [
    {
      'name': 'Machine' + str(time()),
      'os_id': '1',
      'memory': '512',
    },
  ]

  result = {
    'tests': [],
    'initial_cpu': psutil.cpu_percent(interval=1),
    'initial_memory': psutil.virtual_memory().used
  }
  for machine in machines :
    w = Worker(machine)
    w.start()

    memory = 0
    processor = 0
    while(w.is_alive()):
      aux = psutil.cpu_percent(interval=1)
      if aux > processor :
        processor = aux

      aux = psutil.virtual_memory().used
      if aux > memory :
        memory = aux

    buffer = BytesIO()
    c = pycurl.Curl()
    c.setopt(c.URL, 'http://' + HOST + ':' + PORT + '/boxes/' + str(w.get_id()) + '/stop')
    c.setopt(c.WRITEDATA, buffer)
    c.perform()
    c.close()


    timer = w.get_timer()
    result['tests'].append({'machine': machine, 'start': timer['start'], 'create': timer['create'], 'cpu': processor, 'memory': memory})
  print (json.dumps(result))
