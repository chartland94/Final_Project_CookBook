var fs = require( "fs" );
var http = require( "http" );
var sqlite = require( "sqlite3" );


function listCountries( req, res )
{
var db = new sqlite.Database( "recipe_final.sqlite" );
var resp_text = "<!DOCTYPE html>"+
"<html>" + "<h1>Cuisines in Cookbook</h1>" +
"<body style=\"background-image: url('http://www.oraviaggiando.it/amministrazione/ristoranti/1329458810-f2-osteria-francescana-modena-bottura3.jpg')\">" +
"<li>" + "<a href='http://localhost:8080/'>Back to Home Page</a></li>" + 
"<li>" + "</li>" +
"<table border='1'>" +
"<tr>" + "<th>Cuisine</th>" + "<th>ID</th>" + "</tr>";
db.each( "SELECT * FROM CUISINES", function( err, row ) {

resp_text += "<tr>" + "<td>" + "<a href='/list_recipe_by_country?country=" + row.CID + "'>" + row.NAME + "</a></td>" + "<td>" + row.CID + "</th></tr>";
});
db.close(
function() {
console.log("this was done");
console.log( "Complete! ");
resp_text += "</body>" + "</html>";
res.writeHead( 200 );
res.end( resp_text );
} );
}

function addCuisine( req, res )
{
	var db = new sqlite.Database("recipe_final.sqlite");
	var form_text = req.url.split( "?" )[1];
	var form_inputs = form_text.split( "&" );
	var perf_input = form_inputs[0].split( "=" );
	var name = decodeURIComponent( ( perf_input[1] + '' ).replace( /\+/g, '%20' ) );
	var sql_cmd = "INSERT INTO CUISINES ('NAME') VALUES ('"+
	name+"')";
	db.run( sql_cmd );
	db.close();
	res.writeHead( 200 );
	var resp_text = "<html><body style='background-image: url(\"http://www.magic4walls.com/wp-content/uploads/2014/09/cuisine-cinnamon-green-apple-picture-hd-food-wallpaper.jpg\")'>" + "<a  style='color:black' href='http://localhost:8080/'>Back to Home Page</a>" + "<br><br>" + name + " was added to the cuisine list." + "</body></html>";
	res.end( resp_text );
}





function listRecipeCountry( req, res )
{
var db = new sqlite.Database( "recipe_final.sqlite" );
var form_text = req.url.split( "?" )[1];
var form_inputs = form_text.split( "&" );
var perf_input = form_inputs[0].split( "=" );
var look_ID = parseInt(perf_input[1]);
var count_row = 0;
var resp_text = "<!DOCTYPE html>"+
"<html>" + "<h1>Recipes by Cuisine</h1>" +
"<body style=\"background-image: url('http://web-rockstars.com/gourmet/wp-content/uploads/2014/02/Steak7.jpg')\">" +
"<li>" + "<a href='http://localhost:8080/'>Back to Home Page</a></li>" + 
"<li>" + "</li>" +
"<table border='1'>" +
"<tr>" + "<th>Name</th>" +  "<th>Cuisine</th>" + "</tr>";
db.each( "SELECT CUISINES.CID, CUISINES.NAME as cname, RECIPES.NAME as rname, * FROM RECIPES " + "JOIN CUISINES on CUISINES.CID = RECIPES.CID", function( err, row ) {
if ( row.CID === look_ID )
{
resp_text += "<tr>" + "<td>" + "<a href='/list_recipe_by_id?recipe=" + row.RID + "'>" + row.rname + "</a>" + "</td>" +  "<td>" + row.cname + "</td></tr>";
count_row++;
}
});
db.close(
function() {
console.log( "Complete! ");
if( count_row === 0 )
{
	resp_text += "<p>I'm sorry. No recipes were found for Country ID: " + perf_input[1] + "</p>";
}
resp_text += "</body>" + "</html>";
res.writeHead( 200 );
res.end( resp_text );
} );
}


