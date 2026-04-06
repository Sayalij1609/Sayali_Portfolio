from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

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
    # Add email sending logic here if needed
    print(f"New message from {name} ({email}): {subject} — {message}")
    return jsonify({'status': 'success', 'message': 'Message received!'})

if __name__ == '__main__':
    app.run(debug=True)