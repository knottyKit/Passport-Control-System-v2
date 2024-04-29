<?php
#region DB Connect
require_once '../../dbconn/dbconnectpcs.php';
#endregion

#region set timezone
date_default_timezone_set('Asia/Manila');
#endregion

#region Initialize Variable
$number = $birthdate = $issued = $expiry = NULL;
$empID = 0;
#endregion

#region get values
if (!empty($_POST["empID"])) {
    $empID = $_POST["empID"];
}
if (!empty($_POST["number"])) {
    $number = $_POST["number"];
}
if (!empty($_POST["birthdate"])) {
    $birthdate = $_POST["birthdate"];
}
if (!empty($_POST["issued"])) {
    $issued = $_POST["issued"];
}
if (!empty($_POST["expiry"])) {
    $expiry = $_POST["expiry"];
}

try {
    $checkQ = "SELECT COUNT(*) FROM passport_details WHERE emp_number = :empID";
    $checkStmt = $connpcs->prepare($checkQ);
    $checkStmt->execute([":empID" => "$empID"]);
    $checkCount = $checkStmt->fetchColumn();
    if ($checkCount == 0) {
        $updateQ = "INSERT INTO `passport_details`(`emp_number`, `passport_birthdate`, `passport_number`, `passport_issue`, `passport_expiry`) 
        VALUES (:empID, :birthdate, :numberP, :issued, :expiry)";
    } else {
        $updateQ = "UPDATE passport_details SET passport_birthdate = :birthdate, passport_number = :numberP, passport_issue = :issued, passport_expiry = :expiry 
        WHERE emp_number = :empID";
    }
    $updateStmt = $connpcs->prepare($updateQ);
    $updateStmt->execute([":birthdate" => "$birthdate", ":numberP" => "$number", ":issued" => "$issued", ":expiry" => "$expiry", ":empID" => "$empID"]);

    if (!empty($_FILES["fileValue"])) {
        $fileVName = $_FILES['fileValue']['name'];
        $fileTemp = $_FILES['fileValue']['tmp_name'];

        $folderID = "C:/xampp/htdocs/PCS/empDetails/EmployeesFolder/" . $empID;
        if(!file_exists($folderID)) {
            mkdir($folderID, 0755, true);
        }

        $folderName = "C:/xampp/htdocs/PCS/empDetails/EmployeesFolder/" . $empID . "/passport.pdf";

        if (file_exists($folderName)) {
            unlink($folderName);
        }
        if (!rename($fileTemp, $folderName)) {
            $message = array("message" => "Uploading file failed!");
        }
    }
} catch (Exception $e) {
    echo "Connection failed: " . $e->getMessage();
}
