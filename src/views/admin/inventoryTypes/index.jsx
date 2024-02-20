import { Box, SimpleGrid, useDisclosure } from "@chakra-ui/react";
import ColumnsTable from "/views/admin/inventoryTypes/components/ColumnsTable";
import React, { useState, useContext, useEffect } from "react";
import { getInventoryType } from "/api/inventoryTypes";
import { userDataColumns } from "./variables/columnsData";
import moment from "moment";
import PaginationButton from "/components/pagination/PaginationButton";
import { LoadingContext } from "/contexts/LoadingContext";
import FormInventoryTypeModal from "/components/modals/inventoryTypeModal/FormInventoryTypeModal";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { deleteInventoryType } from "/api/inventoryTypes";
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
    getInventoryTypeData(
      defaultSetting.page,
      defaultSetting.firstSort,
      defaultSetting.orderBy
    );
  }, []);

  const [inventoryTypes, setInventoryTypes] = React.useState([]);
  const [pages, setPages] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState("1");
  const [lastPage, setLastPage] = React.useState("1");

  const [editInventoryTypeID, setEditInventoryTypeID] = useState(null);

  const [searchBar, setSearchBar] = useState("");
  const [searchFilterBar, setSearchFilterBar] = useState("username");

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <FormInventoryTypeModal
        closeModal={onCloseModal}
        stateOpen={isOpen}
        isEdit={isEdit}
        inventoryTypeID={editInventoryTypeID}
      />
      <SimpleGrid
        mb="20px"
        columns={{ sm: 1, md: 1 }}
        spacing={{ base: "20px", xl: "20px" }}
      >
        <ColumnsTable
          columnsData={userDataColumns}
          tableData={inventoryTypes}
          setting={defaultSetting}
          selectSort={selectSortData}
          setAddFormOpen={setAddFormOpen}
          setDeleteData={deleteInventoryTypeData}
          selectEdit={selectEditData}
          searchBar={searchBar}
          setSearchBar={setSearchBar}
          searchFilterBar={searchFilterBar}
          setSearchFilter={setSearchFilterBar}
          searchTrigger={() => {
            getInventoryTypeData(
              1,
              defaultSetting.firstSort,
              defaultSetting.orderBy
            );
          }}
        />
      </SimpleGrid>
      {inventoryTypes.length > 0 && (
        <PaginationButton
          setPage={(pageNum) => {
            getInventoryTypeData(
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

  async function getInventoryTypeData(
    selectPage = 1,
    sortTitle = "",
    sortType = ""
  ) {
    try {
      showLoading();
      const result = await getInventoryType({
        page: selectPage,
        pageSize: defaultSetting.pageSize,
        sortTitle: sortTitle,
        sortType: sortType,
        search: searchBar,
        searchFilter: searchFilterBar,
      });
      if (result) {
        setLastPage(result.lastPage);
        setCurrentPage(result.currentPage);
        setPages(result.pages);
        if (!result.data) {
          setInventoryTypes([]);
          return MySwal.fire("ไม่พบข้อมูล", "ไม่พบข้อมูลที่ค้นหา", "warning");
        }
        setInventoryTypes(result.data);
      }
    } catch (error) {
      MySwal.fire("เกิดข้อผิดพลาด!", error.message, "error");
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
    getInventoryTypeData(currentPage, sortTitle, sortType);
  }

  function deleteInventoryTypeData(inventoryTypeID) {
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
        const res = await deleteInventoryType(inventoryTypeID);
        if (res) {
          if (res.code === 200) {
            MySwal.fire(
              "ลบเรียบร้อย!",
              "ประเภทผู้ใช้ถูกลบเรียบร้อยแล้ว",
              "success"
            );
            await getInventoryTypeData(
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

  function selectEditData(inventoryTypeID) {
    setEditInventoryTypeID(inventoryTypeID);
    setEdit(true);
    onOpen();
  }

  function onCloseModal() {
    setEditInventoryTypeID(null);
    setEdit(false);
    getInventoryTypeData(
      currentPage,
      defaultSetting.firstSort,
      defaultSetting.orderBy
    );
    onClose();
  }
}
