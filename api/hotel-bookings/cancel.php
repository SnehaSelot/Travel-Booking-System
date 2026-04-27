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
$stmt = $conn->prepare("SELECT Check_In, Status FROM HOTEL_BOOKING WHERE Hotel_Booking_Id = ?");
$stmt->bind_param("i", $hotelBookingId);
$stmt->execute();
$result = $stmt->get_result();
if ($result->num_rows === 0) {
    http_response_code(404);
    echo json_encode(["error" => "Hotel booking not found"]);
    exit;
}

$booking = $result->fetch_assoc();
if ($booking['Status'] === 'cancelled') {
    http_response_code(400);
    echo json_encode(["error" => "Booking already cancelled"]);
    exit;
}

$checkIn = new DateTime($booking['Check_In']);
$today = new DateTime();
$diff = (int)$today->diff($checkIn)->format('%r%a');
if ($diff < 1) {
    http_response_code(400);
    echo json_encode(["error" => "Hotel booking can only be cancelled at least 1 day before check-in"]);
    exit;
}

try {
    $update = $conn->prepare("UPDATE HOTEL_BOOKING SET Status = 'cancelled' WHERE Hotel_Booking_Id = ?");
    $update->bind_param("i", $hotelBookingId);
    $update->execute();

    echo json_encode(["success" => true, "message" => "Hotel booking cancelled"]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Unable to cancel hotel booking: " . $e->getMessage()]);
}

$conn->close();
