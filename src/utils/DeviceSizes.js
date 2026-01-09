/**
 * Device sizes library with real device dimensions
 * Based on actual device specifications
 */
export const DEVICE_SIZES = {
  // Desktop
  desktop: {
    name: 'Desktop',
    width: '100%',
    maxWidth: '1200px',
    height: '800px',
    type: 'desktop'
  },
  
  // Tablets
  ipad: {
    name: 'iPad',
    width: '768px',
    maxWidth: '768px',
    height: '1024px',
    type: 'tablet'
  },
  ipadPro: {
    name: 'iPad Pro',
    width: '1024px',
    maxWidth: '1024px',
    height: '1366px',
    type: 'tablet'
  },
  ipadAir: {
    name: 'iPad Air',
    width: '820px',
    maxWidth: '820px',
    height: '1180px',
    type: 'tablet'
  },
  galaxyTab: {
    name: 'Galaxy Tab',
    width: '800px',
    maxWidth: '800px',
    height: '1280px',
    type: 'tablet'
  },
  
  // iPhone devices
  iphoneSE: {
    name: 'iPhone SE',
    width: '375px',
    maxWidth: '375px',
    height: '667px',
    type: 'mobile'
  },
  iphone8: {
    name: 'iPhone 8',
    width: '375px',
    maxWidth: '375px',
    height: '667px',
    type: 'mobile'
  },
  iphone8Plus: {
    name: 'iPhone 8 Plus',
    width: '414px',
    maxWidth: '414px',
    height: '736px',
    type: 'mobile'
  },
  iphoneX: {
    name: 'iPhone X',
    width: '375px',
    maxWidth: '375px',
    height: '812px',
    type: 'mobile'
  },
  iphone11: {
    name: 'iPhone 11',
    width: '414px',
    maxWidth: '414px',
    height: '896px',
    type: 'mobile'
  },
  iphone11Pro: {
    name: 'iPhone 11 Pro',
    width: '375px',
    maxWidth: '375px',
    height: '812px',
    type: 'mobile'
  },
  iphone11ProMax: {
    name: 'iPhone 11 Pro Max',
    width: '414px',
    maxWidth: '414px',
    height: '896px',
    type: 'mobile'
  },
  iphone12: {
    name: 'iPhone 12',
    width: '390px',
    maxWidth: '390px',
    height: '844px',
    type: 'mobile'
  },
  iphone12Pro: {
    name: 'iPhone 12 Pro',
    width: '390px',
    maxWidth: '390px',
    height: '844px',
    type: 'mobile'
  },
  iphone12ProMax: {
    name: 'iPhone 12 Pro Max',
    width: '428px',
    maxWidth: '428px',
    height: '926px',
    type: 'mobile'
  },
  iphone13: {
    name: 'iPhone 13',
    width: '390px',
    maxWidth: '390px',
    height: '844px',
    type: 'mobile'
  },
  iphone13Pro: {
    name: 'iPhone 13 Pro',
    width: '390px',
    maxWidth: '390px',
    height: '844px',
    type: 'mobile'
  },
  iphone13ProMax: {
    name: 'iPhone 13 Pro Max',
    width: '428px',
    maxWidth: '428px',
    height: '926px',
    type: 'mobile'
  },
  iphone14: {
    name: 'iPhone 14',
    width: '390px',
    maxWidth: '390px',
    height: '844px',
    type: 'mobile'
  },
  iphone14Pro: {
    name: 'iPhone 14 Pro',
    width: '393px',
    maxWidth: '393px',
    height: '852px',
    type: 'mobile'
  },
  iphone14ProMax: {
    name: 'iPhone 14 Pro Max',
    width: '430px',
    maxWidth: '430px',
    height: '932px',
    type: 'mobile'
  },
  iphone15: {
    name: 'iPhone 15',
    width: '393px',
    maxWidth: '393px',
    height: '852px',
    type: 'mobile'
  },
  iphone15Pro: {
    name: 'iPhone 15 Pro',
    width: '393px',
    maxWidth: '393px',
    height: '852px',
    type: 'mobile'
  },
  iphone15ProMax: {
    name: 'iPhone 15 Pro Max',
    width: '430px',
    maxWidth: '430px',
    height: '932px',
    type: 'mobile'
  },
  
  // Android devices
  pixel: {
    name: 'Google Pixel',
    width: '411px',
    maxWidth: '411px',
    height: '731px',
    type: 'mobile'
  },
  pixelXL: {
    name: 'Google Pixel XL',
    width: '411px',
    maxWidth: '411px',
    height: '823px',
    type: 'mobile'
  },
  pixel2: {
    name: 'Google Pixel 2',
    width: '411px',
    maxWidth: '411px',
    height: '731px',
    type: 'mobile'
  },
  pixel2XL: {
    name: 'Google Pixel 2 XL',
    width: '411px',
    maxWidth: '411px',
    height: '823px',
    type: 'mobile'
  },
  pixel3: {
    name: 'Google Pixel 3',
    width: '393px',
    maxWidth: '393px',
    height: '786px',
    type: 'mobile'
  },
  pixel3XL: {
    name: 'Google Pixel 3 XL',
    width: '412px',
    maxWidth: '412px',
    height: '847px',
    type: 'mobile'
  },
  pixel4: {
    name: 'Google Pixel 4',
    width: '393px',
    maxWidth: '393px',
    height: '830px',
    type: 'mobile'
  },
  pixel4XL: {
    name: 'Google Pixel 4 XL',
    width: '412px',
    maxWidth: '412px',
    height: '869px',
    type: 'mobile'
  },
  pixel5: {
    name: 'Google Pixel 5',
    width: '393px',
    maxWidth: '393px',
    height: '851px',
    type: 'mobile'
  },
  pixel6: {
    name: 'Google Pixel 6',
    width: '412px',
    maxWidth: '412px',
    height: '915px',
    type: 'mobile'
  },
  pixel6Pro: {
    name: 'Google Pixel 6 Pro',
    width: '412px',
    maxWidth: '412px',
    height: '915px',
    type: 'mobile'
  },
  pixel7: {
    name: 'Google Pixel 7',
    width: '412px',
    maxWidth: '412px',
    height: '915px',
    type: 'mobile'
  },
  pixel7Pro: {
    name: 'Google Pixel 7 Pro',
    width: '412px',
    maxWidth: '412px',
    height: '915px',
    type: 'mobile'
  },
  pixel8: {
    name: 'Google Pixel 8',
    width: '412px',
    maxWidth: '412px',
    height: '915px',
    type: 'mobile'
  },
  pixel8Pro: {
    name: 'Google Pixel 8 Pro',
    width: '430px',
    maxWidth: '430px',
    height: '932px',
    type: 'mobile'
  },
  galaxyS20: {
    name: 'Galaxy S20',
    width: '360px',
    maxWidth: '360px',
    height: '800px',
    type: 'mobile'
  },
  galaxyS21: {
    name: 'Galaxy S21',
    width: '360px',
    maxWidth: '360px',
    height: '800px',
    type: 'mobile'
  },
  galaxyS22: {
    name: 'Galaxy S22',
    width: '360px',
    maxWidth: '360px',
    height: '780px',
    type: 'mobile'
  },
  galaxyS23: {
    name: 'Galaxy S23',
    width: '360px',
    maxWidth: '360px',
    height: '780px',
    type: 'mobile'
  },
  galaxyNote20: {
    name: 'Galaxy Note 20',
    width: '412px',
    maxWidth: '412px',
    height: '915px',
    type: 'mobile'
  }
};

