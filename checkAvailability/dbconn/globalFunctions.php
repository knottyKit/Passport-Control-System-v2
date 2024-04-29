<?php
function checkOverlap($empnum, $range)
{
    global $connpcs;
    $isOverlap = false;
    $starttime = $range['start'];
    $endtime = $range['end'];
    $dispatchQ = "SELECT * FROM `dispatch_list` WHERE `emp_number` = :empnum AND ((`dispatch_from` <= :starttime AND `dispatch_to` >= :starttime) OR 
    (`dispatch_from` <= :endtime AND `dispatch_to` >= :endtime) OR (:starttime <= `dispatch_from` AND :endtime >= `dispatch_from`) OR (:starttime <= `dispatch_to` AND :endtime >= `dispatch_to`))";
    $dispatchStmt = $connpcs->prepare($dispatchQ);
    $dispatchStmt->execute([":empnum" => $empnum, ":starttime" => $starttime, ":endtime" => $endtime]);
    if ($dispatchStmt->rowCount() > 0) {
        $isOverlap = true;
    }

    return $isOverlap;
}
