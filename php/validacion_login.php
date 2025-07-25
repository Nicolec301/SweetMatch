<?php
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $usuario_input = $_POST['nombre'];
    $password = $_POST['password'];
    
    // Validar campos vacíos
    if (empty($usuario_input) || empty($password)) {
        header("Location: ../modules/login/login.php?error=empty");
        exit();
    }
    
    // Leer el archivo de usuarios
    $usuarios = file_get_contents('../data/usuarios.txt');
    $usuarios_array = explode("---", $usuarios);
    
    foreach ($usuarios_array as $usuario) {
        if (empty(trim($usuario))) continue;
        
        $datos = [];
        $lineas = explode("\n", $usuario);
        foreach ($lineas as $linea) {
            $partes = explode(":", $linea);
            if (count($partes) == 2) {
                $datos[trim($partes[0])] = trim($partes[1]);
            }
        }
        
        // Verificar nombre O email
        if (isset($datos['nombre']) && isset($datos['email']) && isset($datos['password'])) {
            if (($datos['nombre'] === $usuario_input || $datos['email'] === $usuario_input) 
                && password_verify($password, $datos['password'])) {
                $sesion_usuario = $datos;
                unset($sesion_usuario['password']);
                
                $_SESSION['usuario'] = $sesion_usuario;
                header("Location: ../modules/Perfil/perfil.php");
                exit();
            }
        }
    }
    
    // Si no encuentra coincidencia
    header("Location: ../modules/login/login.php?error=invalid");
    exit();
}
?>