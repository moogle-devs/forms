from flask import Flask, render_template, request
from replit import web
from requests import post

app = Flask(__name__)


@app.route("/css/style")
def style():
  return app.send_static_file("stylesheets/style.css")


@app.route("/js/edit")
def edit_script():
  return app.send_static_file("scripts/edit.js")


@app.route("/js/form")
def form_script():
  return app.send_static_file("scripts/form.js")


@app.route("/")
def index():
  return render_template("index.html")


@app.route("/edit")
def edit():
  return render_template("edit.html", login=web.auth.name)


@app.route("/form")
def form():
  return render_template("form.html")

@app.route('/save', methods=["POST"])
def save2Cloud():
  data = request.get_json(force=True)
  cloud = "https://9d5ff3d2-795a-4609-bb47-a5d4d13bd681-forms.m00gle.repl.co/";
  r = post(cloud, json=data)
  r.raise_for_status()
  return r.json()

if __name__ == "__main__":
  app.run(host="0.0.0.0", port=81)
