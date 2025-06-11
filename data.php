<?php
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: index.php');
    exit;
}

$servername = "127.0.0.1:3307";
$username = "root";
$password = "";
$database = "website";

// Create database connection
$conn = new mysqli($servername, $username, $password, $database);
if ($conn->connect_error) {
    die("Database connection failed: " . $conn->connect_error);
}

// Get and sanitize form data
$name = htmlspecialchars($_POST['name']);
$phone = htmlspecialchars($_POST['phone']);
$address = htmlspecialchars($_POST['address']);
$cvv = htmlspecialchars($_POST['cvv']); 

// Only store last 4 digits of card number
$card_number_full = preg_replace('/\D/', '', $_POST['card_number']);
$card_number = substr($card_number_full, -4);

$expiry_month = (int)$_POST['expiry_month'];
$expiry_year = (int)$_POST['expiry_year'];

// Prepare SQL statement
$stmt = $conn->prepare(
    'INSERT INTO payments (name, phone, address, card_number, expiry_month, expiry_year)
     VALUES (?, ?, ?, ?, ?, ?)'
);
if (!$stmt) {
    die("Failed to prepare statement: " . $conn->error);
}

$stmt->bind_param('ssssii', $name, $phone, $address, $card_number, $expiry_month, $expiry_year);

// Execute the statement
if ($stmt->execute()) {
    echo "<script>alert('Checkout completed!'); window.location.href='index.html';</script>";
} else {
    echo "Insert failed: " . $stmt->error;
}

$stmt->close();
$conn->close();

if (isset($_POST['cart_data'])) {
  $cart = json_decode($_POST['cart_data'], true);
  echo "<pre>";
  print_r($cart);
  echo "</pre>";
}

?>