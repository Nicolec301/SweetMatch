<?php
/**
 * Archivo que contiene los datos de las conversaciones
 * Cada conversación tiene un identificador único y contiene
 * los mensajes intercambiados entre los usuarios
 */

// Definir la estructura de datos para las conversaciones
$conversaciones = [
    "sophia" => [
        "nombre" => "Sofía",
        "imagen" => "../../images/Sofia.png",
        "ultima_actividad" => "Hace 2 horas",
        "tiempo_indicador" => "2h",
        "vista_previa" => "¿Cuál película piensas ver?",
        "mensajes" => [
            [
                "emisor" => "Sofía",
                "remitente" => false, // false significa que no es el usuario actual
                "contenido" => "¡Hola! ¿Cómo va tu día?",
                "hora" => "14:30",
                "leido" => true
            ],
            [
                "emisor" => "Tú",
                "remitente" => true, // true significa que es el usuario actual
                "contenido" => "¡Hola Sofía! Bastante bien, acabo de terminar un ejercicio. ¿Y el tuyo?",
                "hora" => "14:35",
                "leido" => true
            ],
            [
                "emisor" => "Sofía",
                "remitente" => false,
                "contenido" => "¡Genial! Yo estoy en casa relajándome, leyendo un libro. ¿Planes para esta noche?",
                "hora" => "14:40",
                "leido" => true
            ],
            [
                "emisor" => "Tú",
                "remitente" => true,
                "contenido" => "Nada definido aún, quizás vea una película. ¿Qué estás leyendo?",
                "hora" => "14:43",
                "leido" => true
            ],
            [
                "emisor" => "Sofía",
                "remitente" => false,
                "contenido" => "Estoy leyendo una novela de misterio, ¡es muy atrapante! Una película suena bien, ¿cuál piensas ver?",
                "hora" => "14:50",
                "leido" => true
            ]
        ]
    ],
    "andre" => [
        "nombre" => "Andrés",
        "imagen" => "../../images/Fotos/chico1.jpg",
        "ultima_actividad" => "Hace 1 día",
        "tiempo_indicador" => "1d",
        "vista_previa" => "Estoy en el parque, el clima está increíble.",
        "mensajes" => [
            [
                "emisor" => "Andrés",
                "remitente" => false,
                "contenido" => "¡Hola! ¿Qué tal estás?",
                "hora" => "10:15",
                "leido" => true
            ],
            [
                "emisor" => "Tú",
                "remitente" => true,
                "contenido" => "¡Hey Andrés! Todo bien por aquí, ¿y tú?",
                "hora" => "10:30",
                "leido" => true
            ],
            [
                "emisor" => "Andrés",
                "remitente" => false,
                "contenido" => "Estoy en el parque, el clima está increíble. ¿Te gustaría unirte?",
                "hora" => "10:45",
                "leido" => true
            ],
            [
                "emisor" => "Tú",
                "remitente" => true,
                "contenido" => "Suena genial, pero tengo algunos pendientes. ¿Tal vez mañana?",
                "hora" => "11:00",
                "leido" => true
            ],
            [
                "emisor" => "Andrés",
                "remitente" => false,
                "contenido" => "¡Claro! Mañana también estará lindo el día. Te aviso la hora.",
                "hora" => "11:15",
                "leido" => true
            ]
        ]
    ],
    "laura" => [
        "nombre" => "Laura",
        "imagen" => "../../images/laura.png",
        "ultima_actividad" => "Hace 2 días",
        "tiempo_indicador" => "2d",
        "vista_previa" => "Acabo de terminar un gran libro!",
        "mensajes" => [
            [
                "emisor" => "Laura",
                "remitente" => false,
                "contenido" => "¡Hola! ¿Te gusta leer?",
                "hora" => "15:20",
                "leido" => true
            ],
            [
                "emisor" => "Tú",
                "remitente" => true,
                "contenido" => "¡Hola Laura! Sí, me encanta. ¿Qué estás leyendo últimamente?",
                "hora" => "15:30",
                "leido" => true
            ],
            [
                "emisor" => "Laura",
                "remitente" => false,
                "contenido" => "Acabo de terminar un gran libro de ciencia ficción. ¿Te gusta ese género?",
                "hora" => "15:45",
                "leido" => true
            ],
            [
                "emisor" => "Tú",
                "remitente" => true,
                "contenido" => "¡Me encanta! ¿Cuál era el título? Siempre busco recomendaciones.",
                "hora" => "16:00",
                "leido" => true
            ],
            [
                "emisor" => "Laura",
                "remitente" => false,
                "contenido" => "Se llama 'Cronopaisaje'. Si quieres, podemos ir a una librería algún día y te lo muestro.",
                "hora" => "16:15",
                "leido" => true
            ]
        ]
    ],
    "tomas" => [
        "nombre" => "Tomás",
        "imagen" => "../../images/Fotos/chico3.jpg",
        "ultima_actividad" => "Hace 3 días",
        "tiempo_indicador" => "3d",
        "vista_previa" => "¿Vamos por un café la próxima semana?",
        "mensajes" => [
            [
                "emisor" => "Tomás",
                "remitente" => false,
                "contenido" => "¡Hola! ¿Cómo te va con tus proyectos?",
                "hora" => "09:10",
                "leido" => true
            ],
            [
                "emisor" => "Tú",
                "remitente" => true,
                "contenido" => "¡Hola Tomás! Bastante bien, estoy trabajando en algunas ideas nuevas. ¿Y tú?",
                "hora" => "09:25",
                "leido" => true
            ],
            [
                "emisor" => "Tomás",
                "remitente" => false,
                "contenido" => "También estoy con varios proyectos interesantes. Me gustaría compartir algunas ideas contigo.",
                "hora" => "09:40",
                "leido" => true
            ],
            [
                "emisor" => "Tú",
                "remitente" => true,
                "contenido" => "¡Me parece genial! ¿Tienes algún momento libre para charlar?",
                "hora" => "10:05",
                "leido" => true
            ],
            [
                "emisor" => "Tomás",
                "remitente" => false,
                "contenido" => "¿Vamos por un café la próxima semana? Podría ser el martes o miércoles.",
                "hora" => "10:20",
                "leido" => true
            ]
        ]
    ]
];

