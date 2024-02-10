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
import { Box, SimpleGrid, useDisclosure } from "@chakra-ui/react";
import ColumnsTable from "/views/admin/expenses/components/ColumnsTable";
import React, { useState, useContext, useEffect } from "react";
import { getExpenses } from "/api/expenses";
import { expenseDataColumns } from "./variables/columnsData";
import moment from "moment";
import PaginationButton from "/components/pagination/PaginationButton";
import { LoadingContext } from "/contexts/LoadingContext";
import FormExpenseModal from "/components/modals/expenseModal/FormExpenseModal";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { deleteExpense } from "/api/expenses";
import { getProjectTitle } from "/api/expenses";
import { getSellerName } from "/api/expenses";
const MySwal = withReactContent(Swal);

export default function Settings() {
  const { showLoading, hideLoading } = useContext(LoadingContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isEdit, setEdit] = useState(false);
  const [projects, setProjects] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [defaultSetting, setDefaultSetting] = useState({
    page: 1,
    pageSize: 10,
    firstSort: "date",
    orderBy: "desc",
  });

  useEffect(() => {
    getExpensesData(
      defaultSetting.page,
      defaultSetting.firstSort,
      defaultSetting.orderBy
    );
    getProjectTitle().then((res) => {
      if (res) {
        let projectData = res.data;
        projectData.unshift({ id: "none", title: "ไม่มี" });
        setProjects(projectData);
      }
    });
    getSellerName().then((res) => {
      if (res) {
        let customerData = res.data;
        customerData.unshift({ id: "none", name: "ไม่มี" });
        setCustomers(customerData);
      }
    });
  }, []);

  const [expenses, setExpenses] = React.useState([]);
  const [pages, setPages] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState("1");
  const [lastPage, setLastPage] = React.useState("1");

  const [editExpenseID, setEditExpenseID] = useState(null);

  const [searchBar, setSearchBar] = useState("");
  const [searchFilterBar, setSearchFilterBar] = useState("title");
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <FormExpenseModal
        closeModal={onCloseModal}
        stateOpen={isOpen}
        isEdit={isEdit}
        projects={projects}
        customers={customers}
        expenseID={editExpenseID}
      />
      <SimpleGrid
        mb="20px"
        columns={{ sm: 1, md: 1 }}
        spacing={{ base: "20px", xl: "20px" }}
      >
        <ColumnsTable
          columnsData={expenseDataColumns}
          tableData={expenses}
          setting={defaultSetting}
          selectSort={selectSortData}
          setAddFormOpen={setAddFormOpen}
          setDelete={deleteExpenseData}
          selectEdit={selectEditData}
          searchBar={searchBar}
          setSearchBar={setSearchBar}
          searchFilterBar={searchFilterBar}
          setSearchFilter={setSearchFilterBar}
          searchTrigger={() => {
            getExpensesData(
              1,
              defaultSetting.firstSort,
              defaultSetting.orderBy
            );
          }}
        />
      </SimpleGrid>
      {expenses.length > 0 && (
        <PaginationButton
          setPage={(pageNum) => {
            getExpensesData(
              pageNum,
              defaultSetting.firstSort,
              defaultSetting.orderBy
            );
          }}
          pages={pages}
          currentPage={currentPage}
          lastPage={lastPage}
        />
      )}
    </Box>
  );

  async function getExpensesData(
    selectPage = 1,
    sortTitle = "",
    sortType = ""
  ) {
    showLoading();
    const result = await getExpenses({
      page: selectPage,
      pageSize: defaultSetting.pageSize,
      sortTitle: sortTitle,
      sortType: sortType,
      search: searchBar,
      searchFilter: searchFilterBar,
    });
    if (result) {
      const resultData = result.data.map((item) => {
        let returnData = item;
        if (returnData.date) {
          returnData.date = moment(returnData.date)
            .add(543, "year")
            .format("DD.MM.YYYY");
        }
        if (returnData.dateEnd) {
          returnData.dateEnd = moment(returnData.dateEnd)
            .add(543, "year")
            .format("DD.MM.YYYY");
        }
        return returnData;
      });
      setLastPage(result.lastPage);
      setCurrentPage(result.currentPage);
      setPages(result.pages);
      setExpenses(resultData);
    }
    hideLoading();
  }

  function selectSortData(sortTitle, sortType) {
    setDefaultSetting({
      ...defaultSetting,
      firstSort: sortTitle,
      orderBy: sortType,
    });
    getExpensesData(currentPage, sortTitle, sortType);
  }

  function deleteExpenseData(expenseID) {
    MySwal.fire({
      title: "คุณแน่ใจหรือว่าจะลบ?",
      text: "คุณจะไม่สามารถย้อนกลับได้!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ใช่, ลบเลย!",
      cancelButtonText: "ไม่, ยกเลิก!",
      confirmButtonColor: "red",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        showLoading();
        const res = await deleteExpense(expenseID);
        if (res) {
          if (res.message === "success") {
            MySwal.fire("ลบเรียบร้อย!", "โครงการถูกลบเรียบร้อยแล้ว", "success");
            await getExpensesData(
              currentPage,
              defaultSetting.firstSort,
              defaultSetting.orderBy
            );
          }
        }
        hideLoading();
      }
    });
  }

  function setAddFormOpen() {
    onOpen();
    setEdit(false);
  }

  function selectEditData(expenseID) {
    setEditExpenseID(expenseID);
    setEdit(true);
    onOpen();
  }

  function onCloseModal() {
    setEditExpenseID(null);
    setEdit(false);
    getExpensesData(
      currentPage,
      defaultSetting.firstSort,
      defaultSetting.orderBy
    );
    onClose();
  }
}
