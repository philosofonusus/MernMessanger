// Models
const Groups = require("../models/groups.model")
const Users = require("../models/users.model")
// Schema
const ObjectId = require("mongoose").Types.ObjectId
const GroupMember = require("../models/joi/member.joi")
const Message = require("../models/joi/message.joi")

// Error handler
const { ErrorHandler } = require("../helpers/error")
// Status codes
const {
   NOT_FOUND, CONFLICT, BAD_REQUEST,
   INTERNAL_SERVER_ERROR, OK
} = require("../helpers/http.status")

// Handlers
const { REQUEST_HANDLER } = require("./request.handler")

const getGroupsList = async userId => {
   console.log(userId)
   if (!userId || !ObjectId.isValid(userId)) return {
      error: true,
      errorCode: BAD_REQUEST,
      message: "No UserId in request parameter or UserId is not a valid UserId"
   }
   try {
      let projection = {
         members: 0, createdAt: 0, __v: 0,
         messages: { $slice: -1 }
      }
      let groups = await Groups.find({ "members.userId": userId }, projection)
      return { data: groups }
   }
   catch (error) {
      return {
         error: true,
         errorCode: INTERNAL_SERVER_ERROR,
         message: error.message
      }
   }
}
const getGroup = async groupId => {
   if (!ObjectId.isValid(groupId)) return {
      error: true,
      errorCode: BAD_REQUEST,
      message: `GroupId ${groupId} is not a valid objectId`
   }
   try {
      let projection = "-members -messages -__v"
      let group = await Groups.findById(groupId).select(projection)
      if (!group) return {
         error: true,
         errorCode: NOT_FOUND,
         message: `Group not found with the Id ${groupId}`
      }
      return { data: group }
   }
   catch (error) {
      return {
         error: true,
         errorCode: INTERNAL_SERVER_ERROR,
         message: error.message
      }
   }
}
const getGroupMembers = async (groupId, query) => {
   if (!ObjectId.isValid(groupId)) return {
      error: true,
      errorCode: BAD_REQUEST,
      message: `GroupId ${groupId} is not a valid objectId`
   }
   try {
      let group = await Groups.findById(groupId).select('members')
      if (!group) return {
         error: true,
         errorCode: NOT_FOUND,
         message: `Group not found with the Id ${groupId}`
      }
      let _group = group._doc
      if (query.name || query.thumbnail) {
         _group.members = await Promise.all(_group.members.map(async mem => {
            let _mem = mem._doc
            let user = await Users.findById(_mem.userId).select("name thumbnail")
            return {
               ..._mem, name: query.name ? user.name : undefined,
               thumbnail: query.thumbnail ? user.thumbnail : undefined
            }
         }))
      }
      return { data: _group.members }
   }
   catch (error) {
      return {
         error: true,
         errorCode: INTERNAL_SERVER_ERROR,
         message: error.message
      }
   }
}
const getGroupMessages = async (groupId, query) => {
   if (!ObjectId.isValid(groupId)) return {
      error: true,
      errorCode: BAD_REQUEST,
      message: `GroupId ${groupId} is not a valid objectId`
   }
   try {
      let limit = query.limit || 20
      let page = query.page || 1
      let projection = {}
      let fileds = [
         'name', 'description', "members", "thumbnail",
         "createdAt", "createdBy", "seenBy", "__v"
      ]
      fileds.forEach(el => { projection[el] = 0 })
      let resp = await Groups.findOne({ _id: groupId }, { ...projection, messages: { $slice: - page * limit } })
      if (!resp) return {
         error: true,
         errorCode: NOT_FOUND,
         message: "There is no group exist with the id " + groupId
      }
      return { data: resp.messages }
   }
   catch (error) {
      return {
         error: true,
         errorCode: INTERNAL_SERVER_ERROR,
         message: error.message
      }
   }
}

const createGroup = async payload => {
   try {
      let group = new Groups(payload)
      let validationError = group.validateSync()
      if (validationError) return {
         error: true,
         errorCode: BAD_REQUEST,
         message: validationError.message
      }
      let newGroup = await group.save()
      return { data: newGroup }
   }
   catch (error) {
      return {
         error: true,
         errorCode: INTERNAL_SERVER_ERROR,
         message: error.message
      }
   }
}

