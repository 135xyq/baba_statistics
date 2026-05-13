const db = uniCloud.database();
const _ = db.command;

exports.main = async (event, context) => {
	const { openid, date } = event;
	const parts = String(date).split('-');
	const year = Number(parts[0]);
	const month = Number(parts[1]);
	const monthStr = String(month).padStart(2, '0');

	const totalDays = new Date(Date.UTC(year, month, 0)).getUTCDate();
	const firstDay = new Date(`${year}-${monthStr}-01T00:00:00+08:00`).getTime();
	const lastDay = new Date(`${year}-${monthStr}-${String(totalDays).padStart(2, '0')}T23:59:59.999+08:00`).getTime();

	const result = await db.collection('problem')
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
			totalNumber: { $sum: "$totalNumber" },
			errorNumber: { $sum: "$errorNumber" }
		})
		.sort({ _id: 1 })
		.end();

	const result1 = await db.collection('problem')
		.aggregate()
		.match({
			time: _.gte(firstDay).lte(lastDay),
			openid: openid
		})
		.addFields({
			adjustedTime: {
				$add: ['$time', 28800000] 
			}
		})
		.group({
			_id: {
				date: {
					$dateToString: {
						format: '%Y-%m-%d',
						date: {
							$toDate: '$adjustedTime'
						}
					} 
				},
				type: '$type',
				typeName: '$typeName'
			},
			totalNumber: { $sum: '$totalNumber' },
			errorNumber: { $sum: '$errorNumber' }
		})
		.end();

	const dailyCount = {};
	const list = ['yanyu','ziliao','panduan','shuliang','changshi','zhengzhi','shenlun'];

	for (let day = 1; day <= totalDays; day++) {
		const dateKey = `${year}-${monthStr}-${String(day).padStart(2, '0')}`;
		dailyCount[dateKey] = {};
	}

	// Index result1 by date
	const typeDataByDate = {};
	result1.data.forEach(item => {
		const d = item._id.date;
		if (!typeDataByDate[d]) typeDataByDate[d] = [];
		typeDataByDate[d].push(item);
	});

	result.data.forEach(item => {
		const dateKey = item._id;
		if (!dailyCount[dateKey]) dailyCount[dateKey] = {};

		const dayTypes = typeDataByDate[dateKey] || [];
		dayTypes.forEach(temp => {
			const tIndex = temp._id.type - 1;
			if (list[tIndex]) {
				dailyCount[dateKey][list[tIndex]] = {
					name: temp._id.typeName,
					totalNumber: temp.totalNumber,
					errorNumber: temp.errorNumber
				};
			}
		});

		dailyCount[dateKey].all = {
			name: '总数',
			totalNumber: item.totalNumber,
			errorNumber: item.errorNumber
		};
	});

	return {
		code: 0,
		msg: 'success',
		data: dailyCount
	};
};