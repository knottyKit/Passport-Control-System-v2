<?php
#region DB Connect
require_once '../dbconn/dbconnectpcs.php';
// require_once '../dbconn/globalFunctions.php';
#endregion

#region set timezone
date_default_timezone_set('Asia/Manila');
#endregion

#region Initialize Variable
$expiringList = array();
$expireQ = "SELECT CONCAT(ed.emp_firstname,' ',ed.emp_surname) AS ename,TIMESTAMPDIFF(DAY, CURDATE(), vd.visa_expiry) AS expiring_in,ed.emp_number FROM `visa_details` AS vd JOIN 
`employee_details` AS ed ON vd.emp_number=ed.emp_number WHERE vd.visa_expiry>=CURDATE() AND  vd.visa_expiry <= DATE_ADD(CURDATE(), INTERVAL 7 MONTH) AND ed.emp_dispatch = 1 
OR vd.visa_expiry < CURDATE() ORDER BY CASE WHEN vd.visa_expiry>=CURDATE() THEN 1 ELSE vd.visa_expiry END";
$expireStmt = $connpcs->prepare($expireQ);
#endregion

#region Entries Query
try {
    $expireStmt->execute();
    $expireArr = $expireStmt->fetchAll();
    foreach ($expireArr as $exp) {
        $output = array();
        $name = $exp['ename'];
        $id = $exp['emp_number'];
        $until = (int)$exp['expiring_in'];
        if ($until < 0) {
            $until = 0;
        }
        $output["name"] = $name;
        $output["id"] = $id;
        $output["until"] = $until;
        array_push($expiringList, $output);
    }
} catch (Exception $e) {
    $errorMsg['catch'] =  "Connection failed: " . $e->getMessage();
}

#endregion
echo json_encode($expiringList, JSON_PRETTY_PRINT);
