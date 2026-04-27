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

if (empty($data['Amount']) || empty($data['Method'])) {
    http_response_code(400);
    echo json_encode(["error" => "Amount and Method are required"]);
    exit;
}

$amount = isset($data['Amount']) ? (float) $data['Amount'] : null;
$method = $data['Method'] ?? null;
$bookingId = !empty($data['Booking_Id']) ? (int) preg_replace('/^b/', '', $data['Booking_Id']) : null;
$hotelBookingId = !empty($data['Hotel_Booking_Id']) ? (int) preg_replace('/^hb/', '', $data['Hotel_Booking_Id']) : null;

if ($amount === null || !$method) {
    http_response_code(400);
    echo json_encode(["error" => "Amount and Method are required"]);
    exit;
}

try {
    $stmt = $conn->prepare("INSERT INTO PAYMENT (Amount, Method, Status, Payment_Date, Booking_Id, Hotel_Booking_Id) VALUES (?, ?, 'success', CURDATE(), ?, ?)");
    $stmt->bind_param("dsii", $amount, $method, $bookingId, $hotelBookingId);
    $stmt->execute();

    echo json_encode([
        "success" => true,
        "payment" => [
            "Payment_Id" => $conn->insert_id,
            "Status" => "success"
        ]
    ]);
} catch (mysqli_sql_exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
$conn->close();
