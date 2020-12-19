(function () {
	addModal = true;
	setupEvents();
	/*fetch("/courses").then(res => res.json()).then(res => {
		console.log(res);
		allCards = res;
		for(var i = 0; i < 10; i++) {
			addCard(allCards[i]);
		}

	})*/
})();

var addModal = true;

function setupEvents() {
	var fields = ["number", "name", "description", "hours", "period", "inclass", "outclass"];
	for (var field of fields) {
		var fg = htmlToElement(`
		<div class="form-group ">
			<label for="add-${field}">Course ${field[0].toUpperCase() + field.slice(1)}</label>
			<input type="text" class="form-control" id="add-${field}">
        </div>
		`);
		document.getElementsByClassName("form-row")[0].appendChild(fg);
	}
	document.body.addEventListener('click', function (event) {
		if (event.target.classList.contains('delete-course')) {
			fetch(`/courses/${event.target.getAttribute("value")}`, {
				method: 'DELETE'
			}).then(res => res.json()).then(res => {
				console.log(res);
				search();
			})
		} else if (event.target.id === 'search-name') {
			event.preventDefault();
			search();
		} else if (event.target.id === 'add-submit') {
			console.log(event.target);
			var obj = {};
			for (var field of fields) {
				obj[field] = document.getElementById(`add-${field}`).value;
			}
			var uri = "/courses";
			var method = "POST";
			if(!addModal) {
				uri = "/courses/" + event.target.getAttribute("value");
				method = "PUT";
			}
			fetch(uri, {
				method: method,
				headers: { 'Content-type': 'application/json' },
				body: JSON.stringify(obj)
			}).then(res => res.json()).then(res => {
				console.log(res);
			})
		} else if (event.target.classList.contains("edit-course")) {
			addModal = false;

		}
	});
}

function search() {
	fetch(`/courses/name/${name_input.value}`).then(res => res.json()).then(res => {
		if (res !== null) {
			container.innerHTML = "";
			for (var course of res)
				addCard(course);
		} else {
			alert("Course not found!");
		}
	})
}

var container = document.getElementById("cards-container");
var name_input = document.getElementById("search");
var allCards = [];

function addCard(course) {
	var card = htmlToElement(`
	<div class="card">
				<div class="card-body">
					<h5 class="card-title">${course.course}</h5>
					<h6 class="card-subtitle mb-2 text-muted">${course.name}</h6>
					<p class="card-text">${course.description}</p>
					<h6 class="card-subtitle mb-3 text-muted">
						Hours: ${course.hours} | Period: ${course.period} | Inclass: ${course.inclass} |
				Outclass: ${course.outclass}
					</h6>
					<button value="${course.id}" class="edit-course btn btn-primary">Edit</button>
					<button value="${course.id}" class="delete-course btn btn-primary">Delete</button>
				</div>
			</div>`);
	container.appendChild(card);
}

function htmlToElement(html) {
	var template = document.createElement('template');
	html = html.trim(); // Never return a text node of whitespace as the result
	template.innerHTML = html;
	return template.content.firstChild;
}