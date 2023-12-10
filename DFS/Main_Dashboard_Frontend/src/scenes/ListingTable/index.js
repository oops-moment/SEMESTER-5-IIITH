import { Box, useTheme } from "@mui/material";
import Header from "../../components/Header";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { tokens } from "../../theme";
import { useState, useEffect } from "react";

const Listing = () => {
  const [tableData, setTableData] = useState([]);
  const ip = localStorage.getItem("ip");
  console.log("table se aaya hu", ip);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5001/getPieData?ip=${ip}`);
        const value = await response.json();
        console.log(value);
        setTableData(value);
        if (!response.ok) {
          throw new Error("Failed to fetch data from the server");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [tableData]);
  
  console.log("listing data", tableData);

  return (
    <Box m="20px">

      <TableContainer component={Paper} style={{ maxHeight: "75vh" }}>
        <Table stickyHeader aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Key</TableCell>
              <TableCell align="left">Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(tableData).map(([key, value], index) => (
              <TableRow key={index}>
                <TableCell align="left">{key}</TableCell>
                <TableCell align="left">{JSON.stringify(value)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Listing;
