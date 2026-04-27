<?php
require_once __DIR__ . '/../config.php';

$source = $_GET['source'] ?? '';
$destination = $_GET['destination'] ?? '';

$sql = "SELECT t.*, v.Name AS Vehicle_Name, v.Type AS Vehicle_Type, v.Total_Seats,
               r.Source, r.Destination, r.Distance
        FROM TRIP t
        JOIN VEHICLE v ON t.Vehicle_Id = v.Vehicle_Id
        JOIN ROUTE r ON t.Route_Id = r.Route_Id
        WHERE 1=1";
$params = [];
$types = "";

if ($source) {
    $sql .= " AND LOWER(r.Source) LIKE LOWER(?)";
    $params[] = "%$source%";
    $types .= "s";
}
if ($destination) {
    $sql .= " AND LOWER(r.Destination) LIKE LOWER(?)";
    $params[] = "%$destination%";
    $types .= "s";
}

$stmt = $conn->prepare($sql);
if ($params) $stmt->bind_param($types, ...$params);
$stmt->execute();
$result = $stmt->get_result();

$trips = [];
while ($row = $result->fetch_assoc()) {
    // Count available seats
    $seatStmt = $conn->prepare("SELECT COUNT(*) as available FROM SEAT WHERE Trip_Id = ? AND Status = 'available'");
    $seatStmt->bind_param("i", $row['Trip_Id']);
    $seatStmt->execute();
    $seatCount = $seatStmt->get_result()->fetch_assoc()['available'];

    $trips[] = [
        "id" => "t" . $row['Trip_Id'],
        "vehicle" => $row['Vehicle_Name'],
        "type" => strtolower($row['Vehicle_Type']),
        "source" => $row['Source'],
        "destination" => $row['Destination'],
        "departure" => $row['Departure_Time'],
        "arrival" => $row['Arrival_Time'],
        "duration" => "", // Calculate if needed
        "price" => (float) $row['Price'],
        "seatsAvailable" => (int) $seatCount,
        "totalSeats" => (int) $row['Total_Seats'],
        "amenities" => [] // Add amenities table if needed
    ];
}

echo json_encode($trips);
$conn->close();
