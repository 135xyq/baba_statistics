const db = uniCloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  const {
    openid,
    date,
  } = event; // 从事件中获取openid
  const currentDate = new Date();

  const year = date.year
  const month = date.month

  // 获取当前月的第一天和最后一天
  const firstDay = new Date(year, month - 1, 1).getTime() - (8 * 60 * 60 * 1000);
  const lastDay = new Date(year, month, 0, 23, 59, 59, 999).getTime() - (8 * 60 * 60 * 1000);

  const result = await db.collection('problem')
    .aggregate()
    .match({
      time: _.gte(firstDay).lte(lastDay),
      openid: openid,
    })
    // 在这里增加时区处理
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
        } // 按天分组
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

  console.log(result);
  // 创建一个日期列表以确保每一天都有记录
  const dailyCount = {};
  const totalDays = new Date(year, month, 0).getDate(); // 当前月的总天数

  for (let day = 1; day <= totalDays; day++) {
    const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    dailyCount[dateKey] = {
      count: 0,
      totalNumber: 0,
      errorNumber: 0
    }; // 初始化为 0
  }

  // 填充实际数据
  result.data.forEach(item => {
    dailyCount[item._id] = {
      count: item.count,
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