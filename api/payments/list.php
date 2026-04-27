<?php
require_once __DIR__ . '/../config.php';

$userId = $_GET['user_id'] ?? '';
if (!$userId) {
    http_response_code(400);
    echo json_encode(["error" => "User ID required"]);
    exit;
}

$sql = "SELECT p.*, 
        COALESCE(
            CONCAT(r.Source, ' → ', r.Destination),
            h.Name
        ) AS Description
        FROM PAYMENT p
        LEFT JOIN TRAVEL_BOOKING tb ON p.Booking_Id = tb.Booking_Id
        LEFT JOIN TRIP t ON tb.Trip_Id = t.Trip_Id
        LEFT JOIN ROUTE r ON t.Route_Id = r.Route_Id
        LEFT JOIN HOTEL_BOOKING hb ON p.Hotel_Booking_Id = hb.Hotel_Booking_Id
        LEFT JOIN HOTEL h ON hb.Hotel_Id = h.Hotel_Id
        WHERE tb.User_Id = ? OR hb.User_Id = ?
        ORDER BY p.Payment_Date DESC";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $userId, $userId);
$stmt->execute();
$result = $stmt->get_result();

$payments = [];
while ($row = $result->fetch_assoc()) {
    $payments[] = [
        "id" => "p" . $row['Payment_Id'],
        "bookingId" => $row['Booking_Id'] ? "b" . $row['Booking_Id'] : "hb" . $row['Hotel_Booking_Id'],
        "method" => $row['Method'],
        "amount" => (float) $row['Amount'],
        "date" => $row['Payment_Date'],
        "status" => $row['Status'],
        "description" => $row['Description']
    ];
}

echo json_encode($payments);
$conn->close();
