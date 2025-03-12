import dayjs from 'dayjs';

import constants from './constants';

const formatLocalPrice = (num, precision = 2, locale = 'en-IN') => {
  const formatter = new Intl.NumberFormat(locale, {
    maximumFractionDigits: precision,
  });
  return formatter.format(num);
};

const getDateTime = (date, format = 'h:mm A, DD MMMM YYYY') => {
  return dayjs(date).format(format);
};

const fixToTwoLocalPrice = num => formatLocalPrice(num);
const fixToThreeLocalPrice = num => formatLocalPrice(num, 3);

const getDate = (date, format = 'DD MMMM YYYY') => {
  return dayjs(date).format(format);
};

const formatCurrency = (num, locale = 'en-IN') => {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'INR',
  });
  return formatter.format(num);
};

const formatNumber = (num, locale = 'en-IN') => {
  const formatter = new Intl.NumberFormat(locale);
  return formatter.format(num);
};

const formatJsonSafely = (str: string) => {
  try {
    const jsonValue = JSON.parse(str);
    return jsonValue;
  } catch {
    return undefined;
  }
};

const formatRawHtmlValue = (rawHtml: string = '') => {
  return formatJsonSafely(rawHtml)?.hasOwnProperty('time')
    ? JSON.parse(rawHtml) || ''
    : {
        time: new Date().getTime(),
        blocks: [
          {
            id: new Date().toISOString(),
            type: 'paragraph',
            data: {
              text: rawHtml || '',
            },
          },
        ],
        version: constants.TEXT_EDITOR_VERSION,
      };
};

export {
  fixToTwoLocalPrice,
  fixToThreeLocalPrice,
  getDateTime,
  getDate,
  formatCurrency,
  formatNumber,
  formatJsonSafely,
  formatRawHtmlValue,
};
