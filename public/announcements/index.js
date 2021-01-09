(function () {
	addModal = true;
	setupEvents();
})();

async function setupEvents() {
	const fields = ["title", "description",	"link"];
	for (let field of fields) {
		let fg = htmlToElement(`
		<div class="form-group ">
			<label for="add-${field}">Announcement ${field[0].toUpperCase() + field.slice(1)}</label>
			<input type="text" class="form-control" id="add-${field}">
        </div>
		`);
		document.getElementsByClassName("form-row")[0].appendChild(fg);
	}
	for (let field of fields) {
		let fg = htmlToElement(`
		<div class="form-group ">
			<label for="edit-${field}">Announcement ${field[0].toUpperCase() + field.slice(1)}</label>
			<input type="text" class="form-control" id="edit-${field}">
		</div>
		`);
		document.getElementsByClassName("form-row")[1].appendChild(fg);
	}
	document.body.addEventListener('click', function (event) {
		if (event.target.classList.contains('delete-announcement')) {
			fetch(`/announcements/${event.target.getAttribute("value")}`, {
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
			let obj = {};
			for (let field of fields) {
				obj[field] = document.getElementById(`add-${field}`).value;
			}
			let uri = "/announcements";
			const method = "POST";
			if (!addModal) {
				uri = "/announcements/" + event.target.getAttribute("value");
				method = "PUT";
			}
			fetch(uri, {
				method: method,
				headers: { 'Content-type': 'application/json' },
				body: JSON.stringify(obj)
			}).then(res => res.json()).then(res => {
				console.log(res);
			})
		} else if (event.target.id === 'edit-submit') {
			console.log(event.target);
			let id = parseInt(document.getElementById("hidden-id").textContent);
			let obj = {id: id};
			for (let field of fields) {
				obj[field] = document.getElementById(`edit-${field}`).value;
			}
			let uri = "/announcements/" + id;
			const method = "PUT";
			fetch(uri, {
				method: method,
				headers: { 'Content-type': 'application/json' },
				body: JSON.stringify(obj)
			}).then(res => res.json()).then(async (res) => {
				console.log(res);
				search();
			})
		} else if (event.target.classList.contains("edit-announcement")) {
			document.querySelector("#edit-button").click();
			let mapping = maps[parseInt(event.target.getAttribute("value"))];
			document.getElementById("hidden-id").textContent = mapping["id"];
			for (let field of fields) {
				document.getElementById(`edit-${field}`).value = mapping[field] ? mapping[field] : "";
			}
			console.log(mapping["prerequisites"]);
		}
	});
}

function search() {
	fetch(`/announcements/name/${name_input.value}`).then(res => res.json()).then(res => {
		if (res !== null) {
			container.innerHTML = "";
			for (let announcement of res)
				addCard(announcement);
		} else {
			alert("Announcement not found!");
		}
	})
}

let container = document.getElementById("cards-container");
let name_input = document.getElementById("search");
let allCards = [];
let maps = {};

function addCard(announcement) {
	maps[announcement.id] = announcement;
	let card = htmlToElement(`
	<div class="card">
		<div class="card-body">
			<h5 class="card-title">${announcement.title}</h5>
			<h6 class="card-subtitle mb-2 text-muted">${announcement.link}</h6>
			<p class="card-text">${announcement.description}</p>
			<button value="${announcement.id}" class="edit-announcement btn btn-primary">Edit</button>
			<button value="${announcement.id}" class="delete-announcement btn btn-primary">Delete</button>
		</div>
	</div>`);
	container.appendChild(card);
}

function htmlToElement(html) {
	const template = document.createElement('template');
	html = html.trim();
	template.innerHTML = html;
	return template.content.firstChild;
}
