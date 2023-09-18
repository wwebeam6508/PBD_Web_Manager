// Chakra imports
import { Box, Flex, Text, Select, useColorModeValue } from "@chakra-ui/react";
// Custom components
import Card from "/components/card/Card.jsx";
import PieChart from "/components/charts/PieChart";
import { VSeparator } from "/components/separator/Separator";
import React, { useEffect, useState } from "react";

export default function Conversion(props) {
  const { ...rest } = props;

  // Chakra Color Mode
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const cardColor = useColorModeValue("white", "navy.700");
  const cardShadow = useColorModeValue(
    "0px 18px 40px rgba(112, 144, 176, 0.12)",
    "unset"
  );

  const [pieChartData, setPieChartData] = useState([]);
  const [pieChartOptions, setPieChartOptions] = useState({
    labels: [],
    colors: [],
    chart: {
      width: "50px",
    },
    states: {
      hover: {
        filter: {
          type: "none",
        },
      },
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    hover: { mode: null },
    plotOptions: {
      donut: {
        expandOnClick: false,
        donut: {
          labels: {
            show: false,
          },
        },
      },
    },
    fill: {
      colors: [],
    },
    yaxis: {
      labels: {
        formatter: function (value) {
          return value + " งาน";
        },
      },
    },
    tooltip: {
      enabled: true,
      theme: "dark",
    },
  });

  useEffect(() => {
    if (rest.data && rest.data.length > 0) getChartData();
  }, [rest.data]);
  return (
    <Card p="20px" align="center" direction="column" w="100%" {...rest}>
      <Flex
        px={{ base: "0px", "2xl": "10px" }}
        justifyContent="space-between"
        alignItems="center"
        w="100%"
        mb="8px"
      >
        <Text color={textColor} fontSize="md" fontWeight="600" mt="4px">
          สัดส่วนงานที่ได้รับจากลูกค้า
        </Text>
      </Flex>

      {pieChartOptions.labels.length > 0 && pieChartData.length > 0 && (
        <PieChart
          h="100%"
          w="100%"
          chartData={pieChartData}
          chartOptions={pieChartOptions}
        />
      )}

      <Card
        bg={cardColor}
        flexDirection="row"
        boxShadow={cardShadow}
        w="100%"
        p="15px"
        px="20px"
        mt="15px"
        mx="auto"
      >
        {rest.data &&
          rest.data.map((work, index) => {
            // show only top 2
            if (index > 1) return null;
            return (
              <Flex key={`workpiecard-${index}`}>
                <Flex direction="column" py="5px">
                  <Flex align="center">
                    <Box
                      h="8px"
                      w="8px"
                      bg={
                        pieChartOptions.colors.length > 0
                          ? pieChartOptions.colors[index]
                          : "white"
                      }
                      borderRadius="50%"
                      me="4px"
                    />
                    <Text fontSize="xs" fontWeight="700" mb="5px">
                      {work.name}
                    </Text>
                  </Flex>
                  <Text fontSize="lg" color={textColor} fontWeight="700">
                    {work.workCount}
                  </Text>
                  <Text fontSize="xs">{work.ratio}%</Text>
                </Flex>
                {index < rest.data.length - 1 && (
                  <VSeparator
                    mx={{ base: "60px", xl: "60px", "2xl": "60px" }}
                  />
                )}
              </Flex>
            );
          })}
      </Card>
    </Card>
  );

  function getChartData() {
    const chartData = [];
    const chartLabels = [];
    const chartColorLabels = [];
    if (rest.data) {
      if (pieChartData.length !== rest.data.length) {
        rest.data.map((cusWorkRatio) => {
          chartData.push(cusWorkRatio.workCount);
          chartLabels.push(cusWorkRatio.name);

          chartColorLabels.push(cusWorkRatio.color);
        });

        setPieChartData(chartData);
        setPieChartOptions({
          ...pieChartOptions,
          labels: chartLabels,
          colors: chartColorLabels,
          fill: {
            colors: chartColorLabels,
          },
        });
      }
    }
  }
}
