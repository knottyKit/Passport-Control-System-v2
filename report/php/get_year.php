<?php
#region DB Connect
require_once '../../dbconn/dbconnectpcs.php';
#endregion

#region set timezone
date_default_timezone_set('Asia/Manila');
#endregion

#region Initialize Variable
$yearNow = date('Y');
$years = array();
#endregion

#region main query
try {
    $yearQ = "SELECT DISTINCT(YEAR(dispatch_from)) as dispatch_from FROM dispatch_list UNION SELECT DISTINCT(YEAR(dispatch_to)) as dispatch_to FROM dispatch_list";
    $yearStmt = $connpcs->query($yearQ);
    $yearStmt->execute([]);
    $allYears = $yearStmt->fetchAll();

    foreach($allYears as $val) {
        array_push($years, $val["dispatch_from"]);
    }

    if(!in_array($yearNow, $years)) {
        array_push($years, $yearNow);
    }
    sort($years);

} catch (Exception $e) {
    echo "Connection failed: " . $e->getMessage();
}
#endregion

echo json_encode($years);
