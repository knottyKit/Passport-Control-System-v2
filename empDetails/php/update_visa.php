<?php
#region DB Connect
require_once '../../dbconn/dbconnectpcs.php';
#endregion

#region set timezone
date_default_timezone_set('Asia/Manila');
#endregion

#region Initialize Variable
$number = $issued = $expiry = NULL;
$empID = 0;
#endregion

#region get values
if (!empty($_POST["empID"])) {
    $empID = $_POST["empID"];
}
if (!empty($_POST["number"])) {
    $number = $_POST["number"];
}
if (!empty($_POST["issued"])) {
    $issued = $_POST["issued"];
}
if (!empty($_POST["expiry"])) {
    $expiry = $_POST["expiry"];
}
#endregion

#region main function
try {
    $checkQ = "SELECT COUNT(*) FROM visa_details WHERE emp_number = :empID";
    $checkStmt = $connpcs->prepare($checkQ);
    $checkStmt->execute([":empID" => "$empID"]);
    $checkCount = $checkStmt->fetchColumn();
    if ($checkCount == 0) {
        $updateQ = "INSERT INTO `visa_details`(`emp_number`, `visa_number`, `visa_issue`, `visa_expiry`) 
        VALUES (:empID, :numberV, :issued, :expiry)";
    } else {
        $updateQ = "UPDATE visa_details SET visa_number = :numberV, visa_issue = :issued, visa_expiry = :expiry WHERE emp_number = :empID";
    }
    $updateStmt = $connpcs->prepare($updateQ);
    $updateStmt->execute([":numberV" => "$number", ":issued" => "$issued", ":expiry" => "$expiry", ":empID" => $empID]);

    if (!empty($_FILES["fileValue"])) {
        $fileVName = $_FILES['fileValue']['name'];
        $fileTemp = $_FILES['fileValue']['tmp_name'];

        $folderID = "C:/xampp/htdocs/PCS/empDetails/EmployeesFolder/" . $empID;
        if(!file_exists($folderID)) {
            mkdir($folderID, 0755, true);
        }

        $folderName = "C:/xampp/htdocs/PCS/empDetails/EmployeesFolder/" . $empID . "/visa.pdf";

        if (file_exists($folderName)) {
            unlink($folderName);
        }
        if (!copy($fileTemp, $folderName)) {
            $message = array("message" => "Uploading file failed!");
        }
    }
} catch (Exception $e) {
    echo "Connection failed: " . $e->getMessage();
}
#endregion