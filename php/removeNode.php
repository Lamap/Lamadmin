<?php
include "../../acc/logs.php";
include 'settings.php';

if (!$sql_connect = @mysql_connect($SERVER, $USER,$PSW ))
	die('{"status":"'.$_SERVER_ERROR.'","message":"'.$_DB_CONNECT_ERROR_MESSAGE.': '.mysql_error().'"}');
mysql_select_db($DB,$sql_connect) or die('{"status":"'.$_SERVER_ERROR.'","message":"'.$_DB_OPEN_ERROR_MESSAGE.': '.mysql_error().'"}');

$TABLE = 'structure';

if(!isset($_POST['childrenIDs']) || !isset($_POST['ID']))
	die('{"status":"'.$_SERVER_ERROR.'","message":" 00'.$_DB_INVALID_DATA_ERROR_MESSAGE.': '.mysql_error().'"}');
$ID = $_POST['ID'];
$childrenIDs = $_POST['childrenIDs'];

$IDs2DELETE = "( ID = ".$ID;
$structureIDs2DELETE = "( structureID = ".$ID;

if($_POST['childrenIDs'] != 0)
{
	foreach ($childrenIDs as $index => $childID) {
		$IDs2DELETE.= " OR ID = $childID";
		$structureIDs2DELETE.= " OR structureID = $childID";
	}
}

$IDs2DELETE .= ")";
$structureIDs2DELETE .= ")";


/// remove image files
$message = '';
$imagesWhatgonnaDelete = '';
$imageNames = getImageNames($structureIDs2DELETE);
try{
	foreach ($imageNames as $key => $value) {
		$fileName = $GLOBALS['IMAGE_PATH'].$value;
		$thumbFileName = $GLOBALS['IMAGE_THUMB_PATH'].$value;
		$imagesWhatgonnaDelete.= $fileName.'|';
		unlink($fileName);
		unlink($thumbFileName);
	}
}
catch(Exception $e){
	$message.= 'Could not delete.';
}

///// IMAGE DELETING
$delStr = "DELETE FROM structure WHERE $IDs2DELETE";
mysql_query($delStr,$sql_connect) or die('{"status":"'.$_SERVER_ERROR.'","message":"01 '.$_DB_SELECT_ERROR_MESSAGE.': '.mysql_error().' - '.$delStr.'"}');



///////// DELETE FROM STRUCTURE
$delImg = "DELETE FROM images WHERE $structureIDs2DELETE";
$res = mysql_query($delImg,$sql_connect) or die('{"status":"'.$_SERVER_ERROR.'","message":"02'.$_DB_SELECT_ERROR_MESSAGE.': '.mysql_error().' - '.$delImg.'"}');



////// FEEDBACK
print '{"status":"OK", "message":"'.$message.'","delImages":"'.$delImg.'", "delStr":"'.$delStr.'", "unlinks":"'.$imagesWhatgonnaDelete.'"}';

////
function getImageNames($condition){
	$_SERVER_ERROR = $GLOBALS['_SERVER_ERROR'];
	$_DB_SELECT_ERROR_MESSAGE = $GLOBALS['_DB_SELECT_ERROR_MESSAGE'];
	$sql_connect = $GLOBALS['sql_connect'];
	
	$selImg = "SELECT * from images WHERE $condition";
	$resImg = mysql_query($selImg,$sql_connect) or die('{"status":"'.$_SERVER_ERROR.'","message":"03'.$_DB_SELECT_ERROR_MESSAGE.': '.mysql_error().' - '.$selImg.'"}');
	
	$names = Array();

	while ($sor = mysql_fetch_array($resImg, MYSQL_ASSOC)) {
		$names[] = $sor['name'];
	}
	
	return $names;
}
?>