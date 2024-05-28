<?php
    require '../../dbconn/dbconnectpcs.php';

    $khiID = 0;
    $message = [];

    if(!empty($_POST['khiID'])) {
        $khiID = $_POST['khiID'];
    }

    try {
        $checkID = "SELECT `number`, `surname`, `firstname`, `group_id` FROM `khi_details` WHERE `number` = :khiID";
        $checkIDStmt = $connpcs->prepare($checkID);
        $checkIDStmt->execute([":khiID" => "$khiID"]);
        if($checkIDStmt->rowCount() > 0) {
            $empDeets = $checkIDStmt->fetchObject();
            $message['user'] = $empDeets;
            $message['isSuccess'] = 1;
        } else {
            $message['isSuccess'] = 0;
            $message['message'] = 'User ID is not registered';
        }

        echo json_encode($message);

    } catch (Exception $e) {
        echo "Error : " . $e->getMessage();
    }

?>