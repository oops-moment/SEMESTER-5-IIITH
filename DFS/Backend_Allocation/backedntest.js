// backend.js
const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());
const {createClient} = require('redis');

const redisClient = createClient()
redisClient.on('error', err => console.log('Redis error:', err));
redisClient.connect();


app.listen(5001, () => {
  console.log("Server started on port 5001");
});

const findMostSuitableIP = (ipList, requiredCPU, requiredGPU, requiredRAM) => {
  const convertedArray = Object.entries(ipList).map(([ip, data]) => ({
    Ip: ip,
    Topic: data.topic,
    stat: data.stat,

    overall_cpu_usage: data.overall_cpu_usage,
    cpu_usage_per_process: data.cpu_usage_per_process,

    total_cpu_count: data.total_cpu_count,
    free_cpu_count: data.free_cpu_count,

    total_gpu_count: data.total_gpu_count,
    free_gpu_count: data.free_gpu_count,

    free_gpu_memory: data.free_gpu_memory,
    total_ram: data.total_ram,
    free_ram: data.free_ram,

    free_disk_space: data.free_disk_space,
    folder_memory_usage: data.folder_memory_usage,

    network_card: data.network_card,
    ethernet_port: data.ethernet_port

  }));

  const suitableIPs = convertedArray.filter(
    ip =>
      ip.free_ram >= requiredRAM &&
      ip.total_gpu_count >= requiredGPU &&
      ip.total_cpu_count>= requiredCPU
  );

  if (suitableIPs.length > 0) {
    const allConditionsSatisfied = suitableIPs.some(
      ip =>
        ip.free_ram >= requiredRAM &&
        ip.total_gpu_count >= requiredGPU &&
        ip.total_cpu_count>= requiredCPU
    );

    if (allConditionsSatisfied) {
      const sortedSuitableIPs = suitableIPs.sort((a, b) => {
        return (
          (a.free_ram - requiredRAM) +
          (a.total_gpu_count - requiredGPU) +
          (a.total_cpu_count - requiredCPU)
        ) -
          (
            (b.free_ram - requiredRAM) +
            (b.total_gpu_count - requiredGPU) +
            (a.total_cpu_count - requiredCPU)
          );
      });

      const mostSuitableIP = sortedSuitableIPs[0];
      return { result: "Yes", ip: mostSuitableIP.Ip };
    }
  }

  const partialConditionSatisfied = suitableIPs.some(
    ip =>
      ip.free_ram >= requiredRAM ||
      ip.total_gpu_count >= requiredGPU ||
      ip.total_cpu_count >= requiredCPU
  );

  if (partialConditionSatisfied) {
    const sortedSuitableIPs = suitableIPs.sort((a, b) => {
      const aConditions =
        (a.free_ram >= requiredRAM ? 1 : 0) +
        (a.total_gpu_count >= requiredGPU ? 1 : 0) +
        (a.total_cpu_count >= requiredCPU ? 1 : 0);

      const bConditions =
        (b.free_ram >= requiredRAM ? 1 : 0) +
        (b.total_gpu_count >= requiredGPU ? 1 : 0) +
        (b.total_cpu_count >= requiredCPU ? 1 : 0);

      return bConditions - aConditions;
    });

    const mostSuitableIP = sortedSuitableIPs[0];
    return { result: "Partial Yes", ip: mostSuitableIP.Ip };
  } else {
    return { result: "No", ip: null };
  }
};

// app.get("/allocationapi", async (req, res) => {
//   const { gpu, cpu, ram } = req.query;
//   console.log("GPU:", gpu, "CPU:", cpu, "RAM:", ram);
//   const ipList = [
//     { ip: '192.168.1.1', freeRAM: 21, freeGPU: 1, cpuUsage: 40 },
//     { ip: '192.168.1.2', freeRAM: 32, freeGPU: 4, cpuUsage: 40 },
//     { ip: '192.168.1.3', freeRAM: 24, freeGPU: 5, cpuUsage: 40 },
//     // Add more IPs as needed
//   ];
//   const ip = findMostSuitableIP(ipList, cpu, gpu, ram);
//   console.log("ip is", ip);
//   res.json(ip);
// });

//real code without any hardcode
app.get('/allocationapi', async (req, res) => {
  // const value = await redisClient.get('192.168.137.1');
  const { gpu, cpu, ram } = req.query;
  const allIps =
      await redisClient.KEYS('*');  // Get all keys (IPs) stored in Redis
  const result = {};
  for (const ip of allIps) {
    const value =
        await redisClient.LRANGE(ip, -1, -1);  // Get the last value for each IP
    result[ip] = JSON.parse(value[0]);  // Parse the value from string to JSON
  }
  ip = findMostSuitableIP(result, cpu,gpu,ram)
  console.log('ip is', ip)
  res.json(ip);
});

app.get("/DEallocationapi", async (req, res) => {
  const ipp = req.query.IP;
  const output = `Request has been sent for deallocation to the ip ${ipp}\n`;
  res.json(output);
});
