// This is a global variable with all rows of the "teltypes" table.
var TELTYPES = [];

function reload_persons() {
	$.get('persons').done(function(data) {
		$('#persons').html(render_persons(data.persons));
		$('#persons-messages').html(render_messages(data.messages));
	}).fail(function(response) {
		var data = response.responseJSON;
		$('#persons-messages').html(render_messages(data.messages));
	});
}

function reload_telephones(person_id) {
	$.get('persons/' + person_id + '/telephones').done(function(data) {
		$('#telephones').html(render_telephones(data.person, data.telephones));
		$('#telephones-messages').html(render_messages(data.messages));
	}).fail(function(response) {
		var data = response.responseJSON;
		$('#telephones-messages').html(render_messages(data.messages));
	});
}

function reload_teltypes() {
	$.get('teltypes').done(function(data) {
		TELTYPES = data.teltypes;
	}).fail(function(response) {
		var data = response.responseJSON;
		$('#persons-messages').html(render_messages(data.messages));
	});
}

$(document).ready(function() {
	
	reload_teltypes();
	reload_persons();

	$(document).on('click', 'a.persons-refresh', function() {
		reload_persons();
		return false; // disables default browser behavior when a hyper-link is clicked.
	});

	$(document).on('click', 'a.person-add', function() {
		var new_person = { id: '', fname: '', lname: '',	address: '' };
		$('#person-edit').html(render_person_form(new_person));
		$('#person-messages').html('');
		return false;
	});

	$(document).on('click', 'a.person-edit', function() {
		var person_id = $(this).attr('data-person-id');
		$.get('persons/'+person_id).done(function(data) {
			$('#person-edit').html(render_person_form(data.person));	
			$('#person-messages').html(render_messages(data.messages));
		}).fail(function(response) {
			var data = response.responseJSON;
			$('#person-messages').html(render_messages(data.messages));
		});
		return false;
	});

	$(document).on('submit', '#person-edit > form', function() {
		var edited_person = $(this).serializeObject();
		$.postJSON('persons/' + edited_person.id, edited_person).done(function(data) {
			$('#person-edit').html('');
			$('#person-messages').html(render_messages(data.messages));
			reload_persons();
		}).fail(function(response) {
			var data = response.responseJSON;
			$('#person-messages').html(render_messages(data.messages));
		});
		return false;
	});

	$(document).on('click', 'a.person-delete', function() {
		var person_id = $(this).attr('data-person-id');
		$.delete('persons/' + person_id).done(function(data) {
			reload_persons();
			$('#person-messages').html(render_messages(data.messages));
		}).fail(function(response) {
			var data = response.responseJSON;
			$('#person-messages').html(render_messages(data.messages));
		});
		return false;
	});


	// TELEPHONES
	$(document).on('click', 'a.person-telephones, a.telephones-refresh', function() {
		var person_id = $(this).attr('data-person-id');
		reload_telephones(person_id);
		$('#telephone-edit').html('');
		$('#telephone-messages').html('');
		return false;
	});

	$(document).on('click', 'a.telephone-delete', function() {
		var telephone_id = $(this).attr('data-telephone-id');
		var person_id = $(this).attr('data-person-id');
		$.delete('telephones/' + telephone_id).done(function(data) {
			reload_telephones(person_id);
		});
		return false;
	});

	$(document).on('click', 'a.telephone-edit', function() {
		var telephone_id = $(this).attr('data-telephone-id');
		$.get('telephones/'+telephone_id).done(function(data){
			$('#telephone-edit').html(render_telephone_form(data.telephone));
			$('#telephone-messages').html(render_messages(data.messages));					
		}).fail(function(response) {
			var data = response.responseJSON;
			$('#telephone-messages').html(render_messages(data.messages));
		});
		return false;
	});

	$(document).on('click', 'a.telephone-add', function() {
		var person_id = $(this).attr('data-person-id');
		var new_telephone = { id: '', person_id: person_id, number: '', teltype_id: '' };
		$('#telephone-edit').html(render_telephone_form(new_telephone));
		$('#telephone-messages').html('');
		return false;
	});

	$(document).on('submit', '#telephone-edit > form', function() {
		var telephone = $(this).serializeObject();
		$.postJSON('telephones/' + telephone.id, telephone).done(function(data) {
			$('#telephone-edit').html('');
			$('#telephone-messages').html(render_messages(data.messages));
			reload_telephones(telephone.person_id);
		}).fail(function(response) {
			var data = response.responseJSON;
			$('#telephone-messages').html(render_messages(data.messages));
		});
		return false;
	});
});
