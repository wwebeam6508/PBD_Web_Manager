import { Box, SimpleGrid, useDisclosure } from "@chakra-ui/react";
import ColumnsTable from "/views/admin/inventory/components/ColumnsTable";
import React, { useState, useContext, useEffect } from "react";
import { getInventory, deleteInventory } from "/api/inventory";
import { userDataColumns } from "./variables/columnsData";
import PaginationButton from "/components/pagination/PaginationButton";
import { LoadingContext } from "/contexts/LoadingContext";
import FormInventoryModal from "/components/modals/inventoryModal/FormInventoryModal";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
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
    getInventoryData(
      defaultSetting.page,
      defaultSetting.firstSort,
      defaultSetting.orderBy
    );
  }, []);

  const [inventories, setInventory] = React.useState([]);
  const [pages, setPages] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState("1");
  const [lastPage, setLastPage] = React.useState("1");

  const [editInventoryID, setEditInventoryID] = useState(null);

  const [searchBar, setSearchBar] = useState("");
  const [searchFilterBar, setSearchFilterBar] = useState("name");

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <FormInventoryModal
        closeModal={onCloseModal}
        stateOpen={isOpen}
        isEdit={isEdit}
        inventoryID={editInventoryID}
      />
      <SimpleGrid
        mb="20px"
        columns={{ sm: 1, md: 1 }}
        spacing={{ base: "20px", xl: "20px" }}
      >
        <ColumnsTable
          columnsData={userDataColumns}
          tableData={inventories}
          setting={defaultSetting}
          selectSort={selectSortData}
          setAddFormOpen={setAddFormOpen}
          setDeleteData={deleteInventoryData}
          selectEdit={selectEditData}
          searchBar={searchBar}
          setSearchBar={setSearchBar}
          searchFilterBar={searchFilterBar}
          setSearchFilter={setSearchFilterBar}
          searchTrigger={() => {
            getInventoryData(
              1,
              defaultSetting.firstSort,
              defaultSetting.orderBy
            );
          }}
        />
      </SimpleGrid>
      {inventories.length > 0 && (
        <PaginationButton
          setPage={(pageNum) => {
            getInventoryData(
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

  async function getInventoryData(
    selectPage = 1,
    sortTitle = "",
    sortType = ""
  ) {
    try {
      showLoading();
      const result = await getInventory({
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
          setInventory([]);
          return MySwal.fire("ไม่พบข้อมูล", "ไม่พบข้อมูลที่ค้นหา", "warning");
        }
        setInventory(result.data);
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
    getInventoryData(currentPage, sortTitle, sortType);
  }

  function deleteInventoryData(inventoryID) {
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
        const res = await deleteInventory(inventoryID);
        if (res) {
          if (res.code === 200) {
            MySwal.fire(
              "ลบเรียบร้อย!",
              "ประเภทผู้ใช้ถูกลบเรียบร้อยแล้ว",
              "success"
            );
            await getInventoryData(
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

  function selectEditData(inventoryID) {
    setEditInventoryID(inventoryID);
    setEdit(true);
    onOpen();
  }

  function onCloseModal() {
    setEditInventoryID(null);
    setEdit(false);
    getInventoryData(
      currentPage,
      defaultSetting.firstSort,
      defaultSetting.orderBy
    );
    onClose();
  }
}
