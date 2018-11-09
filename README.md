# OctoTramp

OctoTramp is a fun GitHub-themed OctoTramp trampolining game originally created
for HackRPI 2016.

The stack utilizes Django and Python 3 for the backend and Processing.js on the
frontend.

## Setup

Install `python3` and `pip3` before continuing. While not required, it is
recommended that you use `pipenv` to create a virtual Python environment.

Next, install the required Python modules:

```bash
# OPTION 1: without pipenv
python3 -m pip install -r requirements.txt

# OPTION 2: with pipenv
python3 -m pipenv install -r requirements.txt
python3 -m pipenv shell
```

Setup the database:

```bash
python3 manage.py makemigrations octotramp
python3 manage.py migrate
```

## Running locally

```bash
python3 manage.py runserver
```
