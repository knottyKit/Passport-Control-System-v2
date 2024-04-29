<?php
#region DB Connect
require_once '../../dbconn/dbconnectpcs.php';
#endregion

#region set timezone
date_default_timezone_set('Asia/Manila');
#endregion

#region Initialize Variable

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
