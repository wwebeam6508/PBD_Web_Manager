// Chakra imports
import {
  Box,
  Button,
  Flex,
  Icon,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Card from "components/card/Card.js";
// Custom components
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

export default function YearReport(props) {
  const { ...rest } = props;

  // Chakra Color Mode
  const textColor = useColorModeValue("secondaryGray.900", "white");

  const [ChartData, setChartData] = useState([]);
  const [ChartOptions, setChartOptions] = useState({
    chart: {
      id: "years-report",
      toolbar: {
        show: false,
      },
      stacked: true,
      dropShadow: {
        enabled: true,
        top: 13,
        left: 0,
        blur: 10,
        opacity: 0.1,
        color: "#4318FF",
      },
    },
    colors: ["#0942FF", "#FF5A5A"],
    markers: {
      size: 0,
      colors: "white",
      strokeColors: "#7551FF",
      strokeWidth: 3,
      strokeOpacity: 0.9,
      strokeDashArray: 0,
      fillOpacity: 1,
      discrete: [],
      shape: "circle",
      radius: 2,
      offsetX: 0,
      offsetY: 0,
      showNullDataPoints: true,
    },
    tooltip: {
      theme: "dark",
    },
    dataLabels: {
      enabled: true,
    },
    stroke: {
      curve: "smooth",
      type: "line",
    },
    xaxis: {
      type: "text",
      categories: [],
      labels: {
        style: {
          colors: "#A3AED0",
          fontSize: "12px",
          fontWeight: "500",
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      show: false,
    },
    legend: {
      show: false,
    },
    grid: {
      show: false,
      column: {
        color: ["#f20f22", "#39B8FF"],
        opacity: 0.5,
      },
    },
    color: ["#f20f22", "#39B8FF"],
  });

  useEffect(() => {
    if (rest.data) {
      getChartData();
    }
  }, [rest.data]);
  return (
    <Card align="center" direction="column" w="100%" {...rest}>
      <Flex align="center" w="100%" px="15px" py="10px">
        <Text
          me="auto"
          color={textColor}
          fontSize="xl"
          fontWeight="700"
          lineHeight="100%"
        >
          รายงานผลประกอบการ
        </Text>
      </Flex>

      <Box h="240px" mt="auto">
        <ReactApexChart
          series={ChartData}
          options={ChartOptions}
          type="bar"
          width="100%"
          height="100%"
        />
      </Box>
    </Card>
  );

  function getChartData() {
    const data = [
      {
        name: "กำไร",
        data: rest.data.map((item) => {
          return item.totalEarn - item.totalExpense > 0
            ? item.totalEarn - item.totalExpense
            : 0;
        }),
      },
      {
        name: "ขาดทุน",
        data: rest.data.map((item) => {
          return item.totalEarn - item.totalExpense < 0
            ? item.totalEarn - item.totalExpense
            : 0;
        }),
      },
    ];
    const category = rest.data.map((item) => {
      return item.year;
    });
    setChartOptions({
      ...ChartOptions,
      xaxis: {
        ...ChartOptions.xaxis,
        categories: category,
      },
    });
    setChartData(data);
  }
}
