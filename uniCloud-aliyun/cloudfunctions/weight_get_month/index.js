const db = uniCloud.database();
const _ = db.command;

exports.main = async (event, context) => {
    const {
        openid,
        date
    } = event;
    
    const year = Number(date.year);
    const month = Number(date.month);
    const monthStr = String(month).padStart(2, '0');

    const totalDays = new Date(Date.UTC(year, month, 0)).getUTCDate();
    const firstDay = new Date(`${year}-${monthStr}-01T00:00:00+08:00`).getTime();
    const lastDay = new Date(`${year}-${monthStr}-${String(totalDays).padStart(2, '0')}T23:59:59.999+08:00`).getTime();

    // 聚合查询：按天分组，获取每天最晚的记录
    const result = await db.collection('weight')
        .aggregate()
        .match({
            time: _.gte(firstDay).lte(lastDay),
            openid: openid
        })
        .addFields({
            adjustedTime: {
                $add: ['$time', 28800000] // 调整为 UTC+8
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
            latestRecord: {
                $last: {
                    time: '$time',
                    value: '$value' 
                }
            }
        })
        .replaceRoot({
            newRoot: {
                date: '$_id',
                value: '$latestRecord.value' 
            }
        })
        .end();

    // 生成全量日期列表（确保无数据的日期返回 null）
    const dailyData = {};
    for (let day = 1; day <= totalDays; day++) {
        const dateKey = `${year}-${monthStr}-${String(day).padStart(2, '0')}`;
        dailyData[dateKey] = null; 
    }

    // 填充实际数据
    result.data.forEach(item => {
        dailyData[item.date] = item.value;
    });

    return {
        code: 0,
        msg: 'success',
        data: dailyData
    };
};