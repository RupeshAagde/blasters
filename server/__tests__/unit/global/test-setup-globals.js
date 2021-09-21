const nock = require('nock')


const host = 'https://api.xyz.com/gringotts'
const gringottsMock = nock(host)
  .get('/api/v1/external/aggregator-config-details/')
  .reply(200, {})

module.exports = () => {
  console.log('\n***********************SETUP*********************\n')
  return gringottsMock
}
