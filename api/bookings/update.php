<?php
require_once __DIR__ . '/../config.php';
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (empty($data['Booking_Id'])) {
    http_response_code(400);
    echo json_encode(["error" => "Booking_Id is required"]);
    exit;
}

$bookingId = (int) preg_replace('/^b/', '', $data['Booking_Id']);
$updates = [];
$params = [];
$types = "";

if (isset($data['Status'])) {
    $updates[] = "Status = ?";
    $params[] = $data['Status'];
    $types .= "s";
}

if (isset($data['Total_Amount'])) {
    $updates[] = "Total_Amount = ?";
    $params[] = (float) $data['Total_Amount'];
    $types .= "d";
}

if (empty($updates)) {
    http_response_code(400);
    echo json_encode(["error" => "No fields to update"]);
    exit;
}

$params[] = $bookingId;
$types .= "i";

$sql = "UPDATE TRAVEL_BOOKING SET " . implode(", ", $updates) . " WHERE Booking_Id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param($types, ...$params);

try {
    $stmt->execute();
    echo json_encode([
        "success" => true,
        "message" => "Booking updated successfully"
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Update failed: " . $e->getMessage()]);
}

$conn->close();
?>