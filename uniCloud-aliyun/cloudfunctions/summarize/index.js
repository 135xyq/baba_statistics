'use strict';
const db = uniCloud.database();
const dbCmd = db.command
const $ = db.command.aggregate

exports.main = async (event, context) => {
  const { openid, type, date } = event;

  let startTime = '';
  let endTime = '';

  const year = Number(date.year);
  if (type === 'year') {
    startTime = new Date(`${year}-01-01T00:00:00+08:00`).getTime();
    endTime = new Date(`${year}-12-31T23:59:59.999+08:00`).getTime();
  } else {
    const month = Number(date.month);
    const monthStr = String(month).padStart(2, '0');
    const totalDays = new Date(Date.UTC(year, month, 0)).getUTCDate();
    startTime = new Date(`${year}-${monthStr}-01T00:00:00+08:00`).getTime();
    endTime = new Date(`${year}-${monthStr}-${String(totalDays).padStart(2, '0')}T23:59:59.999+08:00`).getTime();
  }

  // 获取拉屎数量
  const thingConut = await db.collection('thing').where({
    openid: openid,
    time: dbCmd.gte(startTime).and(dbCmd.lte(endTime))
  }).count();

  // 获取做题正确率和做题数量，做题时长
  const problemResult = await db.collection('problem').aggregate()
    .match({
      openid: openid,
      time: dbCmd.gte(startTime).lte(endTime) 
    })
    .group({
      _id: null, 
      totalNumber: {
        $sum: "$totalNumber"
      },
      errorNumber: {
        $sum: "$errorNumber"
      },
      useTime: {
        $sum: ($.ifNull(['$useTime', 0]))
      }
    })
    .end();

  // 发送的话
  const wantSaySend = await db.collection('wantSay').where({
    openid: openid,
    time: dbCmd.gte(startTime).and(dbCmd.lte(endTime))
  }).count();

  // 收到的话
  const wantSayGet = await db.collection('wantSay').where({
    toUserOpenId: openid,
    time: dbCmd.gte(startTime).and(dbCmd.lte(endTime))
  }).count();

  return {
    code: 0,
    msg: '成功',
    data: {
      thing: thingConut.total,
      wantSaySend: wantSaySend.total,
      wantSayGet: wantSayGet.total,
      useTime: 0,
      errorNumber: 0,
      totalNumber: 0,
      ...(problemResult.data && problemResult.data[0] ? problemResult.data[0] : {})
    },
  }
};