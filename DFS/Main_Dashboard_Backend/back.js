
const express = require('express');
const app = express();
const cors = require('cors');
const {createClient} = require('redis');

const redisClient = createClient()
redisClient.on('error', err => console.log('Redis error:', err));
redisClient.connect();

function findSuitableIP(ipDict, requiredRAM) {
  const suitableIPs = Object.entries(ipDict).filter(
      ([ip, resources]) => resources.free_ram >= requiredRAM);

  suitableIPs.forEach(([ip, resources]) => {
    console.log(`IP: ${ip}, Free RAM: ${resources.free_ram}`);
  });
  console.log(suitableIPs.length)
  if (suitableIPs.length > 0) {
    console.log('ips,', suitableIPs)
    return {result: 'Yes', ip: suitableIPs[0][0]};
  }
  else {
    return {result: 'No'};
  }
}

app.use(cors());
app.use(express.json());

app.listen(5001, () => {
  console.log('Server started on port 5001');
});

app.get('/getIpData', async (req, res) => {
  // const value = await redisClient.get('192.168.137.1');
  const ip = req.query.ip
  const value = await redisClient.LRANGE(ip, 0, -1);
  // console.log(value);
  res.json(value);
});

app.get('/allIpData', async (req, res) => {
  const allIps =
      await redisClient.KEYS('*');  // Get all keys (IPs) stored in Redis
  const result = {};

  for (const ip of allIps) {
    const value =
        await redisClient.LRANGE(ip, -1, -1);  // Get the last value for each IP
    result[ip] = JSON.parse(value[0]);  // Parse the value from string to JSON
  }

  // console.log(result);
  res.json(result);
});

app.get('/getPieData', async (req, res) => {
  // const value = await redisClient.get('192.168.137.1');
  const ip = req.query.ip
  const value = await redisClient.LRANGE(ip, -1, -1);
  res.json(JSON.parse(value[0]));
});


app.get('/getLineData', async (req, res) => {
  const ip = req.query.ip
  const value = await redisClient.LRANGE(ip, 0, 4);
  console.log("heyy",value)
  res.json(value);
});


app.get('/allocationAPI', async (req, res) => {
  // const value = await redisClient.get('192.168.137.1');
  const cpu = req.query.cpu
  console.log('cpu is', cpu)
  const allIps =
      await redisClient.KEYS('*');  // Get all keys (IPs) stored in Redis
  const result = {};
  for (const ip of allIps) {
    const value =
        await redisClient.LRANGE(ip, -1, -1);  // Get the last value for each IP
    result[ip] = JSON.parse(value[0]);  // Parse the value from string to JSON
  }
  ip = findSuitableIP(result, cpu)
  console.log('ip is', ip)
  res.json(ip);
});
