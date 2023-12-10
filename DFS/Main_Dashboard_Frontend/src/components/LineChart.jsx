import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import { mockLineData as data } from "../data/mockData";
import { useEffect, useState } from "react";

// const dataArray = [8.9,10.11,10.2,9.8,8.4,9,7,];
const dataArray = [8, 15, 10, 5, 12, 18, 7, 14, 20, 3, 16, 9, 11, 6, 13, 19, 4, 17, 2, 1];


const LineChart = ({ isCustomLineColors = false, isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const ip = localStorage.getItem("ip")
  console.log("line chart called")

  // const data = [
  //   {
  //     id: "line",
  //     color: tokens("dark").greenAccent[500],
  //     data: dataArray.map((value, index) => ({ x: index, y: value })),
  //   },
  // ];

  const [LineData, setLinedata] = useState()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5001/getLineData?ip=${ip}`);
        console.log("line chart se aaya hu", response);
  
        if (!response.ok) {
          throw new Error('Failed to fetch data from server');
        }
  
        const rawData = await response.json();
  
        // Check if rawData is empty before processing it
        if (!rawData || rawData.length === 0) {
          console.warn('Received empty data from the server');
          return;
        }
  
        const parsedData = rawData.map((item) => JSON.parse(item).free_ram);
        console.log("parsed data", parsedData);
        setLinedata(parsedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, [LineData]);
  

  // const folder_usage = LineData.map((item) => item.folder_memory_usage);
  // console.log("folder", folder_usage)
  const data = [
    {
      id: "line",
      color: tokens("dark").greenAccent[500],
      data: LineData
        ? LineData.map((value, index) => ({
            x: index,
            y: value,
          }))
        : [],
    },
  ];
  

  return (
    <ResponsiveLine
      data={data}
      theme={{
        axis: {
          domain: {
            line: {
              stroke: colors.grey[100],
            },
          },
          legend: {
            text: {
              fill: colors.grey[100],
            },
          },
          ticks: {
            line: {
              stroke: colors.grey[100],
              strokeWidth: 1,
            },
            text: {
              fill: colors.grey[100],
            },
          },
        },
        legends: {
          text: {
            fill: colors.grey[100],
          },
        },
        tooltip: {
          container: {
            color: colors.primary[500],
          },
        },
      }}
      
      colors={isDashboard ? { datum: "color" } : { scheme: "nivo" }}
      lineWidth={2}
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        min: "auto",
        max: "auto",
        stacked: true,
        reverse: false,
      }}
      yFormat=" >-.2f"
      curve="catmullRom"
      axisTop={null}
      axisRight={null}
      axisBottom={{
        orient: "bottom",
        tickSize: 0,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "Index", // Change legend to "Index"
        legendOffset: 36,
        legendPosition: "middle",
      }}
      axisLeft={{
        orient: "left",
        tickValues: 5,
        tickSize: 3,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "Ram usage in GB", // Change legend to "Value"
        fontSize: 30,
        legendOffset: -40,
        legendPosition: "middle",
      }}
      enableGridX={false}
      enableGridY={false}
      pointSize={12}
      pointColor={{ theme: "background" }}
      // pointColor={ "black"}
      pointBorderWidth={4}
      // pointBorderColor={{ from: "serieColor" }}
      pointBorderColor={"black"}
      pointLabelYOffset={-12}
      useMesh={true}
      legends={[
        {
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 100,
          translateY: 0,
          itemsSpacing: 0,
          itemDirection: "left-to-right",
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: "circle",
          symbolBorderColor: "rgba(0, 0, 0, .5)",
          effects: [
            {
              on: "hover",
              style: {
                itemBackground: "rgba(0, 0, 0, .03)",
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
    />
  );
};

export default LineChart;