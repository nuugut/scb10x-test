import os
import time

import jwt
import psycopg2
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

pg_host = os.environ['POSTGRES_HOST']
pg_user = os.environ['POSTGRES_USER']
pg_password = os.environ['POSTGRES_PASSWORD']
pg_db = os.environ['POSTGRES_DB']

def init_cnx():
    return psycopg2.connect(dbname=pg_db, user=pg_user, password=pg_password, host=pg_host)

@app.route('/')
def index():
    return 'Index Page'


@app.route('/user', methods=['POST'])
def user():
    if request.method == 'POST':
        request_body = request.json
        cnx = init_cnx()
        cur = cnx.cursor()
        try:
            cur.execute("SELECT * FROM users WHERE email=%s", [request_body['email']])
            result = cur.fetchone()
            if result:
                return "Email already exist", 400
            cur.execute("""
                INSERT INTO users (email, password)
                VALUES (%s, crypt(%s, gen_salt('bf')));
            """, [request_body['email'], request_body['password']])
            cnx.commit()
            return generate_jwt(request_body['email']), 201
        except Exception as e:
            cnx.rollback()
            raise(e)
        finally:
            cur.close()
            cnx.close()


@app.route('/login', methods=['POST'])
def login():
    if request.method == 'POST':
        request_body = request.json
        cnx = init_cnx()
        cur = cnx.cursor()
        try:
            cur.execute("SELECT * FROM users WHERE email=%s AND password=crypt(%s, password);", [request_body['email'], request_body['password']])
            result = cur.fetchone()
            if not result:
                return "Email or Password incorrect", 400
            return generate_jwt(request_body['email']), 200
        except Exception as e:
            cnx.rollback()
            raise(e)
        finally:
            cur.close()
            cnx.close()


@app.route('/party', methods=['GET', 'POST'])
def party():
    if request.method == 'GET':
        cnx = init_cnx()
        cur = cnx.cursor()
        try:
            cur.execute("""
                WITH count_party_joining AS (
                    SELECT party_id, count(*) as members 
                    FROM party_joining group by party_id
                ) 
                SELECT p.id, p.name, COALESCE(cpj.members, 0), p.max_members, p.img
                FROM parties p 
                LEFT JOIN count_party_joining cpj 
                ON p.id = cpj.party_id
                ORDER BY p.name ASC;
            """)
            result = cur.fetchall()
            app.logger.info(result)
            return jsonify(result), 200
        except Exception as e:
            cnx.rollback()
            raise(e)
        finally:
            cur.close()
            cnx.close()
    elif request.method == 'POST':
        request_body = request.json
        cnx = init_cnx()
        cur = cnx.cursor()
        try:
            cur.execute("""
                INSERT INTO parties (name, max_members, img)
                VALUES (%s, %s, %s)
            """, [request_body['party_name'], request_body['max_members'], request_body['img']])
            cnx.commit()
            return "Party create successfully", 201
        except Exception as e:
            cnx.rollback()
            raise(e)
        finally:
            cur.close()
            cnx.close()


@app.route('/join-party/<party_id>', methods=['POST'])
def join_party(party_id):
    if request.method == 'POST':
        request_body = request.json
        cnx = init_cnx()
        cur = cnx.cursor()
        try:
            cur.execute("SELECT * FROM party_joining WHERE party_id=%s AND user_email=%s", [party_id, request_body['user_email']])
            result = cur.fetchone()
            if result:
                return "You already join this party", 400
            cur.execute("""
                INSERT INTO party_joining (party_id, user_email)
                VALUES (%s, %s)
            """, [party_id, request_body['user_email']])
            cnx.commit()
            return "Join party successfully", 200
        except Exception as e:
            cnx.rollback()
            raise(e)
        finally:
            cur.close()
            cnx.close()
                        

def generate_jwt(email):
    return jwt.encode({'email': email}, os.environ['JWT_SECRET'], algorithm='HS256')


if __name__ == '__main__':
    app.run(host='0.0.0.0')
