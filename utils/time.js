
const addZero = (v) => {
  let result = v;

  if (v < 10) {
    result = `0${v}`;
  }

  return result;
};

export const formatISOString = (input) => {
  if (typeof input !== 'string') {
    throw new Error('input must be a ISO string');
  }

  const date = new Date(input);

  const d = addZero(date.getDate());
  const m = addZero(date.getMonth() + 1);
  const y = addZero(date.getFullYear());
  const h = addZero(date.getHours());
  const mm = addZero(date.getMinutes());

  return `${d}/${m}/${y} ${h}:${mm}`;
};
