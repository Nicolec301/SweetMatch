<?php
// filepath: c:\xampp\htdocs\SweetMatchProto\modules\chats\enviar-mensaje.php

// Verificar si es una solicitud POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    // Redirigir a la página de chats si no es una solicitud POST
    header('Location: chats.php');
    exit;
}

// Incluir el archivo de conversaciones
require_once 'data/conversaciones.php';

// Obtener los datos del formulario
$conversacion_id = isset($_POST['conversacion_id']) ? $_POST['conversacion_id'] : 'sophia';
$mensaje = isset($_POST['mensaje']) ? trim($_POST['mensaje']) : '';

// Verificar que el mensaje no esté vacío
if (empty($mensaje)) {
    // Redirigir a la conversación si el mensaje está vacío
    header("Location: chats.php?id=$conversacion_id&error=mensaje_vacio");
    exit;
}

// Verificar que la conversación exista
$conversacion = obtener_conversacion($conversacion_id);
if ($conversacion === null) {
    // Redirigir a la página de chats si la conversación no existe
    header('Location: chats.php');
    exit;
}

// Guardar el mensaje utilizando la función en conversaciones.php
$resultado = guardar_mensaje($conversacion_id, $mensaje, true);

if (!$resultado) {
    // Si hay un error al guardar el mensaje
    header("Location: chats.php?id=$conversacion_id&error=error_guardado");
    exit;
}

// Obtener la hora actual
$hora_actual = date('H:i');

// Redirigir de vuelta a la conversación
header("Location: chats.php?id=$conversacion_id&success=mensaje_enviado");
exit;
?>
