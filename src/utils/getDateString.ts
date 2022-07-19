const getFileDateString = (file, req) => {
  const d = new Date();
  return (
    d.getFullYear() +
    '년_' +
    (d.getMonth() + 1) +
    '월_' +
    d.getDate() +
    '일_' +
    d.getHours() +
    '시_' +
    d.getMinutes() +
    '분_' +
    d.getSeconds() +
    '초_' +
    req.user.name +
    '.zip'
  );
};

const getServerTime = () => {
  const today = new Date();
  return {
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    day: today.getDate(),
    hour: today.getHours(),
    minute: today.getMinutes(),
    second: today.getSeconds(),
  };
};

export { getFileDateString, getServerTime };
