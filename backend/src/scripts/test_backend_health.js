const userService = require('../modules/core-access/business/services/user.service');

async function testHealth() {
  console.log('Testing userService.listBranches...');
  const branches = await userService.listBranches();
  console.log('Branches retrieved:', branches.length);

  console.log('Testing userService.listPartners...');
  const partners = await userService.listPartners();
  console.log('Partners retrieved:', partners.length);

  console.log('All Core-Access health checks PASSED!');
}

testHealth().catch((err) => {
  console.error('Health check failed:', err);
  process.exit(1);
});
