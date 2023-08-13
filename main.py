from flask import Flask, render_template, request
from replit import web
from requests import post

app = Flask(__name__)


@app.route("/css/style")
def style():
  return app.send_static_file("stylesheets/style.css")


@app.route("/js/edit-form")
def edit_form_script():
  return app.send_static_file("scripts/edit-form.js")


@app.route("/js/load-form")
def load_form_script():
  return app.send_static_file("scripts/load-form.js")


@app.route("/")
def index():
  return render_template("index.html")


@app.route("/edit")
def edit_form():
  return render_template("edit-form.html", login=web.auth.name)


@app.route("/load-form")
@web.authenticated
def load_form():
  return render_template("load-form.html")


@app.route("/save", methods=["POST"])
def save_to_cloud():
  data = request.get_json(force=True)
  cloud = "https://9d5ff3d2-795a-4609-bb47-a5d4d13bd681-forms.m00gle.repl.co/";
  response = post(cloud, json=data)
  response.raise_for_status()
  return response.json()


if __name__ == "__main__":
  app.run(host="0.0.0.0", port=81)
