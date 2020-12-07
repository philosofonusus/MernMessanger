'use strict'
const usersRouter = require('express').Router()
const userRouter = require('express').Router()

// Controllers
const UserController = require("../controllers/user.controller")
const ChatController = require("../controllers/chat.controller")
const GroupController = require("../controllers/group.controller")

// conversation list
userRouter.get("/:userId/conversations", UserController.GET_CONVERSATIONS)

// Friends and Friend Request
userRouter.get("/:userId/friends/list", UserController.GET_FRIENDS_LIST)
userRouter.get("/:userId/friendRequests/list", UserController.GET_FRIEND_REQUESTS_LIST)
userRouter.post("/:userId/sendFriendRequest", UserController.SEND_FRIEND_REQUEST)
userRouter.post("/:userId/acceptFriendRequest", UserController.ACCEPT_FRIEND_REQUEST)
userRouter.get("/:userId/friend/:frndId", UserController.GET_FRIEND)

// Chats
userRouter.get("/:userId/chats/list", ChatController.GET_CHAT_LIST)

// userRouter.route("/:userId/chat/:frndId")
//    .delete("DELETE CHAT")

// Chat
const CHAT = "/:userId/chat/:frndId"
userRouter.route(CHAT + "/messages")
   .get(ChatController.GET_CHAT_MESSAGES)
userRouter.route(CHAT + "/message")
   .post(ChatController.PUSH_CHAT_MESSAGE)
userRouter.route(CHAT + "/message/:msgId")
   .delete(ChatController.DELETE_CHAT_MESSAGE)

// Groups
userRouter.route("/:userId/groups/")
   .get(GroupController.GET_GROUPS)
   .post(GroupController.CREATE_GROUP)
   //.delete(GroupController.DELETE_GROUPS)

userRouter.route("/:userId/groups/list")
   .get(GroupController.GET_GROUPS_LIST)

const GROUP = "/:userId/group/:groupId"
// Group
userRouter.route(GROUP)
   .get(GroupController.GET_GROUP)
   .patch(GroupController.UPDATE_GROUP)
   .delete(GroupController.DELETE_GROUP)
// Group members
userRouter.route(GROUP + "/members")
   .get(GroupController.GET_GROUP_MEMBERS)
   .post(GroupController.ADD_GROUP_MEMBER)
// Group member
userRouter.route(GROUP + "/member/:userId")
   .patch(GroupController.UPDATE_GROUP_MEMBER)
   .delete(GroupController.DELETE_GROUP_MEMBER)
// Group messages
userRouter.route(GROUP + "/messages")
   .get(GroupController.GET_GROUP_MESSAGES)
   .post(GroupController.ADD_GROUP_MESSAGE)
// Group message
userRouter.route(GROUP + "/message/:msgId")
   .delete(GroupController.DELETE_GROUP_MESSAGE)

exports.usersRouter = usersRouter
exports.userRouter = userRouter