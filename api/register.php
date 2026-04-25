<?php
// Registration is handled at account.vevit.fun/register
// This endpoint redirects there or returns a message for API callers
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    header('Location: https://account.vevit.fun/register');
    exit;
}

http_response_code(200);
echo json_encode([
    'success' => false,
    'message' => 'Registrace probíhá na account.vevit.fun/register',
    'redirect' => 'https://account.vevit.fun/register'
]);
?>