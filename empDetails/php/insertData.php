<?php
#region DB Connect
require_once '../../dbconn/dbconnectpcs.php';
require_once '../../dbconn/dbconnectkdtph.php';
#endregion

#region set timezone
date_default_timezone_set('Asia/Manila');
#endregion


try {
    $empQ = "SELECT ep.fldEmployeeNum as id, ep.fldSurname as lastname, ep.fldFirstname as firstname, ep.fldGroup as groupID, kl.fldOutlook FROM emp_prof as ep LEFT JOIN 
    kdtlogin as kl ON ep.fldEmployeeNum = kl.fldEmployeeNum WHERE ep.fldActive = 1 AND ep.fldEmployeeNum < 1000 ORDER BY ep.fldEmployeeNum";
    $empStmt = $connkdt->prepare($empQ);
    $empStmt->execute([]);
    $empList = $empStmt->fetchAll();

    foreach ($empList as $val) {
        $id = $val["id"];
        $lastname = $val["lastname"];
        $firstname = $val["firstname"];
        $group = $val["groupID"];
        $email = $val["fldOutlook"];

        $groupQ = "SELECT group_id as id FROM group_list WHERE group_abbr = :group";
        $groupStmt = $connpcs->prepare($groupQ);
        $groupStmt->execute([":group" => "$group"]);
        $groupID = $groupStmt->fetchColumn();

        $insertQ = "INSERT INTO `employee_details`(`emp_number`, `emp_surname`, `emp_firstname`, `group_id`, `emp_email`) 
        VALUES (:id, :lastname, :firstname, :groupID, :email)";
        $insertStmt = $connpcs->prepare($insertQ);
        $insertStmt->execute([":id" => "$id", ":lastname" => "$lastname", ":firstname" => "$firstname", ":groupID" => "$groupID", ":email" => "$email"]);

        echo "success";
    }
} catch (Exception $e) {
    echo "Connection failed: " . $e->getMessage();
}

// echo json_encode($empList);
