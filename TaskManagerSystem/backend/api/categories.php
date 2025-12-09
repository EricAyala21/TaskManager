<?php
require_once '../config/database.php';
require_once '../config/cors.php';

$database = new Database();
$db = $database->getConnection();

// Check if database connection is valid
if ($db === null) {
    http_response_code(503);
    echo json_encode([
        "message" => "Database connection failed. Please check your database configuration.",
        "error" => "Connection error"
    ]);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            // Get single category
            $id = $_GET['id'];
            $stmt = $db->prepare("SELECT * FROM categories WHERE id = ?");
            $stmt->execute([$id]);
            $category = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($category) {
                echo json_encode($category);
            } else {
                http_response_code(404);
                echo json_encode(["message" => "Category not found"]);
            }
        } else {
            // Get all categories
            $stmt = $db->query("SELECT * FROM categories ORDER BY name ASC");
            $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($categories);
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        
        if (!empty($data->name)) {
            $stmt = $db->prepare("INSERT INTO categories (name) VALUES (?)");
            
            if ($stmt->execute([$data->name])) {
                http_response_code(201);
                echo json_encode([
                    "message" => "Category created successfully",
                    "id" => $db->lastInsertId(),
                    "name" => $data->name
                ]);
            } else {
                http_response_code(503);
                echo json_encode(["message" => "Unable to create category"]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["message" => "Category name is required"]);
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"));
        
        if (!empty($data->id) && !empty($data->name)) {
            $stmt = $db->prepare("UPDATE categories SET name = ? WHERE id = ?");
            
            if ($stmt->execute([$data->name, $data->id])) {
                echo json_encode([
                    "message" => "Category updated successfully",
                    "id" => $data->id,
                    "name" => $data->name
                ]);
            } else {
                http_response_code(503);
                echo json_encode(["message" => "Unable to update category"]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["message" => "Category ID and name are required"]);
        }
        break;

    case 'DELETE':
        $data = json_decode(file_get_contents("php://input"));
        
        if (!empty($data->id)) {
            // First, check if category has tasks
            $checkStmt = $db->prepare("SELECT COUNT(*) as count FROM tasks WHERE category_id = ?");
            $checkStmt->execute([$data->id]);
            $result = $checkStmt->fetch(PDO::FETCH_ASSOC);
            
            if ($result['count'] > 0) {
                http_response_code(400);
                echo json_encode(["message" => "Cannot delete category with existing tasks"]);
            } else {
                $stmt = $db->prepare("DELETE FROM categories WHERE id = ?");
                
                if ($stmt->execute([$data->id])) {
                    echo json_encode(["message" => "Category deleted successfully"]);
                } else {
                    http_response_code(503);
                    echo json_encode(["message" => "Unable to delete category"]);
                }
            }
        } else {
            http_response_code(400);
            echo json_encode(["message" => "Category ID is required"]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["message" => "Method not allowed"]);
        break;
}
?>
