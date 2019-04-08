<?php

// Route URL paths
if($request->get('authors')) {
	$response->authors = $db->querybind_all('SELECT authors.id, authors.name, countries.name FROM AUTHORS INNER JOIN countries on countries.id = authors.country_id Order by id');
}
/*\
Problem for task 1 : 
If we join the tables , how to display countries.name column where
there is the same column name in authors. ? 
*/
else if($request->get('authors/[0-9]+')) {
	$person_id = (int) $request->segment(1);
	$response->authors = $db->querybind_one('SELECT * FROM authors WHERE id = ?', [ $person_id ]);
	if(!$response->authors) {
		$response->code(404);
		$response->error('404: Person Not Found.');
	}
}

else if($request->post('authors/[0-9]+') || $request->post('persons')) {
	$person_id = (int) $request->segment(1, 0);
	$person = $request->data;
	if($person) {	
		if(strlen($person->fname) < 1) $response->error('First Name is empty.');
		if(strlen($person->lname) < 1) $response->error('Last Name is empty.');
		if(strlen($person->address) < 3) $response->error('Address is shorter then 3 characters.');
	}
	else {
		$response->error('No JSON data sent.');
	}
	
	if($response->hasErrors()) {
		$response->code(400);
		$response->error('400: Invalid input.');
	}
	else {
		if($person_id > 0) { // update existing
			$result = $db->querybind(
				'UPDATE persons SET fname=?, lname=?, address=? WHERE id=?', 
				[$person->fname, $person->lname, $person->address, $person_id]
			);
		} else { // insert new
			$result = $db->querybind(
				'INSERT INTO persons SET fname=?, lname=?, address=?', 
				[$person->fname, $person->lname, $person->address]
			);
			$person_id = $db->insert_id;
		}
		
		$response->person = $db->querybind_one('SELECT * FROM persons WHERE id = ?', [$person_id]);
		$response->info('Person saved.');	
	}
}
else if($request->delete('persons/[0-9]+')) {
	$person_id = (int) $request->segment(1);
	$db->querybind('DELETE FROM telephones WHERE person_id = ?', [$person_id] );
	$db->querybind('DELETE FROM persons WHERE id = ?', [$person_id] );
	$response->info("Person id=$person_id and its telephones deleted.");
}

//Task 2 begin : 
else if($request->get('authors/[0-9]+/books')) {
	$author_id = (int) $request->segment(1);
	$response->author = $db->querybind_one('SELECT * FROM authors WHERE id = ?', [$author_id] );
	$response->books = [];
	if($response->author) {
		$response->books = $db->querybind_all('SELECT * FROM books WHERE author_id = ?', [$author_id] );
	}
	else {
		$response->code(404);
		$response->error("404: Author with id=$author_id not found.");
	}
}
// Task 2 end 

else if($request->get('telephones/[0-9]+')) {
	$telephone_id = (int) $request->segment(1);
	$response->telephone = $db->querybind_one('SELECT * FROM telephones WHERE id = ?', [ $telephone_id ]);
	if(!$response->telephone) {
		$response->code(404);
		$response->error('404: Telephone Not Found.');
	}
}
else if($request->post('telephones/[0-9]+') || $request->post('telephones')) {
	$telephone_id = (int) $request->segment(1);
	$telephone = $request->data; // deserialized JSON object sent over the network.
	if($telephone) {
		if(strlen($telephone->number) < 1) $response->error('Number is empty.');
		if($telephone->person_id < 1) $response->error('Missing person_id.');
		if($telephone->teltype_id < 1) $response->error('Type is empty.');
//		$teltype = $db->querybind_one("SELECT * FROM teltypes WHERE id = ?", [$telephone->teltype_id + 0]);
//		if(!$teltype) $response->error('Type is invalid.');
	}
	else {
		$response->error('No JSON data sent.');
	}
	
	if($response->hasErrors()) {
		$response->code(400);
		$response->error('400: Invalid input.');		
	}
	else {
		$args = [$telephone->person_id, $telephone->teltype_id, $telephone->number, $telephone_id];
		
		if($telephone_id > 0) { // update existing
			$result = $db->querybind('UPDATE telephones SET person_id=?, teltype_id=?, number=? WHERE id=?', $args);
		} else { // insert new
			$result = $db->querybind('INSERT INTO telephones SET person_id=?, teltype_id=?, number=?', $args);
			$telephone_id = $db->insert_id;
		}

		$response->telephone = $db->querybind_one('SELECT * FROM telephones WHERE id = ?', [$telephone_id]);
		$response->info('Telephone saved.');	
	}
}
else if($request->delete('telephones/[0-9]+')) {
	$telephone_id = (int) $request->segment(1);
	$db->querybind('DELETE FROM telephones WHERE id = ?', [$telephone_id] );
	$response->info("Telephone id=$telephone_id deleted.");
}
else if($request->get('teltypes')) {
	$response->teltypes = $db->querybind_all('SELECT * FROM teltypes ORDER BY id');
}
else {
	$response->error('404: URL Not Found: /'.$request->path);
	$response->code(404);
}

// Outputs $response object as JSON to the client.
echo $response->render();