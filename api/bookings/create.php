<?php
require_once __DIR__ . '/../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$required = ['User_Id', 'Trip_Id', 'Total_Amount', 'seats', 'passenger'];
foreach ($required as $field) {
    if (empty($data[$field])) {
        http_response_code(400);
        echo json_encode(["error" => "$field is required"]);
        exit;
    }
}

$bookingDate = !empty($data['Booking_Date']) ? $data['Booking_Date'] : date("Y-m-d");

$conn->begin_transaction();

$userId = (int)$data['User_Id'];
if ($userId <= 0) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid User_Id"]);
    exit;
}

$userCheck = $conn->prepare("SELECT User_Id FROM USER WHERE User_Id = ?");
$userCheck->bind_param("i", $userId);
$userCheck->execute();
$userCheck->store_result();
if ($userCheck->num_rows === 0) {
    http_response_code(400);
    echo json_encode(["error" => "User_Id does not exist. Please login again."]);
    exit;
}

try {
    // Remove "t" prefix
    $tripId = preg_replace('/^t/', '', $data['Trip_Id']);

    // Create booking
    $stmt = $conn->prepare("INSERT INTO TRAVEL_BOOKING (Booking_Date, Total_Amount, Status, User_Id, Trip_Id) VALUES (?, ?, 'confirmed', ?, ?)");
    $stmt->bind_param("sdii", $bookingDate, $data['Total_Amount'], $data['User_Id'], $tripId);
    $stmt->execute();
    $bookingId = $conn->insert_id;

    // Add passenger
    $p = $data['passenger'];
    $pStmt = $conn->prepare("INSERT INTO PASSENGER (Name, Age, Gender, Booking_Id) VALUES (?, ?, ?, ?)");
    $pStmt->bind_param("sisi", $p['name'], $p['age'], $p['gender'], $bookingId);
    $pStmt->execute();

    // Update seat statuses
    foreach ($data['seats'] as $seatNumber) {
        $sStmt = $conn->prepare("UPDATE SEAT SET Status = 'booked' WHERE Trip_Id = ? AND Seat_Number = ?");
        $sStmt->bind_param("ii", $tripId, $seatNumber);
        $sStmt->execute();
    }

    $conn->commit();

    echo json_encode([
        "success" => true,
        "booking" => [
            "Booking_Id" => $bookingId,
            "Status" => "confirmed",
            "Total_Amount" => $data['Total_Amount']
        ]
    ]);
} catch (Exception $e) {
    $conn->rollback();
    http_response_code(500);
    echo json_encode(["error" => "Booking failed: " . $e->getMessage()]);
}
$conn->close();
