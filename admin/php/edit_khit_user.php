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
#endregion

#region Set Variable Values
if (!empty($_POST["empID"])) {
    $empID = $_POST["empID"];
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
    $editUser = "UPDATE `khi_details` SET `group_id` = :grpID WHERE `number` = :empID";
    $editUserStmt = $connpcs->prepare($editUser);
    if($editUserStmt->execute([":grpID" => "$grpID", ":empacc" => "$empacc", ":empID" => "$empID"])) {
        if($empacc == 0) {
            $editPerm = "DELETE FROM `khi_user_permissions` WHERE `employee_id` = :empID";
        } else {
            $editPerm = "INSERT INTO `khi_user_permissions`(`permission_id`, `employee_id`) VALUES (1, :empID)";
        }

        $editPermStmt = $connpcs->prepare($editPerm);
        if($editPermStmt->execute([":empID" => "$empID"])) {
            $message["isSuccess"] = 1;
            $message["message"] = "User successfully updated";
        } else {
            $message["isSuccess"] = 0;
            $message["message"] = "Error updating user";
        }

        
    }

} catch (Exception $e) {
    echo "Connection failed: " . $e->getMessage();
}
#endregion
echo json_encode($message);