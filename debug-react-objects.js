// Script de debugging temporal para identificar el objeto problemático
console.log('🔍 DEBUG: Interceptando errores de React para objetos inválidos');

// Interceptar el error de React sobre objetos inválidos
const originalError = console.error;
console.error = function(...args) {
  if (args[0] && args[0].includes && args[0].includes('Objects are not valid as a React child')) {
    console.log('🚨 ERROR DETECTADO - Objeto inválido como React child:');
    console.log('📊 Stack trace:', new Error().stack);
    console.log('📊 Argumentos del error:', args);
    
    // Buscar en el DOM elementos que podrían contener el objeto
    const allElements = document.querySelectorAll('*');
    allElements.forEach((element, index) => {
      if (element.textContent && element.textContent.includes('[object Object]')) {
        console.log(`🎯 Elemento ${index} con [object Object]:`, element);
        console.log('📋 Contenido:', element.textContent);
        console.log('📋 HTML:', element.innerHTML);
      }
    });
  }
  
  // Llamar al console.error original
  originalError.apply(console, args);
};

console.log('✅ Sistema de debugging activado');