function listRecipeID( req, res )
{
var db = new sqlite.Database( "recipe_final.sqlite" );
var form_text = req.url.split( "?" )[1];
var form_inputs = form_text.split( "&" );
var perf_input = form_inputs[0].split( "=" );
var look_ID = parseInt(perf_input[1]);
var count_row = 0;
console.log( look_ID );
var resp_text = "<!DOCTYPE html>"+
"<html>" + "<h1>Recipe Information</h1>" +
"<body style=\"background-image: url('http://www.aiwalls.com/wp-content/photography/2012061821/meatdrink_1013648.jpg')\">" +
"<a href='http://localhost:8080/'>Back to Home Page</a>" + "<br><br>" ;
db.each( "SELECT * FROM RECIPES", function( err, row ) {
var recipe_lines = row.INSTRUCTIONS.split("-");
var ing_lines = row.INGREDIENTS.split("-");
if ( row.RID === look_ID )
{
resp_text += "<p><li><b>Recipe Name: </b>" + row.NAME + "</li>" + 
			 "<li><b>Time Needed: </b>" + row.TIME + "</li></p>" +
			 "<li><img src='" + row.IMAGE + "' style='width:304px;height:228px'</img></li>" +
       "<li><b>Ingredients:</b></li>";
for ( var i = 0; i < ing_lines.length; i++)
{
  resp_text += "<li>" + ing_lines[i] + "</li><br>";
}

resp_text += "<li><b>Instructions:</b></li>";
for ( var i = 0; i < recipe_lines.length; i++)
{
	resp_text += "<li>" + recipe_lines[i] + "</li><br>";
}
count_row++;
}
});
db.close(
function() {
console.log( "Complete! ");
if( count_row === 0 )
{
	resp_text += "<p>I'm sorry. No information was found for Recipe ID: " + perf_input[1] + "</p>";
}
resp_text += "</body>" + "</html>";
res.writeHead( 200 );
res.end( resp_text );
} );
}

function addRecipe( req, res )
{
	var db = new sqlite.Database( "recipe_final.sqlite" );
	var form_text = req.url.split( "?" )[1];
	var form_inputs = form_text.split( "&" );
	var perf_input = form_inputs[0].split( "=" );
	var perf_input2 = form_inputs[1].split( "=" );
	var perf_input3 = form_inputs[2].split( "=" );
	var perf_input4 = form_inputs[3].split( "=" );
	var perf_input5 = form_inputs[4].split( "=" );
  var perf_input6 = form_inputs[5].split( "=" );
	var name = decodeURIComponent( ( perf_input[1] + '' ).replace( /\+/g, '%20' ) );
	var cid = decodeURIComponent( ( perf_input2[1] + '' ).replace( /\+/g, '%20' ) );
	var time = decodeURIComponent( ( perf_input3[1] + '' ).replace( /\+/g, '%20' ) );
	var image = decodeURIComponent( ( perf_input4[1] + '' ).replace( /\+/g, '%20' ) );
	var ing = decodeURIComponent( ( perf_input5[1] + '' ).replace( /\+/g, '%20' ) );
  var info = decodeURIComponent( ( perf_input6[1] + '' ).replace( /\+/g, '%20' ) );
		var sql_cmd = "INSERT INTO RECIPES('NAME', 'CID', 'TIME', 'IMAGE' , 'INGREDIENTS', 'INSTRUCTIONS') VALUES ('"+
		name+"', '"+
		cid+"', '"+
		time+"', '"+
		image+"', '"+
    ing+"', '"+
		info+"')";
    db.run( sql_cmd );
		db.close();
		res.writeHead( 200 );
		var resp_text = "<html><body style='background-image: url(\"http://www.magic4walls.com/wp-content/uploads/2014/09/cuisine-cinnamon-green-apple-picture-hd-food-wallpaper.jpg\")'>" + "<a  style='color:black' href='http://localhost:8080/'>Back to Home Page</a>" + "<br><br>" + "The recipe was added to the cuisine list, thank you for contributing!!</body></html>"
		res.end( resp_text );
}


