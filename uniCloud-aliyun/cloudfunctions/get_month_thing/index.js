const db = uniCloud.database();
const _ = db.command;

exports.main = async (event, context)=>{
  const {
    openid
  } = event; // 从事件中获取openid
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; // 月份从 0 开始

  // 获取当前月的第一天和最后一天
  const firstDay = new Date(year, month - 1, 1).getTime();
  const lastDay = new Date(year, month, 0).getTime();

  const result = await db.collection('thing')
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
      count: {
        $sum: 1
      } 
    })
    .end();

console.log(result);
  // 创建一个日期列表以确保每一天都有记录
  const dailyCount = {};
  const totalDays = new Date(year, month, 0).getDate(); // 当前月的总天数

  for (let day = 1; day <= totalDays; day++) {
    const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    dailyCount[dateKey] = 0; // 初始化为 0
  }

  // 填充实际数据
  result.data.forEach(item => {
    dailyCount[item._id] = item.count;
  });

  return {
    code: 0.,
    msg: 'success',
    data: dailyCount
  };
}