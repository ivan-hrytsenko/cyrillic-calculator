const CYRILLIC_SYMBOLS_MAP = {
  'А': 1, 'В': 2, 'Г': 3, 'Д': 4, 'Є': 5, 'Ѕ': 6, 'З': 7, 'И': 8, 'Ѳ': 9,
  'І': 10, 'К': 20, 'Л': 30, 'М': 40, 'Н': 50, 'Ѯ': 60, 'О': 70, 'П': 80, 'Ч': 90,
  'Р': 100, 'С': 200, 'Т': 300, 'У': 400, 'Ф': 500, 'Х': 600, 'Ц': 700, 'Ѱ': 800, 'Ѡ': 900
};

const ARABIC_TO_CYRILLIC_MAP = {
  '1': 'А', '2': 'В', '3': 'Г', '4': 'Д', '5': 'Є', '6': 'Ѕ', '7': 'З', '8': 'И', '9': 'Ѳ',
  '10': 'І', '20': 'К', '30': 'Л', '40': 'М', '50': 'Н', '60': 'Ѯ', '70': 'О', '80': 'П', '90': 'Ч',
  '100': 'Р', '200': 'С', '300': 'Т', '400': 'У', '500': 'Ф', '600': 'Х', '700': 'Ц', '800': 'Ѱ', '900': 'Ѡ'
};

const MAX_NUMBER_VALUE = 999;
const MIN_NUMBER_VALUE = 1;

const convertCyrillicToArabic = (cyrillicNumber) => {
  if (typeof cyrillicNumber !== 'string' || cyrillicNumber.length === 0) {
    return 0;
  }

  let arabicSum = 0;
  for (const char of cyrillicNumber) {
    const value = CYRILLIC_SYMBOLS_MAP[char];
    if (value === undefined) {
      return NaN;
    }
    arabicSum += value;
  }
  return arabicSum;
};

const splitArabicNumber = (arabicNumber) => {
  const parsedNumber = Number(arabicNumber);

  if (Number.isNaN(parsedNumber) || parsedNumber < 0 || parsedNumber > MAX_NUMBER_VALUE) {
    return { hundreds: 0, tens: 0, units: 0 };
  }

  const hundreds = Math.floor(parsedNumber / 100) * 100;
  const tens = Math.floor((parsedNumber % 100) / 10) * 10;
  const units = parsedNumber % 10;

  return { hundreds, tens, units };
};

const convertArabicToCyrillic = (arabicNumber) => {
  const parsedNumber = Number(arabicNumber);

  if (Number.isNaN(parsedNumber) || parsedNumber < MIN_NUMBER_VALUE || parsedNumber > MAX_NUMBER_VALUE) {
    return '';
  }

  if (parsedNumber === 0) {
      return '';
  }

  const { hundreds, tens, units } = splitArabicNumber(parsedNumber);
  let cyrillicResult = '';

  if (hundreds > 0) {
    cyrillicResult += ARABIC_TO_CYRILLIC_MAP[hundreds.toString()];
  }

  if (tens > 0) {
    cyrillicResult += ARABIC_TO_CYRILLIC_MAP[tens.toString()];
  }

  if (units > 0) {
    cyrillicResult += ARABIC_TO_CYRILLIC_MAP[units.toString()];
  }

  return cyrillicResult;
};

export {
  convertCyrillicToArabic,
  convertArabicToCyrillic,
  splitArabicNumber
};