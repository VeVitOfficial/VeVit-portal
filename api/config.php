<?php
// Database configuration — Wedos
$DB_HOST = 'md396.wedos.net:3306';
$DB_NAME = 'd390994_account';
$DB_USER = 'a390994_account';
$DB_PASS = 'Vitek2008.';
$DB_CHARSET = 'utf8mb4';

// HMAC secret for cookie signing
$SECRET_KEY = 'vVp7!kQ2#mN9$xR4@jL6&hY8*cW3';

// PDO connection
$dsn = "mysql:host=$DB_HOST;dbname=$DB_NAME;charset=$DB_CHARSET";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

function getDB() {
    global $dsn, $DB_USER, $DB_PASS, $options;
    static $pdo = null;
    if ($pdo === null) {
        $pdo = new PDO($dsn, $DB_USER, $DB_PASS, $options);
    }
    return $pdo;
}

// Cookie signing helpers
function signCookieData(array $data): string {
    global $SECRET_KEY;
    $json = json_encode($data, JSON_UNESCAPED_UNICODE);
    $signature = hash_hmac('sha256', $json, $SECRET_KEY);
    return base64_encode($json) . '.' . $signature;
}

function verifyCookieData(string $cookieValue): ?array {
    global $SECRET_KEY;
    $parts = explode('.', $cookieValue, 2);
    if (count($parts) !== 2) return null;
    [$encoded, $signature] = $parts;
    $json = base64_decode($encoded, true);
    if ($json === false) return null;
    $expectedSig = hash_hmac('sha256', $json, $SECRET_KEY);
    if (!hash_equals($expectedSig, $signature)) return null;
    $data = json_decode($json, true);
    if (!is_array($data)) return null;
    return $data;
}