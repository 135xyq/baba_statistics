'use strict';
const db = uniCloud.database(); //代码块为cdb
exports.main = async (event, context) => {
  try {
    // 1. 查询 map 表中的所有数据
    const mapData = await db.collection('map').get();

    // 2. 通过 openid 分组，获取每个 openid 的最后一条记录
    const lastMapEntries = {};
    mapData.data.forEach(item => {
      const openid = item.openid;
      // 如果没有记录或当前记录的时间更晚，更新最后一条记录
      if (!lastMapEntries[openid] || item.time > lastMapEntries[openid].time) {
        lastMapEntries[openid] = item;
      }
    });

    // 3. 提取出所有的 openid
    const openids = Object.keys(lastMapEntries);

    // 4. 查询 user 表获取对应的 nickName
    const userData = await db.collection('user')
      .where({
        openid: db.command.in(openids) // 根据 openid 筛选
      })
      .get();


    // 5. 创建一个映射，方便根据 openid 获取 nickName
    const userMap = {};
    userData.data.forEach(user => {
      userMap[user.openid] = {
        nickName: user.nickName,
        avatarUrl: user.avatarUrl,
      };
    });

    // 6. 构建最终结果
    const result = Object.values(lastMapEntries).map(item => ({
      openid: item.openid,
      time: item.time,
      ...item,
      nickName: userMap[item.openid]?.nickName || null, // 如果没有对应的 nickName，返回 null
      avatarUrl: userMap[item.openid]?.avatarUrl || null, // 如果没有对应的 avatarUrl，返回 null
    }));

    return {
      code: 0,
      data: result // 返回最终结果
    };
  } catch (error) {
    return {
      code: 500,
      message: '查询失败',
      error: error.message
    };
  }
};