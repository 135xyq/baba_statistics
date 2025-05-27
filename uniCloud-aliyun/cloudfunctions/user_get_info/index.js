'use strict';
const db = uniCloud.database()
const $ = db.command.aggregate
exports.main = async (event, context) => {
	try {
		const { openid } = event
		
		// 使用聚合查询关联user_role表
		const result = await db.collection('user')
			.aggregate()
			.match({
				openid: openid
			})
			.lookup({
				from: 'user_role',
				localField: 'roleId',
				foreignField: '_id',
				as: 'roleInfo'
			})
			.project({
				_id: 1,
				nickName: 1,
				openid: 1,
				roleId: 1,
				"gender": 1,
				"avatarUrl":1,
				"isHidden": true,
				roleName: $.arrayElemAt(['$roleInfo.roleName', 0]),
				roleLevel: $.arrayElemAt(['$roleInfo.roleLevel', 0]),
				functionList: $.arrayElemAt(['$roleInfo.functionList', 0])
			})
			.end()

		if (result.data.length === 0) {
			return {
				code: 404,
				msg: '用户不存在'
			}
		}

		return {
			code: 0,
			data: result.data[0],
			msg: '获取成功'
		}
	} catch (error) {
		return {
			code: 500,
			msg: error.message || '服务器错误'
		}
	}
};
