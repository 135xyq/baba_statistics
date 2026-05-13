'use strict';
const db = uniCloud.database();

function parseTime(time) {
	if (!time) return Date.now();
	if (typeof time === 'number' || !isNaN(Number(time))) {
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

function getBeijingTimeStr(timestamp) {
	const date = new Date(timestamp + 8 * 3600 * 1000);
	const year = date.getUTCFullYear();
	const month = String(date.getUTCMonth() + 1).padStart(2, '0');
	const day = String(date.getUTCDate()).padStart(2, '0');
	const hour = String(date.getUTCHours()).padStart(2, '0');
	const minutes = String(date.getUTCMinutes()).padStart(2, '0');
	const seconds = String(date.getUTCSeconds()).padStart(2, '0');
	return `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`;
}

exports.main = async (event, context) => {
	const { openid, type, totalNumber, errorNumber, typeName, time, useTime } = event;
	
	if (!openid) {
		return { code: -1, msg: '缺少用户标识', data: null };
	}

	const parsedTime = parseTime(time);
	
	const collection = db.collection("problem");
	const data = {
		openid,
		type, 
		totalNumber: Number(totalNumber) || 0, 
		errorNumber: Number(errorNumber) || 0,
		typeName,
		useTime: Number(useTime) || 0,
		time: parsedTime,
		create_time: getBeijingTimeStr(Date.now())
	};
	
	try {
		await collection.add(data);
		return {
			code: 0,
			msg: '新增成功！',
			data: {},
		}
	} catch (e) {
		return {
			code: -1,
			msg: '新增失败',
			data: null
		}
	}
};