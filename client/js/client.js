// This is a global variable with all rows of the "teltypes" table.
var TELTYPES = [];

function reload_authors() {
	$.get('authors').done(function(data) {
		$('#authors').html(render_authors(data.authors));
		$('#authors-messages').html(render_messages(data.messages));
	}).fail(function(response) {
		var data = response.responseJSON;
		$('#authors-messages').html(render_messages(data.messages));
	});
}

function reload_books(author_id) {
	$.get('authors/' + author_id + '/books').done(function(data) {
		$('#books').html(render_books(data.author, data.books));
		$('#books-messages').html(render_messages(data.messages));
	}).fail(function(response) {
		var data = response.responseJSON;
		$('#books-messages').html(render_messages(data.messages));
	});
}

function reload_countries() {
	$.get('countries').done(function(data) {
		TELTYPES = data.countries;
	}).fail(function(response) {
		var data = response.responseJSON;
		$('#countries-messages').html(render_messages(data.messages)); // may be authors-messages
	});
}

$(document).ready(function() {
	
	//reload_books();
	reload_authors();

	$(document).on('click', 'a.authors-refresh', function() {
		reload_authors();
		return false; // disables default browser behavior when a hyper-link is clicked.
	});

	$(document).on('click', 'a.authors-add', function() {
		var new_author = { id: '', name: '', age: '',	country_id: '' };
		$('#authors-edit').html(render_authors_form(new_author));
		$('#authors-messages').html('');
		return false;
	});

	$(document).on('click', 'a.authors-edit', function() {
		var authors_id = $(this).attr('data-authors-id');
		$.get('authors/'+author_id).done(function(data) {
			$('#authors-edit').html(render_authors_form(data.authors));	
			$('#authors-messages').html(render_messages(data.messages));
		}).fail(function(response) {
			var data = response.responseJSON;
			$('#authors-messages').html(render_messages(data.messages));
		});
		return false;
	});

	$(document).on('submit', '#authors-edit > form', function() {
		var edited_author = $(this).serializeObject();
		$.postJSON('authors/' + edited_author.id, edited_author).done(function(data) {
			$('#authors-edit').html('');
			$('#authors-messages').html(render_messages(data.messages));
			reload_authors();
		}).fail(function(response) {
			var data = response.responseJSON;
			$('#authors-messages').html(render_messages(data.messages));
		});
		return false;
	});

	$(document).on('click', 'a.authors-delete', function() {
		var author_id = $(this).attr('data-author-id');
		$.delete('authors/' + author_id).done(function(data) {
			reload_authors();
			$('#authors-messages').html(render_messages(data.messages));
		}).fail(function(response) {
			var data = response.responseJSON;
			$('#authors-messages').html(render_messages(data.messages));
		});
		return false;
	});


	// BOOKS
	// Task _ 2  // whenever there is a click on the link 
	$(document).on('click', 'a.author-books, a.books-refresh', function() {
		var author_id = $(this).attr('data-authors-id');
		reload_books(author_id);  // call the function with the argument id
		$('#books-edit').html('');
		$('#books-messages').html('');
		return false;
	});
	// Task _ 2 


	$(document).on('click', 'a.books-delete', function() {
		var book_id = $(this).attr('data-book-id');
		var author_id = $(this).attr('data-authors-id');
		$.delete('books/' + book_id).done(function(data) {
			reload_books(author_id);
		});
		return false;
	});

	$(document).on('click', 'a.books-edit', function() {
		var book_id = $(this).attr('data-books-id');
		$.get('books/'+book_id).done(function(data){
			$('#books-edit').html(render_telephone_form(data.books));
			$('#books-messages').html(render_messages(data.messages));					
		}).fail(function(response) {
			var data = response.responseJSON;
			$('#telephone-messages').html(render_messages(data.messages));
		});
		return false;
	});
/*
	$(document).on('click', 'a.books-add', function() {
		var author_id = $(this).attr('data-authors-id');
		var new_book = { id: '', author_id: author_id, number: '', teltype_id: '' };
		$('#telephone-edit').html(render_telephone_form(new_telephone));
		$('#telephone-messages').html('');
		return false;
	});
*/
	$(document).on('submit', '#books-edit > form', function() {
		var book = $(this).serializeObject();
		$.postJSON('books/' + boos.id, book).done(function(data) {
			$('#books-edit').html('');
			$('#books-messages').html(render_messages(data.messages));
			reload_books(books.authors_id);
		}).fail(function(response) {
			var data = response.responseJSON;
			$('#books-messages').html(render_messages(data.messages));
		});
		return false;
	});
});
