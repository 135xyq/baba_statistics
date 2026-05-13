'use strict';
const db = uniCloud.database(); 
const dbCmd = db.command;

function getDayRange() {
	const beijingMs = Date.now() + 8 * 3600 * 1000;
	const startOfDay = beijingMs - (beijingMs % 86400000) - 8 * 3600 * 1000;
	return {
		startOfDay,
		endOfDay: startOfDay + 86400000 - 1
	};
}

exports.main = async (event, context) => {
	const collection = db.collection("thing");
	const { startOfDay, endOfDay } = getDayRange();
  
	const data = await collection.where({
		openid: event.openid,
		time: dbCmd.gte(startOfDay).and(dbCmd.lte(endOfDay))
	}).orderBy('time','asc').get();

	return {
		code: 0,
		msg: '获取成功！',
		data: data.data,
	}
};