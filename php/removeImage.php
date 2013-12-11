<?php
include "../../acc/logs.php";
include 'settings.php';

if (!$sql_connect = @mysql_connect($SERVER, $USER,$PSW ))
	die('{"status":"'.$_SERVER_ERROR.'","message":"'.$_DB_CONNECT_ERROR_MESSAGE.': '.mysql_error().'"}');
mysql_select_db($DB,$sql_connect) or die('{"status":"'.$_SERVER_ERROR.'","message":"'.$_SERVER_ERROR.'","'.$_DB_OPEN_ERROR_MESSAGE.': '.mysql_error().'"}');

$TABLE = 'images';

if(!isset($_POST['imageID']) || !isset($_POST['nodeID']) || !isset($_POST['imageName']))
	die('{"status":"'.$_SERVER_ERROR.'","message":"'.$_DB_INVALID_DATA_ERROR_MESSAGE.': '.mysql_error().'"}');
$nodeID = $_POST['nodeID'];
$imageID = $_POST['imageID'];
$imageName = $_POST['imageName'];

/////   delete
$del = "DELETE FROM $TABLE WHERE ID = $imageID";
mysql_query($del,$sql_connect) or die('{"status":"'.$_SERVER_ERROR.'","message":"'.$_DB_SELECT_ERROR_MESSAGE.': '.mysql_error().'"}');

///////// READ
$imagesToSendBack = getImages($nodeID);

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

/// REMOVE FILE

$message = '';

$fileName = $GLOBALS['IMAGE_PATH'].$imageName;
$thumbFileName = $GLOBALS['IMAGE_THUMB_PATH'].$imageName;
try{
	$s1 = unlink($fileName);
	$s2 = unlink($thumbFileName);
}
catch(Exception $e){
	$message.= 'Could not delete.';
}
if(!$s1)
	$message.= 'could not delete:::: '.$fileName;

if(!$s2)
	$message.= 'could not delete:::: '.$thumbFileName;

////// FEEDBACK
print '{"status":"OK", "IMAGES":['.$imagesToSendBack.'],"message":"'.$message.'"}';
?>