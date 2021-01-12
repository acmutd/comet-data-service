const base = `https://utdallas.collegescheduler.com/api/terms/2021%20Spring/subjects`;

const number = "(?:\\d(?:\\.\\d)*)"
const range = `(?:(\\[${number}-${number}\\]|\\[${number} or ${number}\\]|${number}))`;
const course_re = new RegExp(`\\(${range}-${range}\\) (\\S)$`);

const prereq_re = /\. (Prerequisite[s]* or Corequisite|Prerequisite|Corequisite)[s]*: (.*?)(?=(\.))/g;

let id_counter = 0;
let allCourses = [];

// TODO: remove unnecessary props
// const remove_props = ["subjectId", "subjectShort", "subjectLong", "number", "title",
//                      "displayTitle", "titleLong", "hasRestrictions", "hasTopics", "topic"];

function fetch_prereqs(course) {
    let matches = [...course["description"].matchAll(prereq_re)];
    for(let match of matches) {
        if (match[1].includes('or Corequisite')) 
            course["prerequisiteOrCorequisites"] = match[2];
        else if (match[1].includes('Prerequisite'))
            course["prerequisites"] = match[2];
        else if (match[1].includes('Corequisite'))
            course["corequisites"] = match[2];
    }
    course["description"] = course["description"].replaceAll(prereq_re, "");
}

function process(course) {
    course["id"] = id_counter++;
    course["course"] = course["subjectId"] + " " + course["number"];
    if(course["number"].length >= 2) 
        course["hours"] = course["number"][1];

    let desc = course["description"];
    let match = course_re.exec(desc);
    if(match && match.length == 4) {
        course["inclass"] = match[1];
        course["outclass"] = match[2];
        course["period"] = match[3];
        // console.log("Description: " + desc);
        // console.log("Matched: " + match[1] + " -> " + match[2] + "; " + match[3]);
    } else {
        console.error(desc);
    }

    fetch_prereqs(course);
    allCourses.push(course);
}

async function scrape_college_scheduler() {
    fetch(base).then(res => res.json()).then(async (data) => {
        for (let subject of data) {
            await fetch(`${base}/${subject.id}/courses`)
                .then(a => a.json()).then(async (subject_detail) => {
                    for (let course of subject_detail) {
                        await fetch(`${base}/${subject.id}/courses/${course.number}`)
                            .then(a => a.json())
                            .then((course_detail) => process(course_detail));
                    }
            })
            console.log(`done with ${subject.id}`);
        }
    })
}
