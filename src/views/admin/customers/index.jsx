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
import ColumnsTable from "/views/admin/customers/components/ColumnsTable";
import React, { useState, useContext, useEffect } from "react";
import { customerDataColumns } from "./variables/columnsData";
import PaginationButton from "/components/pagination/PaginationButton";
import { LoadingContext } from "/contexts/LoadingContext";
import FormCustomerModal from "/components/modals/customerModal/FormCustomerModal";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { getCustomers, deleteCustomer } from "/api/customers";
const MySwal = withReactContent(Swal);

export default function Settings() {
  const { showLoading, hideLoading } = useContext(LoadingContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isEdit, setEdit] = useState(false);

  const [defaultSetting, setDefaultSetting] = useState({
    page: 1,
    pageSize: 10,
    firstSort: "",
    orderBy: "",
  });

  useEffect(() => {
    getCustomersData(
      defaultSetting.page,
      defaultSetting.firstSort,
      defaultSetting.orderBy
    );
  }, []);

  const [customers, setCustomers] = React.useState([]);
  const [pages, setPages] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState("1");
  const [lastPage, setLastPage] = React.useState("1");

  const [editCustomerID, setEditCustomerID] = useState(null);

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <FormCustomerModal
        closeModal={onCloseModal}
        stateOpen={isOpen}
        isEdit={isEdit}
        customerID={editCustomerID}
      />
      <SimpleGrid
        mb="20px"
        columns={{ sm: 1, md: 1 }}
        spacing={{ base: "20px", xl: "20px" }}
      >
        <ColumnsTable
          columnsData={customerDataColumns}
          tableData={customers}
          setting={defaultSetting}
          selectSort={selectSortData}
          setAddFormOpen={setAddFormOpen}
          setDeleteProjectData={deleteCustomerData}
          selectEdit={selectEditData}
        />
      </SimpleGrid>
      {customers.length > 0 && (
        <PaginationButton
          setPage={(pageNum) => {
            getCustomersData(
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

  async function getCustomersData(
    selectPage = 1,
    sortTitle = "",
    sortType = ""
  ) {
    try {
      showLoading();
      const result = await getCustomers({
        page: selectPage,
        pageSize: defaultSetting.pageSize,
        sortTitle: sortTitle,
        sortType: sortType,
      });
      if (result) {
        if (!Array.isArray(result.data)) {
          setCustomers([]);
        } else {
          setCustomers(result.data);
        }
        setLastPage(result.lastPage);
        setCurrentPage(result.currentPage);
        setPages(result.pages);
      }
    } finally {
      hideLoading();
    }
  }

  function selectSortData(sortTitle, sortType) {
    setDefaultSetting({
      ...defaultSetting,
      firstSort: sortTitle,
      orderBy: sortType,
    });
    getCustomersData(currentPage, sortTitle, sortType);
  }

  function deleteCustomerData(customerID) {
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
        const res = await deleteCustomer(customerID);
        if (res) {
          if (res.code === 200) {
            MySwal.fire(
              "ลบเรียบร้อย!",
              "บริษัทหรือลูกค้าถูกลบเรียบร้อยแล้ว",
              "success"
            );
            await getCustomersData(
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

  function selectEditData(customerID) {
    setEditCustomerID(customerID);
    setEdit(true);
    onOpen();
  }

  function onCloseModal() {
    setEditCustomerID(null);
    setEdit(false);
    getCustomersData(
      currentPage,
      defaultSetting.firstSort,
      defaultSetting.orderBy
    );
    onClose();
  }
}
