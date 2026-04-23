from flask import Flask, render_template, request, redirect, url_for, session
import sqlite3

app = Flask(__name__)
app.secret_key = 'your_secret_key_here' # Replace with a strong, unique secret key!

# Database Initialization (will be expanded later)
def init_db():
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    # Create tables here later
    conn.commit()
    conn.close()

# Route for the homepage
@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    init_db()
    app.run(debug=True)
