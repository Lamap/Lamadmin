<?php
include "../../acc/logs.php";

if (!$sql_connect = @mysql_connect($SERVER, $USER,$PSW ))
	die('{"status":"'.$_SERVER_ERROR.'","message":"'.$_DB_CONNECT_ERROR_MESSAGE.': '.mysql_error().'"}');
mysql_select_db($DB,$sql_connect) or die('{"status":"message":"'.$_SERVER_ERROR.'","'.$_DB_OPEN_ERROR_MESSAGE.': '.mysql_error().'"}');

$TABLE_IMAGE = 'images';
$TABLE_STRUCTURE = 'structure'; 
if(!isset($_POST['fileName']) || !isset($_POST['ID']))
	die('{"status":"'.$_SERVER_ERROR.'","message":"'.$_DB_INVALID_DATA_ERROR_MESSAGE.': '.mysql_error().'"}');
$ID = $_POST['ID'];

$name = $_POST['fileName'];

///////// INSERT
$upd = "INSERT INTO $TABLE_IMAGE SET ID = NULL, structureID = $ID, name = '$name'";
mysql_query($upd,$sql_connect) or die('{"status":"'.$_SERVER_ERROR.'","message":"'.$_DB_INSERT_ERROR_MESSAGE.': '.$ins.mysql_error().'"}');	

$imagesToSendBack = getImages($ID);


function getImages($id){
	$_SERVER_ERROR = $GLOBALS['_SERVER_ERROR'];
	$_DB_SELECT_ERROR_MESSAGE = $GLOBALS['_DB_SELECT_ERROR_MESSAGE'];
	$sql_connect = $GLOBALS['sql_connect'];
	
	$selImg = "SELECT * from images WHERE structureID = $id ORDER BY ID";
	$resImg = mysql_query($selImg,$sql_connect) or die('{"status":"'.$_SERVER_ERROR.'","message":"'.$_DB_SELECT_ERROR_MESSAGE.': '.mysql_error().'"}');
	
	$images = '';
	$i = 0;
	while ($sor = mysql_fetch_array($resImg, MYSQL_ASSOC)) {
		if($i != 0)
			$images.= ',';		
		$images.= '{"name":"'.$sor['name'].'", ';
		$images.= '"ID":"'.$sor['ID'].'"}';	
		$i++;
	}
	
	return $images;
}

print '{"status":"OK", "IMAGES":['.$imagesToSendBack.']}';
?>