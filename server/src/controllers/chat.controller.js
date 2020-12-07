
const Chats = require("../models/chats.model")
const { CError } = require("../helpers/error")
const { REQUEST_HANDLER } = require("../controllers/request.handler")
const { INTERNAL_SERVER_ERROR, BAD_REQUEST, NOT_MODIFIED } = require("../helpers/http.status")
const ObjectId = require('mongoose').Types.ObjectId
const Message = require("../models/joi/message.joi")

// handle get
const getChatMessages = async (userId, frndId, { limit, page }) => {
   try {

      let l = limit || 50, p = page || 1
      let chat = await Chats.findOne({ users: { $all: [userId, frndId] } }, { messages: { $slice: -l * p } })

      if (!chat) throw new CError(BAD_REQUEST, "Chat not fround")

      return { data: chat.messages }
   }
   catch (err) {
      console.log(err)
      return { error: true, errorCode: err.errorCode, message: err.message }
   }
}
const getChatList = async userId => {
   try {

      let resp = await Chats.find({ users: userId }, { messages: { $slice: -1 }, __v: 0, createdAt: 0 })
      return { data: resp }
   }
   catch (err) {
      return { error: true, errorCode: err.errorCode, message: err.message }
   }
}

// handle create
const createChat = async (userId, frndId, { createdAt }) => {
   if (!ObjectId.isValid(userId) || !ObjectId.isValid(frndId)) {
      return {
         error: true,
         errorCode: BAD_REQUEST,
         message: "UserId or FriendId is not a valid ObjectId"
      }
   }
   try {
      let chat = new Chats({ users: [userId, frndId], messages: [], createdAt })
      let validationError = chat.validateSync()
      if (validationError) {
         return {
            error: true,
            errorCode: BAD_REQUEST,
            messages: "Chat validation failed"
         }
      }
      let savedChat = await chat.save()
      return { data: savedChat }
   }
   catch (error) {
      return {
         error: true,
         errorCode: INTERNAL_SERVER_ERROR,
         message: error.message
      }
   }
}
const pushChatMessage = async (userId, frndId, message) => {
   if (!ObjectId.isValid(userId) || !ObjectId.isValid(frndId)) {
      return {
         error: true,
         errorCode: BAD_REQUEST,
         message: "UserId or FriendId is not a valid ObjectId"
      }
   }
   try {

      let { error } = Message.validate(message)
      if (error) return {
         error: true,
         errorCode: BAD_REQUEST,
         message: error.message
      }

      let pushResp = await Chats.updateOne(
         { users: { $all: [userId, frndId] } },
         { $push: { messages: message } }
      )

      if (pushResp.nModified === 0) return {
         error: true,
         errorCode: BAD_REQUEST,
         message: "Message not pushed"
      }

      return { data: pushResp }

   }
   catch (error) {
      return {
         error: true,
         errorCode: INTERNAL_SERVER_ERROR,
         message: error.message
      }
   }
}

// handle deletes
const deleteChatMessage = async (userId, frndId, msgId) => {
   try {
      let resp = await Chats.updateOne(
         { users: { $all: [userId, frndId] } },
         { $pull: { messages: { _id: msgId } } }
      )
      if (resp.nModified === 0) throw new CError(BAD_REQUEST, "Error while deleting message")
      return { data: resp }
   }
   catch (err) { return { error: true, errorCode: err.errorCode, message: err.message } }
}
const deleteChat = async (userId, frndId) => {
   try {
      let resp = Chats.deleteOne({ users: { $all: [userId, frndId] } })
      if (resp.nModified === 0) throw new CError(BAD_REQUEST, "Error deleting chat")
      return { data: resp }
   }
   catch (err) { return { error: true, errorCode: err.errorCode, message: err.message } }
}

// Exports
exports.createChat = createChat
exports.getChatMessages = getChatMessages
exports.createChat = createChat
exports.sendChatMessage = pushChatMessage
exports.deleteChatMessage = deleteChatMessage
exports.deleteChat = deleteChat


// GET REQUESTS
exports.GET_CHAT_LIST = ({ params: { userId } }, res, next) => {
   REQUEST_HANDLER(res, next, getChatList, [userId])
}
exports.GET_CHAT_MESSAGES = ({ params: { userId, frndId }, query }, res, next) => {
   REQUEST_HANDLER(res, next, getChatMessages, [userId, frndId, query])
}

// POST REQUESTS
exports.CREATE_CHAT = ({ params: { userId, frndId }, body }, res, next) => {
   REQUEST_HANDLER(res, next, createChat, [userId, frndId, body])
}
exports.PUSH_CHAT_MESSAGE = ({ params: { userId, frndId }, body }, res, next) => {
   REQUEST_HANDLER(res, next, pushChatMessage, [userId, frndId, body])
}

// DELETE REQUESTS
exports.DELETE_CHAT_MESSAGE = ({ params: { userId, frndId, msgId }, res, next }) => {
   REQUEST_HANDLER(res, next, deleteChatMessage, [userId, frndId, msgId])
}
exports.DELETE_CHAT = ({ params: { userId, frndId } }, res, next) => {
   REQUEST_HANDLER(res, next, deleteChat, [userId, frndId])
}