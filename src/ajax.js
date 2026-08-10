/*
 * This file is part of the @orkans/utilsjs package.
 * Copyright (c) 2026 Orkan <orkans+utilsjs@gmail.com>
 */
import * as utils from './utils.js';

const _loading = {};
const _cfg = { api: null, debug: false };

export function cfg(key, val) {
  _cfg[key] = val;
}

/**
 * Number of opened connections.
 */
export function loading(url = null) {
  return _loading[url] ?? false;
}

/**
  Send FORM inputs and return decoded JSON response.
*/
export function postForm(url, form) {
  // Form to Object
  const data = Object.fromEntries(new FormData(form));
  return fetchJson(url, data, { method: 'POST' });
}

/**
  GET decoded JSON from endpoint server.

  CAUTION:
  JS.fetch() does NOT send well known 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
  instead is sent as: 'multipart/form-data' resulting in empty PHP arrays: $_POST, $_FILES.
  To get the contents use:
  - PHP7: $_POST = file_get_contents('php://input');
  - PHP8: [$_POST, $_FILES] = request_parse_body();
*/
export async function fetchJson(url, body = null, opts = {}) {
  let data, error;

  opts = utils.objFilter({
    ...{
      headers: utils.objFilter({
        'Content-Type': 'application/json',
        'X-Api-Key': _cfg.api,
      }),
      method: body ? 'POST' : 'GET',
      body: body ? JSON.stringify(body) : null,
    },
    ...opts,
  });

  _cfg.debug && console.debug('fetchJson req:', { url, opts });
  url in _loading ? _loading[url]++ : (_loading[url] = 1);

  try {
    const res = await fetch(url, opts);

    data = await res.text(); // keep php errors as text...
    data = JSON.parse(data); // ...or decode php response
    error = data.error ? `API: ${data.error}` : null;
    data = data.data;
  } catch (er) {
    error = `JS: ${er.message}`;
  }

  _cfg.debug && console.debug('fetchJson res:', { data, error });
  _loading[url]--;

  return { data, error };
}
