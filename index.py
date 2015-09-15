
import logging
from hashlib import md5
from base64 import urlsafe_b64encode
from os import urandom

import redis
from flask import Flask, request, render_template

import config


logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__,static_folder='public')
r = redis.StrictRedis(
    host=config.REDIS_HOST,
    port=config.REDIS_PORT,
    db=config.REDIS_DB,
    password=config.REDIS_PASSWORD
)

@app.route('/set', methods=['post'])
def setPass():
    assert request.method == 'POST'
    password = request.form['pass']
    iv = request.form['iv']
    uuid = urlsafe_b64encode(md5(urandom(128)).digest())[:8].decode('utf-8')

    with r.pipeline() as pipe:
        pipe.set(uuid, iv + '|' + password)
        pipe.expire(uuid, config.TTL)
        pipe.execute()

    return '/get/{}'.format(uuid)

@app.route('/get/<uuid>', methods=['get'])
def getPass(uuid):
    with r.pipeline() as pipe:
        password = r.get(uuid)
        r.delete(uuid)

    return render_template('get.html', data=password.decode('ascii') if password else '')

@app.route('/', methods=['get'])
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run()
