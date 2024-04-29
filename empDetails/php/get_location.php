<?php
#region DB Connect
require_once '../../dbconn/dbconnectpcs.php';
#endregion

#region set timezone
date_default_timezone_set('Asia/Manila');
#endregion

#region main function
try {
    $getLocQ = "SELECT location_id as id, location_name as name FROM location_list";
    $getLocStmt = $connpcs->prepare($getLocQ);
    $getLocStmt->execute([]);
    $locations = $getLocStmt->fetchAll();
} catch (Exception $e) {
    echo "Connection failed: " . $e->getMessage();
}
#endregion

echo json_encode($locations);