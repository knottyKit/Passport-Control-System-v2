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

$empnum = 0;
if (!empty($_POST["empid"])) {
    $empnum = $_POST["empid"];
}
die(json_encode(getKHIMembers($empnum)));
$emps = array();
$grpID = NULL;
$grpStmt = '';
if (!empty($_POST['grpID'])) {
    $grpID = (int)$_POST['grpID'];
    $grpStmt = "AND `group_id`= $grpID";
}
#endregion

#region main query
try {
    $empQ = "SELECT CONCAT(emp_surname,', ',emp_firstname) AS ename,emp_number FROM `employee_details` WHERE emp_dispatch = 1 $grpStmt ORDER BY emp_surname";
    $empStmt = $connpcs->query($empQ);

    if ($empStmt->rowCount() > 0) {
        $emparr = $empStmt->fetchAll();
        foreach ($emparr as $emp) {
            $output = array();
            $name = $emp['ename'];
            $id = $emp['emp_number'];
            $output += ["name" => $name];
            $output += ["id" => $id];
            array_push($emps, $output);
        }
    }
} catch (Exception $e) {
    echo "Connection failed: " . $e->getMessage();
}

#endregion

#region FUNCTIONS

#endregion
echo json_encode($emps);
