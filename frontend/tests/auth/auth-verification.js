/* global process */
import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/api';
const rand = Math.floor(Math.random() * 1000000);
const username = `verify_user_${rand}`;
const email = `verify_${rand}@example.com`;
const password = 'VerifyPassword123!';

const results = {};

function logResult(testName, passed, errorMsg = '') {
  results[testName] = passed;
  if (passed) {
    console.log(`PASS ${testName}`);
  } else {
    console.error(`FAIL ${testName}: ${errorMsg}`);
  }
}

async function runTests() {
  console.log('Starting Authentication E2E Verification Suite against running Django backend...');
  
  let access_token = '';
  let refresh_token = '';

  // A. Register
  try {
    const res = await axios.post(`${BASE_URL}/account/register/`, {
      username,
      email,
      password,
      first_name: 'Verify',
      last_name: 'Test',
      role: 'manager'
    });
    if (res.status === 201) {
      logResult('Register', true);
    } else {
      logResult('Register', false, `Expected 201, got ${res.status}`);
    }
  } catch (err) {
    logResult('Register', false, err.response?.data ? JSON.stringify(err.response.data) : err.message);
  }

  // B. Login
  try {
    const res = await axios.post(`${BASE_URL}/account/login/`, {
      username,
      password
    });
    if (res.status === 200 && res.data.access && res.data.refresh) {
      access_token = res.data.access;
      refresh_token = res.data.refresh;
      logResult('Login', true);
    } else {
      logResult('Login', false, `Expected tokens, got: ${JSON.stringify(res.data)}`);
    }
  } catch (err) {
    logResult('Login', false, err.response?.data ? JSON.stringify(err.response.data) : err.message);
  }

  // C. Profile
  if (access_token) {
    try {
      const res = await axios.get(`${BASE_URL}/account/profile/`, {
        headers: { Authorization: `Bearer ${access_token}` }
      });
      if (res.status === 200 && res.data.username === username) {
        logResult('Profile', true);
      } else {
        logResult('Profile', false, `Username mismatch. Expected ${username}, got ${res.data.username}`);
      }
    } catch (err) {
      logResult('Profile', false, err.response?.data ? JSON.stringify(err.response.data) : err.message);
    }
  } else {
    logResult('Profile', false, 'Skipped due to login failure');
  }

  // D. Invalid Login
  try {
    await axios.post(`${BASE_URL}/account/login/`, {
      username,
      password: 'WrongPassword!'
    });
    logResult('Invalid Login', false, 'Expected 401 request failure, but request succeeded');
  } catch (err) {
    if (err.response?.status === 401) {
      logResult('Invalid Login', true);
    } else {
      logResult('Invalid Login', false, `Expected status 401, got ${err.response?.status || err.message}`);
    }
  }

  // E. Refresh Token
  if (refresh_token) {
    try {
      const res = await axios.post(`${BASE_URL}/account/refresh/`, {
        refresh: refresh_token
      });
      if (res.status === 200 && res.data.access) {
        access_token = res.data.access; // update access token
        logResult('Refresh', true);
      } else {
        logResult('Refresh', false, `Expected new access token, got: ${JSON.stringify(res.data)}`);
      }
    } catch (err) {
      logResult('Refresh', false, err.response?.data ? JSON.stringify(err.response.data) : err.message);
    }
  } else {
    logResult('Refresh', false, 'Skipped due to login failure');
  }

  // F. Invalid Refresh Token
  try {
    await axios.post(`${BASE_URL}/account/refresh/`, {
      refresh: 'invalid_refresh_token_string'
    });
    logResult('Invalid Refresh', false, 'Expected request failure, but request succeeded');
  } catch (err) {
    if (err.response?.status === 401) {
      logResult('Invalid Refresh', true);
    } else {
      logResult('Invalid Refresh', false, `Expected status 401, got ${err.response?.status || err.message}`);
    }
  }

  // G. Protected Endpoint (No Auth)
  try {
    await axios.get(`${BASE_URL}/account/profile/`);
    logResult('Protected Endpoint', false, 'Expected request failure, but request succeeded');
  } catch (err) {
    if (err.response?.status === 401) {
      logResult('Protected Endpoint', true);
    } else {
      logResult('Protected Endpoint', false, `Expected status 401, got ${err.response?.status || err.message}`);
    }
  }

  // H. Projects Endpoint
  if (access_token) {
    try {
      const res = await axios.get(`${BASE_URL}/projects/`, {
        headers: { Authorization: `Bearer ${access_token}` }
      });
      if (res.status === 200) {
        logResult('Projects', true);
      } else {
        logResult('Projects', false, `Expected 200, got ${res.status}`);
      }
    } catch (err) {
      logResult('Projects', false, err.response?.data ? JSON.stringify(err.response.data) : err.message);
    }
  } else {
    logResult('Projects', false, 'Skipped due to access token failure');
  }

  // I. Tasks Endpoint
  if (access_token) {
    try {
      const res = await axios.get(`${BASE_URL}/tasks/`, {
        headers: { Authorization: `Bearer ${access_token}` }
      });
      if (res.status === 200) {
        logResult('Tasks', true);
      } else {
        logResult('Tasks', false, `Expected 200, got ${res.status}`);
      }
    } catch (err) {
      logResult('Tasks', false, err.response?.data ? JSON.stringify(err.response.data) : err.message);
    }
  } else {
    logResult('Tasks', false, 'Skipped due to access token failure');
  }

  console.log('\n--- VERIFICATION SUMMARY ---');
  const allPassed = Object.values(results).every(v => v === true);
  if (allPassed) {
    console.log('All tests passed successfully! Authentication module is production-ready and merge-ready.');
    process.exit(0);
  } else {
    console.error('Some tests failed. Check log details above.');
    process.exit(1);
  }
}

runTests();
