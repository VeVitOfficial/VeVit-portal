<?php
// 1. CORS RESTRIKCE
$allowed_origins = [
    'https://vevit.fun',
    'https://vewibe.vevit.fun',
    'https://account.vevit.fun',
    'http://localhost:3000'
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Access-Control-Allow-Credentials: true");
} else {
    // Zákaz komunikace z jiných domén
    if ($origin !== '') {
        http_response_code(403);
        exit(json_encode(['error' => 'CORS policy failed.']));
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

header('Content-Type: application/json; charset=utf-8');

// 2. RATE LIMITING (IP-based)
session_start();
$ip = $_SERVER['REMOTE_ADDR'];
$time = time();
$rate_limit = 5; // max 5 požadavků
$time_window = 1; // za 1 sekundu

if (!isset($_SESSION['rate_limit'])) {
    $_SESSION['rate_limit'] = [];
}

// Vyčistit staré záznamy
$_SESSION['rate_limit'] = array_filter($_SESSION['rate_limit'], function($timestamp) use ($time, $time_window) {
    return ($timestamp >= ($time - $time_window));
});

if (count($_SESSION['rate_limit']) >= $rate_limit) {
    http_response_code(429);
    exit(json_encode(['error' => 'Too Many Requests. Please slow down.']));
}
$_SESSION['rate_limit'][] = $time;

require_once __DIR__ . '/api/config.php';

try {
    $pdo = getDB();
} catch (\PDOException $e) {
    http_response_code(500);
    exit(json_encode(['error' => 'Database connection failed']));
}

// Získání aktuálního uživatele z podepsané cookie
$current_user_id = null;
if (isset($_COOKIE['vevit_auth'])) {
    $cookieValue = $_COOKIE['vevit_auth'];
    $userData = verifyCookieData($cookieValue);
    if ($userData && isset($userData['id'])) {
        $current_user_id = $userData['id'];
    }
}

// Zpracování požadavku
$action = $_GET['action'] ?? '';
$input = json_decode(file_get_contents('php://input'), true);

switch ($action) {
    case 'create_post':
        // 4. AUTORIZACE UŽIVATELŮ
        if (!$current_user_id) {
            http_response_code(401);
            exit(json_encode(['error' => 'Unauthorized']));
        }

        $sender_id = $input['user_id'] ?? '';
        if ($sender_id !== $current_user_id) {
            http_response_code(403);
            exit(json_encode(['error' => 'Forbidden: User ID mismatch']));
        }

        $title = $input['title'] ?? '';
        $content = $input['content'] ?? '';

        // 5. PREPARED STATEMENTS
        $stmt = $pdo->prepare("INSERT INTO posts (user_id, title, content) VALUES (:user_id, :title, :content)");
        $stmt->execute([
            'user_id' => $current_user_id,
            'title' => $title,
            'content' => $content
        ]);

        echo json_encode(['success' => true, 'post_id' => $pdo->lastInsertId()]);
        break;

    case 'get_posts':
        // 5. PREPARED STATEMENTS
        $stmt = $pdo->prepare("SELECT id, user_id, title, content FROM posts ORDER BY created_at DESC LIMIT 10");
        $stmt->execute();
        $posts = $stmt->fetchAll();

        // 3. SANITIZACE VÝSTUPŮ (Ochrana proti XSS)
        $sanitized_posts = array_map(function($post) {
            return [
                'id' => $post['id'],
                'user_id' => htmlspecialchars($post['user_id'], ENT_QUOTES, 'UTF-8'),
                'title' => htmlspecialchars($post['title'], ENT_QUOTES, 'UTF-8'),
                'content' => htmlspecialchars($post['content'], ENT_QUOTES, 'UTF-8')
            ];
        }, $posts);

        echo json_encode(['success' => true, 'posts' => $sanitized_posts]);
        break;

    case 'upvote_post':
        // 4. AUTORIZACE UŽIVATELŮ
        if (!$current_user_id) {
            http_response_code(401);
            exit(json_encode(['error' => 'Unauthorized']));
        }

        $post_id = $input['post_id'] ?? '';

        // 5. PREPARED STATEMENTS
        $stmt = $pdo->prepare("UPDATE posts SET upvotes = upvotes + 1 WHERE id = :post_id");
        $stmt->execute(['post_id' => $post_id]);

        echo json_encode(['success' => true]);
        break;

    case 'get_stats':
        // Získání počtu registrovaných uživatelů
        try {
            $stmt = $pdo->query("SELECT COUNT(*) as user_count FROM users");
            $result = $stmt->fetch();
            $user_count = $result ? (int)$result['user_count'] : 0;
        } catch (\PDOException $e) {
            // Pokud tabulka neexistuje, vrátíme 0
            $user_count = 0;
        }

        echo json_encode([
            'success' => true,
            'stats' => [
                'users' => $user_count,
                'games' => 21,
                'tools' => 100,
                'lessons' => 500
            ]
        ]);
        break;

    default:
        http_response_code(400);
        echo json_encode(['error' => 'Invalid action']);
        break;
}
?>
