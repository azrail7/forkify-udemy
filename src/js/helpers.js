// goal of this file is to create functions that we reuse in our project
import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config';
// will return a promise which will reject after number of seconds
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);
    // Promise.race as soon as one rejects or fullfills that promise will be the winner
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (error) {
    // we have to rethrow the error
    // promised being returned from getJSON will be rejected
    // and we will be able to handle error in model.js
    // propagated the error from this function to another
    throw error;
  }
};
/*
// getJSON will return resolved value of the promise
export const getJSON = async function (url) {
  try {
    // Promise.race as soon as one rejects or fullfills that promise will be the winner
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (error) {
    // we have to rethrow the error
    // promised being returned from getJSON will be rejected
    // and we will be able to handle error in model.js
    // propagated the error from this function to another
    throw error;
  }
};

// how to send data to an API (POST request)
export const sendJSON = async function (url, uploadData) {
  try {
    const fetchPro = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadData),
    });
    // Promise.race as soon as one rejects or fullfills that promise will be the winner
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (error) {
    // we have to rethrow the error
    // promised being returned from getJSON will be rejected
    // and we will be able to handle error in model.js
    // propagated the error from this function to another
    throw error;
  }
};
*/
