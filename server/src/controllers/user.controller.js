'use strict'
// Models
const Users = require("../models/users.model")
const Groups = require("../models/groups.model")
const Chats = require("../models/chats.model")

// Schema
const Friend = require("../models/joi/friend.joi")
const ObjectId = require("mongoose").Types.ObjectId
const FriendRequest = require("../models/joi/friendRequest")

// Error handlers
const { CError } = require("../helpers/error")

// Status codes
const { BAD_REQUEST, INTERNAL_SERVER_ERROR } = require("../helpers/http.status")

// Request Handlers
const { createChat } = require("./chat.controller")
const { REQUEST_HANDLER } = require("./request.handler")

const getUser = async (userId, select = []) => {
   try {
      let user = await Users.findById(userId).select(select.join(" "))
      if (user) return { error: false, data: user }
      return { error: true, message: "User not found!" }
   }
   catch (err) { return { error: true, errorCode: err.errorCode, message: err.message } }
}
const getFriend = async frndId => {
   try {
      let friend = await Users.findById(frndId).select("name email userName status thumbnail")
      if (!friend) throw new CError(BAD_REQUEST, "Friend not found")
      return { data: friend }
   }
   catch (err) { return { error: true, errorCode: err.errorCode, message: err.message } }
}
const getFriendsList = async userId => {
   try {
      let limit = 100;
      let user = await Users.findById(userId, { friends: { $slice: -limit } })
      if (!user) throw new CError(BAD_REQUEST, "User not found")
      let friends = (user && user.friends) ? await Promise.all(user.friends.map(async friend => {
         return await Users.findById(friend.userId).select("name email thumbnail status")
      })) : []
      return { error: false, data: friends }
   }
   catch (err) { return { error: true, errorCode: err.errorCode, message: err.message } }
}
const getFriendsRequestList = async userId => {
   try {
      let limit = 100;
      let user = await Users.findById(userId, { friendRequests: { $slice: -limit } })
      if (!user) throw new CError(BAD_REQUEST, "User not found")
      let friendRequests = (user && user.friendRequests) ? await Promise.all(user.friendRequests.map(async request => {
         return await Users.findById(request.userId).select("name email userName thumbnail status")
      })) : []
      return { data: friendRequests }
   }
   catch (err) { return { error: true, errorCode: err.errorCode, message: err.message } }
}
const getConversations = async (userId, { limit, page } = { limit: 20, page: 1 }) => {
   try {

      if (!ObjectId.isValid(userId)) throw new CError(BAD_REQUEST, `Invalid UserId ${userId}`)

      //let l = limit || 20, p = page || 1

      let projection = { messages: { $slice: -1 }, members: 0, __v: 0, createdAt: 0 }
      let groups = await Groups
         .find({ "members.userId": userId }, projection)
         .sort({ "messages.sentAt": -1 })
         .limit((limit / 2) * page) || []

      groups = groups.map(g => ({ ...g._doc, type: 'g' }))

      let chats = await Chats
         .find({ users: userId }, projection)
         .sort({ 'message.sentAt': -1 })
         .limit((limit / 2) * page) || []

      if (!chats) throw new CError(BAD_REQUEST, "Chats not found")
      chats = chats.map(c => ({ ...c._doc, type: 'c' }))

      let conversations = groups.concat(chats).sort((a, b) => b.messages[0].sentAt - a.messages[0].sentAt)

      return { error: false, data: conversations }
   }
   catch (err) {
      console.log(err.message)
      return { error: true, errorCode: err.errorCode, message: err.message }
   }
}
const updateUser = async (userId, data) => {
   try {
      let resp = await Users.updateOne({ _id: userId }, data)
      if (resp.nModified === 0) throw new CError(BAD_REQUEST, "Error updating user")
      return { data: resp }
   }
   catch (err) { return { error: true, errorCode: err.errorCode, message: err.message } }
}
const addFriendRequest = async (userId, request) => {
   try {
      // Checking userId and frined's userId
      if (!ObjectId.isValid(userId) || !ObjectId.isValid(request && request.userId))
         throw new CError(BAD_REQUEST, 'UserId or FriendId is not a valid ObjectId')

      // Checking if friend data is valid
      let { error } = FriendRequest.validate(request)
      if (error) throw new CError(BAD_REQUEST, error.message)
      // Pushing friend request
      let resp = await Users.updateOne(
         { _id: userId },
         { $push: { friendRequests: request } }
      )
      // If request not pushed
      if (resp.nModified === 0)
         throw new CError(INTERNAL_SERVER_ERROR, "Error pushing friend request")
      // returning
      return { data: resp }
   }
   catch (err) { return { error: true, errorCode: err.errorCode, message: err.message } }
}
const acceptFriendRequest = async (userId, request) => {
   try {
      // Checking userId and frined's userId
      if (!ObjectId.isValid(userId) || !ObjectId.isValid(request.userId))
         throw new CError(BAD_REQUEST, 'UserId or FriendId is not a valid ObjectId')

      let { error } = Friend.validate(request)
      if (error) throw new CError(BAD_REQUEST, "Friend validation failed")

      let resp = await Users.updateOne({ _id: userId }, { $push: { friends: request } })
      if (resp.nModified === 0) throw new CError(INTERNAL_SERVER_ERROR, "Error while accepting friend request")

      let pulled = await Users.updateOne({ _id: userId }, { $pull: { friendRequests: { userId: request.userId } } })

      if (pulled.nModified === 0) {
         await Users.updateOne({ _id: userId }, { $pull: { friends: { userId: request.userId } } })
         throw new CError(BAD_REQUEST, "Friend request not available in the request list")
      }

      // Creating chat
      let chatRes = await createChat(userId, request.userId, { createdAt: request.addedAt })
      if (chatRes.error) throw new CError(chatRes.errorCode, chatRes.message)

      return { data: resp }

   }
   catch (err) { return { error: true, errorCode: err.errorCode, message: err.message } }
}

// Method exports
exports.getUser = getUser
exports.getFriend = getFriend
exports.updateUser = updateUser
exports.getFriendsList = getFriendsList
exports.getConversations = getConversations
exports.addFriendRequest = addFriendRequest
exports.acceptFriendRequest = acceptFriendRequest
exports.getFriendsRequestList = getFriendsRequestList

// GET REQUESTS
exports.GET_USER = ({ params: { userId } }, res, nxt) => {
   REQUEST_HANDLER(res, nxt, getUser, [userId])
}
exports.GET_FRIEND = ({ params: { frndId } }, res, next) => {
   REQUEST_HANDLER(res, next, getFriend, [frndId])
}
exports.GET_FRIENDS_LIST = ({ params: { userId } }, res, next) => {
   REQUEST_HANDLER(res, next, getFriendsList, [userId])
}
exports.GET_FRIEND_REQUESTS_LIST = ({ params: { userId } }, res, next) => {
   REQUEST_HANDLER(res, next, getFriendsRequestList, [userId])
}
exports.GET_CONVERSATIONS = ({ params: { userId }, query }, res, next) => {
   REQUEST_HANDLER(res, next, getConversations, [userId, query])
}
exports.SEND_FRIEND_REQUEST = ({ params: { userId }, body }, res, next) => {
   REQUEST_HANDLER(res, next, addFriendRequest, [userId, body])
}
exports.ACCEPT_FRIEND_REQUEST = ({ params: { userId }, body }, res, next) => {
   REQUEST_HANDLER(res, next, acceptFriendRequest, [userId, body])
}
exports.UPDATE_USER = ({ params: { userId }, body }, res, next) => {
   REQUEST_HANDLER(res, next, updateUser, [userId, body])
}