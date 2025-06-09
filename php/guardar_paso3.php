<?php
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Recoger todos los datos del formulario
    $registro = [
        'nombre' => $_POST['nombre'],
        'apellido' => $_POST['apellido'],
        'email' => $_POST['email'],
        'password' => password_hash($_POST['password'], PASSWORD_DEFAULT), // Encriptamos la contraseña
        'edad' => $_POST['edad'],
        'genero' => $_POST['genero'],
        'genero_busco' => $_POST['busco'],
        'edad_min_busco' => $_POST['edad_min'],
        'edad_max_busco' => $_POST['edad_max'],
        'intereses' => isset($_POST['intereses']) ? $_POST['intereses'] : [],
        'descripcion' => $_POST['descripcion']
    ];
    
    // Procesar la foto
    if(isset($_FILES['foto'])) {
        $foto_nombre = time() . '_' . $_FILES['foto']['name'];
        $foto_path = '../uploads/' . $foto_nombre;
        
        // Crear directorio si no existe
        if (!file_exists('../uploads/')) {
            mkdir('../uploads/', 0777, true);
        }
        
        if(move_uploaded_file($_FILES['foto']['tmp_name'], $foto_path)) {
            $registro['foto'] = $foto_nombre;
        }
    }

    if (empty($_POST['nombre']) || empty($_POST['apellido']) || empty($_POST['email']) || 
        empty($_POST['password']) || empty($_POST['edad']) || empty($_POST['genero'])) {
        header("Location: ../modules/crearCuenta/CrearCuenta.html?error=campos_vacios");
        exit();
    }

    // Validar contraseña (mínimo 8 caracteres)
    if (strlen($_POST['password']) < 8) {
        header("Location: ../modules/crearCuenta/CrearCuenta.html?error=password_corta");
        exit();
    }

    // Validar edad mínima
    if ($_POST['edad'] < 18) {
        header("Location: ../modules/crearCuenta/CrearCuenta.html?error=edad_minima");
        exit();
    }
    
    // Formatear datos para guardar
    $datos = "";
    foreach($registro as $key => $value) {
        if(is_array($value)) {
            $value = implode(',', $value);
        }
        $datos .= "$key:$value\n";
    }
    $datos .= "---\n"; // Separador entre usuarios
    
    // Guardar en archivo
    file_put_contents("../data/usuarios.txt", $datos, FILE_APPEND);
    
    // Crear una versión segura para la sesión (sin la contraseña)
    $sesion_usuario = $registro;
    unset($sesion_usuario['password']); // Removemos la contraseña de la sesión
    
    // Iniciar sesión con los datos del usuario
    $_SESSION['usuario'] = $sesion_usuario;
    
    // Redirigir al perfil
    header("Location: ../modules/login/login.php?registro=1");
    exit();
}
?>
