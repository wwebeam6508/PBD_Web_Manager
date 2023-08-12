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

  const [ChartData, setChartData] = useState([]);
  const [ChartOptions, setChartOptions] = useState({
    title: {
      text: "รายงานผลประกอบการ",
      align: "left",
      margin: 10,
      offsetX: 0,
      offsetY: 0,
      floating: false,
      style: {
        fontSize: "20px",
        fontWeight: "bold",
        fontFamily: undefined,
        color: "#263238",
      },
    },
    chart: {
      id: "years-report",
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
    colors: ["#00FF7F", "#FF5A5A"],
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
    plotOptions: {
      bar: {
        borderRadius: 10,
        dataLabels: {
          position: "top", // top, center, bottom
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return (
          //make number format
          val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        );
      },
      offsetY: -20,
      style: {
        fontSize: "12px",
        colors: ["#304758", "	#8B0000"],
      },
      distributed: false,
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
    },
    yaxis: {
      show: false,
      labels: {
        formatter: function (value) {
          return (
            //make number format
            value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " บาท"
          );
        },
      },
    },
    legend: {
      show: false,
    },
    grid: {
      show: false,
    },
  });

  useEffect(() => {
    if (rest.data) {
      getChartData();
    }
  }, [rest.data]);
  return (
    <Card align="center" direction="column" w="100%" {...rest}>
      <ReactApexChart
        series={ChartData}
        options={ChartOptions}
        type="bar"
        width="100%"
        height="100%"
      />
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
      return String(Number(item.year) + 543);
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
