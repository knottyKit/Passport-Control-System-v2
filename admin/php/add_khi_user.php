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
$groupID = $empnum = $empacc = 0;
$fname = $lname = "";
#endregion

#region Set Variable Values
if (!empty($_POST["empID"])) {
    $empID = $_POST["empID"];
}
if (!empty($_POST["fname"])) {
    $fname = $_POST["fname"];
}
if (!empty($_POST["lname"])) {
    $lname = $_POST["lname"];
}
if (!empty($_POST["grpID"])) {
    $grpID = $_POST["grpID"];
}
if (!empty($_POST["empacc"])) {
    $empacc = $_POST["empacc"];
}
#endregion

#region main query
try {
    $checkID = "SELECT COUNT(*) FROM `khi_details` WHERE `number` = :empID AND `is_active` = 1";
    $checkIDStmt = $connpcs->prepare($checkID);
    $checkIDStmt->execute([":empID" => "$empID"]);
    $checkCount = $checkIDStmt->fetchColumn();

    if($checkCount == 0) {
        $insertUser = "INSERT INTO `khi_details`(`number`, `surname`, `firstname`, `group_id`, `is_active`) 
        VALUES (:empID, :lname, :fname, :grpID, 1)";
        $insertUserStmt = $connpcs->prepare($insertUser);
        if($insertUserStmt->execute([":empID" => "$empID", ":lname" => "$lname", ":fname" => "$fname", ":grpID" => "$grpID"])) {
            if($empacc == 1) {
                $insertAccess = "INSERT INTO `khi_user_permissions`(`permission_id`, `employee_id`) VALUES (1, :empID)";
                $insertAccessStmt = $connpcs->prepare($insertAccess);
                if($insertAccessStmt->execute([":empID" => "$empID"])) {
                    $message["isSuccess"] = 1;
                    $message["message"] = "User successfully added";
                }
            }
        }

        
    } else {
        $message["isSuccess"] = 0;
        $message["message"] = "User ID already registered";
    }

} catch (Exception $e) {
    echo "Connection failed: " . $e->getMessage();
}
#endregion
echo json_encode($message);