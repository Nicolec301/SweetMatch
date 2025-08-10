const BaseModel = require('./BaseModel');

class UserPhotoModel extends BaseModel {
  constructor() {
    super('usuario_fotos', [
      'id','usuario_id','url_foto','es_principal','created_at'
    ]);
  }

  async addPhoto(userId, filePath, esPrincipal = false) {
    return await this.create({
      usuario_id: userId,
      url_foto: filePath,
      es_principal: esPrincipal
    });
  }

  async setPrincipal(userId, photoId) {
    return await this.transaction(async (client) => {
      await client.query('UPDATE usuario_fotos SET es_principal = false WHERE usuario_id = $1',[userId]);
      const result = await client.query('UPDATE usuario_fotos SET es_principal = true WHERE id = $1 AND usuario_id = $2 RETURNING *',[photoId,userId]);
      return result.rows[0];
    });
  }

  async getUserPhotos(userId) {
    return await this.customQuery('SELECT * FROM usuario_fotos WHERE usuario_id = $1 ORDER BY es_principal DESC, id ASC',[userId]);
  }
}

module.exports = new UserPhotoModel();