const addGroupMember = async (groupId, payload) => {
   // Checking if GroupId is valid
   if (!ObjectId.isValid(groupId)) return {
      error: true,
      errorCode: BAD_REQUEST,
      message: `GroupId ${groupId} is not a valid objectId`
   }
   try {
      // Checking if GroupMember Schema is valid
      let { error } = GroupMember.validate(payload)
      if (error) return { error: true, errorCode: BAD_REQUEST, message: error.message }
      // Is Group member already Exist
      let member = await Groups.findOne({ 'members.userId': payload.userId }).select('_id')
      if (member) return {
         error: true,
         errorCode: CONFLICT,
         message: `UserId ${payload.userId} already exist in this group`
      }
      // Adding user
      let resp = await Groups.updateOne({ _id: groupId }, { $push: { members: payload } })
      // Checking if user added
      if (resp.nModified === 0) return {
         error: true, errorCode: INTERNAL_SERVER_ERROR, message: "Error while adding member"
      }
      // User added successfully
      return { data: resp }
   }
   catch (error) {
      return {
         error: true,
         errorCode: INTERNAL_SERVER_ERROR,
         message: error.message
      }
   }
}
const addGroupMessage = async (groupId, userId, payload) => {
   // Checking if GroupId is valid
   if (!ObjectId.isValid(groupId)) return {
      error: true,
      errorCode: BAD_REQUEST,
      message: `GroupId ${groupId} is not a valid objectId`
   }
   try {
      // Checking if GroupMessage Schema is valid
      let { error } = Message.validate(payload)
      if (error) return { error: true, errorCode: BAD_REQUEST, message: error.message }
      // Pushing message
      let resp = await Groups.updateOne(
         { _id: groupId, "members.userId": userId },
         { $push: { messages: payload } }
      )
      // Checking if message pushed
      if (resp.nModified === 0) return {
         error: true, errorCode: INTERNAL_SERVER_ERROR, message: "Error while Pushing message"
      }
      // Messages pushed successfully
      return { data: resp }
   }
   catch (error) {
      return {
         error: true,
         errorCode: INTERNAL_SERVER_ERROR,
         message: error.message
      }
   }
}

const updateGroup = async (groupId, payload) => {
   try {
      let resp = await Groups.updateOne({ _id: groupId }, payload)
      if (resp.nModified == 0) return {
         error: true,
         errorCode: BAD_REQUEST,
         message: "Error while updating group"
      }
      return { data: resp }
   }
   catch (error) {
      return {
         error: true,
         errorCode: INTERNAL_SERVER_ERROR,
         message: error.message
      }
   }
}
const updateGroupMember = async (groupId, userId, payload) => {
   if (!ObjectId.isValid(groupId) || !ObjectId.isValid(userId)) return {
      error: true, errorCode: BAD_REQUEST,
      message: `GroupId or UserId is not valid objectId`
   }
   try {
      let set = {}
      Object.keys(payload).forEach(key => { set[`members.$.${key}`] = payload[key] })
      let resp = await Groups.updateOne(
         { _id: groupId, "members.userId": userId },
         { $set: set }
      )
      if (resp.nModified == 0) return {
         error: true,
         errorCode: BAD_REQUEST,
         message: "Error while updating group member"
      }
      return { data: resp }
   }
   catch (error) {
      return {
         error: true,
         errorCode: INTERNAL_SERVER_ERROR,
         message: error.message
      }
   }
}

const deleteGroup = async groupId => {
   try {
      let resp = await Groups.deleteOne({ _id: groupId })
      return { data: resp }
   }
   catch (error) {
      return {
         error: true,
         errorCode: INTERNAL_SERVER_ERROR,
         message: error.message
      }
   }
}
const deleteGroupMember = async (groupId, userId) => {
   if (!ObjectId.isValid(groupId) || !ObjectId.isValid(userId)) return {
      error: true, errorCode: BAD_REQUEST,
      message: `GroupId or UserId is not valid objectId`
   }
   try {
      let resp = await Groups.updateOne(
         { _id: groupId },
         { $pull: { members: { userId } } }
      )
      if (resp.nModified == 0) return {
         error: true,
         errorCode: BAD_REQUEST,
         message: "Error while deleting group member"
      }
      return { data: resp }
   }
   catch (error) {
      return {
         error: true,
         errorCode: INTERNAL_SERVER_ERROR,
         message: error.message
      }
   }
}
const deleteGroupMessage = async (groupId, msgId) => {
   if (!ObjectId.isValid(groupId) || !ObjectId.isValid(msgId)) return {
      error: true, errorCode: BAD_REQUEST,
      message: `GroupId or MessageId is not valid objectId`
   }
   try {
      let resp = await Groups.updateOne(
         { _id: groupId },
         { $pull: { messages: { _id: msgId } } }
      )
      if (resp.nModified == 0) return {
         error: true,
         errorCode: BAD_REQUEST,
         message: "Error while deleting message"
      }
      return { data: resp }
   }
   catch (error) {
      return {
         error: true,
         errorCode: INTERNAL_SERVER_ERROR,
         message: error.message
      }
   }
}

