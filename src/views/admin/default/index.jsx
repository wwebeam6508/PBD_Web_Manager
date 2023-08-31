/*!
  _   _  ___  ____  ___ ________  _   _   _   _ ___   
 | | | |/ _ \|  _ \|_ _|__  / _ \| \ | | | | | |_ _| 
 | |_| | | | | |_) || |  / / | | |  \| | | | | || | 
 |  _  | |_| |  _ < | | / /| |_| | |\  | | |_| || |
 |_| |_|\___/|_| \_\___/____\___/|_| \_|  \___/|___|
                                                                                                                                                                                                                                                                                                                                       
=========================================================
* Horizon UI - v1.1.0
=========================================================

* Product Page: https://www.horizon-ui.com/
* Copyright 2022 Horizon UI (https://www.horizon-ui.com/)

* Designed and Coded by Simmmple

=========================================================                                                                                                                                                                                           

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// Chakra imports
import { Box, Icon, SimpleGrid, useColorModeValue } from "@chakra-ui/react";
import { getEarnAndSpendEachYearData } from "/api/dashboard";
// Assets
// Custom components
import MiniCalendar from "/components/calendar/MiniCalendar";
import MiniStatistics from "/components/card/MiniStatistics";
import IconBox from "/components/icons/IconBox";
import React, { useContext, useEffect, useState } from "react";
import {
  MdAttachMoney,
  MdMoneyOff,
  MdPlaylistAddCheck,
  MdWorkOutline,
} from "react-icons/md";
import ComplexTable from "/views/admin/default/components/ComplexTable";
import WorkPieCard from "/views/admin/default/components/WorkPieCard";
import ProfitPieCard from "/views/admin/default/components/ProfitPieCard";
import Tasks from "/views/admin/default/components/Tasks";
import EarnAndSpendEachYear from "/views/admin/default/components/EarnAndSpendEachYear";
import YearReport from "/views/admin/default/components/YearReport";
import { columnsDataComplex } from "/views/admin/default/variables/columnsData";
import tableDataComplex from "/views/admin/default/variables/tableDataComplex.json";
import { FaMoneyBill } from "react-icons/fa";
import { getDashboardData } from "/api/dashboard";
import { LoadingContext } from "/contexts/LoadingContext";

export default function UserReports() {
  const { showLoading, hideLoading } = useContext(LoadingContext);
  // Chakra Color Mode
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");

  useEffect(() => {
    getDashboard();
  }, []);

  const [earnAndSpendEachYear, setEarnAndSpendEachYear] = useState({});
  const [totalEarn, setTotalEarn] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [yearsReport, setYearsReport] = useState([]);
  const [totalWork, setTotalWork] = useState(0);
  const [totalWorkUnfinished, setTotalWorkUnfinished] = useState(0);
  const [customerWorkRatio, setCustomerWorkRatio] = useState([]);
  const [customerProfitRatio, setCustomerProfitRatio] = useState([]);

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3, "2xl": 6 }}
        gap="20px"
        mb="20px"
      >
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon w="32px" h="32px" as={MdAttachMoney} color={brandColor} />
              }
            />
          }
          name={`รายได้`}
          textColor={useColorModeValue("blue.500", "blue.200")}
          // show value of totalEarn as localstring
          value={totalEarn.toLocaleString() + " บาท"}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon w="32px" h="32px" as={MdMoneyOff} color={brandColor} />
              }
            />
          }
          textColor={useColorModeValue("red.500", "red.200")}
          name={`รายจ่าย `}
          value={totalExpense.toLocaleString() + " บาท"}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon w="32px" h="32px" as={FaMoneyBill} color={brandColor} />
              }
            />
          }
          textColor={totalEarn - totalExpense > 0 ? "green.500" : "red.500"}
          growth={
            (((totalEarn - totalExpense) / totalEarn) * 100).toFixed(2) + "%"
          }
          name={`กำไร`}
          value={(totalEarn - totalExpense).toLocaleString() + " บาท"}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg="linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)"
              icon={<Icon w="28px" h="28px" as={MdWorkOutline} color="white" />}
            />
          }
          name="งานที่กำลังดำเนินการ"
          value={totalWorkUnfinished}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg="linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)"
              icon={
                <Icon
                  w="32px"
                  h="32px"
                  as={MdPlaylistAddCheck}
                  color={"white"}
                />
              }
            />
          }
          name="งานทั้งหมด"
          value={totalWork}
        />
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px" mb="20px">
        {earnAndSpendEachYear.month && (
          <EarnAndSpendEachYear
            data={earnAndSpendEachYear}
            selectActiveYear={getEarnAndSpendEachYear}
          />
        )}
        {yearsReport.length > 0 && <YearReport data={yearsReport} />}
      </SimpleGrid>
      <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap="20px" mb="20px">
        <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px">
          {customerProfitRatio.length > 0 && (
            <ProfitPieCard data={customerProfitRatio} />
          )}
          {customerWorkRatio.length > 0 && (
            <WorkPieCard data={customerWorkRatio} />
          )}
        </SimpleGrid>
      </SimpleGrid>
      {/* <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap='20px' mb='20px'>
        <ComplexTable
          columnsData={columnsDataComplex}
          tableData={tableDataComplex}
        />
        <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px'>
          <Tasks />
          <MiniCalendar h='100%' minW='100%' selectRange={false} />
        </SimpleGrid>
      </SimpleGrid> */}
    </Box>
  );

  async function getDashboard() {
    showLoading();
    const res = await getDashboardData();
    if (res) {
      const data = res.data;
      setEarnAndSpendEachYear(data.spentAndEarnEachMonth);
      setTotalEarn(data.totalEarn);
      setTotalExpense(data.totalExpense);
      setYearsReport(data.yearsReport);
      setTotalWork(data.totalWork);
      setTotalWorkUnfinished(data.totalWorkUnfinished);
      setCustomerWorkRatio(data.customerWorkRatio);
      setCustomerProfitRatio(data.customerProfitRatio);
    }
    hideLoading();
  }

  async function getEarnAndSpendEachYear(year) {
    showLoading();
    const res = await getEarnAndSpendEachYearData(year);
    if (res) {
      setEarnAndSpendEachYear(res.data);
    }
    hideLoading();
  }
}
