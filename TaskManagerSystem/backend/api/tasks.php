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
            // Get single task
            $id = $_GET['id'];
            $stmt = $db->prepare("
                SELECT t.*, c.name as category_name 
                FROM tasks t 
                LEFT JOIN categories c ON t.category_id = c.id 
                WHERE t.id = ?
            ");
            $stmt->execute([$id]);
            $task = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($task) {
                echo json_encode($task);
            } else {
                http_response_code(404);
                echo json_encode(["message" => "Task not found"]);
            }
        } else {
            // Get all tasks with category information
            $categoryFilter = isset($_GET['category_id']) ? $_GET['category_id'] : null;
            
            if ($categoryFilter) {
                $stmt = $db->prepare("
                    SELECT t.*, c.name as category_name 
                    FROM tasks t 
                    LEFT JOIN categories c ON t.category_id = c.id 
                    WHERE t.category_id = ?
                    ORDER BY t.created_at DESC
                ");
                $stmt->execute([$categoryFilter]);
            } else {
                $stmt = $db->query("
                    SELECT t.*, c.name as category_name 
                    FROM tasks t 
                    LEFT JOIN categories c ON t.category_id = c.id 
                    ORDER BY t.created_at DESC
                ");
            }
            
            $tasks = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($tasks);
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        
        if (empty($data)) {
            http_response_code(400);
            echo json_encode(["message" => "Invalid request data"]);
            break;
        }
        
        if (!empty($data->title)) {
            try {
                $categoryId = !empty($data->category_id) ? intval($data->category_id) : null;
                $description = !empty($data->description) ? $data->description : null;
                
                $stmt = $db->prepare("
                    INSERT INTO tasks (title, description, category_id, is_completed) 
                    VALUES (?, ?, ?, 0)
                ");
                
                if ($stmt->execute([$data->title, $description, $categoryId])) {
                    http_response_code(201);
                    $taskId = $db->lastInsertId();
                    
                    // Fetch the created task with category info
                    $fetchStmt = $db->prepare("
                        SELECT t.*, c.name as category_name 
                        FROM tasks t 
                        LEFT JOIN categories c ON t.category_id = c.id 
                        WHERE t.id = ?
                    ");
                    $fetchStmt->execute([$taskId]);
                    $task = $fetchStmt->fetch(PDO::FETCH_ASSOC);
                    
                    echo json_encode([
                        "message" => "Task created successfully",
                        "task" => $task
                    ]);
                } else {
                    http_response_code(503);
                    echo json_encode(["message" => "Unable to create task"]);
                }
            } catch (PDOException $e) {
                http_response_code(500);
                echo json_encode([
                    "message" => "Database error: " . $e->getMessage()
                ]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["message" => "Task title is required"]);
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"));
        
        if (!empty($data->id)) {
            $updates = [];
            $params = [];
            
            if (isset($data->title)) {
                $updates[] = "title = ?";
                $params[] = $data->title;
            }
            
            if (isset($data->description)) {
                $updates[] = "description = ?";
                $params[] = $data->description;
            }
            
            if (isset($data->category_id)) {
                $updates[] = "category_id = ?";
                $params[] = $data->category_id;
            }
            
            if (isset($data->is_completed)) {
                $updates[] = "is_completed = ?";
                $params[] = $data->is_completed ? 1 : 0;
            }
            
            if (!empty($updates)) {
                $params[] = $data->id;
                $sql = "UPDATE tasks SET " . implode(", ", $updates) . " WHERE id = ?";
                $stmt = $db->prepare($sql);
                
                if ($stmt->execute($params)) {
                    // Fetch updated task
                    $fetchStmt = $db->prepare("
                        SELECT t.*, c.name as category_name 
                        FROM tasks t 
                        LEFT JOIN categories c ON t.category_id = c.id 
                        WHERE t.id = ?
                    ");
                    $fetchStmt->execute([$data->id]);
                    $task = $fetchStmt->fetch(PDO::FETCH_ASSOC);
                    
                    echo json_encode([
                        "message" => "Task updated successfully",
                        "task" => $task
                    ]);
                } else {
                    http_response_code(503);
                    echo json_encode(["message" => "Unable to update task"]);
                }
            } else {
                http_response_code(400);
                echo json_encode(["message" => "No fields to update"]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["message" => "Task ID is required"]);
        }
        break;

    case 'DELETE':
        $data = json_decode(file_get_contents("php://input"));
        
        if (!empty($data->id)) {
            $stmt = $db->prepare("DELETE FROM tasks WHERE id = ?");
            
            if ($stmt->execute([$data->id])) {
                echo json_encode(["message" => "Task deleted successfully"]);
            } else {
                http_response_code(503);
                echo json_encode(["message" => "Unable to delete task"]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["message" => "Task ID is required"]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["message" => "Method not allowed"]);
        break;
}
?>
