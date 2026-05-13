const db = uniCloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  const { openid, date } = event;

  const parts = String(date).split('-');
  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const monthStr = String(month).padStart(2, '0');

  const totalDays = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const firstDay = new Date(`${year}-${monthStr}-01T00:00:00+08:00`).getTime();
  const lastDay = new Date(`${year}-${monthStr}-${String(totalDays).padStart(2, '0')}T23:59:59.999+08:00`).getTime();

  const result = await db.collection('weight')
    .where({
      time: _.gte(firstDay).lte(lastDay),
      openid: openid,
    })
    .orderBy('time', 'asc')
    .get();

  const dailyData = {};
  for (let day = 1; day <= totalDays; day++) {
    const dateKey = `${year}-${monthStr}-${String(day).padStart(2, '0')}`;
    dailyData[dateKey] = 0;
  }

  const grouped = {};
  result.data.forEach(item => {
    const d = new Date(item.time + 8 * 3600 * 1000);
    const dateKey = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
    if (!grouped[dateKey] || item.time > grouped[dateKey].time) {
      grouped[dateKey] = item;
    }
  });

  for (const dateKey in grouped) {
    if (dailyData.hasOwnProperty(dateKey)) {
      dailyData[dateKey] = grouped[dateKey].value;
    }
  }

  return {
    code: 0,
    msg: 'success',
    data: dailyData
  };
}
