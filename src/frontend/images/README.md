# 📸 Images - Recursos Gráficos SweetMatch

Esta carpeta contiene todos los recursos gráficos, iconos, imágenes y multimedia utilizados en la interfaz de SweetMatch.

## 📁 Estructura de Archivos

```
images/
├── 🎯 logo.svg                    # Logo principal de SweetMatch
├── 👤 Perfiles de Usuario/
│   ├── andres.png                 # Foto de perfil - Andrés
│   ├── CarlosAna.png              # Foto de pareja - Carlos y Ana
│   ├── chica.jpg                  # Foto genérica femenina
│   ├── JessicaMark.png            # Foto de pareja - Jessica y Mark
│   ├── laura.png                  # Foto de perfil - Laura
│   ├── Sofia.png                  # Foto de perfil - Sofía
│   └── tomas.png                  # Foto de perfil - Tomás
├── 🎨 UI Icons/
│   ├── corazon.svg                # Icono de corazón/like
│   ├── female.svg                 # Icono género femenino
│   ├── male.svg                   # Icono género masculino
│   ├── Escribir.png               # Icono de escribir mensaje
│   ├── Globo.png                  # Icono de globo de diálogo
│   └── Visto.png                  # Icono de mensaje visto
├── 🌐 Social Media/
│   ├── facebook.svg               # Logo Facebook
│   ├── instagram.svg              # Logo Instagram
│   ├── linkedin.svg               # Logo LinkedIn
│   ├── twitter.svg                # Logo Twitter
│   └── youtube.svg                # Logo YouTube
├── 🎪 Interfaz/
│   ├── footer.png                 # Imagen para el footer
│   ├── footer.svg                 # Footer en formato vectorial
│   ├── Foto.jpg                   # Imagen genérica de foto
│   ├── foto.png                   # Placeholder de foto
│   └── 13.png                     # Elemento gráfico numerado
├── 🎁 Marketing/
│   ├── GifCora.webp               # Animación de corazón
│   └── Infografía Regalos de San Valentín Ilustrado Rojo.png
└── 👥 Galería de Usuarios/
    ├── I_Foto0.jpg                # Imagen de galería #0
    ├── I_Foto1.jpg                # Imagen de galería #1
    ├── I_Foto2.jpg                # Imagen de galería #2
    ├── I_Foto3.jpg                # Imagen de galería #3
    ├── I_Foto4.jpg                # Imagen de galería #4
    └── I_Foto5.jpg                # Imagen de galería #5
```

## 🎯 Categorías de Imágenes

### **🏷️ Branding**
- `logo.svg` - Logo principal de SweetMatch en formato vectorial

### **👤 Perfiles de Usuario**
Fotos utilizadas como ejemplos y placeholders para perfiles de usuarios:
- **Individuales**: andres.png, laura.png, Sofia.png, tomas.png, chica.jpg
- **Parejas**: CarlosAna.png, JessicaMark.png (historias de éxito)

### **🎨 Iconografía UI**
Iconos para la interfaz de usuario:
- `corazon.svg` - Para likes y matches
- `female.svg` / `male.svg` - Filtros de género
- `Escribir.png` - Botón de escribir mensaje
- `Globo.png` - Indicador de chat
- `Visto.png` - Estado de mensaje leído

### **🌐 Redes Sociales**
Logos oficiales en formato SVG:
- Facebook, Instagram, LinkedIn, Twitter, YouTube

### **📱 Elementos de Interfaz**
- `footer.png` / `footer.svg` - Elementos visuales del footer
- `foto.png` - Placeholder para imágenes de perfil
- `13.png` - Elemento gráfico numerado

### **🎬 Multimedia**
- `GifCora.webp` - Animación de corazón en formato WebP optimizado
- Infografía temática de San Valentín

### **🖼️ Galería de Imágenes**
Serie de imágenes `I_Foto0.jpg` a `I_Foto5.jpg` para:
- Carrusel de imágenes
- Galería de ejemplos
- Testimoniales visuales

## 🔧 Uso en Componentes

### **Importación típica**:
```javascript
import logo from '../../images/logo.svg';
import corazon from '../../images/corazon.svg';
```

### **En componentes React**:
```jsx
<img src={logo} alt="SweetMatch Logo" />
<img src={corazon} alt="Like" className="like-icon" />
```

## 📊 Formatos Utilizados

| Formato | Uso | Ventajas |
|---------|-----|----------|
| **SVG** | Logos, iconos | Escalables, pequeños |
| **PNG** | UI con transparencia | Calidad, compatibilidad |
| **JPG** | Fotos de perfil | Compresión, tamaño |
| **WebP** | Animaciones | Compresión moderna |

## 🎨 Convenciones de Nomenclatura

- **CamelCase**: Para nombres compuestos (CarlosAna.png)
- **lowercase**: Para iconos simples (corazon.svg, logo.svg)
- **Descriptivo**: Nombres que indican su propósito
- **Numeración**: Serie I_Foto0-5 para galerías

## 📱 Responsive Considerations

Todas las imágenes están optimizadas para:
- **Diferentes resoluciones**: Desde móviles hasta desktop
- **Retina displays**: Calidad alta para pantallas HD
- **Carga rápida**: Formatos comprimidos y tamaños optimizados

---

*Las imágenes de perfil son solo para demostración y deben ser reemplazadas por contenido real de usuarios.*
