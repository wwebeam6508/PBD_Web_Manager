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
import ColumnsTable from "/views/admin/users/components/ColumnsTable";
import React, { useState, useContext, useEffect } from "react";
import { getUser } from "/api/users";
import { userDataColumns } from "./variables/columnsData";
import moment from "moment";
import PaginationButton from "/components/pagination/PaginationButton";
import { LoadingContext } from "/contexts/LoadingContext";
import FormUserModal from "/components/modals/userModal/FormUserModal";
import { getUserType } from "/api/users";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { deleteUser } from "/api/users";
const MySwal = withReactContent(Swal);

export default function Settings() {
  const { showLoading, hideLoading } = useContext(LoadingContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isEdit, setEdit] = useState(false);
  const [userTypes, setUserTypes] = useState([]);

  const [defaultSetting, setDefaultSetting] = useState({
    page: 1,
    pageSize: 10,
    firstSort: "date",
    orderBy: "desc",
  });

  useEffect(() => {
    getUserData(
      defaultSetting.page,
      defaultSetting.firstSort,
      defaultSetting.orderBy
    );
    getUserType().then((res) => {
      if (res) {
        let userTypeData = res.data;
        userTypeData.unshift({ id: "", name: "กรุณาเลือกประเภทผู้ใช้" });
        setUserTypes(userTypeData);
      }
    });
  }, []);

  const [users, setUsers] = React.useState([]);
  const [pages, setPages] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState("1");
  const [lastPage, setLastPage] = React.useState("1");

  const [editUserID, setEditUserID] = useState(null);

  const [searchBar, setSearchBar] = useState("");
  const [searchFilterBar, setSearchFilterBar] = useState("username");

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <FormUserModal
        closeModal={onCloseModal}
        stateOpen={isOpen}
        isEdit={isEdit}
        userTypes={userTypes}
        userID={editUserID}
      />
      <SimpleGrid
        mb="20px"
        columns={{ sm: 1, md: 1 }}
        spacing={{ base: "20px", xl: "20px" }}
      >
        <ColumnsTable
          columnsData={userDataColumns}
          tableData={users}
          setting={defaultSetting}
          selectSort={selectSortData}
          setAddFormOpen={setAddFormOpen}
          setDeleteData={deleteUserData}
          selectEdit={selectEditData}
          searchBar={searchBar}
          setSearchBar={setSearchBar}
          searchFilterBar={searchFilterBar}
          setSearchFilter={setSearchFilterBar}
          searchTrigger={() => {
            getUserData(1, defaultSetting.firstSort, defaultSetting.orderBy);
          }}
        />
      </SimpleGrid>
      {users.length > 0 && (
        <PaginationButton
          setPage={(pageNum) => {
            getUserData(
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

  async function getUserData(selectPage = 1, sortTitle = "", sortType = "") {
    try {
      showLoading();
      const result = await getUser({
        page: selectPage,
        pageSize: defaultSetting.pageSize,
        sortTitle: sortTitle,
        sortType: sortType,
        search: searchBar,
        searchFilter: searchFilterBar,
      });
      if (result) {
        if (result.data) {
          const resultData = result.data.map((item) => {
            let returnData = item;
            if (returnData.date) {
              returnData.date = moment(returnData.date)
                .add(543, "year")
                .format("DD.MM.YYYY");
            }
            return returnData;
          });
          setUsers(resultData);
        } else {
          setUsers([]);
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
    getUserData(currentPage, sortTitle, sortType);
  }

  function deleteUserData(userID) {
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
        const res = await deleteUser(userID);
        if (res) {
          if (res.code === 200) {
            MySwal.fire("ลบเรียบร้อย!", "โครงการถูกลบเรียบร้อยแล้ว", "success");
            await getUserData(
              currentPage,
              defaultSetting.firstSort,
              defaultSetting.orderBy
            );
          } else {
            MySwal.fire("ลบไม่สำเร็จ!", res.message, "error");
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

  function selectEditData(userID) {
    setEditUserID(userID);
    setEdit(true);
    onOpen();
  }

  function onCloseModal() {
    setEditUserID(null);
    setEdit(false);
    getUserData(currentPage, defaultSetting.firstSort, defaultSetting.orderBy);
    onClose();
  }
}
