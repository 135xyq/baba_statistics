'use strict';
const db = uniCloud.database(); 
const dbCmd = db.command; 

exports.main = async (event, context) => {
	const { openid, text, range = 1 } = event;

	if (!openid) {
		return { code: -1, msg: '缺少用户标识', data: null };
	}
	if (!text || !text.trim()) {
		return { code: -1, msg: '内容不能为空', data: null };
	}

	const collection = db.collection("lucky");
	const data = {
		openid,
		time: Date.now(),
		text: text.trim(),
		range: Number(range) || 1
	};
	
	try {
		await collection.add(data);
		return {
			code: 0,
			msg: '新增成功！',
			data: {},
		};
	} catch (e) {
		return {
			code: -1,
			msg: '新增失败，请稍后再试',
			data: null,
		};
	}
};
