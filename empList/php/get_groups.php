<?php
#region DB Connect
require_once '../../dbconn/dbconnectpcs.php';
#endregion

#region set timezone
date_default_timezone_set('Asia/Manila');
#endregion

#region Initialize Variable
$groups = array();
#endregion

#region main query
try {
    $groupQ = "SELECT group_id as id, group_name as name, group_abbr as abbreviation, (SELECT COUNT(*) FROM employee_details WHERE group_id = id) as empCount 
    FROM group_list HAVING empCount > 0 ORDER BY group_name";
    $groupStmt = $connpcs->query($groupQ);
    $groupStmt->execute([]);
    $groups = $groupStmt->fetchAll();
} catch (Exception $e) {
    echo "Connection failed: " . $e->getMessage();
}
#endregion
echo json_encode($groups);
