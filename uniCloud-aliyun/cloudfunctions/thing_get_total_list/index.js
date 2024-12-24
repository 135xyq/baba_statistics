'use strict';
const db = uniCloud.database(); //代码块为cdb
const dbCmd = db.command // 取指令
// 根据人名分组
async function getThingCountWithNickName() {
  // Step 1: 从 user 表中获取 openid 和 nickName
  const users = await db.collection('user')
    .field({
      openid: true,
      nickName: true,
      avatarUrl: true
    })
    .get();

  const userMap = {};
  users.data.forEach(user => {
    userMap[user.openid] = {
      nickName: user.nickName,
      avatarUrl: user.avatarUrl
    };
  });

  // Step 2: 在 thing 表中统计每个 openid 的数量
  const things = await db.collection('thing')
    .aggregate()
    .group({
      _id: '$openid',
      count: db.command.aggregate.sum(1)
    })
    .sort({
      count: -1, // 按照数量降序排序
      nickName: 1,
    })
    .end();

  // 将统计结果与 nickName 对应
  const result = things.data.map(item => ({
    openid: item._id,
    count: item.count,
    nickName: userMap[item._id].nickName || 'Unknown' ,// 如果没有对应的 nickName，使用 'Unknown'
    avatarUrl: userMap[item._id].avatarUrl || '' // 如果没有对应的 nickName，使用 'Unknown'
  }));

  return result;
}


// 月份
async function getMonthlyThingCountWithNickName(startTime,endTime) {
  // Step 1: 统计当前月份每个 openid 对应的 thing 数量
  const thingStats = await db.collection('thing')
    .aggregate()
    .match({
      time: dbCmd.gte(startTime).and(dbCmd.lte(endTime))
    })
    .group({
      _id: '$openid',
      count: db.command.aggregate.sum(1)
    })
    .sort({
      count: -1, // 按数量降序排序
      nickName: 1,
    })
    .end();

  const openids = thingStats.data.map(item => item._id);

  // Step 2: 从 user 表中获取 openid 和 nickName
  const userDocs = await db.collection('user')
    .where({
      openid: dbCmd.in(openids)
    })
    .field({
      openid: true,
      nickName: true,
      avatarUrl: true
    })
    .get();

  const userMap = {};
  userDocs.data.forEach(user => {
    userMap[user.openid] = {
      nickName: user.nickName,
      avatarUrl: user.avatarUrl
    };
  });

  // Step 3: 将统计结果与 nickName 对应
  const result = thingStats.data.map(item => ({
    openid: item._id,
    count: item.count,
    nickName: userMap[item._id].nickName || 'Unknown' ,// 如果没有对应的 nickName，使用 'Unknown'
    avatarUrl: userMap[item._id].avatarUrl || '' // 如果没有对应的 nickName，使用 'Unknown'
  }));

  return result;
}
// 新增记录
exports.main = async (event, context) => {
  //event为客户端上传的参数
  const collection = db.collection("thing");

  const type = event.type

  const now = new Date();
  let startOfDay
  // 月度
  if (type === 1) {
    startOfDay = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
  } else if (type === 2) {
    // 年度
     startOfDay = new Date(now.getFullYear(), 1, 1, 0, 0, 0, 0);
  }else if(type === 0) {
    // 今日
    startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
  }


  let list = []
  if (type !== 3) {
    list =await getMonthlyThingCountWithNickName(startOfDay.getTime(), now.getTime())

  } else {
    // 统计数量列表
    list = await getThingCountWithNickName()
  }

  //返回数据给客户端
  return {
    code: 0,
    mag: '成功',
    data: list,
  }
};