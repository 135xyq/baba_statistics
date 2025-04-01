const { close } = require("inspector");

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
  const firstDay = new Date(year, month - 1, 1).getTime() - (8 * 60 * 60 * 1000);
  const lastDay = new Date(year, month, 0).getTime() - (8 * 60 * 60 * 1000);

  const result = await db.collection('weight')
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
        }
      },
      latestRecord: {
        $last: {
          time: '$time',
          value: '$value' // 假设字段名为 value
        }
      }
    })
    .replaceRoot({
      newRoot: {
        date: '$_id',
        value: '$latestRecord.value' // 提取最晚记录的 value
      }
    })
    .end();

  // 生成全量日期列表（确保无数据的日期返回 null）
  const dailyData = {};
  const totalDays = new Date(year, month, 0).getDate();

  for (let day = 1; day <= totalDays; day++) {
    const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    dailyData[dateKey] = null; // 默认无数据
  }
  

  // 填充实际数据
  result.data.forEach(item => {
    dailyData[item.date] = item.value;
  });

  return {
    code: 0.,
    msg: 'success',
    data: dailyData
  };
}