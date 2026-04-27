<?php
require_once __DIR__ . '/../config.php';

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
$refundAmount = $data['Refund_Amount'] ?? 0;

$stmt = $conn->prepare("SELECT Booking_Date, Trip_Id, Status FROM TRAVEL_BOOKING WHERE Booking_Id = ?");
$stmt->bind_param("i", $bookingId);
$stmt->execute();
$result = $stmt->get_result();
if ($result->num_rows === 0) {
    http_response_code(404);
    echo json_encode(["error" => "Booking not found"]);
    exit;
}

$booking = $result->fetch_assoc();
if ($booking['Status'] === 'cancelled') {
    http_response_code(400);
    echo json_encode(["error" => "Booking already cancelled"]);
    exit;
}

$tripDate = new DateTime($booking['Booking_Date']);
$today = new DateTime();
$diff = (int)$today->diff($tripDate)->format('%r%a');
if ($diff < 1) {
    http_response_code(400);
    echo json_encode(["error" => "Trip can only be cancelled at least 1 day before departure"]);
    exit;
}

$conn->begin_transaction();
try {
    // Update booking status
    $stmt = $conn->prepare("UPDATE TRAVEL_BOOKING SET Status = 'cancelled' WHERE Booking_Id = ?");
    $stmt->bind_param("i", $bookingId);
    $stmt->execute();

    // Create cancellation record
    $cStmt = $conn->prepare("INSERT INTO CANCELLATION (Cancel_Date, Refund_Amount, Booking_Id) VALUES (CURDATE(), ?, ?)");
    $cStmt->bind_param("di", $refundAmount, $bookingId);
    $cStmt->execute();

    // Free up seats for this booking when provided
    if (!empty($data['seats']) && is_array($data['seats'])) {
        $tripId = (int)$booking['Trip_Id'];
        foreach ($data['seats'] as $seatNumber) {
            $sStmt = $conn->prepare("UPDATE SEAT SET Status = 'available' WHERE Trip_Id = ? AND Seat_Number = ?");
            $sStmt->bind_param("ii", $tripId, $seatNumber);
            $sStmt->execute();
        }
    }

    $conn->commit();
    echo json_encode(["success" => true, "message" => "Booking cancelled"]);
} catch (Exception $e) {
    $conn->rollback();
    http_response_code(500);
    echo json_encode(["error" => "Cancellation failed: " . $e->getMessage()]);
}
$conn->close();
