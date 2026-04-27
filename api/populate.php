<?php
require_once __DIR__ . '/config.php';

echo "Populating database with hotels and trips...\n";

// Insert Hotels
$hotels = [
    ['The Grand Palace', 'Goa, Calangute Beach', 4.5],
    ['Marina Bay Resort', 'Mumbai, Marine Drive', 4.8],
    ['Heritage Haveli', 'Jaipur, Old City', 4.2],
    ['Backwater Retreat', 'Kerala, Alleppey', 4.6],
    ['Taj Mahal Palace', 'Mumbai, Colaba', 4.9],
    ['ITC Grand Chola', 'Chennai, Guindy', 4.7],
    ['The Leela Palace', 'Bangalore, Old Airport Road', 4.8],
    ['Hyatt Regency', 'Delhi, Bhikaji Cama Place', 4.4],
    ['Radisson Blu', 'Pune, Hinjewadi', 4.3],
    ['Novotel', 'Hyderabad, Hitech City', 4.2],
    ['Courtyard by Marriott', 'Ahmedabad, Satellite', 4.5],
    ['Holiday Inn', 'Kolkata, Salt Lake', 4.1]
];

foreach ($hotels as $index => $hotel) {
    $hotelId = $index + 1;
    $stmt = $conn->prepare("INSERT IGNORE INTO HOTEL (Hotel_Id, Name, Location, Rating) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("issd", $hotelId, $hotel[0], $hotel[1], $hotel[2]);
    $stmt->execute();

    // Insert rooms for each hotel
    $rooms = [
        ['Deluxe Room', 4500, 2],
        ['Suite', 8000, 3],
        ['Standard Room', 3000, 2]
    ];

    if ($hotelId >= 5) { // Additional hotels have different rooms
        $rooms = [
            ['Luxury Suite', 25000, 2],
            ['Executive Room', 12000, 2],
            ['Superior Room', 5500, 2]
        ];
    }

    foreach ($rooms as $roomIndex => $room) {
        $roomId = ($hotelId - 1) * 3 + $roomIndex + 1;
        $stmt = $conn->prepare("INSERT IGNORE INTO ROOM (Room_Id, Hotel_Id, Room_Type, Price, Capacity) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("iisdi", $roomId, $hotelId, $room[0], $room[1], $room[2]);
        $stmt->execute();
    }
}

// Insert Routes
$routes = [
    [1, 'Mumbai', 'Goa', 400],
    [2, 'Delhi', 'Mumbai', 1400],
    [3, 'Bangalore', 'Chennai', 350],
    [4, 'Chennai', 'Bangalore', 350],
    [5, 'Pune', 'Hyderabad', 550],
    [6, 'Kolkata', 'Delhi', 1500],
    [7, 'Ahmedabad', 'Jaipur', 650],
    [8, 'Ahmedabad', 'Mumbai', 500],
    [9, 'Delhi', 'Agra', 200],
    [10, 'Mumbai', 'Goa', 400],
    [11, 'Chennai', 'Pondicherry', 150],
    [12, 'Bangalore', 'Kolkata', 1900],
    [13, 'Hyderabad', 'Bangalore', 570],
    [14, 'Delhi', 'Varanasi', 800],
    [15, 'Kolkata', 'Puri', 500]
];

foreach ($routes as $route) {
    $stmt = $conn->prepare("INSERT IGNORE INTO ROUTE (Route_Id, Source, Destination, Distance) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("issi", $route[0], $route[1], $route[2], $route[3]);
    $stmt->execute();
}

// Insert Vehicles
$vehicles = [
    [1, 'Volvo Multi-Axle A/C Sleeper', 'bus', 36],
    [2, 'Rajdhani Express', 'train', 72],
    [3, 'Luxury A/C Seater', 'bus', 40],
    [4, 'Shatabdi Express', 'train', 90],
    [5, 'Mercedes Multi-Axle Semi-Sleeper', 'bus', 36],
    [6, 'Duronto Express', 'train', 72],
    [7, 'AC Volvo Multi-Axle', 'bus', 40],
    [8, 'Garib Rath Express', 'train', 80],
    [9, 'Luxury Coach', 'bus', 45],
    [10, 'Tejas Express', 'train', 78],
    [11, 'Semi-Sleeper AC', 'bus', 30],
    [12, 'Humsafar Express', 'train', 72],
    [13, 'Volvo AC Seater', 'bus', 40],
    [14, 'Vande Bharat Express', 'train', 112],
    [15, 'Luxury Sleeper', 'bus', 32]
];

foreach ($vehicles as $vehicle) {
    $stmt = $conn->prepare("INSERT IGNORE INTO VEHICLE (Vehicle_Id, Name, Type, Total_Seats) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("issi", $vehicle[0], $vehicle[1], $vehicle[2], $vehicle[3]);
    $stmt->execute();
}

// Insert Trips
$trips = [
    [1, 1, 1, 1200, '21:00', '06:30'],
    [2, 2, 2, 2450, '16:25', '08:35'],
    [3, 3, 3, 850, '06:00', '12:30'],
    [4, 4, 4, 780, '06:00', '11:00'],
    [5, 5, 5, 1500, '19:30', '07:00'],
    [6, 6, 6, 2800, '20:05', '13:25'],
    [7, 7, 7, 1800, '22:00', '08:00'],
    [8, 8, 8, 950, '14:30', '22:45'],
    [9, 9, 9, 600, '07:00', '10:30'],
    [10, 10, 10, 1650, '06:25', '12:35'],
    [11, 11, 11, 450, '23:00', '02:30'],
    [12, 12, 12, 3200, '21:45', '18:30'],
    [13, 13, 13, 1100, '20:30', '05:00'],
    [14, 14, 14, 1850, '06:00', '14:30'],
    [15, 15, 15, 950, '22:30', '06:00']
];

foreach ($trips as $trip) {
    $stmt = $conn->prepare("INSERT IGNORE INTO TRIP (Trip_Id, Vehicle_Id, Route_Id, Price, Departure_Time) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("iiiis", $trip[0], $trip[1], $trip[2], $trip[3], $trip[4]);
    $stmt->execute();

    // Insert seats for each trip
    $vehicleId = $trip[1];
    $stmt2 = $conn->prepare("SELECT Total_Seats FROM VEHICLE WHERE Vehicle_Id = ?");
    $stmt2->bind_param("i", $vehicleId);
    $stmt2->execute();
    $totalSeats = $stmt2->get_result()->fetch_assoc()['Total_Seats'];

    for ($i = 1; $i <= $totalSeats; $i++) {
        $stmt3 = $conn->prepare("INSERT IGNORE INTO SEAT (Seat_Id, Trip_Id, Seat_Number, Status) VALUES (?, ?, ?, 'available')");
        $seatId = ($trip[0] - 1) * 100 + $i; // Generate unique seat ID
        $stmt3->bind_param("iii", $seatId, $trip[0], $i);
        $stmt3->execute();
    }
}

echo "Database populated successfully!\n";
$conn->close();
?>