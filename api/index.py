from flask import Flask, render_template, request, jsonify

app = Flask(__name__, template_folder="../templates", static_folder="../static")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/contact', methods=['POST'])
def contact():
    data = request.get_json()
    name = data.get('name', '')
    email = data.get('email', '')
    subject = data.get('subject', '')
    message = data.get('message', '')

    # Just logs (works in Vercel logs)
    print(f"New message from {name} ({email}): {subject} — {message}")

    return jsonify({'status': 'success', 'message': 'Message received!'})

# 🔥 REQUIRED for Vercel
def handler(environ, start_response):
    return app(environ, start_response)