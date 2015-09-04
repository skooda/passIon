## SOME CONFIG
REDIS_HOST = 'localhost'
REDIS_PORT = 6379
REDIS_DB = 0
TTL = 20 # Password time to life (time in seconds, when unpicked password will be deleted)
import logging
logging.basicConfig(level=logging.DEBUG)

## APP
from flask import Flask
from flask import request
from flask import render_template
import redis
from uuid import uuid4

app = Flask(__name__,static_folder='public')
r = redis.StrictRedis(host=REDIS_HOST, port=REDIS_PORT, db=REDIS_DB)

@app.route('/set', methods=['post'])
def setPass():
    assert request.method == 'POST'
    password = request.form['pass']
    uuid = uuid4()

    with r.pipeline() as pipe:
        pipe.set(uuid, password)
        pipe.expire(uuid, TTL)
        pipe.execute()

    return '/get/{}'.format(uuid)

@app.route('/get/<uuid>', methods=['get'])
def getPass(uuid):
    with r.pipeline() as pipe:
        password = r.get(uuid)
        r.delete(uuid)

    return password or ""

@app.route('/', methods=['get'])
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run()