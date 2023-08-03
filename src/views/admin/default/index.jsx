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
import {
  Box,
  Icon,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react";
import { getEarnAndSpendEachYearData } from "api/dashboard";
// Assets
// Custom components
import MiniCalendar from "components/calendar/MiniCalendar";
import MiniStatistics from "components/card/MiniStatistics";
import IconBox from "components/icons/IconBox";
import React, { useEffect, useState } from "react";
import {
  MdAddTask,
  MdAttachMoney,
  MdFileCopy,
  MdMoneyOff,
} from "react-icons/md";
import CheckTable from "views/admin/default/components/CheckTable";
import ComplexTable from "views/admin/default/components/ComplexTable";
import DailyTraffic from "views/admin/default/components/DailyTraffic";
import PieCard from "views/admin/default/components/PieCard";
import Tasks from "views/admin/default/components/Tasks";
import EarnAndSpendEachYear from "views/admin/default/components/EarnAndSpendEachYear";
import YearReport from "views/admin/default/components/YearReport";
import {
  columnsDataCheck,
  columnsDataComplex,
} from "views/admin/default/variables/columnsData";
import tableDataCheck from "views/admin/default/variables/tableDataCheck.json";
import tableDataComplex from "views/admin/default/variables/tableDataComplex.json";
import { getTotalEarnData } from "api/dashboard";
import { getTotalExpenseData } from "api/dashboard";
import { FaMoneyBill } from "react-icons/fa";
import { getYearsReportData } from "api/dashboard";

export default function UserReports() {
  // Chakra Color Mode
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");

  useEffect(() => {
    getEarnAndSpendEachYear(new Date().getFullYear());
    getTotalEarn();
    getTotalExpense();
    getYearsReport();
  }, []);

  const [earnAndSpendEachYear, setEarnAndSpendEachYear] = useState({});
  const [totalEarn, setTotalEarn] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [yearsReport, setYearsReport] = useState([]);


  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3, "2xl": 6 }}
        gap='20px'
        mb='20px'>
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={
                <Icon w='32px' h='32px' as={MdAttachMoney} color={brandColor} />
              }
            />
          }
          name='รายได้ทั้งหมด'
          textColor={useColorModeValue("blue.500", "blue.200")}
          // show value of totalEarn as localstring
          value={totalEarn.toLocaleString() + ' บาท'}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={
                <Icon w='32px' h='32px' as={MdMoneyOff} color={brandColor} />
              }
            />
          }
          textColor={useColorModeValue("red.500", "red.200")}
          name='รายจ่ายทั้งหมด'
          value={totalExpense.toLocaleString() + ' บาท'}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={
                <Icon w='32px' h='32px' as={FaMoneyBill} color={brandColor} />
              }
            />
          }
        textColor={totalEarn - totalExpense > 0 ? "green.500" : "red.500"}
          growth={((totalEarn - totalExpense) / totalEarn).toFixed(2)*100 + '%'}
        name='กำไร' value={((totalEarn - totalExpense)).toLocaleString() + ' บาท'} />
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg='linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)'
              icon={<Icon w='28px' h='28px' as={MdAddTask} color='white' />}
            />
          }
          name='งานที่กำลังดำเนินการ'
          value='154'
        />
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={
                <Icon w='32px' h='32px' as={MdFileCopy} color={brandColor} />
              }
            />
          }
          name='งานทั้งหมด'
          value='2935'
        />
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px' mb='20px'>
        <EarnAndSpendEachYear data={earnAndSpendEachYear} selectActiveYear={getEarnAndSpendEachYear} />
        <YearReport data={yearsReport} />
      </SimpleGrid>
      <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap='20px' mb='20px'>
        <CheckTable columnsData={columnsDataCheck} tableData={tableDataCheck} />
        <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px'>
          <DailyTraffic />
          <PieCard />
        </SimpleGrid>
      </SimpleGrid>
      <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap='20px' mb='20px'>
        <ComplexTable
          columnsData={columnsDataComplex}
          tableData={tableDataComplex}
        />
        <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px'>
          <Tasks />
          <MiniCalendar h='100%' minW='100%' selectRange={false} />
        </SimpleGrid>
      </SimpleGrid>
    </Box>
  );

  async function getEarnAndSpendEachYear(year) {
    const res = await getEarnAndSpendEachYearData(year);
    if ( res) {
      setEarnAndSpendEachYear(res.data);
    }
  }

  async function getTotalEarn() {
    const res = await getTotalEarnData();
    if ( res) {
      setTotalEarn(res.data);
    }
  }

  async function getTotalExpense() {
    const res = await getTotalExpenseData();
    if ( res) {
      setTotalExpense(res.data);
    }
  }

  async function getYearsReport() {
    const res = await getYearsReportData();
    if ( res) {
      setYearsReport(res.data);
    }
  }
}
