<?php
require_once __DIR__ . '/config.php';

header('Content-Type: application/json; charset=utf-8');

$allowed_origins = [
    'https://vevit.fun',
    'https://vewibe.vevit.fun',
    'https://account.vevit.fun',
    'http://localhost:3000'
];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Allow-Credentials: true');
}
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Clear the auth cookie
setcookie('vevit_auth', '', time() - 3600, '/', '.vevit.fun', true, false);
setcookie('vevit_auth', '', time() - 3600, '/', '', true, false);

echo json_encode(['success' => true]);
?>