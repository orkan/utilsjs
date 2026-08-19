/*
 * This file is part of the @orkans/utilsjs package.
 * Copyright (c) 2026 Orkan <orkans+utilsjs@gmail.com>
 */

/**
 * Get version string.
 */
export function version(key = '') {
  switch (key) {
    case 'long':
      return 'UtilsJS v4.5.0 (c) 2026 Orkan';

    case 'short':
      return 'UtilsJS v4.5.0';

    case 'app':
      return 'UtilsJS';

    case 'vendor':
      return '@orkans/utilsjs';

    case 'desc':
      return 'Bunch of scripts collected from all around the JS world';

    case 'npm':
      return 'https://www.npmjs.com/package/@orkans/utilsjs';

    case 'git':
      return 'https://github.com/orkan/utilsjs';

    case 'home':
      return 'https://github.com/orkan';

    case 'year':
      return '2026';

    // yyyy-MMM-d
    case 'date':
    case 'dateYYYYMMD':
      return '2026-Aug-19';

    // EEE, dd MMM yyyy HH:mm:ss XXX
    case 'dateRFC2822':
      return 'Wed, 19 Aug 2026 07:07:43 +02:00';

    // yyyy-MM-dd'T'HH:mm:ssXXX
    case 'dateRFC3339':
      return '2026-08-19T07:07:43+02:00';

    case 'major':
      return '4';

    case 'minor':
      return '5';

    case 'patch':
      return '0';

    case 'metas':
      return '';
  }

  return '4.5.0';
}
