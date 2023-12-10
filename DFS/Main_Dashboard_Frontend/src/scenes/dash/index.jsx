import React from "react";
import { Box, Typography, useTheme, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { Link } from "react-router-dom";
import { tokens } from "../../theme";
import { mockTransactions } from "../../data/mockData";
import { useState, useEffect } from "react";
import Dashboard from "../dashboard";
import Header from "../../components/Header";


const Dash = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [hardwareData, setHardwareData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5001/allIpData');
        if (!response.ok) {
          throw new Error('Failed to fetch data from server');
        }

        const result = await response.json();
        setHardwareData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [hardwareData]);

  const inputData = {
    '172.17.0.1': {
      overall_cpu_usage: 28.2,
      cpu_usage_per_process: [
        19.8, 26.9, 42.3,
        13.7, 21.2, 13.1,
        66.3, 31.8
      ],
      cpu_count: 8,
      free_gpu_memory: [1869],
      gpu_count: 1,
      free_ram: 10.02059555053711,
      free_disk_space: 2.487873077392578,
      topic: '0x9f72d2559005'
    }
  };

  const convertedArray = Object.entries(hardwareData).map(([ip, data]) => ({
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

  // console.log("converted", convertedArray);

  return (
    <Box m="20px">
      {/* HEADER */}

      {/* GRID & CHARTS */}
      <Box
        gridColumn="span 4"
        gridRow="span 2"
        backgroundColor={colors.primary[400]}
        overflow="auto"
      >
        <Box
          display="flex"
          flexDirection="column"
          p="15px"
        >
          {/* <Typography color={colors.grey[100]} variant="h3" fontWeight="630">
            SERVER LIST
          </Typography> */}
          <Header title="SERVER LIST" subtitle="All IPs connected to Network" />
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow style={{ fontWeight: 'bold' }}>
                  <TableCell style={{ fontSize: '0.9rem', fontWeight: 600 }}>Server IP</TableCell>
                  <TableCell style={{ fontSize: '0.9rem', fontWeight: 600 }}>Server ID</TableCell>
                  <TableCell style={{ fontSize: '0.9rem', fontWeight: 600 }}>Server Status</TableCell>
                  <TableCell style={{ fontSize: '0.9rem', fontWeight: 600 }}>Network Cards</TableCell>
                  {/* <TableCell style={{ fontSize: '0.9rem', fontWeight: 600 }}>Status Value</TableCell> */}


                  <TableCell style={{ fontSize: '0.9rem', fontWeight: 600 }}>Total GPU Count</TableCell>
                  <TableCell style={{ fontSize: '0.9rem', fontWeight: 600 }}>Free GPU Count</TableCell>
                  <TableCell style={{ fontSize: '0.9rem', fontWeight: 600 }}>Total Ram</TableCell>

                  <TableCell style={{ fontSize: '0.9rem', fontWeight: 600 }}>Free Ram</TableCell>
                  <TableCell style={{ fontSize: '0.9rem', fontWeight: 600 }}>Free Disk Space</TableCell>
                  <TableCell style={{ fontSize: '0.9rem', fontWeight: 600 }}>Overall CPU Usage</TableCell>

                  <TableCell style={{ fontSize: '0.9rem', fontWeight: 600 }}>Total CPU Count</TableCell>
                  <TableCell style={{ fontSize: '0.9rem', fontWeight: 600 }}>Free CPU Count</TableCell>

                  {/* <TableCell style={{ fontSize: '0.9rem', fontWeight: 600 }}>Free GPU Memory</TableCell> */}

                 
                  <TableCell style={{ fontSize: '0.9rem', fontWeight: 600 }}>Ethernet Ports</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {convertedArray.map((transaction, i) => (
                  <TableRow
                    key={i}
                    component={Link}
                    to={`/details/${transaction.Ip}`} // Use a dynamic route or link to the desired page
                    style={{ textDecoration: 'none' }}
                  >
                    <TableCell style={{ fontSize: '0.88rem' }} >{transaction.Ip}</TableCell>
                    <TableCell style={{ fontSize: '0.88rem' }}>{transaction.Topic}</TableCell>
                    <TableCell style={{ fontSize: '0.88rem', color: transaction.stat === 1 ? 'green' : 'red', fontWeight: 'bold' }}>
                      {transaction.stat === 1 ? 'Up' : 'Down'}
                    </TableCell>
                    <TableCell style={{ fontSize: '0.88rem' }}>{transaction.network_card}</TableCell>
                       {/* <TableCell style={{ fontSize: '0.88rem' }}>{transaction.stat}</TableCell> */}

                    <TableCell style={{ fontSize: '0.88rem' }}>{transaction.total_gpu_count}</TableCell>
                    <TableCell style={{ fontSize: '0.88rem' }}>{transaction.free_gpu_count}</TableCell>

                    <TableCell style={{ fontSize: '0.88rem' }}>{transaction.total_ram} </TableCell>

                    <TableCell style={{ fontSize: '0.88rem', color:( (transaction.free_ram )>( 0.25 * 15 )) ? 'green' : 'red', fontWeight: 'bold' }}>
                    {transaction.free_ram.toFixed(2)} GB
                    </TableCell>


                    {/* <TableCell style={{ fontSize: '0.88rem' }}>{transaction.free_ram.toFixed(2)} GB</TableCell> */}
                    <TableCell style={{ fontSize: '0.88rem' }}>{transaction.free_disk_space.toFixed(2)} GB</TableCell>
                    <TableCell style={{ fontSize: '0.88rem' }}>{transaction.overall_cpu_usage}</TableCell>

                    <TableCell style={{ fontSize: '0.88rem' }}>{transaction.total_cpu_count}</TableCell>
                    <TableCell style={{ fontSize: '0.88rem' }}>{transaction.free_cpu_count}</TableCell>

                    {/* <TableCell style={{ fontSize: '0.88rem' }}>{transaction.free_gpu_memory}</TableCell> */}
                    <TableCell style={{ fontSize: '0.88rem' }}>{transaction.ethernet_port}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
};

export default Dash;