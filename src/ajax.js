/*
 * This file is part of the @orkans/utilsjs package.
 * Copyright (c) 2026 Orkan <orkans+utilsjs@gmail.com>
 */
import * as utils from './utils.js';

const _loading = {};
const _fetchCache = {};

// ================================================================================================
// DATA DATA DATA DATA DATA DATA DATA DATA DATA DATA DATA DATA DATA DATA DATA DATA DATA DATA DATA
// ================================================================================================
export const cfg = { api: null, debug: false };

// ================================================================================================
// FUNCTIONS FUNCTIONS FUNCTIONS FUNCTIONS FUNCTIONS FUNCTIONS FUNCTIONS FUNCTIONS FUNCTIONS
// ================================================================================================

/**
 * Show/hide debug messages.
 */
export function debug(message, data = null) {
  cfg.debug && utils.debug(message, data);
}

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
 */
export async function fetchJson(url, body = null, opts = {}) {
  let data, error;

  opts = {
    ...{
      ajax: {
        cache: '',
      },
      fetch: utils.objFilter({
        headers: utils.objFilter({
          'Content-Type': 'application/json',
          'X-Api-Key': cfg.api,
        }),
        method: body ? 'POST' : 'GET',
        body: body ? JSON.stringify(body) : null,
      }),
    },
    ...opts,
  };

  cfg.debug && debug('fetchJson() req:', { url, opts });
  url in _loading ? _loading[url]++ : (_loading[url] = 1);

  if (opts.ajax.cache in _fetchCache) {
    cfg.debug && debug(`fetchJson() cache hit: ${opts.ajax.cache}`);
    data = _fetchCache[opts.ajax.cache];
  } else {
    try {
      const res = await fetch(url, opts.fetch);
      data = await res.text(); // keep php errors as text...
      data = JSON.parse(data); // ...or decode php response
      error = data.error ? `API: ${data.error}` : null;
      data = data.data;
      if (opts.ajax.cache) {
        _fetchCache[opts.ajax.cache] = data;
      }
    } catch (er) {
      error = `JS: ${er.message}`;
    }
  }

  cfg.debug && debug('fetchJson res:', { data, error });
  _loading[url]--;

  return { data, error };
}
