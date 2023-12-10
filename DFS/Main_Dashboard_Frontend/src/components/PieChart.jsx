import React, { useEffect, useState } from "react";
import { ResponsivePie } from "@nivo/pie";
import { tokens } from "../theme";
import { useTheme } from "@mui/material";

const PieChart = () => {
  const [piedata, setpiedata] = useState([]);
  const ip = localStorage.getItem("ip");
  console.log("pie se aaya hu", ip);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5001/getPieData?ip=${ip}`
        );
        const value = await response.json();
        console.log(value);
        setpiedata(value);
        if (!response.ok) {
          throw new Error("Failed to fetch data from server");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [piedata]);

  console.log("piedata", piedata);

  const newdata = [20.3,10.8,18.2,15.5,18.1,17.1,0,0];

  const mydata = piedata.cpu_usage_per_process;
  
  const data = mydata && mydata.length > 0
    ? mydata.map((value, index) => ({
        id: `${value} %`,
        label: `Process ${index + 1}`,
        value,
      }))
    : newdata.map((value, index) => ({
        id: `${value} %`,
        label: `Process ${index + 1}`,
        value,
      }));
  

  return (
    <ResponsivePie
      data={data}
      theme={{
        // Your theme configurations
      }}
      margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
      innerRadius={0.5}
      padAngle={1.2}
      cornerRadius={4}
      activeOuterRadiusOffset={8}
      borderColor={{
        from: "color",
        modifiers: [["darker", 0.2]],
        fontSize: 30,
      }}
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsTextColor={colors.grey[100]}
      arcLinkLabelsThickness={3}
      arcLinkLabelsColor={{ from: "color" }}
      enableArcLabels={false}
      arcLabelsRadiusOffset={0.4}
      arcLabelsSkipAngle={7}
      arcLabelsTextColor={{
        from: "color",
        modifiers: [["darker", 2]],
      }}
      defs={[
        // Your defs configurations
      ]}

      legends={[
        {
          anchor: "bottom",
          direction: "row",
          justify: false,
          translateX: 0,
          translateY: 56,
          itemsSpacing: 0,
          itemWidth: 150,
          itemHeight: 18,
          itemTextColor: colors.grey[100],
          itemDirection: "left-to-right",
          itemOpacity: 1,
          symbolSize: 18,
          symbolShape: "circle",
          effects: [
            {
              on: "hover",
              style: {
                itemTextColor: colors.grey[100],
              },
            },
          ],
        },
      ]}
    />
  );
};

export default PieChart;
