<?php
function stringify($string)
{
    $stringRet = $string;
    if (strpos($string, "'")) {
        $stringRet = str_replace("'", "&apos;", $string);
    } else if (strpos($string, '"')) {
        $stringRet = str_replace("'", "&quot;", $string);
    }
    return $stringRet;
}

function getFirstday($yearMonthValue, $cutOffValue)
{
    $firstDay = date("Y-m-01", strtotime($yearMonthValue));
    switch ($cutOffValue) {
        case "4":
            $firstDay = date('Y-m-d', strtotime('last week'));
            break;
        case "5":
            $firstDay = date('Y-m-d', strtotime('this week'));
            break;
    }
    return $firstDay;
}

function getLastday($yearMonthValue, $cutOffValue, $firstd)
{
    $lastDay = date("Y-m-16", strtotime($yearMonthValue));
    switch ($cutOffValue) {
        case "3":
            $lastDay = date('Y-m-d', strtotime($firstd . '+ 1 month'));
            break;
        case "4":
            $lastDay = date('Y-m-d', strtotime('last week +6 days'));
            break;
        case "5":
            $lastDay = date('Y-m-d', strtotime('this week +6 days'));
            break;
    }
    return $lastDay;
}
