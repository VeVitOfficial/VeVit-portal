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
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Allow-Credentials: true');
}
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit(json_encode(['success' => false, 'message' => 'Method not allowed']));
}

$input = json_decode(file_get_contents('php://input'), true);
$nickname = trim($input['username'] ?? '');
$password = $input['password'] ?? '';

if (!$nickname || !$password) {
    http_response_code(400);
    exit(json_encode(['success' => false, 'message' => 'Zadejte přezdívku a heslo.']));
}

try {
    $pdo = getDB();
    $stmt = $pdo->prepare('SELECT id, nickname, email, password_hash, full_name, avatar_url, tier, xp, level FROM users WHERE nickname = ?');
    $stmt->execute([$nickname]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password_hash'])) {
        http_response_code(401);
        exit(json_encode(['success' => false, 'message' => 'Neplatná přezdívka nebo heslo.']));
    }

    $userData = [
        'id' => (string)$user['id'],
        'nickname' => $user['nickname'],
        'fullName' => $user['full_name'] ?? $user['nickname'],
        'avatarUrl' => $user['avatar_url'] ?? '',
        'email' => $user['email'] ?? '',
        'tier' => $user['tier'] ?? 'free',
        'xp' => (int)($user['xp'] ?? 0),
        'level' => (int)($user['level'] ?? 1),
    ];

    $signedCookie = signCookieData($userData);
    setcookie('vevit_auth', $signedCookie, time() + (86400 * 30), '/', '.vevit.fun', true, false);

    echo json_encode(['success' => true, 'user' => $userData]);
} catch (\PDOException $e) {
    http_response_code(500);
    exit(json_encode(['success' => false, 'message' => 'Chyba serveru. Zkuste to prosím později.']));
}
?>