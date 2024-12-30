const db = uniCloud.database()

exports.main = async (event)=> {
	const {openid} = event

	// 获取所有相关用户的基本信息
	const usersRes = await db.collection('user')
			.get()

	const userMap = {}
	const userIds = new Set()
	usersRes.data.forEach(user => {
		userMap[user.openid] = {
			nickName: user.nickName,
			avatarUrl: user.avatarUrl
		}
		userIds.add(user.openid)
	})

	userIds.delete(openid)

	// 获取每个用户的最新一条消息和未读消息数量
	const chatList = []

	for (let friendId of userIds) {
		// 获取与该用户的最新聊天记录
		const latestMsgRes = await db.collection('chat')
				.where(db.command.or(
						{ senderOpenid: friendId, receiverOpenid: openid },
						{ senderOpenid: openid, receiverOpenid: friendId }
				))
				.orderBy('time', 'desc')
				.limit(1)  // 获取最新的消息
				.get()

		const lastMsg = latestMsgRes.data[0] || {}

		// 计算与该用户的未读消息数量
		const unreadCountRes = await db.collection('chat')
				.where({
					receiverOpenid: openid,
					senderOpenid: friendId,
					isRead: false
				})
				.count()

		chatList.push({
			friendId,
			nickName: userMap[friendId]?.nickName,
			avatarUrl: userMap[friendId]?.avatarUrl,
			lastMessage: lastMsg.content || '',
			lastMsgTime: lastMsg.time || 0,
			unreadCount: unreadCountRes.total
		})

	}

	// 对聊天记录进行排序：未读消息数多的排在前面，未读消息相同则按最后一条消息时间排序
	chatList.sort((a, b) => {
		if (b.unreadCount !== a.unreadCount) {
			return b.unreadCount - a.unreadCount  // 未读消息数多的排在前面
		} else {
			return b.lastMsgTime - a.lastMsgTime  // 如果未读消息数量相同，按最后一条消息时间排序
		}
	})

	return {
		code :0,
		msg: '获取成功',
		data: chatList
	}
}
