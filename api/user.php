<?php
require_once __DIR__ . '/config.php';

header('Content-Type: application/json; charset=utf-8');

// CORS
$allowed_origins = [
    'https://vevit.fun',
    'https://vewibe.vevit.fun',
    'https://account.vevit.fun',
    'http://localhost:3000'
];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
    header('Access-Control-Allow-Methods: GET, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Allow-Credentials: true');
}
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if (!isset($_COOKIE['vevit_auth'])) {
    http_response_code(401);
    exit(json_encode(['success' => false, 'message' => 'Not authenticated']));
}

$cookieValue = $_COOKIE['vevit_auth'];
$userData = verifyCookieData($cookieValue);

if (!$userData || !isset($userData['id'])) {
    http_response_code(401);
    exit(json_encode(['success' => false, 'message' => 'Invalid cookie']));
}

try {
    $pdo = getDB();
    $stmt = $pdo->prepare('SELECT id, nickname, email, full_name, avatar_url, tier, xp, level FROM users WHERE id = ?');
    $stmt->execute([$userData['id']]);
    $user = $stmt->fetch();

    if (!$user) {
        http_response_code(401);
        exit(json_encode(['success' => false, 'message' => 'User not found']));
    }

    echo json_encode(['success' => true, 'user' => [
        'id' => (string)$user['id'],
        'nickname' => $user['nickname'],
        'fullName' => $user['full_name'] ?? $user['nickname'],
        'avatarUrl' => $user['avatar_url'] ?? '',
        'email' => $user['email'] ?? '',
        'tier' => $user['tier'] ?? 'free',
        'xp' => (int)($user['xp'] ?? 0),
        'level' => (int)($user['level'] ?? 1),
    ]]);
} catch (\PDOException $e) {
    http_response_code(500);
    exit(json_encode(['success' => false, 'message' => 'Server error']));
}
?>