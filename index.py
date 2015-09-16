
import logging
import pickle
from time import time
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
        data = {'status': 'ok', 'iv': iv, 'pass': password}
        pipe.set(uuid, pickle.dumps(data))
        pipe.expire(uuid, config.TTL)
        pipe.execute()

    return '/get/{}'.format(uuid)


@app.route('/get/<uuid>', methods=['get'])
def getPass(uuid):
    with r.pipeline() as pipe:
        raw_data = r.get(uuid)

        if not raw_data:
            return render_template('expired.html')

        data = pickle.loads(raw_data)
        if data['status'] == 'ok':
            new_data = {'status': 'withdrawn', 'time': int(time()), 'ip': request.remote_addr}
            r.set(uuid, pickle.dumps(new_data))
            return render_template('get.html', data=data['iv'] + '|' + data['pass'])

        if data['status'] == 'withdrawn':
            return render_template('withdrawn.html')


@app.route('/', methods=['get'])
def index():
    ttl = int(config.TTL/60)
    return render_template('index.html', ttl=ttl)

if __name__ == '__main__':
    app.run()
