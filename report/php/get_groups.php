<?php
#region DB Connect
require_once '../../dbconn/dbconnectnew.php';
require_once '../../dbconn/dbconnectpcs.php';
require_once '../../dbconn/dbconnectkdtph.php';
require_once '../../global/globalFunctions.php';
session_start();
#endregion

#region set timezone
date_default_timezone_set('Asia/Manila');
#endregion

#region Initialize Variable
$groups = array();
$userID = 0;
if (!empty($_SESSION["IDKHI"])) {
    $userID = $_SESSION["IDKHI"];
    $userID = hex2bin($userID);
    $userID = base64_decode(urldecode($userID));
}
#endregion

#region main query
try {
    $groups = getGroups($userID);
} catch (Exception $e) {
    echo "Connection failed: " . $e->getMessage();
}
#endregion
echo json_encode($groups);
