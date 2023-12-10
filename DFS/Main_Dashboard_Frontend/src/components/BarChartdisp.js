import React from "react";
import { useTheme } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { schemeSet3 } from "d3-scale-chromatic";
import { useState, useEffect } from "react";

const BarChartdisp = ({ isDashboard = false }) => {
  const ip = localStorage.getItem("ip");
  const theme = useTheme();
  const colors = schemeSet3;

  const [bardata, setbardata] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5001/getPieData?ip=${ip}`);
        const value = await response.json();
        if (!response.ok) {
          throw new Error('Failed to fetch data from the server');
        }

        setbardata(value);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [bardata]);

  const direcs_object = {
    usr: "28G",
    bin: "0",
    etc: "15M",
    tmp: "588K",
    lib: "0",
    root: "69M",
  };

  // console.log("bar", bardata.folder_memory_usage)
  console.log("bar", bardata)

  // const folder = bardata.folder_memory_usage
  // const t =  bardata.folder_memory_usage

  // console.log("bar", bardata.folder_memory_usagee
  const direcs_array = bardata
    ? Object.entries(bardata.folder_memory_usage).map(([key, value]) => {
      const numericValue = parseInt(value);
      let convertedValue;
      console.log("hello guys sahi hu")
      console.log("kya aao error de rhe the", bardata.folder_memory_usage)

      if (value.endsWith("K")) {
        convertedValue = numericValue * 1024; // Convert Kilobytes to Bytes
      } else if (value.endsWith("M")) {
        convertedValue = numericValue * 1024 * 1024; // Convert Megabytes to Bytes
      } else if (value.endsWith("G")) {
        convertedValue = numericValue * 1024 * 1024 * 1024; // Convert Gigabytes to Bytes
      } else {
        convertedValue = numericValue; // Assume value is already in Bytes
      }
      return [key, convertedValue.toString()];
    })
    :
    Object.entries(direcs_object).map(([key, value]) => {
      const numericValue = parseInt(value);
      let convertedValue;
      console.log("iuchhh")
      if (value.endsWith("K")) {
        convertedValue = numericValue * 1024; // Convert Kilobytes to Bytes
      } else if (value.endsWith("M")) {
        convertedValue = numericValue * 1024 * 1024; // Convert Megabytes to Bytes
      } else if (value.endsWith("G")) {
        convertedValue = numericValue * 1024 * 1024 * 1024; // Convert Gigabytes to Bytes
      } else {
        convertedValue = numericValue; // Assume value is already in Bytes
      }
      return [key, convertedValue.toString()];
    })


  console.log(direcs_array)

  const chartData = direcs_array
    ? direcs_array.map(([key, value]) => ({
      key,
      value: parseInt(value, 10), // Convert value to integer
    }))
    : [];

  const maxValue = Math.max(...chartData.map((entry) => entry.value));

  // Use a logarithmic scale for the y-axis
  const logScale = (value) => Math.log2(value + 1); // Adding 1 to handle cases where value is 0

  // Normalize the values to a percentage of the maximum value
  const normalizedData = chartData.map((entry) => ({
    key: entry.key,
    value: logScale((entry.value / maxValue) * 100), // Adjust the scale as needed
  }));

  return (
    <div style={{ height: "300px" }}>
      <ResponsiveBar
        data={normalizedData}
        keys={["value"]}
        indexBy="key"
        margin={{ top: 50, right: 50, bottom: 70, left: 45 }}
        padding={0.3}
        colors={colors}
        // axisLeft={{
        //   tickSize: 5,
        //   tickPadding: 5,
        //   tickRotation: 0,
        //   legend: "Memory usage in bytes",
        //   legendPosition: "middle",
        //   legendOffset: -100,
        //   // Use the logScale for the tick values
        //   format: (value) => {
        //     const base = Math.pow(2, value);
        //     return base === 1 ? base.toString() : `${base}e${value}`;
        //   },

        // }}

        axisBottom={{
          tickSize: 10,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Folders",
          legendPosition: "middle",
          legendOffset: 40,
          tickLabelProps: () => ({ fontSize: 30 }), // Adjust the fontSize as needed
        }}
        label={(d) => ``}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
        legends={[
          {
            dataFrom: "keys",
            anchor: "bottom-right",
            direction: "column",
            justify: false,
            translateX: 120,
            translateY: 0,
            itemsSpacing: 2,
            itemWidth: 100,
            itemHeight: 20,
            itemDirection: "left-to-right",
            itemOpacity: 0.85,
            symbolSize: 20,
            effects: [
              {
                on: "hover",
                style: {
                  itemOpacity: 0.5,
                },
              },
            ],
          },
        ]}
      />
    </div>
  );
};

export default BarChartdisp;