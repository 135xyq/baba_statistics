'use strict';
const db = uniCloud.database(); 
const dbCmd = db.command;

function getDayRange(dateStr) {
	let startOfDay;
	if (dateStr) {
		const str = String(dateStr).replace(/\//g, '-');
		const isoStr = str.length === 10 ? `${str}T00:00:00+08:00` : str.replace(' ', 'T') + '+08:00';
		startOfDay = new Date(isoStr).getTime();
		if (isNaN(startOfDay)) {
			const d = new Date(dateStr);
			startOfDay = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()).getTime() - 8 * 3600 * 1000;
		}
	} else {
		const beijingMs = Date.now() + 8 * 3600 * 1000;
		startOfDay = beijingMs - (beijingMs % 86400000) - 8 * 3600 * 1000;
	}
	return {
		startOfDay,
		endOfDay: startOfDay + 86400000 - 1
	};
}

exports.main = async (event, context) => {
	const collection = db.collection("thing");
	const { startOfDay, endOfDay } = getDayRange(event.date);
  
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