<?php
require_once __DIR__ . '/../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$required = ['User_Id', 'Hotel_Id', 'Rating', 'Comment'];
foreach ($required as $field) {
    if (empty($data[$field])) {
        http_response_code(400);
        echo json_encode(["error" => "$field is required"]);
        exit;
    }
}

$hotelId = preg_replace('/^h/', '', $data['Hotel_Id']);

$stmt = $conn->prepare("INSERT INTO REVIEW (Rating, Comment, User_Id, Hotel_Id) VALUES (?, ?, ?, ?)");
$stmt->bind_param("dsii", $data['Rating'], $data['Comment'], $data['User_Id'], $hotelId);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "review_id" => $conn->insert_id]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Review submission failed"]);
}
$conn->close();
