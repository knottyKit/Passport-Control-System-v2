<?php
#region DB Connect
require_once '../../dbconn/dbconnectpcs.php';
#endregion

#region set timezone
date_default_timezone_set('Asia/Manila');
#endregion

#region Initialize Variable
$searchkey = NULL;
$groupID = $sortKey = 0;
$dispatch = 1;
$employees = array();
$groupQuery = "1";
$searchStmt = "";
$sortKey = 1;
#endregion

#region Set Variable Values
if (!empty($_POST["groupID"])) {
    $groupID = $_POST["groupID"];
}
if (!empty($_POST["dispatch"])) {
    $dispatch = $_POST["dispatch"];
}
if ($groupID != 0) {
    $groupQuery = "ed.group_id = $groupID";
}
if (!empty($_POST['searchkey'])) {
    $searchkey = $_POST['searchkey'];
    $searchStmt = "AND (CONCAT_WS(' ',ed.emp_firstname,ed.emp_surname) LIKE '%$searchkey%' OR ed.emp_number LIKE '%$searchkey%')";
}
if (!empty($_POST['sortKey'])) {
    $sortKey = $_POST['sortKey'];
}

if ($sortKey == 1) {
    $sortQuery = "ORDER BY ed.emp_number ASC";
} else if ($sortKey == 2) {
    $sortQuery = "ORDER BY ed.emp_number DESC";
} else if ($sortKey == 3) {
    $sortQuery = "ORDER BY ed.emp_firstname ASC";
} else if ($sortKey == 4) {
    $sortQuery = "ORDER BY ed.emp_firstname DESC";
} else {
    $sortQuery = "ORDER BY ed.emp_number ASC";
}
#endregion

#region main query
try {
    $employeesQuery = "SELECT ed.emp_number as empID, ed.emp_surname as lastname, ed.emp_firstname as firstname, gl.group_abbr as groupAbbr, pd.passport_expiry as passportExpiry, 
    vd.visa_expiry as visaExpiry, ed.emp_dispatch as dispatch FROM employee_details as ed LEFT JOIN group_list as gl ON ed.group_id = gl.group_id LEFT JOIN passport_details as pd 
    ON ed.emp_number = pd.emp_number LEFT JOIN visa_details as vd ON ed.emp_number = vd.emp_number WHERE $groupQuery $searchStmt $sortQuery";
    $empStmt = $connpcs->prepare($employeesQuery);
    $empStmt->execute([]);
    if ($empStmt->rowCount() > 0) {
        $employeeDeets = $empStmt->fetchAll();
        foreach ($employeeDeets as &$val) {
            if ($val["passportExpiry"] !== null) {
                $pass = strtotime($val["passportExpiry"]);
                $val["passportExpiry"] = date("d M Y", $pass);
            } else {
                $val["passportExpiry"] = "None";
            }
            if ($val["visaExpiry"] !== null) {
                $visa = strtotime($val["visaExpiry"]);
                $val["visaExpiry"] = date("d M Y", $visa);
            } else {
                $val["visaExpiry"] = "None";
            }
        }
        $employees = $employeeDeets;

        // if (!empty($_POST["searchkey"])) {
        //     $searchkey = $_POST["searchkey"];

        //     foreach ($employeeDeets as $val) {
        //         $lastname = strtolower($val["lastname"]);
        //         $firstname = strtolower($val["firstname"]);
        //         $empID = $val["empID"];

        //         if (strpos($lastname, $searchkey) !== false) {
        //             array_push($employees, $val);
        //         } else if (strpos($firstname, $searchkey) !== false) {
        //             array_push($employees, $val);
        //         } else if (strpos($empID, $searchkey) !== false) {
        //             array_push($employees, $val);
        //         }
        //     }
        // } else {
        //     $employees = $employeeDeets;
        // }
    }
} catch (Exception $e) {
    echo "Connection failed: " . $e->getMessage();
}
#endregion
echo json_encode($employees);
