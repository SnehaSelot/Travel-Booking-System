<?php
// CORS FIX
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
    exit();
}

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

require_once __DIR__ . '/../config.php';

// Get JSON input
$data = json_decode(file_get_contents("php://input"), true);

$first = $data['First_Name'] ?? '';
$last = $data['Last_Name'] ?? '';
$email = $data['Email'] ?? '';
$phone = $data['Phone'] ?? '';
$password = $data['Password'] ?? '';

if (!$first || !$last || !$email || !$password) {
    echo json_encode(["error" => "Missing required fields"]);
    exit();
}

$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

try {
    $check = $conn->prepare("SELECT User_Id FROM USER WHERE Email = ?");
    $check->bind_param("s", $email);
    $check->execute();
    $check->store_result();

    if ($check->num_rows > 0) {
        http_response_code(409);
        echo json_encode(["error" => "Email already registered"]);
        exit();
    }

    $sql = "INSERT INTO USER (First_Name, Last_Name, Email, Phone, Password) VALUES (?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssss", $first, $last, $email, $phone, $hashedPassword);
    $stmt->execute();

    $newUser = [
        "User_Id" => $stmt->insert_id,
        "First_Name" => $first,
        "Last_Name" => $last,
        "Email" => $email,
        "Phone" => $phone,
        "role" => $email === "admin@example.com" ? "admin" : "user"
    ];

    echo json_encode(["success" => true, "user" => $newUser]);
} catch (mysqli_sql_exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}

$conn->close();
?>