const BASE_URL = process.env.RELAYER_URL || 'http://localhost:3000';
const TEST_ACCOUNT = process.env.TEST_STELLAR_ACCOUNT || '';

async function request(path, options) {
  const response = await fetch(`${BASE_URL}${path}`, options);
  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(`${path} failed: ${JSON.stringify(body)}`);
  }

  return body;
}

async function main() {
  console.log(`Testing C-Pay Stellar relayer: ${BASE_URL}`);

  const health = await request('/health');
  console.log('Health:', {
    status: health.status,
    network: health.network,
  });

  if (TEST_ACCOUNT) {
    const status = await request(`/account/${TEST_ACCOUNT}/status`);
    console.log('Account status check completed');

    const balance = await request(`/account/${TEST_ACCOUNT}/balance`);
    console.log('Account balance check completed');
  } else {
    console.log('Test account not provided. Skipping account endpoints.');
  }
}

main().catch(error => {
  console.error(error.message);
  process.exit(1);
});
