'use strict';
const db = uniCloud.database(); //代码块为cdb
const dbCmd = db.command // 取指令
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const collection = db.collection("problem");

	const now = new Date(event.date);
	const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0).getTime() - (8 *60 * 60 * 1000);
	const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).getTime() - (8 * 60 * 60 * 1000);

	const data = await collection.where({
		openid: event.openid,
		time: dbCmd.gte(startOfDay).and(dbCmd.lte(endOfDay))
	}).orderBy('time', 'desc').get()

	const res = await db.collection('problem') // 替换为你的集合名
		.where({
			openid: event.openid,
			time: dbCmd.gte(startOfDay).and(dbCmd.lte(endOfDay))
		})
		.field({
			useTime: true
		}) // 只返回 useTime 字段
		.get();

	// 计算 useTime 的总和
	const totalUseTime = res.data.reduce((sum, record) => {
		return sum + (record.useTime || 0); // 如果 useTime 不存在，默认为 0
	}, 0);

	console.log(totalUseTime);

	//返回数据给客户端
	return {
		code: 0,
		mag: '获取成功！',
		data: {
			list: data.data,
			useTimeAll: totalUseTime
		}

	}
};