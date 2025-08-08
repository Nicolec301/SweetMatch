// Exportador centralizado de modelos
const BaseModel = require('./BaseModel');
const UserModel = require('./User');
const MatchModel = require('./Match');
const MessageModel = require('./Message');
const ConversationModel = require('./Conversation');
const InterestModel = require('./Interest');

module.exports = {
  BaseModel,
  UserModel,
  MatchModel,
  MessageModel,
  ConversationModel,
  InterestModel
};
