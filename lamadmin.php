<?php
echo "
<html>
</html>
";
include "../acc/logs.php";
if (!$sql_connect = @mysql_connect($SERVER, $USER,$PSW ))
	die(print("Az adatbázishoz való csatlakozás sikertelen volt."));
mysql_select_db($DB,$sql_connect) or die(print("Nem sikerült az adatbázis megnyitása. A hiba oka: ".mysql_error()));

$TABLE = 'structure';
$sel="SELECT * from $TABLE ";

$res = mysql_query($sel,$sql_connect) or die(print("err Nem tudtam a lekérdezést végrehajtani! A hiba oka: ".mysql_error()));

while ($sor = mysql_fetch_array($res, MYSQL_ASSOC)) print $sor['NAME_HUN']."<br>";
?>