<?php
include "../../acc/logs.php";

if (!$sql_connect = @mysql_connect($SERVER, $USER,$PSW ))
	die('{"status":"'.$_SERVER_ERROR.'","message":"'.$_DB_CONNECT_ERROR_MESSAGE.': '.mysql_error().'"}');
mysql_select_db($DB,$sql_connect) or die('{"status":"message":"'.$_SERVER_ERROR.'","'.$_DB_OPEN_ERROR_MESSAGE.': '.mysql_error().'"}');

$TABLE = 'structure';

if(!isset($_POST['NAME_HUN']) || !isset($_POST['NAME_ENG']) || !isset($_POST['TEXT_CONTENT_HUN']) || !isset($_POST['TEXT_CONTENT_ENG']) || !isset($_POST['ID']))
	die('{"status":"'.$_SERVER_ERROR.'","message":"'.$_DB_INVALID_DATA_ERROR_MESSAGE.': '.mysql_error().'"}');
$ID = $_POST['ID'];
$NAME_HUN = $_POST['NAME_HUN'];
$NAME_ENG = $_POST['NAME_ENG'];
$TEXT_CONTENT_HUN = base64_encode($_POST['TEXT_CONTENT_HUN']);
$TEXT_CONTENT_ENG = base64_encode($_POST['TEXT_CONTENT_ENG']);

///////// UPDATE
$upd="UPDATE $TABLE SET NAME_HUN = '$NAME_HUN', NAME_ENG = '$NAME_ENG', TEXT_CONTENT_HUN = '$TEXT_CONTENT_HUN', TEXT_CONTENT_ENG = '$TEXT_CONTENT_ENG' WHERE ID=$ID";
$res = mysql_query($upd,$sql_connect) or die('{"status":"'.$_SERVER_ERROR.'","message":"'.$_DB_SELECT_ERROR_MESSAGE.': '.mysql_error().'"}');

////// FEEDBACK
print '{"status":"OK", "NAME_HUN":"'.$NAME_HUN.'", "NAME_ENG":"'.$NAME_ENG.'", "TEXT_CONTENT_HUN":"'.$TEXT_CONTENT_HUN.'","TEXT_CONTENT_ENG":"'.$TEXT_CONTENT_ENG.'"}';
?>