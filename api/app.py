from flask import Flask, jsonify, request
import pyparsing as pp
from pyparsing import oneOf
import json
import copy

app = Flask(__name__)

# https://utdallas.collegescheduler.com/api/terms/2021%20Spring/subjects/CS/courses/3345

with open("data/new.json", 'r') as f:
    data = json.loads(f.read())
with open("data/major_requirements_processed.txt", 'r') as f:
    degreePlan = json.loads(f.read())
with open("data/ecs_computer-science.json", 'r') as f:
    ecs_cs = json.loads(f.read())

@app.route('/')
def hello():
    return "Hello World!"

@app.route('/api/plan/ecs/computer-science')
def degree():
    return jsonify(ecs_cs)

# @app.route('/degreeAll')
# def degreeAll():
#     return jsonify(degreePlan)


# @app.route('/degree')
# def degree():
#     school = request.args.get('school')
#     major = request.args.get('major')
#     try:
#         result = jsonify(degreePlan[school][major])
#     except:
#         result = {"message": "school/major not found"}
#     return result


# @app.route('/core')
# def core():
#     school = request.args.get('school')
#     major = request.args.get('major')
#     try:
#         result = jsonify(degreePlan[school][major]["Core"])
#     except:
#         result = {"message": "school/major not found"}
#     return result


# @app.route('/major')
# def major():
#     school = request.args.get('school')
#     major = request.args.get('major')
#     try:
#         result = jsonify(degreePlan[school][major]["Major"])
#     except:
#         result = {"message": "school/major not found"}
#     return result


# @app.route('/elective')
# def elective():
#     school = request.args.get('school')
#     major = request.args.get('major')
#     try:
#         result = jsonify(degreePlan[school][major]["Elective"])
#     except:
#         result = {"message": "school/major not found"}
#     return result


@app.route("/prerequisite")
def prereq():
    name = request.args.get('name')
    if name in data:
        new_data = copy.deepcopy(data[name])
        for index, req in enumerate(new_data["prerequisites"]):
            reqName = req.split(": ")
            new_data["prerequisites"][index] = {reqName[0]: process(reqName[1])}
        return jsonify(new_data["prerequisites"])
    return jsonify({"message": "course name not found."})


@app.route('/search')
def search():
    name = request.args.get('name')
    if name in data:
        return jsonify(data[name])
    return jsonify({"message": "course name not found."})

def recursion(obj, grade="CR"):
    if type(obj) == list and len(obj) == 1:
        return recursion(obj[0], grade=grade)
    if type(obj) == str:
        if obj in data:
            id = data[obj]["id"]
            return {"type": "course", "id": id, "grade": grade}
        return obj
    
    if type(obj) == list and len(obj) >= 3:
        comparator = obj[1] # and | or
        if comparator != "with":
            obj = {"node": {"type": "op", "id": comparator, "children": [recursion(req, grade=grade) for ind, req in enumerate(obj) if ind % 2 == 0]}}
        else:
            print(obj)
            obj = recursion(obj[0], grade=obj[2][0].split("_")[1])
        return obj
    
    for index, ob in enumerate(obj):
        obj[index] = recursion(ob, grade=grade)
    return obj

def process(st):
    complex_expr = pp.Forward()
    operator = pp.Regex(">=|<=|!=|>|<|=").setName("operator")
    logical = (pp.Keyword("AND") | pp.Keyword("OR") | pp.Keyword("WITH")).setName("logical")
    vars = pp.Regex(r"([A-Z]+ [0-9]+|GRADE_(A|B|C|B-|C-))")
    condition = (vars + operator + vars) | vars
    clause = pp.Group(condition ^ (pp.Suppress(
        "(") + complex_expr + pp.Suppress(")")))

    expr = pp.operatorPrecedence(clause, [
                                ("with", 2, pp.opAssoc.LEFT, ),
                                (oneOf("or and"), 2, pp.opAssoc.LEFT, )
                                 ])

    complex_expr << expr

    string = st # "((CE 3311 or EE 3311) and (CE 3320 or EE 3320) and (CE 3345 or CS 3345 or SE 3345) and (CE 3354 or CS 3354 or SE 3354)) or (ENGR 3300 and EE 3302 and (CE 3311 or EE 3311) and (CE 3320 or EE 3320)) or (ENGR 3300 and EE 3302 and (CE 3345 or CS 3345 or SE 3345))"
    # string = "RHET 1302 with GRADE_C"
    try:
        rep = complex_expr.parseString(string)
        strRep = str(rep).replace('\'', '"')

        js = json.loads(strRep)
        res = recursion(js)
        return res
    except:
        return {"message": "Prerequisites can not be parsed"}
    


if __name__ == '__main__':
    app.run()