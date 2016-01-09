import os
from datetime import datetime
from flask import Flask, request, flash, url_for, redirect, \
     render_template, abort, send_from_directory
import indicoio
import json
import operator as op
import threading

indicoio.config.api_key = 'b1b29987309a10beab53d428a70699d3'

app = Flask(__name__)
app.config.from_pyfile('flaskapp.cfg')

@app.route('/')
def index():
    return render_template('index.html')

@app.route("/test")
def test():
    return "<strong>It's Alive!</strong>"

def sort(data):
    sorted_data = sorted(data.items(), key=op.itemgetter(1))
    return sorted_data[::-1]

@app.route('/sentiment', methods=['GET', 'POST'])
def get_sentiment():
    if request.method == 'POST':
        data = dict(request.form)['data_to_analyze']
        return json.dumps({
            'sentiment': round(indicoio.sentiment(data)[0]*10)
        })

@app.route('/language', methods=['GET', 'POST'])
def get_language():
    if request.method == 'POST':
        data = dict(request.form)['data_to_analyze']
        return json.dumps({
            'language': sort(indicoio.language(data)[0])[0]
        })

@app.route('/political', methods=['GET', 'POST'])
def get_political():
    if request.method == 'POST':
        data = dict(request.form)['data_to_analyze']
        return json.dumps({
            'political': indicoio.political(data)
        })

@app.route('/text_tags', methods=['GET', 'POST'])
def get_texttags():
    if request.method == 'POST':
        data = dict(request.form)['data_to_analyze']
        return json.dumps({
            'text_tags': sort(indicoio.text_tags(data)[0])[0:3]
        })

@app.route('/keywords', methods=['GET', 'POST'])
def get_keywords():
    if request.method == 'POST':
        data = dict(request.form)['data_to_analyze']
        return json.dumps({
            'keywords': indicoio.keywords(data, top_n = 15, threshold = 0.3, relative=True)[0].keys()
        })

@app.route('/virality', methods=['GET', 'POST'])
def get_virality():
    if request.method == 'POST':
        data = dict(request.form)['data_to_analyze']
        return json.dumps({
            'virality': indicoio.twitter_engagement(data)
        })

@app.route('/named_entities', methods=['GET', 'POST'])
def get_entities():
    if request.method == 'POST':
        data = dict(request.form)['data_to_analyze']
        return json.dumps({
            'keywords': indicoio.named_entities(data)
        })   

if __name__ == '__main__':
    app.run()
