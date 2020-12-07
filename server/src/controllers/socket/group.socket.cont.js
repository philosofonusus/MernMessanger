
const { Group } = require("../../../models")
const { User } = require("../../../models")

const mapMembersName = members => {
   return Promise.all(members.map(async ({ role, _id }) => {
      let user = await User.findById(_id).select("name")
      return user ? { _id, role, name: user._doc.name } : member
   }))
}

exports.getGroup = async _id => {
   try {
      let group = (await Group.findById(_id))._doc
      group.members = await mapMembersName(group.members)
      return { error: false, data: group }
   } catch (err) {
      return { error: true, data: err }
   }
}