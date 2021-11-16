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
    switch_status: Optional[str] = Query(0)
):
    bbox = sql.db_connect()
    query = f"call agent_search_permissions({option},'{num_page}|-|{cant_page}|-|{id_position}|-|{id_employee}|-|{switch_status}',{id_editor});"
    print(query)
    results = sql.plane_query_text(bbox, query)
    sql.db_close(bbox)
    return results