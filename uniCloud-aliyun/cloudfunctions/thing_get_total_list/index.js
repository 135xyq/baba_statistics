'use strict';
const db = uniCloud.database(); 
const dbCmd = db.command; 

async function getThingCountWithNickName() {
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

  const things = await db.collection('thing')
    .aggregate()
    .group({
      _id: '$openid',
      count: db.command.aggregate.sum(1)
    })
    .sort({
      count: -1, 
    })
    .end();

  const result = things.data.map(item => ({
    openid: item._id,
    count: item.count,
    nickName: userMap[item._id]?.nickName || 'Unknown',
    avatarUrl: userMap[item._id]?.avatarUrl || '' 
  }));

  return result;
}

async function getMonthlyThingCountWithNickName(startTime, endTime) {
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
      count: -1, 
    })
    .end();

  const openids = thingStats.data.map(item => item._id);

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

  const result = thingStats.data.map(item => ({
    openid: item._id,
    count: item.count,
    nickName: userMap[item._id]?.nickName || 'Unknown',
    avatarUrl: userMap[item._id]?.avatarUrl || '' 
  }));

  return result;
}

exports.main = async (event, context) => {
  const type = event.type;

  const beijingMs = Date.now() + 8 * 3600 * 1000;
  const beijingDate = new Date(beijingMs);
  const year = beijingDate.getUTCFullYear();
  const month = String(beijingDate.getUTCMonth() + 1).padStart(2, '0');
  const date = String(beijingDate.getUTCDate()).padStart(2, '0');

  let startOfDayMs;
  if (type === 1) { 
    startOfDayMs = new Date(`${year}-${month}-01T00:00:00+08:00`).getTime();
  } else if (type === 2) { 
    startOfDayMs = new Date(`${year}-01-01T00:00:00+08:00`).getTime();
  } else if (type === 0) { 
    startOfDayMs = new Date(`${year}-${month}-${date}T00:00:00+08:00`).getTime();
  }

  let list = [];
  if (type !== 3) {
    list = await getMonthlyThingCountWithNickName(startOfDayMs, Date.now());
  } else {
    list = await getThingCountWithNickName();
  }

  return {
    code: 0,
    msg: '成功',
    data: list,
  }
};