function removeAllChildren( html_elem )
{
    while( html_elem.firstChild )
    {
        html_elem.removeChild( html_elem.firstChild );
    }
}


function appendChildren( parent, children )
{
    for( var i = 0; i < children.length; i++ )
        parent.appendChild( children[ i ] );
}

function draw()
{
	console.log("hello");
    var main_list = document.getElementById( "main_list" );
    removeAllChildren( main_list );
      

        var new_image = document.createElement( "img");
        new_image.src = "http://www.seriouseats.com/recipes/assets_c/2013/03/20130304-243181-chicken-satay-thumb-625xauto-310277.jpg";
       	new_image.height = 250;
       	new_image.width = 250;

        var new_image2 = document.createElement( "img");
        new_image2.src = "http://www.seriouseats.com/recipes/assets_c/2015/04/20150412-Baked-Mozzarella-Stuffed-Onion-Rings-Cheese-Morgan-Eisenberg-thumb-625xauto-421875.jpg";
       	new_image2.height = 250;
       	new_image2.width = 250;       

        var new_image3 = document.createElement( "img");
        new_image3.src = "http://www.seriouseats.com/recipes/assets_c/2015/03/20150309-gyoza-how-to-japanese-dumpling-recipe-01-thumb-625xauto-420099.jpg";
       	new_image3.height = 250;
       	new_image3.width = 250; 

       	var first_name = document.createElement("a");
       	var sec_name = document.createElement("a");
       	var thir_name = document.createElement("a");

       	first_name.href = "/list_recipe_by_id?recipe=9";
       	first_name.textContent = "Thai Satay Chicken";

       	sec_name.href = "/list_recipe_by_id?recipe=5";
       	sec_name.textContent = "Mozzarell Stuffed Onion Rings";

       	thir_name.href = "/list_recipe_by_id?recipe=8";
       	thir_name.textContent = "Gyoza";

       	var name_item = document.createElement("td");
       	appendChildren( name_item, [first_name]);
        name_item.style.width = "500px" ;

       	var name_item2 = document.createElement("td");
       	appendChildren( name_item2, [sec_name]);
        name_item2.style.width = "500px" ;

       	var name_item3 = document.createElement("td");
       	appendChildren( name_item3, [thir_name]);


        var table_item0 = document.createElement( "tr" );
        appendChildren( table_item0, [ name_item, name_item2, name_item3] );
        main_list.appendChild(table_item0);

       	var row_item = document.createElement("td");
       	appendChildren( row_item, [new_image]);
       	var row_item2 = document.createElement("td");
       	appendChildren( row_item2, [new_image2]);
       	var row_item3 = document.createElement("td");
       	appendChildren( row_item3, [new_image3]);

        var table_item = document.createElement( "tr" );
        appendChildren( table_item, [ row_item, row_item2, row_item3] );
        main_list.appendChild(table_item);
}

function serveFile( filename, req, res )
{
try
{
var contents = fs.readFileSync( filename ).toString();
}
catch( e )
{
console.log(
"Error: Something bad happened trying to open "+filename );
res.writeHead( 404 );
res.end( "" );
return;
}
res.writeHead( 200 );
res.end( contents );
}



function serverFn( req, res )
{
var filename = req.url.substring( 1, req.url.length );
console.log("filename " + filename + filename.length)
if( filename == "" )
{
filename = "./index.html";
}
if( filename.substring( 0, 14 ) == "list_countries" )
{
listCountries( req, res );
}
else if( filename.substring( 0, 22 ) == "list_recipe_by_country")
{
listRecipeCountry( req, res);
}
else if( filename.substring( 0, 17 ) == "list_recipe_by_id")
{
listRecipeID( req, res);
}
else if( filename.substring( 0, 11 ) == "add_cuisine")
{
addCuisine( req, res);
}
else if( filename.substring( 0, 10 ) == "add_recipe")
{
addRecipe( req, res);
}
else
{
serveFile( filename, req, res );
}
}

var server = http.createServer( serverFn );

server.listen( 8080 );