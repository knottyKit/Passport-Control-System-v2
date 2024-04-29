<?php

$date1 = New DateTime('2023-01-06');
$date2 = New DateTime('2023-01-02');

if($date1 > $date2) {
    echo 0;
    die;
}

$difference = $date1->diff($date2);

$difference = $difference -> days;

echo $difference;