/**
 * Función para obtener una conversación específica
 * 
 * @param string $id Identificador de la conversación
 * @return array|null Datos de la conversación o null si no existe
 */
function obtener_conversacion($id) {
    global $conversaciones;
    
    if (isset($conversaciones[$id])) {
        return $conversaciones[$id];
    }
    
    return null;
}

/**
 * Función para obtener todas las conversaciones
 * 
 * @return array Lista de conversaciones
 */
function obtener_todas_conversaciones() {
    global $conversaciones;
    return $conversaciones;
}

/**
 * Guarda un nuevo mensaje en una conversación específica
 * @param string $conversacion_id ID de la conversación
 * @param string $contenido Contenido del mensaje
 * @param bool $remitente Indica si el mensaje es del usuario actual
 * @return bool True si el mensaje fue guardado con éxito, false en caso contrario
 */
function guardar_mensaje($conversacion_id, $contenido, $remitente = true) {
    global $conversaciones;
    
    // Verificar si existe la conversación
    if (!isset($conversaciones[$conversacion_id])) {
        return false;
    }
    
    // Crear el nuevo mensaje
    $nuevo_mensaje = [
        "emisor" => $remitente ? "Tú" : $conversaciones[$conversacion_id]['nombre'],
        "remitente" => $remitente,
        "contenido" => $contenido,
        "hora" => date("H:i"),
        "leido" => false
    ];
    
    // Añadir el mensaje a la conversación
    $conversaciones[$conversacion_id]['mensajes'][] = $nuevo_mensaje;
    
    // Actualizar la vista previa de la conversación
    $conversaciones[$conversacion_id]['vista_previa'] = substr($contenido, 0, 30) . (strlen($contenido) > 30 ? '...' : '');
    $conversaciones[$conversacion_id]['tiempo_indicador'] = "ahora";
    
    // Guardar los cambios en un archivo temporal o base de datos
    // Esta es una implementación simple que guarda los mensajes en un archivo JSON
    $ruta_archivo = __DIR__ . '/mensajes_' . $conversacion_id . '.json';
    $mensajes_guardados = file_exists($ruta_archivo) ? json_decode(file_get_contents($ruta_archivo), true) : [];
    $mensajes_guardados[] = $nuevo_mensaje;
    file_put_contents($ruta_archivo, json_encode($mensajes_guardados, JSON_PRETTY_PRINT));
        
    return true;
}

/**
 * Carga los mensajes guardados de una conversación desde su archivo
 * @param string $conversacion_id ID de la conversación
 * @return bool True si los mensajes fueron cargados con éxito
 */
function cargar_mensajes_guardados($conversacion_id) {
    global $conversaciones;
    
    // Verificar si existe la conversación
    if (!isset($conversaciones[$conversacion_id])) {
        return false;
    }
    
    // Ruta del archivo de mensajes
    $ruta_archivo = __DIR__ . '/mensajes_' . $conversacion_id . '.json';
    
    // Verificar si existe el archivo
    if (file_exists($ruta_archivo)) {
        $mensajes_guardados = json_decode(file_get_contents($ruta_archivo), true);
        
        if (!empty($mensajes_guardados)) {
            // Añadir los mensajes guardados a los predefinidos
            foreach ($mensajes_guardados as $mensaje) {
                // Evitar duplicados verificando si el mensaje ya existe
                $mensaje_existe = false;
                foreach ($conversaciones[$conversacion_id]['mensajes'] as $msg_existente) {
                    if ($msg_existente['contenido'] === $mensaje['contenido'] && 
                        $msg_existente['hora'] === $mensaje['hora'] &&
                        $msg_existente['remitente'] === $mensaje['remitente']) {
                        $mensaje_existe = true;
                        break;
                    }
                }
                
                if (!$mensaje_existe) {
                    $conversaciones[$conversacion_id]['mensajes'][] = $mensaje;
                }
            }
            
            // Actualizar la vista previa con el último mensaje
            $ultimo_mensaje = end($mensajes_guardados);
            $conversaciones[$conversacion_id]['vista_previa'] = substr($ultimo_mensaje['contenido'], 0, 30) . 
                (strlen($ultimo_mensaje['contenido']) > 30 ? '...' : '');
        }
    }
    
    return true;
}

// Cargar los mensajes guardados para todas las conversaciones al inicio
foreach (array_keys($conversaciones) as $conv_id) {
    cargar_mensajes_guardados($conv_id);
}
?>
