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
$msg = array();
$empNumber = NULL;
if (!empty($_POST['empID'])) {
    $empNumber = $_POST['empID'];
} else {
    $msg["isSuccess"] = false;
    $msg['error'] = "Employee Number Missing";
}
$insertQ = "UPDATE `khi_details` SET `is_active`=0 WHERE `number`=:empNumber";
$insertStmt = $connpcs->prepare($insertQ);
#endregion

#region Entries Query
try {
    if (empty($msg)) {
        $insertStmt->execute([":empNumber" => $empNumber]);
        $msg["isSuccess"] = true;
        $msg["error"] = "KHI Member Deleted Successfully";
    }
} catch (Exception $e) {
    $msg["isSuccess"] = false;
    $msg['error'] =  "Connection failed: " . $e->getMessage();
}

#endregion
// echo json_encode(array('errors' => $errorMsg), JSON_PRETTY_PRINT);
echo json_encode($msg);
