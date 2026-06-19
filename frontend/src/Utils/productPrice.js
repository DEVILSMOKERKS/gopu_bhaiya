const ASK_FOR_PRICE_TEXT = 'Ask For Price';

const normalizePriceValue = (price) => {
  if (price === null || price === undefined || price === '') {
    return null;
  }

  if (typeof price === 'number') {
    return Number.isFinite(price) ? price : null;
  }

  if (typeof price === 'string') {
    const cleaned = price.replace(/[^0-9.]/g, '');
    if (!cleaned) {
      return null;
    }

    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
};

export const isAskForPrice = (product) => {
  const value = product?.ask_for_price;
  return value === true || value === 1 || value === '1' || value === 'true';
};

export const formatCurrency = (price, fallback = 'Price not available') => {
  const normalizedPrice = normalizePriceValue(price);

  if (normalizedPrice === null) {
    return fallback;
  }

  return `₹${normalizedPrice.toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  })}`;
};

export const getProductPriceRangeText = (product, fallback = 'Price not available') => {
  if (isAskForPrice(product)) {
    return ASK_FOR_PRICE_TEXT;
  }

  const minPrice = normalizePriceValue(product?.min_price ?? product?.price);
  const maxPrice = normalizePriceValue(product?.max_price);

  if (minPrice !== null && maxPrice !== null && maxPrice > minPrice) {
    return `${formatCurrency(minPrice, fallback)} - ${formatCurrency(maxPrice, fallback)}`;
  }

  if (minPrice !== null) {
    return formatCurrency(minPrice, fallback);
  }

  return fallback;
};

export const getDisplayPriceText = (product, price, fallback = 'Price not available') => {
  if (isAskForPrice(product)) {
    return ASK_FOR_PRICE_TEXT;
  }

  return formatCurrency(price, fallback);
};

export const getAskForPriceText = () => ASK_FOR_PRICE_TEXT;
