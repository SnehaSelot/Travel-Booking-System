<?php
require_once __DIR__ . '/../config.php';

$tripId = $_GET['id'] ?? '';
if (!$tripId) {
    http_response_code(400);
    echo json_encode(["error" => "Trip ID required"]);
    exit;
}

// Remove "t" prefix if present
$numericId = preg_replace('/^t/', '', $tripId);

$stmt = $conn->prepare("SELECT t.*, v.Name AS Vehicle_Name, v.Type AS Vehicle_Type, v.Total_Seats,
                                r.Source, r.Destination, r.Distance
                         FROM TRIP t
                         JOIN VEHICLE v ON t.Vehicle_Id = v.Vehicle_Id
                         JOIN ROUTE r ON t.Route_Id = r.Route_Id
                         WHERE t.Trip_Id = ?");
$stmt->bind_param("i", $numericId);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    http_response_code(404);
    echo json_encode(["error" => "Trip not found"]);
    exit;
}

$row = $result->fetch_assoc();

// Get seats
$seatStmt = $conn->prepare("SELECT * FROM SEAT WHERE Trip_Id = ? ORDER BY Seat_Number");
$seatStmt->bind_param("i", $numericId);
$seatStmt->execute();
$seatResult = $seatStmt->get_result();
$seats = [];
$availableCount = 0;
while ($seat = $seatResult->fetch_assoc()) {
    $seats[] = [
        "id" => $seat['Seat_Id'],
        "number" => (int) $seat['Seat_Number'],
        "status" => $seat['Status']
    ];
    if ($seat['Status'] === 'available') $availableCount++;
}

echo json_encode([
    "id" => "t" . $row['Trip_Id'],
    "vehicle" => $row['Vehicle_Name'],
    "type" => strtolower($row['Vehicle_Type']),
    "source" => $row['Source'],
    "destination" => $row['Destination'],
    "departure" => $row['Departure_Time'],
    "arrival" => $row['Arrival_Time'],
    "duration" => "",
    "price" => (float) $row['Price'],
    "seatsAvailable" => $availableCount,
    "totalSeats" => (int) $row['Total_Seats'],
    "amenities" => [],
    "seats" => $seats
]);
$conn->close();
