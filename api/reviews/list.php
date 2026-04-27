<?php
require_once __DIR__ . '/../config.php';
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
    exit;
}

$result = $conn->query("SELECT Review_Id, Rating, Comment, User_Id, Hotel_Id FROM REVIEW ORDER BY Review_Id DESC");
$reviews = [];
while ($row = $result->fetch_assoc()) {
    $reviews[] = $row;
}

echo json_encode(["success" => true, "reviews" => $reviews]);
$conn->close();
