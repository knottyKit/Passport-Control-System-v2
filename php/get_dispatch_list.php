<?php
#region DB Connect
require_once '../dbconn/dbconnectpcs.php';
// require_once '../dbconn/globalFunctions.php';
#endregion

#region set timezone
date_default_timezone_set('Asia/Manila');
#endregion

#region Initialize Variable
$dispatchList = array();
$dateFilter = date("Y-m-d");
// if (!empty($_POST['ySelect'])) {
//     $dateFilter = date("Y", strtotime($_POST['ySelect']));
// }
#endregion

#region Entries Query
try {
    $dispatchQ = "SELECT CONCAT(ed.emp_firstname,' ',ed.emp_surname) AS ename, ll.location_name, dl.dispatch_from,dl.dispatch_to,pd.passport_expiry,vd.visa_expiry FROM 
    `dispatch_list` AS dl JOIN `employee_details` AS ed ON dl.emp_number=ed.emp_number JOIN `location_list` AS ll ON dl.location_id=ll.location_id LEFT JOIN `passport_details` 
    AS pd ON pd.emp_number=ed.emp_number  LEFT JOIN `visa_details` AS vd ON vd.emp_number=ed.emp_number WHERE dl.dispatch_to >= :dateFilter AND ed.emp_dispatch=1 ORDER BY 
    dl.dispatch_id DESC";
    $dispatchStmt = $connpcs->prepare($dispatchQ);
    $dispatchStmt->execute([":dateFilter" => $dateFilter]);
    $dispatchArr = $dispatchStmt->fetchAll();
    foreach ($dispatchArr as $disp) {
        $passValidity = false;
        $visaValidity = false;
        $output = array();
        $name = $disp['ename'];
        $location = $disp['location_name'];
        $from = strtotime($disp['dispatch_from']);
        $from = date("d M Y", $from);
        $to = strtotime($disp['dispatch_to']);
        $to = date("d M Y", $to);
        $passExp = $disp['passport_expiry'];
        $visaExp = $disp['visa_expiry'];
        if ($passExp && (strtotime($passExp) >= strtotime($to))) {
            $passValidity = true;
        }
        if ($visaExp && (strtotime($visaExp) >= strtotime($to))) {
            $visaValidity = true;
        }
        $output += ["name" => $name];
        $output += ["location" => $location];
        $output += ["from" => $from];
        $output += ["to" => $to];
        $output += ["passValid" => $passValidity];
        $output += ["visaValid" => $visaValidity];
        array_push($dispatchList, $output);
    }
} catch (Exception $e) {
    $errorMsg['catch'] =  "Connection failed: " . $e->getMessage();
}
#endregion

echo json_encode($dispatchList, JSON_PRETTY_PRINT);
