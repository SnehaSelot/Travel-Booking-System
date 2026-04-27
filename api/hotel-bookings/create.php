<?php
require_once __DIR__ . '/../config.php';
header("Content-Type: application/json");
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$required = ['User_Id', 'Hotel_Id', 'Check_In', 'Check_Out', 'Total_Amount'];
foreach ($required as $field) {
    if (empty($data[$field])) {
        http_response_code(400);
        echo json_encode(["error" => "$field is required"]);
        exit;
    }
}

$hotelId = preg_replace('/^h/', '', $data['Hotel_Id']);
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
    $stmt = $conn->prepare("INSERT INTO HOTEL_BOOKING (Check_In, Check_Out, Status, Total_Amount, User_Id, Hotel_Id) VALUES (?, ?, 'confirmed', ?, ?, ?)");
    $stmt->bind_param("ssdii", $data['Check_In'], $data['Check_Out'], $data['Total_Amount'], $userId, $hotelId);
    $stmt->execute();

    echo json_encode([
        "success" => true,
        "booking" => [
            "Hotel_Booking_Id" => $conn->insert_id,
            "Status" => "confirmed",
            "Total_Amount" => $data['Total_Amount']
        ]
    ]);
} catch (mysqli_sql_exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Hotel booking failed: " . $e->getMessage()]);
}

$conn->close();
