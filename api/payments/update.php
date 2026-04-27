<?php
require_once __DIR__ . '/../config.php';
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (empty($data['Payment_Id'])) {
    http_response_code(400);
    echo json_encode(["error" => "Payment_Id is required"]);
    exit;
}

$paymentId = (int) preg_replace('/^p/', '', $data['Payment_Id']);
$updates = [];
$params = [];
$types = "";

if (isset($data['Status'])) {
    $updates[] = "Status = ?";
    $params[] = $data['Status'];
    $types .= "s";
}

if (isset($data['Amount'])) {
    $updates[] = "Amount = ?";
    $params[] = (float) $data['Amount'];
    $types .= "d";
}

if (isset($data['Method'])) {
    $updates[] = "Method = ?";
    $params[] = $data['Method'];
    $types .= "s";
}

if (empty($updates)) {
    http_response_code(400);
    echo json_encode(["error" => "No fields to update"]);
    exit;
}

$params[] = $paymentId;
$types .= "i";

$sql = "UPDATE PAYMENT SET " . implode(", ", $updates) . " WHERE Payment_Id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param($types, ...$params);

try {
    $stmt->execute();
    echo json_encode([
        "success" => true,
        "message" => "Payment updated successfully"
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Update failed: " . $e->getMessage()]);
}

$conn->close();
?>