<?php
require_once '../dbconn/dbconnectkdtph.php'; //database connection
$output = array();
$userHash = '';
if (isset($_COOKIE['userID'])) {
    $userHash = $_COOKIE['userID'];
}
if (!empty($userHash)) {
    $loginQ = "SELECT ep.fldEmployeeNum,ep.fldGroup,ep.fldFirstname,ep.fldSurname,ep.fldNick,ep.fldDateHired,ep.fldDesig FROM kdtlogin AS kl JOIN emp_prof AS ep ON kl.fldEmployeeNum=ep.fldEmployeeNum WHERE kl.fldUserHash=:userHash";
    $loginStmt = $connkdt->prepare($loginQ);
    $loginStmt->execute([":userHash" => $userHash]);
    if ($loginStmt->rowCount() > 0) {
        $empDeetsArr = $loginStmt->fetchAll();
        foreach ($empDeetsArr as $empdeets) {
            $output += ["empNum" => $empdeets['fldEmployeeNum']];
            $output += ["empGroup" => $empdeets['fldGroup']];
            $output += ["empFName" => $empdeets['fldFirstname']];
            $output += ["empSName" => $empdeets['fldSurname']];
            $output += ["empNName" => $empdeets['fldNick']];
            $output += ["empDateHired" => $empdeets['fldDateHired']];
            $output += ["empPos" => $empdeets['fldDesig']];
        }
    }
}
echo json_encode($output);
