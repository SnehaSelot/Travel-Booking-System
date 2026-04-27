<?php
require_once __DIR__ . '/../config.php';
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (empty($data['Hotel_Booking_Id'])) {
    http_response_code(400);
    echo json_encode(["error" => "Hotel_Booking_Id is required"]);
    exit;
}

$hotelBookingId = (int) preg_replace('/^hb/', '', $data['Hotel_Booking_Id']);
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

if (isset($data['Check_In'])) {
    $updates[] = "Check_In = ?";
    $params[] = $data['Check_In'];
    $types .= "s";
}

if (isset($data['Check_Out'])) {
    $updates[] = "Check_Out = ?";
    $params[] = $data['Check_Out'];
    $types .= "s";
}

if (empty($updates)) {
    http_response_code(400);
    echo json_encode(["error" => "No fields to update"]);
    exit;
}

$params[] = $hotelBookingId;
$types .= "i";

$sql = "UPDATE HOTEL_BOOKING SET " . implode(", ", $updates) . " WHERE Hotel_Booking_Id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param($types, ...$params);

try {
    $stmt->execute();
    echo json_encode([
        "success" => true,
        "message" => "Hotel booking updated successfully"
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Update failed: " . $e->getMessage()]);
}

$conn->close();
?>