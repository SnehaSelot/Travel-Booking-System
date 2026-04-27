<?php
require_once __DIR__ . '/../config.php';

$hotelId = $_GET['id'] ?? '';
if (!$hotelId) {
    http_response_code(400);
    echo json_encode(["error" => "Hotel ID required"]);
    exit;
}

$numericId = preg_replace('/^h/', '', $hotelId);

$stmt = $conn->prepare("SELECT * FROM HOTEL WHERE Hotel_Id = ?");
$stmt->bind_param("i", $numericId);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    http_response_code(404);
    echo json_encode(["error" => "Hotel not found"]);
    exit;
}

$hotel = $result->fetch_assoc();

// Get rooms
$roomStmt = $conn->prepare("SELECT * FROM ROOM WHERE Hotel_Id = ?");
$roomStmt->bind_param("i", $numericId);
$roomStmt->execute();
$roomResult = $roomStmt->get_result();
$rooms = [];
while ($room = $roomResult->fetch_assoc()) {
    $rooms[] = [
        "id" => "r" . $room['Room_Id'],
        "type" => $room['Room_Type'],
        "price" => (float) $room['Price'],
        "capacity" => (int) $room['Capacity'],
        "available" => true // Check availability logic
    ];
}

// Get reviews
$revStmt = $conn->prepare("SELECT r.*, u.First_Name, u.Last_Name FROM REVIEW r JOIN USER u ON r.User_Id = u.User_Id WHERE r.Hotel_Id = ?");
$revStmt->bind_param("i", $numericId);
$revStmt->execute();
$revResult = $revStmt->get_result();
$reviews = [];
while ($rev = $revResult->fetch_assoc()) {
    $reviews[] = [
        "id" => $rev['Review_Id'],
        "rating" => (float) $rev['Rating'],
        "comment" => $rev['Comment'],
        "user" => $rev['First_Name'] . " " . $rev['Last_Name']
    ];
}

echo json_encode([
    "id" => "h" . $hotel['Hotel_Id'],
    "name" => $hotel['Name'],
    "location" => $hotel['Location'],
    "rating" => (float) $hotel['Rating'],
    "image" => "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
    "pricePerNight" => (float) ($rooms[0]['price'] ?? 0),
    "amenities" => [],
    "rooms" => $rooms,
    "reviews" => $reviews
]);
$conn->close();
