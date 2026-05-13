'use strict';
const db = uniCloud.database();

function parseTime(time) {
	if (!time) return Date.now();
	if (typeof time === 'number' || !isNaN(Number(time))) {
		// If it's 10 digits (seconds), convert to ms
		const num = Number(time);
		return num < 10000000000 ? num * 1000 : num;
	}
	const str = String(time).replace(/\//g, '-');
	if (str.includes('T')) return new Date(str).getTime();
	
	let isoStr = str;
	if (str.length === 10) {
		isoStr = `${str}T00:00:00+08:00`;
	} else if (str.includes(' ')) {
		isoStr = str.replace(' ', 'T') + '+08:00';
	}
	const ts = new Date(isoStr).getTime();
	return isNaN(ts) ? new Date(time).getTime() - 8 * 3600 * 1000 : ts;
}

exports.main = async (event, context) => {
	const { _id, type, typeName, time, totalNumber, errorNumber, useTime } = event;
	
	if (!_id) {
		return { code: -1, msg: '缺少ID参数' };
	}

	const parsedTime = parseTime(time);

	const res = await db.collection("problem").doc(_id).update({
		type,
		time: parsedTime,
		typeName,
		totalNumber: Number(totalNumber) || 0,
		errorNumber: Number(errorNumber) || 0,
		useTime: Number(useTime) || 0
	});

	return {
		code: 0,
		msg: '更新成功！'
	}
};