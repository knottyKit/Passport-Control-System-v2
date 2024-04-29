<?php
#region DB Connect
require_once '../../dbconn/dbconnectpcs.php';
require_once '../../dbconn/globalFunctions.php';
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
$dateFrom = date("Y-m-d");
if (!empty($_POST['dateFrom'])) {
    $dateFrom = $_POST['dateFrom'];
} else {
    $msg["isSuccess"] = false;
    $msg['error'] = "Date From Missing";
}
$dateTo = date("Y-m-d");
if (!empty($_POST['dateTo'])) {
    $dateTo = $_POST['dateTo'];
} else {
    $msg["isSuccess"] = false;
    $msg['error'] = "Date To Missing";
}
$newRange = [
    'start' => $dateFrom,
    'end' => $dateTo,
];
if (checkOverlap($empNumber, $newRange)) {
    $msg["isSuccess"] = false;
    $msg['error'] = "Dispatch Conflict";
}
$locID = 0;
if (!empty($_POST['locID'])) {
    $locID = $_POST['locID'];
} else {
    $msg["isSuccess"] = false;
    $msg['error'] = "Location Missing";
}
$insertQ = "INSERT INTO `dispatch_list`(`emp_number`,`dispatch_from`,`dispatch_to`,`location_id`) VALUES (:empNumber,:dateFrom,:dateTo,:locID)";
$insertStmt = $connpcs->prepare($insertQ);
#endregion

#region Entries Query
try {
    if (empty($msg)) {
        $insertStmt->execute([":empNumber" => $empNumber, ":dateFrom" => $dateFrom, ":dateTo" => $dateTo, ":locID" => $locID]);
        $msg["isSuccess"] = true;
        $msg["error"] = "Adding dispatch successfull";
    }
} catch (Exception $e) {
    $msg["isSuccess"] = false;
    $msg['error'] =  "Connection failed: " . $e->getMessage();
}

#endregion
// echo json_encode(array('errors' => $errorMsg), JSON_PRETTY_PRINT);
echo json_encode($msg);
