<?php
require_once __DIR__ . '/../config.php';

$userId = $_GET['user_id'] ?? '';
if (!$userId) {
    http_response_code(400);
    echo json_encode(["error" => "User ID required"]);
    exit;
}

$stmt = $conn->prepare("SELECT hb.*, h.Name AS Hotel_Name, h.Location
                         FROM HOTEL_BOOKING hb
                         JOIN HOTEL h ON hb.Hotel_Id = h.Hotel_Id
                         WHERE hb.User_Id = ?
                         ORDER BY hb.Check_In DESC");
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();

$bookings = [];
while ($row = $result->fetch_assoc()) {
    $checkIn = new DateTime($row['Check_In']);
    $checkOut = new DateTime($row['Check_Out']);
    $nights = $checkIn->diff($checkOut)->days;

    $bookings[] = [
        "id" => "hb" . $row['Hotel_Booking_Id'],
        "type" => "hotel",
        "title" => $row['Hotel_Name'] . " (" . $nights . " night" . ($nights > 1 ? "s" : "") . ")",
        "date" => $row['Check_In'],
        "amount" => (float) $row['Total_Amount'],
        "status" => $row['Status']
    ];
}

echo json_encode($bookings);
$conn->close();
