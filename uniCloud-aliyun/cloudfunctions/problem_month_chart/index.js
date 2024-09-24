const db = uniCloud.database();
const _ = db.command;

exports.main = async (event, context) => {
	const {
		openid,
		date
	} = event; // 从事件中获取openid
	const currentDate = new Date(date);
	const year = currentDate.getFullYear();
	const month = currentDate.getMonth() + 1; // 月份从 0 开始

	// 获取当前月的第一天和最后一天
	const firstDay = new Date(year, month - 1, 1).getTime();
	const lastDay = new Date(year, month, 0).getTime();

	const result = await db.collection('problem')
		.aggregate()
		.match({
			time: _.gte(firstDay).lte(lastDay),
			openid: openid,
		})
		.group({
			_id: {
				$dateToString: {
					format: '%Y-%m-%d',
					date: {
						$toDate: '$time'
					}
				} // 按天分组
			},
			totalNumber: {
				$sum: "$totalNumber"
			},
			errorNumber: {
				$sum: "$errorNumber"
			}
		})
		.sort({
			_id: 1
		}) // 按日期排序
		.end();

	const result1 = await db.collection('problem')
		.aggregate()
		.match({
			time: _.gte(firstDay).lte(lastDay),
			openid: openid
		})
		.group({
			_id: {
				date: {
					$dateToString: {
						format: '%Y-%m-%d',
						date: '$time'
					}
				},
				date: {
					$dateToString: {
						format: '%Y-%m-%d',
						date: {
							$toDate: '$time'
						}
					} // 按天分组
				},
				type: '$type',
				typeName: '$typeName'
			},
			totalNumber: {
				$sum: '$totalNumber'
			},
			errorNumber: {
				$sum: '$errorNumber'
			}
		})
		.sort({
			'_id.date': 1,
			'_id.type': 1
		}) // 按日期和类型排序
		.end();
	console.log(result, result1);
	// 创建一个日期列表以确保每一天都有记录
	const dailyCount = {};
	const totalDays = new Date(date.split('-')[0],date.split('-')[1],0).getDate(); // 当前月的总天数
	const list = ['yanyu','ziliao','panduan','shuliang','changshi','shenlun']

	for (let day = 1; day <= totalDays; day++) {
		const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
		dailyCount[dateKey] = {
			
		}; // 初始化为 0
	}

	// 填充实际数据
	result.data.forEach(item => {
		const date = item._id
		for (var i = 0; i < result1.data.length; i++) {
			if(result1.data[i]._id.date === date) {
				let temp = result1.data[i]
				dailyCount[date][list[temp._id.type-1]] = {
					name: temp._id.typeName,
					totalNumber: temp.totalNumber,
					errorNumber: temp.errorNumber
				}
			}
		}
		dailyCount[date].all = {
			name: '总数',
			totalNumber: item.totalNumber,
			errorNumber: item.errorNumber
		};
	});

	return {
		code: 0.,
		msg: 'success',
		data: dailyCount
	};
}