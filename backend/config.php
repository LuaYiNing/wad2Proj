<?php
$servername = "localhost";
$username = "root";  
$password = "root";   
$dbname = ""; //update with db name ; need to create database on aws

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