/**
 * Get device by key
 */
export function getDevice(deviceKey) {
  return DEVICE_SIZES[deviceKey] || DEVICE_SIZES.desktop;
}

/**
 * Get all devices
 */
export function getAllDevices() {
  return DEVICE_SIZES;
}

/**
 * Get devices by type
 */
export function getDevicesByType(type) {
  return Object.entries(DEVICE_SIZES)
    .filter(([key, device]) => device.type === type)
    .reduce((acc, [key, device]) => {
      acc[key] = device;
      return acc;
    }, {});
}

/**
 * Get device keys grouped by category
 */
export function getDeviceCategories() {
  return {
    desktop: ['desktop'],
    tablets: ['ipad', 'ipadPro', 'ipadAir', 'galaxyTab'],
    iphones: [
      'iphoneSE', 'iphone8', 'iphone8Plus', 'iphoneX',
      'iphone11', 'iphone11Pro', 'iphone11ProMax',
      'iphone12', 'iphone12Pro', 'iphone12ProMax',
      'iphone13', 'iphone13Pro', 'iphone13ProMax',
      'iphone14', 'iphone14Pro', 'iphone14ProMax',
      'iphone15', 'iphone15Pro', 'iphone15ProMax'
    ],
    android: [
      'pixel', 'pixelXL', 'pixel2', 'pixel2XL',
      'pixel3', 'pixel3XL', 'pixel4', 'pixel4XL',
      'pixel5', 'pixel6', 'pixel6Pro',
      'pixel7', 'pixel7Pro', 'pixel8', 'pixel8Pro',
      'galaxyS20', 'galaxyS21', 'galaxyS22', 'galaxyS23',
      'galaxyNote20'
    ]
  };
}

