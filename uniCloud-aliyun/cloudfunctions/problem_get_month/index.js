const db = uniCloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  const {
    openid,
    date,
  } = event; 

  const year = Number(date.year);
  const month = Number(date.month);
  const monthStr = String(month).padStart(2, '0');
  
  // Get total days in the month
  const totalDays = new Date(Date.UTC(year, month, 0)).getUTCDate();

  // Calculate start and end in UTC+8
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
        $add: ['$time', 28800000] // UTC+8 offset
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
      count: {
        $sum: 1
      },
      totalNumber: {
        $sum: "$totalNumber"
      },
      errorNumber: {
        $sum: "$errorNumber"
      }
    })
    .end();

  const dailyCount = {};
  
  for (let day = 1; day <= totalDays; day++) {
    const dateKey = `${year}-${monthStr}-${String(day).padStart(2, '0')}`;
    dailyCount[dateKey] = {
      count: 0,
      totalNumber: 0,
      errorNumber: 0
    };
  }

  result.data.forEach(item => {
    dailyCount[item._id] = {
      count: item.count || 0,
      totalNumber: item.totalNumber || 0,
      errorNumber: item.errorNumber || 0
    };
  });

  return {
    code: 0,
    msg: '获取成功！',
    data: dailyCount
  };
}