const db = uniCloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  const { openid } = event;
  
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000; 

  const result = await db.collection('thing')
    .aggregate()
    .match({
      openid: openid,
      time: _.gte(thirtyDaysAgo) 
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
      count: {
        $sum: 1
      } 
    })
    .sort({
      _id: 1
    }) 
    .end();

  const dailyStats = {};
  result.data.forEach(item => {
    dailyStats[item._id] = item.count || 0;
  });

  return {
    code: 0,
    msg: '获取成功！',
    data: dailyStats,
  }
};