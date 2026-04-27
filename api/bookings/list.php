<?php
require_once __DIR__ . '/../config.php';

$userId = $_GET['user_id'] ?? '';
if (!$userId) {
    http_response_code(400);
    echo json_encode(["error" => "User ID required"]);
    exit;
}

$stmt = $conn->prepare("SELECT tb.*, v.Name AS Vehicle_Name, r.Source, r.Destination
                         FROM TRAVEL_BOOKING tb
                         JOIN TRIP t ON tb.Trip_Id = t.Trip_Id
                         JOIN VEHICLE v ON t.Vehicle_Id = v.Vehicle_Id
                         JOIN ROUTE r ON t.Route_Id = r.Route_Id
                         WHERE tb.User_Id = ?
                         ORDER BY tb.Booking_Date DESC");
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();

$bookings = [];
while ($row = $result->fetch_assoc()) {
    $bookings[] = [
        "id" => "b" . $row['Booking_Id'],
        "type" => "trip",
        "title" => $row['Source'] . " → " . $row['Destination'] . " (" . $row['Vehicle_Name'] . ")",
        "date" => $row['Booking_Date'],
        "amount" => (float) $row['Total_Amount'],
        "status" => $row['Status']
    ];
}

echo json_encode($bookings);
$conn->close();
