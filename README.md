# permission-manager

## Features
1. List your work team.

## Install
1. Clone or download this repository
2. Create your own virtual environment and activate it.  
**Windows:**  
	* `py -m venv venv `  
	* `source venv/Scripts/activate`

	**Mac OS**:
	* `virtualenv venv`
	* `virtualenv -p /usr/local/bin/python3 venv`
	* `source venv/bin/activate`
3. Install dependencies: `pip install -r requirements.txt`
4. Start server: `uvicorn main:app --reload`

* Access interactive documentation with Swagger UI: {localhost} / docs
* Access interactive documentation with Redoc: {localhost} / redoc

