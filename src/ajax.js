/*
 * This file is part of the @orkans/utilsjs package.
 * Copyright (c) 2026 Orkan <orkans+utilsjs@gmail.com>
 */
import * as utils from './utils.js';

const _cache = {};
const _loading = {};

// ================================================================================================
// DATA DATA DATA DATA DATA DATA DATA DATA DATA DATA DATA DATA DATA DATA DATA DATA DATA DATA DATA D
// ================================================================================================
export const cfg = { api: null, debug: false };

// ================================================================================================
// FUNCTIONS FUNCTIONS FUNCTIONS FUNCTIONS FUNCTIONS FUNCTIONS FUNCTIONS FUNCTIONS FUNCTIONS FUNCTI
// ================================================================================================

/**
 * Number of opened connections.
 */
export function loading(url = null) {
  return _loading[url] ?? false;
}

/**
 * Send <FORM> inputs and return decoded JSON response.
 */
export function postForm(url, form) {
  return fetchJson(url, Object.fromEntries(new FormData(form)));
}

/**
 * GET decoded JSON from endpoint server or cache.
 *
 * CAUTION:
 * JS.fetch() does NOT send well known 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
 * instead is sent as: 'multipart/form-data' resulting in empty PHP arrays: $_POST, $_FILES.
 * To get the contents use:
 * - PHP7: $_POST = file_get_contents('php://input');
 * - PHP8: [$_POST, $_FILES] = request_parse_body();
 *
 * AbortController:
 * let controller;
 * try {
 *   controller && controller.abort();
 *   controller = new AbortController();
 *   ajax.fetchJson(url, body, {signal: controller.signal});
 *   controller = null;
 * }
 * catch(e) {
 *   if (e.name === 'AbortError') {
 *     console.debug(`setHover(${cacheKey}) aborted!`);
 *   }
 * }
 */
export async function fetchJson(url, body = null, opts = {}) {
  let data, error, exception;

  opts.ajax = { cache: '', ...opts?.ajax };
  opts.fetch = utils.objFilter({
    ...{
      headers: utils.objFilter({
        'Content-Type': 'application/json',
        'X-Api-Key': cfg.api,
      }),
      method: body ? 'POST' : 'GET',
      body: body ? JSON.stringify(body) : null,
    },
    ...opts?.fetch,
  });

  const cacheKey = opts.ajax.cache;

  cfg.debug && console.debug(`fetchJson(${cacheKey}) request:`, { url, opts });
  url in _loading ? _loading[url]++ : (_loading[url] = 1);

  if (cacheKey in _cache) {
    cfg.debug && console.debug(`fetchJson(${cacheKey}) cache hit!`);
    data = _cache[cacheKey];
  } else {
    try {
      const res = await fetch(url, opts.fetch);
      data = await res.text(); // keep php errors as text...
      data = JSON.parse(data); // ...or decode php response
      error = data.error ? `API: ${data.error}` : null;
      data = data.data;
      if (cacheKey && !error) {
        _cache[cacheKey] = data;
      }
    } catch (e) {
      error = `JS: ${e.message}`;
      exception = e;
    }
  }

  cfg.debug && console.debug(`fetchJson(${cacheKey}) response:`, { data, error });
  _loading[url]--;

  return { data, error, exception };
}
