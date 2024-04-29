<?php
#region DB Connect
require_once '../dbconn/dbconnectpcs.php';
require_once '../dbconn/dbconnectkdtph.php';
// require_once '../dbconn/globalFunctions.php';
#endregion

#region set timezone
date_default_timezone_set('Asia/Manila');
$empList = $newEmpList = array();
#endregion

#region main function
try {
    $truncateQ = "TRUNCATE employee_details";
    $truncateStmt = $connpcs->prepare($truncateQ);
    $truncateStmt->execute([]);

    $getQ = "SELECT ep.fldEmployeeNum, ep.fldSurname, ep.fldFirstname, ep.fldBirthDate, ep.fldGroup, kl.fldOutlook FROM emp_prof as ep LEFT JOIN kdtlogin as kl ON 
    ep.fldEmployeeNum = kl.fldEmployeeNum WHERE ep.fldActive = 1 AND ep.fldEmployeeNum < 10000 ORDER BY ep.fldEmployeeNum";
    $getStmt = $connkdt->prepare($getQ);
    $getStmt->execute([]);
    $empList = $getStmt->fetchAll();

    foreach ($empList as $val) {
        $group = $val["fldGroup"];

        $groupIDQ = "SELECT group_id FROM group_list WHERE group_abbr = :group";
        $groupIDStmt = $connpcs->prepare($groupIDQ);
        $groupIDStmt->execute([":group" => "$group"]);
        $groupID = $groupIDStmt->fetchColumn();

        $val["fldGroup"] = $groupID;

        array_push($newEmpList, $val);
    }

    foreach ($newEmpList as $nval) {
        $id = $nval["fldEmployeeNum"];
        $surname = $nval["fldSurname"];
        $firstname = $nval["fldFirstname"];
        $birthday = $nval["fldBirthDate"];
        $group = $nval["fldGroup"];
        $email = $nval["fldOutlook"];

        $checkQ = "SELECT COUNT(*) FROM employee_details WHERE emp_number = :id";
        $checkStmt = $connpcs->prepare($checkQ);
        $checkStmt->execute([":id" => "$id"]);
        $checkRes = $checkStmt->fetchColumn();
        echo $checkRes;
        if ($checkRes == 0) {
            $insertQ = "INSERT INTO `employee_details`(`emp_number`, `emp_surname`, `emp_firstname`, `emp_birthdate`, `group_id`, `emp_email`) VALUES 
            (:id, :surname, :firstname, :birthday, :group, :email)";
            $insertStmt = $connpcs->prepare($insertQ);
            $insertStmt->execute([":id" => "$id", ":surname" => "$surname", ":firstname" => "$firstname", ":birthday" => "$birthday", ":group" => "$group", ":email" => "$email"]);
        }
    }
} catch (Exception $e) {
    $errorMsg['catch'] =  "Connection failed: " . $e->getMessage();
}
#endregion

echo json_encode($newEmpList);
