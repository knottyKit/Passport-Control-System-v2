<?php

$folderID = "C:/xampp/htdocs/PCS/empDetails/EmployeesFolder/1235";
        if(!file_exists($folderID)) {
            if(mkdir($folderID, 0755, true)){
                echo "created";
            } else {
                echo "failed";
            }
            
        } else {
            echo "meron na";
        }
        