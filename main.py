import json
from fastapi import FastAPI, Query
from db import connection as sql
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional


app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/my_team/")
def home(
    option: Optional[str] = Query(None),
    num_page: Optional[str] = Query(None),
    cant_page: Optional[str] = Query(None),
    id_position: Optional[str] = Query(None),
    id_employee: Optional[str] = Query(None),
    id_editor: Optional[str] = Query(0), 
    switch_status: Optional[str] = Query(0),
    data: Optional[str] = Query(None)
):
    bbox = sql.db_connect()
    
    if data :
        parse_data = json.loads(data)
        for i in parse_data:
            if (i['available']):
                sql.plane_query_text_no_response(bbox, f"insert ignore into e_employee_lob (id_employee, id_lob) values ({i['id_employee']},{i['id_lob']});")     
            else :
                sql.plane_query_text_no_response(bbox, f"delete from e_employee_lob where id_employee={i['id_employee']} and id_lob={i['id_lob']};")     
        return {'status':'Done'}
    else :
        query = f"call agent_search_permissions({option},'{num_page}|-|{cant_page}|-|{id_position}|-|{id_employee}|-|{switch_status}',{id_editor});"
        print(query)
        results = sql.plane_query_text(bbox, query)

    sql.db_close(bbox)
    return results