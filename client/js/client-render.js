// All these function render piece of HTML to plug into the DOM tree.
// The HTML can be plugged using $('#id').html(new_html);

function render_authors(authors) {
	var html = "<tr>"+
			"<th>ID</th>"+
			"<th>Name</th>"+
			"<th>Country</th>"+
			"<th></th>"+
		"</tr>";

	for(var i=0; i<authors.length; i++) {
		var p = authors[i];
		html += "<tr>" +
			"<td>" + p.id + "</td>" +
			"<td><a href='#' data-authors-id='" + p.id + "' class='author-books'>" +
				html_escape(p.name) +
			"</a></td>"+
			"<td>" + html_escape(p.name) + "</td>" +
			"<td>" +
				"<a href='#' data-authors-id='" + p.id + "' class='edit_icon authors-edit'>Edit</a> " +
				"<a href='#' data-authors-id='" + p.id + "' class='delete_icon authors-delete'>Delete</a>" +
			"</td>" +
		"</tr>";
	}

	html = "<table class='grid'>"+html+"</table>";
	return html;
}

// task_4 edit
function render_author_form(author) {
	if(!author) return 'Empty author.';
	
	var html = ''
	var title = (author.id) ? 'Edit Person' : 'Add Person'; //decide what ? 
	
	html += "<h1>" + title + "</h1>";
	html += "<form action='#' method='post'>";
	html += "<p><label>ID</label><input name='id' value='" + html_escape(author.id) + "' readonly='readonly' /></p>";
	html += "<p><label>Name</label><input name='name' value='" + html_escape(author.name) + "'/></p>";
	html += "<p><label>Age</label><input name='age' value='" + html_escape(author.age) + "'/></p>";
	html += "<p><label>Country(ID)</label><input name='country_id' value='" + html_escape(author.country_id) + "'/></p>";
	html += "<p><button>Save</button></p>";
	html += "</form>";
	
	return html;
}
// task_4 edit

// books
function render_books(author, books) {	
	var html = '';
	var author_books_int = 0;

	for(var i=0; i<books.length; i++) {
		var book = books[i];
		if (book.author_id == author.id){
			author_books_int += 1; 
		}
	}
	console.log("DEBUG : Number of books of"+author.name+"is"+ author_books_int);
	// Task 2 add : here is formed the name and books number
	html += "<p class='user_icon'>"+ // wtf is this an icon :D
			"<b>" + html_escape(author.name) + "</b>, "+ 
			html_escape(author_books_int) + 
		"</p>";
	
	html += "<table class='grid'>";
	html += "<tr>"+
		"<th>ID</td>"+
		"<th>Title</th>"+
		"<th>Pages</th>"+
		"<th></th>"+
	"</tr>";
	for(var i=0; i<books.length; i++) {
		var book = books[i];
		html += "<tr>"+
			"<td>" + book.id + "</td>" +
			"<td>" + html_escape(book.title) + "</td>" +
			"<td>" + html_escape(book.pages) + "</td>" +
			"<td>" +
				"<a href='#' data-authors-id='" + author.id + "' data-books-id='" + book.id + "' class='edit_icon book-edit'>Edit</a> " +
				"<a href='#' data-authors-id='" + author.id + "' data-books-id='" + book.id + "' class='delete_icon book-delete'>Delete</a>" +
			"</td>"+
		"</tr>";
	}
	html += "</table>";
	
	html += "<p>" +
		"<a href='#' data-author-id='" + author.id + "' class='add_icon book-add'>Add New Telephone</a> " +
		"<a href='#' data-author-id='" + author.id + "' class='refresh_icon book-refresh'>Refresh</a>" +
		"</p>";

	return html;
}


function render_telephone_form(telephone) {
	if(!telephone) return 'Empty telephone.';
	
	var html = '';
	var title = (telephone.id) ? 'Edit Telephone' : 'Add Telephone';
	
	html += "<h1>" + title + "</h1>";
	html += "<form action='#' method='post'>";
	html += "<p><label>ID</label><input name='id' value='" + html_escape(telephone.id) + "' readonly='readonly' /></p>";
	html += "<p><label>PERSON_ID</label><input name='person_id' value='" + html_escape(telephone.person_id) + "' readonly='readonly' /></p>";
	html += "<p><label>Number</label><input name='number' value='" + html_escape(telephone.number) + "'/></p>";
	
	html += "<p><label>Type</label>";
	html += "<select name='teltype_id' class='txt medium'>";
	html += "<option value=''> </option>";
	for(var i = 0; i < TELTYPES.length; i++) {
		var teltype = TELTYPES[i];
		var selected = (telephone.teltype_id === teltype.id) ? 'selected' : '';
		html += "<option value='" + teltype.id + "' " + selected + ">" + teltype.name + "</option>";
	}
	html += "</select>";
	html += "</p>";

	html += "<p><button>Save</button></p>";
	html += "</form>";
	
	return html;
}

function render_messages(messages) {
	var html = '';
	if(messages) {	
		for(var i = 0; i < messages.length; i++) {
			var m = messages[i];
			var css = (m.type === 'error') ? 'error_icon' : 'info_icon';
			html += "<p class='" + css + "'>" + m.text + "</p>";
		}
	}
	return html;
}

function get_teltype(teltype_id) {
	// TELTYPES is global variable preloaded on client start.
	for(var i=0; i < TELTYPES.length; i++) {
		if(TELTYPES[i].id == teltype_id) {
			return TELTYPES[i];
		}
	}
	return null;
}
	
function html_escape(val) {
	return (val+'')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\"/g, '&quot;')
      .replace(/\'/g, '&apos;');
}

