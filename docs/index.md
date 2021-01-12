# Admin Console

Heroku endpoint: `https://comet-data-service.web.app/`
## Courses

1. `GET /`:  UI for CRUD console
2. `POST /courses`: add a new course
3. `GET /courses/name/<name>`: get course info by name (public)
4. `GET /courses/id/<id>`: get course info by id (public)
5. `GET /courses`: get all courses
6. `PUT /courses/<id>`: edit course with id
7. `DELETE /course/<id>`: delete course with id

Note: routes that are not public can only be accessed on the admin console through Google OAuth login. Public routes are available to the public without any authentication.
### Course format:

```javascript
{
    "id": 403,
    "course": "CS 3345",
    "description": "Students will learn about data structures and algorithms",

    // useful info extracted from description
    "hours": "3", 
    "inclass": "3", 
    "outclass": "0",
    "period": "S",

    // prerequisite/corequisite information
    "prerequisites": "(CE 2305 or CS 2305) with a grade of C or better and (CE 2336 or CS 2336 or CS 2337) with a grade of C or better",
    "prerequisiteOrCorequisites": "(CS 3341 or SE 3341 or ENGR 3341)",
    "corequisites": "",

    // miscellaneous information from schedule planner API
    "subjectId": "CS",
    "subjectShort": "CS",
    "subjectLong": "CS - Computer Science",
    "number": "3345",
    "title": "DATA STRUCTURES & ALGORM ANLYS"
    "displayTitle": "3345 - DATA STRUCTURES & ALGORM ANLYS",
    "titleLong": "CS 3345 - DATA STRUCTURES & ALGORM ANLYS",
    "hasRestrictions": false,
    "hasTopics": false,
    "topic": null,
}
```

