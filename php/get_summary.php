<?php
#region DB Connect
require_once '../dbconn/dbconnectpcs.php';
require_once '../dbconn/dbconnectkdtph.php';
require_once '../dbconn/dbconnectnew.php';
require_once '../dbconn/globalFunctions.php';
#endregion

#region set timezone
date_default_timezone_set('Asia/Manila');
#endregion

#regio set variables
$summary = [];
$months = [1,2,3,4,5,6,7,8,9,10,11,12];
$yNow = date("Y");
$firstday = $yNow . "-01-01";
$lastday = $yNow . "-12-31";
#endregion

try {
    foreach($months as $month) {
        $totalPerMonth = [];
        $startDate = $yNow . "-" . $month . "-01";
        $endDate = $yNow . "-" . $month . "-31";

        $dateObj   = DateTime::createFromFormat('!m', $month);
        $monthName = $dateObj->format('F');

        $getSummary = "SELECT COUNT(*) as `total` FROM `dispatch_list` WHERE `dispatch_from` BETWEEN :startDate AND :endDate OR `dispatch_to` BETWEEN :startDate AND :endDate";
        $getSummaryStmt = $connpcs->prepare($getSummary);
        $getSummaryStmt->execute([":startDate" => "$startDate", ":endDate" => "$endDate"]);
        $total = $getSummaryStmt->fetchColumn();

        $totalPerMonth['month'] = $monthName;
        $totalPerMonth['rate'] = $total;

        $summary[] = $totalPerMonth;
    }

    echo json_encode($summary);
//     SELECT 'Jan' as `month`, COUNT(*) as `total` FROM `dispatch_list` WHERE `dispatch_from` BETWEEN '2024-01-01' AND '2024-01-31' OR `dispatch_to` BETWEEN '2024-01-01' AND '2024-01-31' UNION
// SELECT 'Feb' as `month`, COUNT(*) as `total` FROM `dispatch_list` WHERE `dispatch_from` BETWEEN '2024-02-01' AND '2024-02-31' OR `dispatch_to` BETWEEN '2024-02-01' AND '2024-02-31' UNION
// SELECT 'Mar' as `month`, COUNT(*) as `total` FROM `dispatch_list` WHERE `dispatch_from` BETWEEN '2024-03-01' AND '2024-03-31' OR `dispatch_to` BETWEEN '2024-03-01' AND '2024-03-31' UNION 
// SELECT 'Apr' as `month`, COUNT(*) as `total` FROM `dispatch_list` WHERE `dispatch_from` BETWEEN '2024-04-01' AND '2024-04-31' OR `dispatch_to` BETWEEN '2024-04-01' AND '2024-04-31' UNION
// SELECT 'May' as `month`, COUNT(*) as `total` FROM `dispatch_list` WHERE `dispatch_from` BETWEEN '2024-05-01' AND '2024-05-31' OR `dispatch_to` BETWEEN '2024-05-01' AND '2024-05-31' UNION
// SELECT 'Jun' as `month`, COUNT(*) as `total` FROM `dispatch_list` WHERE `dispatch_from` BETWEEN '2024-06-01' AND '2024-06-31' OR `dispatch_to` BETWEEN '2024-06-01' AND '2024-06-31' UNION
// SELECT 'Jul' as `month`, COUNT(*) as `total` FROM `dispatch_list` WHERE `dispatch_from` BETWEEN '2024-07-01' AND '2024-07-31' OR `dispatch_to` BETWEEN '2024-07-01' AND '2024-07-31' UNION
// SELECT 'Aug' as `month`, COUNT(*) as `total` FROM `dispatch_list` WHERE `dispatch_from` BETWEEN '2024-08-01' AND '2024-08-31' OR `dispatch_to` BETWEEN '2024-08-01' AND '2024-08-31' UNION
// SELECT 'Sep' as `month`, COUNT(*) as `total` FROM `dispatch_list` WHERE `dispatch_from` BETWEEN '2024-09-01' AND '2024-09-31' OR `dispatch_to` BETWEEN '2024-09-01' AND '2024-09-31' UNION
// SELECT 'Oct' as `month`, COUNT(*) as `total` FROM `dispatch_list` WHERE `dispatch_from` BETWEEN '2024-10-01' AND '2024-10-31' OR `dispatch_to` BETWEEN '2024-10-01' AND '2024-10-31' UNION
// SELECT 'Nov' as `month`, COUNT(*) as `total` FROM `dispatch_list` WHERE `dispatch_from` BETWEEN '2024-11-01' AND '2024-11-31' OR `dispatch_to` BETWEEN '2024-11-01' AND '2024-11-31' UNION
// SELECT 'Dec' as `month`, COUNT(*) as `total` FROM `dispatch_list` WHERE `dispatch_from` BETWEEN '2024-12-01' AND '2024-12-31' OR `dispatch_to` BETWEEN '2024-12-01' AND '2024-12-31'
} catch (Exception $e) {
    echo "Connection error: " . $e->getMessage();
}

