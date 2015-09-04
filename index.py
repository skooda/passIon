import config
import logging
logging.basicConfig(level=logging.DEBUG)

## APP
from flask import Flask
from flask import request
from flask import render_template
import redis
from uuid import uuid4

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
    uuid = uuid4()

    with r.pipeline() as pipe:
        pipe.set(uuid, password)
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
