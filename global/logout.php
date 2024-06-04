<?php
session_start();

$output['isSuccess'] = session_destroy();

echo json_encode($output);
