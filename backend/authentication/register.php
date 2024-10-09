<?php
include('../config.php');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST['email'];
    $password = $_POST['password'];

    // Check if email is already in use
    $checkEmailQuery = "SELECT * FROM users WHERE email=?";
    $stmt = $conn->prepare($checkEmailQuery);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) { //if email is found from database 
        echo json_encode(['success' => false, 'message' => 'Email is already registered.']);
    } else {
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        $insertQuery = 'INSERT INTO users (email, password) VALUES (?, ?)';
        $stmt = $conn->prepare($insertQuery);
        $stmt->bind_param("ss", $email, $hashedPassword);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'User registered successfully!']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Registration failed.']);
        }
    }
}
?>
