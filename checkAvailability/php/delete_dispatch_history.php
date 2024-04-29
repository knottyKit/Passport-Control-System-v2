<?php
#region DB Connect
require_once '../../dbconn/dbconnectpcs.php';
#endregion

#region set timezone
date_default_timezone_set('Asia/Manila');
#endregion

#region Initialize Variable
$dispatchID = 0;
#endregion

#region get values
if (!empty($_POST["dispatchID"])) {
    $dispatchID = $_POST["dispatchID"];
}
#endregion

#region main function
try {
    $deleteQ = "DELETE FROM dispatch_list WHERE dispatch_id = :dispatchID";
    $deleteStmt = $connpcs->prepare($deleteQ);
    $deleteStmt->execute([":dispatchID" => "$dispatchID"]);
} catch (Exception $e) {
    echo "Connection failed: " . $e->getMessage();
}
#endregion