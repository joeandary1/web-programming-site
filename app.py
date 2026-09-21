"""
Web Programming — Flask application.
Serves the portfolio home page and the Week 2 history pages (hand-made and AI).
"""

from flask import Flask, render_template

app = Flask(__name__)


@app.route("/")
def home():
    """Serve the portfolio home page."""
    weekly_work = [
        {"week": 1, "title": "Live site launched", "endpoint": "home"},
        {"week": 2, "title": "History of the Internet", "endpoint": "internet_history"},
        {"week": 2, "title": "History of the Web", "endpoint": "web_history"},
        {"week": 2, "title": "History of the Internet (AI)", "endpoint": "internet_history_ai"},
        {"week": 2, "title": "History of the Web (AI)", "endpoint": "web_history_ai"},
    ]
    return render_template("index.html", weekly_work=weekly_work)


@app.route("/internet-history")
def internet_history():
    return render_template("internet-history.html")


@app.route("/web-history")
def web_history():
    return render_template("web-history.html")


@app.route("/internet-history-ai")
def internet_history_ai():
    return render_template("internet-history-ai.html")


@app.route("/web-history-ai")
def web_history_ai():
    return render_template("web-history-ai.html")


if __name__ == "__main__":
    app.run(debug=True)