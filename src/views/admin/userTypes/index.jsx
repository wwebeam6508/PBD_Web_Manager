import { Box, SimpleGrid, useDisclosure } from "@chakra-ui/react";
import ColumnsTable from "/views/admin/userTypes/components/ColumnsTable";
import React, { useState, useContext, useEffect } from "react";
import { getUserType } from "/api/userTypes";
import { userDataColumns } from "./variables/columnsData";
import moment from "moment";
import PaginationButton from "/components/pagination/PaginationButton";
import { LoadingContext } from "/contexts/LoadingContext";
import FormUserTypeModal from "/components/modals/userTypeModal/FormUserTypeModal";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { deleteUserType } from "/api/userTypes";
const MySwal = withReactContent(Swal);

export default function Settings() {
  const { showLoading, hideLoading } = useContext(LoadingContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isEdit, setEdit] = useState(false);

  const [defaultSetting, setDefaultSetting] = useState({
    page: 1,
    pageSize: 10,
    firstSort: "date",
    orderBy: "desc",
  });

  useEffect(() => {
    getUserTypeData(
      defaultSetting.page,
      defaultSetting.firstSort,
      defaultSetting.orderBy
    );
  }, []);

  const [userTypes, setUserTypes] = React.useState([]);
  const [pages, setPages] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState("1");
  const [lastPage, setLastPage] = React.useState("1");

  const [editUserTypeID, setEditUserTypeID] = useState(null);

  const [searchBar, setSearchBar] = useState("");
  const [searchFilterBar, setSearchFilterBar] = useState("username");

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <FormUserTypeModal
        closeModal={onCloseModal}
        stateOpen={isOpen}
        isEdit={isEdit}
        userTypeID={editUserTypeID}
      />
      <SimpleGrid
        mb="20px"
        columns={{ sm: 1, md: 1 }}
        spacing={{ base: "20px", xl: "20px" }}
      >
        <ColumnsTable
          columnsData={userDataColumns}
          tableData={userTypes}
          setting={defaultSetting}
          selectSort={selectSortData}
          setAddFormOpen={setAddFormOpen}
          setDeleteData={deleteUserTypeData}
          selectEdit={selectEditData}
          searchBar={searchBar}
          setSearchBar={setSearchBar}
          searchFilterBar={searchFilterBar}
          setSearchFilter={setSearchFilterBar}
          searchTrigger={() => {
            getUserTypeData(
              1,
              defaultSetting.firstSort,
              defaultSetting.orderBy
            );
          }}
        />
      </SimpleGrid>
      {userTypes.length > 0 && (
        <PaginationButton
          setPage={(pageNum) => {
            getUserTypeData(
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

  async function getUserTypeData(
    selectPage = 1,
    sortTitle = "",
    sortType = ""
  ) {
    showLoading();
    const result = await getUserType({
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
        return returnData;
      });
      setLastPage(result.lastPage);
      setCurrentPage(result.currentPage);
      setPages(result.pages);
      setUserTypes(resultData);
    }
    hideLoading();
  }

  function selectSortData(sortTitle, sortType) {
    setDefaultSetting({
      ...defaultSetting,
      firstSort: sortTitle,
      orderBy: sortType,
    });
    getUserTypeData(currentPage, sortTitle, sortType);
  }

  function deleteUserTypeData(userTypeID) {
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
        const res = await deleteUserType(userTypeID);
        if (res) {
          if (res.message === "success") {
            MySwal.fire(
              "ลบเรียบร้อย!",
              "ประเภทผู้ใช้ถูกลบเรียบร้อยแล้ว",
              "success"
            );
            await getUserTypeData(
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

  function selectEditData(userTypeID) {
    setEditUserTypeID(userTypeID);
    setEdit(true);
    onOpen();
  }

  function onCloseModal() {
    setEditUserTypeID(null);
    setEdit(false);
    getUserTypeData(
      currentPage,
      defaultSetting.firstSort,
      defaultSetting.orderBy
    );
    onClose();
  }
}
