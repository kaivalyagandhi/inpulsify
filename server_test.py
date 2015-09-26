from flask import Flask, render_template
from flask.ext.socketio import SocketIO, send, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)


@socketio.on('event')
def handle_json(json):
    print('received json: ' + str(json))


@socketio.on('connect')
def emit_message():
    emit('event', 'I\'m connected!')


if __name__ == '__main__':
    print('here')
    socketio.run(app)
