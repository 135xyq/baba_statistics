const db = uniCloud.database();
const _ = db.command;

exports.main = async (event, context) => {
	const { openid, date } = event;
	const year = Number(date.year);
	const month = Number(date.month);
	const monthStr = String(month).padStart(2, '0');

	const totalDays = new Date(Date.UTC(year, month, 0)).getUTCDate();
	const firstDay = new Date(`${year}-${monthStr}-01T00:00:00+08:00`).getTime();
	const lastDay = new Date(`${year}-${monthStr}-${String(totalDays).padStart(2, '0')}T23:59:59.999+08:00`).getTime();

	const result = await db.collection('thing')
		.aggregate()
		.match({
			time: _.gte(firstDay).lte(lastDay),
			openid: openid,
		})
		.addFields({
			adjustedTime: {
				$add: ['$time', 28800000] // 将时间调整为 UTC+8
			}
		})
		.group({
			_id: {
				$dateToString: {
					format: '%Y-%m-%d',
					date: {
						$toDate: '$adjustedTime'
					}
				}
			},
			count: { $sum: 1 }
		})
		.end();

	const dailyCount = {};
	for (let day = 1; day <= totalDays; day++) {
		const dateKey = `${year}-${monthStr}-${String(day).padStart(2, '0')}`;
		dailyCount[dateKey] = 0;
	}

	result.data.forEach(item => {
		dailyCount[item._id] = item.count;
	});

	return {
		code: 0,
		msg: 'success',
		data: dailyCount
	};
};