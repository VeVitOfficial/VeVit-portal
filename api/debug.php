<?php
// DOPORED: Smažte tento soubor po diagnostice!
require_once __DIR__ . '/config.php';

header('Content-Type: application/json; charset=utf-8');

$results = [];

// 1. Test DB připojení
try {
    $pdo = getDB();
    $results['db_connection'] = 'OK';
} catch (\PDOException $e) {
    $results['db_connection'] = 'FAIL: ' . $e->getMessage();
    echo json_encode($results, JSON_PRETTY_PRINT);
    exit;
}

// 2. Test existence tabulky users
try {
    $stmt = $pdo->query("SHOW TABLES LIKE 'users'");
    $tableExists = $stmt->rowCount() > 0;
    $results['users_table_exists'] = $tableExists ? 'YES' : 'NO - need to create it';

    if ($tableExists) {
        $stmt = $pdo->query("SELECT COUNT(*) as cnt FROM users");
        $row = $stmt->fetch();
        $results['users_count'] = (int)$row['cnt'];
    }
} catch (\PDOException $e) {
    $results['users_table_check'] = 'ERROR: ' . $e->getMessage();
}

// 3. Test HMAC funkce
$testData = ['id' => '1', 'nickname' => 'test'];
$signed = signCookieData($testData);
$verified = verifyCookieData($signed);
$results['hmac_sign_verify'] = ($verified && $verified['nickname'] === 'test') ? 'OK' : 'FAIL';

echo json_encode($results, JSON_PRETTY_PRINT);
?>