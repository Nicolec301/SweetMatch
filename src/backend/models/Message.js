// Modelo simple de Mensaje
class Message {
  constructor(data = {}) {
    this.id = data.id || null;
    this.senderId = data.senderId || null;
    this.receiverId = data.receiverId || null;
    this.content = data.content || '';
    this.createdAt = data.createdAt || new Date();
  }

  // Convertir a JSON
  toJSON() {
    return {
      id: this.id,
      senderId: this.senderId,
      receiverId: this.receiverId,
      content: this.content,
      createdAt: this.createdAt
    };
  }
}

module.exports = Message;
