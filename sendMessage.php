<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $name = htmlspecialchars($_POST['name'] ?? '');
    $email = htmlspecialchars($_POST['email'] ?? '');
    $message = htmlspecialchars($_POST['message'] ?? '');

    if (empty($name) || empty($email) || empty($message)) {
        echo "All fields are required.";
        exit;
    }

    $entry = "Name: $name\nEmail: $email\nMessage: $message\n---\n";
    file_put_contents("messages.txt", $entry, FILE_APPEND);

    echo "<script>
            alert('Message sent successfully!');
            window.location.href = 'index.html';
          </script>";
    exit;
} else {
    echo "Invalid request.";
}
?>