import sqlalchemy as sql

def db_connect():
    user = ''
    password = ''
    host = ''
    database = ''
    conn_string = 'mysql+pymysql://{}:{}@{}/{}'.format(user, password, host, database)
    sql_conn = sql.create_engine(conn_string)
    return sql_conn

def plane_query_text(sql_conn, query_text):
    lista = []
    stmt = sql_conn.execute(f"{query_text}")
    myresult = stmt.fetchall()  
    for row in myresult:
        lista.append(dict(row))
    return lista

def plane_query_text_no_response(sql_conn, query_text):
    stmt = sql_conn.execute(f"{query_text}")

def db_close(sql_conn):
    connection = sql_conn.raw_connection()
    connection.close()