<?php
#region DB Connect
require_once '../../dbconn/dbconnectnew.php';
require_once '../../dbconn/dbconnectpcs.php';
require_once '../../dbconn/dbconnectkdtph.php';
require_once '../../global/globalFunctions.php';
#endregion

#region set timezone
date_default_timezone_set('Asia/Manila');
#endregion

#region Initialize Variable
$searchkey = NULL;
$groupID = $empnum = 0;
$employees = array();
#endregion

#region Set Variable Values
if (!empty($_POST["empid"])) {
    $empnum = $_POST["empid"];
}
#endregion

#region main query
try {
    $employees = getKHIMembers($empnum);
} catch (Exception $e) {
    echo "Connection failed: " . $e->getMessage();
}
#endregion
echo json_encode($employees);
