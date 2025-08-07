// Modelo simple de Match
class Match {
  constructor(data = {}) {
    this.id = data.id || null;
    this.user1Id = data.user1Id || null;
    this.user2Id = data.user2Id || null;
    this.createdAt = data.createdAt || new Date();
  }

  // Convertir a JSON
  toJSON() {
    return {
      id: this.id,
      user1Id: this.user1Id,
      user2Id: this.user2Id,
      createdAt: this.createdAt
    };
  }
}

module.exports = Match;
