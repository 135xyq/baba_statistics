const db = uniCloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  const {
    openid
  } = event; // 从事件中获取openid
  const now = new Date();
  // const oneWeekAgo = new Date(now);
  // oneWeekAgo.setDate(now.getDate() - 7);
  const oneWeekAgo = Date.now() - 30 * 24 * 60 * 60 * 1000; // 计算一周前的时间戳

  const result = await db.collection('thing')
    .aggregate()
    .match({
      openid: openid,
      time: _.gte(oneWeekAgo) // 匹配最近一周的记录
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
      } // 统计数量
    })
    .sort({
      _id: 1
    }) // 按日期排序
    .end();

  console.log(result);
  // 格式化结果
  const dailyStats = {};
  result.data.forEach(item => {
    dailyStats[item._id] = item.count || 0;
  });


  return {
    code: 0,
    mag: '获取成功！',
    data: dailyStats,
  }
};