// Exporting methods
exports.getGroupsList = getGroupsList
exports.getGroup = getGroup
exports.getGroupMembers = getGroupMembers
exports.createGroup = createGroup
exports.addGroupMember = addGroupMember
exports.updateGroup = updateGroup
exports.updateGroupMember = updateGroupMember
exports.deleteGroup = deleteGroup
exports.deleteGroupMember = deleteGroupMember
exports.deleteGroupMessage = deleteGroupMessage
// End

// GET REQUESTS
exports.GET_GROUPS = async ({ params: { groupId } }, res, next) => {
   REQUEST_HANDLER(res, next, getGroup, [groupId])
}
exports.GET_GROUPS_LIST = async ({ params: { userId } }, res, next) => {
   console.log(userId)
   REQUEST_HANDLER(res, next, getGroupsList, [userId])
}
exports.GET_GROUP = async (req, res, next) => {
   try {
      let resp = await getGroup(req.params.groupId)
      if (resp.error) throw new ErrorHandler(resp.errorCode, resp.message)
      res.status(OK).json(resp.data)
   }
   catch (error) { next(error) }
}
exports.GET_GROUP_MEMBERS = async (req, res, next) => {
   try {
      let resp = await getGroupMembers(req.params.groupId, req.query)
      if (resp.error) throw new ErrorHandler(resp.errorCode, resp.message)
      res.status(OK).json(resp.data)
   }
   catch (error) { next(error) }
}
exports.GET_GROUP_MESSAGES = async (req, res, next) => {
   try {
      let resp = await getGroupMessages(req.params.groupId, req.query)
      if (resp.error) throw new ErrorHandler(resp.errorCode, resp.message)
      res.status(OK).json(resp.data)
   }
   catch (error) { next(error) }
}

// POST REQUESTS
exports.CREATE_GROUP = async (req, res, next) => {
   try {
      let resp = await createGroup(req.body)
      if (resp.error) throw new ErrorHandler(resp.errorCode, resp.message)
      res.status(OK).json(resp.data)
   }
   catch (error) { next(error) }
}
exports.ADD_GROUP_MEMBER = async (req, res, next) => {
   try {
      let resp = await addGroupMember(req.params.groupId, req.body)
      if (resp.error) throw new ErrorHandler(resp.errorCode, resp.message)
      res.status(OK).json(resp.data)
   }
   catch (error) { next(error) }
}
exports.ADD_GROUP_MESSAGE = async ({ params: { groupId, userId }, body }, res, next) => {
   REQUEST_HANDLER(res, next, addGroupMessage, [groupId, userId, body])
}

// UPDATE REQUESTS
exports.UPDATE_GROUP = async (req, res, next) => {
   try {
      let resp = await updateGroup(req.params.groupId, req.body)
      if (resp.error) throw new ErrorHandler(resp.errorCode, resp.message)
      res.status(OK).json(resp.data)
   }
   catch (error) {
      next(error)
   }
}
exports.UPDATE_GROUP_MEMBER = async (req, res, next) => {
   try {
      let resp = await updateGroupMember(req.params.groupId, req.params.userId, req.body)
      if (resp.error) throw new ErrorHandler(resp.errorCode, resp.message)
      res.status(OK).json(resp.data)
   }
   catch (error) {
      next(error)
   }
}

// DELETE REQUESTS
exports.DELETE_GROUPS = async (req, res, next) => {
   try {
      let resp = await Groups.deleteMany()
      res.json(OK).json(resp)
   }
   catch (error) { next(error) }
}
exports.DELETE_GROUP = async (req, res, next) => {
   try {
      let resp = await deleteGroup(req.params.groupId)
      if (resp.error) throw new ErrorHandler(resp.errorCode, resp.message)
      res.status(OK).json(resp.data)
   }
   catch (error) { next(error) }
}
exports.DELETE_GROUP_MEMBER = async (req, res, next) => {
   try {
      let resp = await deleteGroupMember(req.params.groupId, req.params.userId)
      if (resp.error) throw new ErrorHandler(resp.errorCode, resp.message)
      res.status(OK).json(resp.data)
   }
   catch (error) { next(error) }
}
exports.DELETE_GROUP_MESSAGE = async (req, res, next) => {
   try {
      let resp = await deleteGroupMessage(req.params.groupId, req.params.msgId)
      if (resp.error) throw new ErrorHandler(resp.errorCode, resp.message)
      res.status(OK).json(resp.data)
   }
   catch (error) { next(error) }
}