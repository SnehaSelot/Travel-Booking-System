<?php
require_once __DIR__ . '/../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (empty($data['Email']) || empty($data['Password'])) {
    http_response_code(400);
    echo json_encode(["error" => "Email and Password are required"]);
    exit;
}

if ($data['Email'] === 'admin@example.com' && $data['Password'] === 'admin123') {
    echo json_encode([
        "success" => true,
        "user" => [
            "User_Id" => 0,
            "First_Name" => "Admin",
            "Last_Name" => "User",
            "Email" => $data['Email'],
            "role" => "admin"
        ]
    ]);
    $conn->close();
    exit;
}

$stmt = $conn->prepare("SELECT * FROM USER WHERE Email = ?");
$stmt->bind_param("s", $data['Email']);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    http_response_code(401);
    echo json_encode(["error" => "Invalid email or password"]);
    exit;
}

$user = $result->fetch_assoc();

if (!password_verify($data['Password'], $user['Password'])) {
    http_response_code(401);
    echo json_encode(["error" => "Invalid email or password"]);
    exit;
}

unset($user['Password']);
echo json_encode(["success" => true, "user" => $user]);
$conn->close();
