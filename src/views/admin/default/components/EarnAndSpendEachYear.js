// Chakra imports
import {
  Box,
  Button,
  Flex,
  Icon,
  Select,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
import LineChart from "components/charts/LineChart";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { IoCheckmarkCircle } from "react-icons/io5";
import { MdBarChart, MdOutlineCalendarToday } from "react-icons/md";
// Assets
export default function EarnAndSpendEachYear(props) {
  const { selectActiveYear, ...rest } = props;
  // Chakra Color Mode

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = useColorModeValue("secondaryGray.600", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const iconColor = useColorModeValue("brand.500", "white");
  const bgButton = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const bgHover = useColorModeValue(
    { bg: "secondaryGray.400" },
    { bg: "whiteAlpha.50" }
  );
  const bgFocus = useColorModeValue(
    { bg: "secondaryGray.300" },
    { bg: "whiteAlpha.100" }
  );
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalEarn, setTotalEarn] = useState(0);
  const [lineChartData, setLineChartData] = useState([]);
  const [lineChartOptions, setLineChartOptions] = useState({
    chart: {
      id: "earn-and-spend-each-year",
      toolbar: {
        show: false,
      },
      dropShadow: {
        enabled: true,
        top: 13,
        left: 0,
        blur: 10,
        opacity: 0.1,
        color: "#4318FF",
      },
    },
    colors: ["#4ED23F", "#FF5A5A"],
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
      enabled: false,
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
        color: ["#7551FF", "#39B8FF"],
        opacity: 0.5,
      },
    },
    color: ["#7551FF", "#39B8FF"],
  });

  useEffect(() => {
    if (rest.data.month) {
      const total = rest.data.month
        .reduce((a, b) => a + b["earn"], 0)
        .toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      setTotalEarn(total);
    }
  }, [rest.data.month]);

  useEffect(() => {
    if (rest.data.month) {
      // sum of {spendWithVat and spendWithOutVat} in each month
      const total = rest.data.month
        .reduce((a, b) => a + b["spendWithVat"] + b["spendWithOutVat"], 0)
        .toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      setTotalExpense(total);
    }
  }, [rest.data.month]);

  useEffect(() => {
    if (rest.data.month) {
      getLineChartData();
      getLineChartCategory();
    }
  }, [rest.data.month]);

  return (
    <Card
      justifyContent="center"
      align="center"
      direction="column"
      w="100%"
      mb="0px"
      {...rest}
    >
      <Flex align="center">
        <Text
          me="auto"
          color={textColor}
          fontSize="xl"
          fontWeight="700"
          lineHeight="100%"
        >
          รายงานรายเดือน
        </Text>
      </Flex>
      <Flex justify="space-between" ps="0px" pe="20px" pt="5px">
        <Flex align="center" w="100%">
          <Select
            w="15%"
            value={rest.data.activeYear}
            onChange={(event) => {
              selectActiveYear(event.target.value);
            }}
          >
            {rest.data.years &&
              rest.data.years.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
          </Select>
        </Flex>
      </Flex>
      <Flex w="100%" flexDirection={{ base: "column", lg: "row" }}>
        <Flex flexDirection="column" me="20px" mt="28px">
          <Text
            color={textColor}
            fontSize="34px"
            textAlign="start"
            fontWeight="700"
            lineHeight="100%"
          ></Text>
          <Flex align="center" mb="20px">
            <Text
              color="secondaryGray.600"
              fontSize="sm"
              fontWeight="500"
              mt="4px"
              me="12px"
            >
              ใช้จ่ายทั้งหมด
            </Text>
            <Flex align="center">
              <Text color="red.500" fontSize="sm" fontWeight="700">
                {totalExpense}
              </Text>
            </Flex>
          </Flex>
          <Flex align="center" mb="20px">
            <Text
              color="secondaryGray.600"
              fontSize="sm"
              fontWeight="500"
              mt="4px"
              me="12px"
            >
              รายได้ทั้งหมด
            </Text>
            <Flex align="center">
              <Text color="green.500" fontSize="sm" fontWeight="700">
                {totalEarn}
              </Text>
            </Flex>
          </Flex>
        </Flex>
        <Box minH="260px" minW="75%" mt="auto">
          <ReactApexChart
            key={`area-earn-spend-month`}
            series={lineChartData}
            options={lineChartOptions}
            type="area"
          />
        </Box>
      </Flex>
    </Card>
  );

  function getLineChartData() {
    const data = [
      {
        name: "รายได้",
        data: rest.data.month.map((item) => item.earn),
      },
      {
        name: "รายจ่าย",
        data: rest.data.month.map(
          (item) => item.spendWithVat + item.spendWithOutVat
        ),
      },
    ];
    setLineChartData(data);
  }

  function getLineChartCategory() {
    const data = rest.data.month.map((item) => item.month);
    // turn month number to text month such as มกรา กุมภาพันธ์ etc.
    const month = data.map((item) => {
      const month = new Date(item + "-01-01").toLocaleString("th-TH", {
        month: "short",
      });
      return month;
    });
    setLineChartOptions({
      ...lineChartOptions,
      xaxis: {
        ...lineChartOptions.xaxis,
        categories: month,
      },
    });
  }
}
