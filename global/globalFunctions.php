<?php
#region Functions
function checkOverlap($empnum, $range)
{
    global $connpcs;
    $isOverlap = false;
    $starttime = $range['start'];
    $endtime = $range['end'];
    $dispatchQ = "SELECT * FROM `dispatch_list` WHERE `emp_number` = :empnum AND (`dispatch_from` BETWEEN :starttime AND :endtime OR `dispatch_to` BETWEEN :starttime
    AND :endtime)";
    $dispatchStmt = $connpcs->prepare($dispatchQ);
    $dispatchStmt->execute([":empnum" => $empnum, ":starttime" => $starttime, ":endtime" => $endtime]);
    if ($dispatchStmt->rowCount() > 0) {
        $isOverlap = true;
    }

    return $isOverlap;
}

function allGroupAccess($empnum)
{
    global $connpcs;
    $access = FALSE;
    $permissionID = 1;
    $userQ = "SELECT COUNT(*) FROM khi_user_permissions WHERE permission_id = :permissionID AND employee_id = :empID";
    $userStmt = $connpcs->prepare($userQ);
    $userStmt->execute([":empID" => $empnum, ":permissionID" => $permissionID]);
    $userCount = $userStmt->fetchColumn();
    if ($userCount > 0) {
        $access = TRUE;
    }
    return $access;
}

function getMembers($empnum)
{
    global $connnew;
    $members = array();
    $yearMonth = date("Y-m-01");
    $myGroups = getGroups($empnum);
    foreach ($myGroups as $grp) {
        $memsQ = "SELECT `id` FROM `employee_list` WHERE `group_id` = :grp AND (`resignation_date` IS NULL OR `resignation_date` = '0000-00-00' OR `resignation_date` > :yearMonth) 
        AND `nickname` <> ''";
        $memsStmt = $connnew->prepare($memsQ);
        $memsStmt->execute([":grp" => $grp['id'], ":yearMonth" => $yearMonth]);
        if ($memsStmt->rowCount() > 0) {
            $memArr = $memsStmt->fetchAll();
            $arrValues = array_column($memArr, "id");
            $members = array_merge($members, $arrValues);
        }
    }
    return $members;
}

function getGroups($empnum)
{
    global $connnew;
    $allGroupAccess = allGroupAccess($empnum);
    // echo $allGroupAccess;
    $myGroups = array();
    if (!$allGroupAccess) {
        $groupsQ = "SELECT gl.id AS `id`, gl.name AS `name`, gl.abbreviation AS `abbr` FROM kdtphdb_new.group_list AS gl JOIN pcosdb.khi_details AS kd 
        ON gl.id = kd.group_id WHERE kd.number = :empnum";
        $groupsStmt = $connnew->prepare($groupsQ);
        $groupsStmt->execute([":empnum" => $empnum]);
        if ($groupsStmt->rowCount() > 0) {
            $groupArr = $groupsStmt->fetchAll();
            foreach ($groupArr as $grp) {
                array_push($myGroups, $grp);
            }
        }
    } else {
        $groupsQ = "SELECT `id`, `name`, `abbreviation` as `abbr` FROM `group_list` ORDER BY `abbreviation`";
        $groupsStmt = $connnew->prepare($groupsQ);
        $groupsStmt->execute();
        if ($groupsStmt->rowCount() > 0) {
            $groupArr = $groupsStmt->fetchAll();
            foreach ($groupArr as $grp) {
                array_push($myGroups, $grp);
            }
        }
    }
    return $myGroups;
}

function getKHIMembers($empnum)
{
    global $connpcs;
    $members = array();
    $myGroups = getGroups($empnum);
    $group_ids = array_map(function ($group) {
        return $group['id'];
    }, $myGroups);
    $grpStmt = "(" . implode(',', $group_ids) . ")";
    $memsQ = "SELECT kd.number, kd.surname, kd.firstname, gl.id, gl.abbreviation FROM pcosdb.khi_details AS kd JOIN kdtphdb_new.group_list AS gl ON kd.group_id = gl.id 
    WHERE kd.group_id IN $grpStmt ORDER BY `number`";
    $memsStmt = $connpcs->prepare($memsQ);
    $memsStmt->execute();
    if ($memsStmt->rowCount() > 0) {
        $memArr = $memsStmt->fetchAll();
        foreach ($memArr as $mem) {
            $output = array();
            $khi_id = $mem['number'];
            $khi_fname = $mem['firstname'];
            $khi_sname = $mem['surname'];
            $group_id = $mem['id'];
            $group_abbr = $mem['abbreviation'];
            $adminType = allGroupAccess($khi_id) ? 1 : 0;
            $output['id'] = $khi_id;
            $output['fname'] = $khi_fname;
            $output['sname'] = $khi_sname;
            $output['group']['id'] = $group_id;
            $output['group']['abbr'] = $group_abbr;
            $output['type'] = $adminType;
            array_push($members, $output);
        }
    }
    return $members;
}
#endregion
