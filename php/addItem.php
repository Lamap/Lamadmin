<?php
include "../../acc/logs.php";

if (!$sql_connect = @mysql_connect($SERVER, $USER,$PSW ))
	die('{"status":"'.$_SERVER_ERROR.'","message":"'.$_DB_CONNECT_ERROR_MESSAGE.': '.mysql_error().'"}');
mysql_select_db($DB,$sql_connect) or die('{"status":"message":"'.$_SERVER_ERROR.'","'.$_DB_OPEN_ERROR_MESSAGE.': '.mysql_error().'"}');

$TABLE = 'structure';

///////// INSERT
if(!isset($_POST['parent']) || !isset($_POST['order']) || !isset($_POST['parentLevel']))
	die('{"status":"'.$_SERVER_ERROR.'","message":"'.$_DB_INVALID_DATA_ERROR_MESSAGE.': '.mysql_error().'"}');
$order =  $_POST['order'];
$level = $_POST['parentLevel'] + 1;
$default_hun_name = "névtelen".$order;
$default_eng_name = "unnamed".$order;
$ins = "INSERT INTO $TABLE SET ID=NULL, PARENT = $_POST[parent], LEVEL = $level, ORDERNUM = $order , NAME_HUN = '$default_hun_name', NAME_ENG = '$default_eng_name'" ;
mysql_query($ins,$sql_connect) or die('{"status":"'.$_SERVER_ERROR.'","message":"'.$_DB_INSERT_ERROR_MESSAGE.': '.$ins.mysql_error().'"}');	

///////// READ
$sel="SELECT * from $TABLE ORDER BY ORDERNUM";

$res = mysql_query($sel,$sql_connect) or die('{"status":"'.$_SERVER_ERROR.'","message":"'.$_DB_SELECT_ERROR_MESSAGE.': '.mysql_error().'"}');

print '{"status":"OK", "structure":[';
$count = 0;

while ($sor = mysql_fetch_array($res, MYSQL_ASSOC)) {
	
	$nameHun = $sor['NAME_HUN'];
	$nameEng = $sor['NAME_ENG'];
	$textContentHun = $sor['TEXT_CONTENT_HUN'];
	$textContentEng = $sor['TEXT_CONTENT_ENG'];
	
	// images
	$imagesArray = explode(',',$sor['IMAGES']);
	$images = '';
	foreach ($imagesArray as $i => $image) {
		if($i != 0)
			$images.= ',';
		$images.= '"'.$image.'"';
		}
	if($images == '""')
		$images = '';

	
	if($count != 0) print ",";
	print '{';
	print '"id":"'.$sor['ID'].'",';
	print '"parent_id":"'.$sor['PARENT'].'",';
	print '"NAME_HUN":"'.$nameHun.'",';
	print '"NAME_ENG":"'.$nameEng.'",';
	print '"TEXT_CONTENT_HUN":"'.$textContentHun.'",';
	print '"TEXT_CONTENT_ENG":"'.$textContentEng.'",';
	print '"IMAGES":['.$images.'],';
	print '"ORDERNUM":"'.$sor['ORDERNUM'].'"';
	print '}';
	$count++;
};
print ']}';
?>