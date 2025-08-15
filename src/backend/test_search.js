const https = require('http');

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/search/users?limit=5&excluirUsuario=20',
  method: 'GET',
  headers: {
    'Authorization': 'Bearer dev-token-123',
    'Content-Type': 'application/json'
  }
};

const req = https.request(options, (res) => {
  console.log(`statusCode: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      console.log('✅ Response received');
      console.log('Success:', response.success);
      console.log('Users found:', response.data?.length || 0);
      
      if (response.data && response.data.length > 0) {
        console.log('\n📋 Lista de usuarios (verificando duplicados):');
        const userIds = [];
        response.data.forEach((user, index) => {
          console.log(`${index + 1}. ID: ${user.id}, Nombre: ${user.nombre}`);
          if (userIds.includes(user.id)) {
            console.log(`   ❌ DUPLICADO! ID ${user.id} ya se encontró antes`);
          } else {
            userIds.push(user.id);
          }
        });
        
        console.log(`\n✅ Total IDs únicos: ${new Set(userIds).size}`);
        console.log(`📊 Total resultados: ${response.data.length}`);
        
        if (new Set(userIds).size === response.data.length) {
          console.log('🎉 ¡No hay duplicados!');
        } else {
          console.log('⚠️  Hay duplicados en los resultados');
        }
      }
    } catch (error) {
      console.error('Error parsing response:', error);
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('Request error:', error);
});

req.end();
