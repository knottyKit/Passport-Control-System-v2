<?php

$ccRecipient = array();
$ccRecipient = implode(", ", $ccRecipient);

$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= "From: kdtreminder@corp.khi.co.jp" . "\r\n";
$headers .= "CC: " . $ccRecipient;
$subject = 'Expiring Passport (for testing)';
$email = "hernandez-kdt@global.kawasaki.com";
$message = "Test CC global variables";

sendMail();

function sendMail()
{
    global $email, $subject, $message, $headers;
    if (mail($email, $subject, $message, $headers)) {
        echo "success";
    } else {
        echo "fail";
    }
}
