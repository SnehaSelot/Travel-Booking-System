<?php
require_once __DIR__ . '/../config.php';

$search = $_GET['search'] ?? '';

$sql = "SELECT * FROM HOTEL WHERE 1=1";
$params = [];
$types = "";

if ($search) {
    $sql .= " AND (LOWER(Name) LIKE LOWER(?) OR LOWER(Location) LIKE LOWER(?))";
    $params[] = "%$search%";
    $params[] = "%$search%";
    $types .= "ss";
}

$stmt = $conn->prepare($sql);
if ($params) $stmt->bind_param($types, ...$params);
$stmt->execute();
$result = $stmt->get_result();

$hotels = [];
while ($row = $result->fetch_assoc()) {
    // Get min room price
    $roomStmt = $conn->prepare("SELECT MIN(Price) as min_price FROM ROOM WHERE Hotel_Id = ?");
    $roomStmt->bind_param("i", $row['Hotel_Id']);
    $roomStmt->execute();
    $minPrice = $roomStmt->get_result()->fetch_assoc()['min_price'];

    $hotels[] = [
        "id" => "h" . $row['Hotel_Id'],
        "name" => $row['Name'],
        "location" => $row['Location'],
        "rating" => (float) $row['Rating'],
        "image" => "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
        "pricePerNight" => (float) ($minPrice ?? 0),
        "amenities" => []
    ];
}

echo json_encode($hotels);
$conn->close();
