<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$photosDir = __DIR__ . '/media/photos/';
$videosDir = __DIR__ . '/media/videos/';

$photos = [];
$videos = [];

// Scan photos folder
if (is_dir($photosDir)) {
    $files = array_diff(scandir($photosDir), ['.', '..']);
    foreach ($files as $file) {
        $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
        if (in_array($ext, ['jpg', 'jpeg', 'png', 'gif', 'webp'])) {
            $name = pathinfo($file, PATHINFO_FILENAME);
            $name = ucwords(str_replace(['-', '_'], ' ', $name));
            $photos[] = [
                'file' => 'media/photos/' . $file,
                'name' => $name,
            ];
        }
    }
}

// Scan videos folder
if (is_dir($videosDir)) {
    $files = array_diff(scandir($videosDir), ['.', '..']);
    foreach ($files as $file) {
        $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
        if (in_array($ext, ['mp4', 'webm', 'ogg'])) {
            $name = pathinfo($file, PATHINFO_FILENAME);
            $name = ucwords(str_replace(['-', '_'], ' ', $name));
            $videos[] = [
                'file' => 'media/videos/' . $file,
                'name' => $name,
            ];
        }
    }
}

echo json_encode(['photos' => $photos, 'videos' => $videos]);
