from flask import Flask, render_template

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
  return render_template("edit.html")


@app.route("/form")
def form():
  return render_template("form.html")


if __name__ == "__main__":
  app.run(host="0.0.0.0", port=81)
