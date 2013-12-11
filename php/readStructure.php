<?php
include "../../acc/logs.php";

if (!$sql_connect = @mysql_connect($SERVER, $USER,$PSW ))
	die('{"status":"'.$_SERVER_ERROR.'","message":"'.$_DB_CONNECT_ERROR_MESSAGE.': '.mysql_error().'"}');
mysql_select_db($DB,$sql_connect) or die('{"status":"'.$_SERVER_ERROR.'","message":"'.$_DB_OPEN_ERROR_MESSAGE.': '.mysql_error().'"}');

$TABLE = 'structure';
$IMAGES = 'images';
$sel="SELECT * from $TABLE ORDER BY ORDERNUM";

$res = mysql_query($sel,$sql_connect) or die('{"status":"'.$_SERVER_ERROR.'","message":"'.$_DB_SELECT_ERROR_MESSAGE.': '.mysql_error().'"}');

print '{"status":"OK", "structure":[';
$count = 0;

while ($sor = mysql_fetch_array($res, MYSQL_ASSOC)) {
	
	$id = $sor['ID'];
	$nameHun = $sor['NAME_HUN'];
	$nameEng = $sor['NAME_ENG'];
	$textContentHun = $sor['TEXT_CONTENT_HUN'];
	$textContentEng = $sor['TEXT_CONTENT_ENG'];
	
	if($count != 0) print ",";
	print '{';
	print '"id":"'.$id.'",';
	print '"parent_id":"'.$sor['PARENT'].'",';
	print '"NAME_HUN":"'.$nameHun.'",';
	print '"NAME_ENG":"'.$nameEng.'",';
		print '"TEXT_CONTENT_HUN":"'.$textContentHun.'",';
	print '"TEXT_CONTENT_ENG":"'.$textContentEng.'",';
	print '"IMAGES":['.getImages($id).'],';
	print '"ORDERNUM":"'.$sor['ORDERNUM'].'"';
	print '}';
	$count++;
};
print ']}';

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
?>