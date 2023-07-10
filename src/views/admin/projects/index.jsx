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
import ColumnsTable from "views/admin/projects/components/ColumnsTable";
import React, {useState, useContext, useEffect } from "react";
import { getProjects } from "api/projects";
import { projectDataColumns } from "./variables/columnsData";
import moment from "moment";
import PaginationButton from "components/pagination/PaginationButton";
import { LoadingContext } from "contexts/LoadingContext";
import FormProjectModal from "components/modals/projectModal/FormProjectModal";
import { getCustomerName } from "api/projects";

export default function Settings() {

  const { showLoading, hideLoading } = useContext(LoadingContext);
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [ isEdit , setEdit ] = useState(false);
  const [ customers, setCustomers ] = useState([]);

  const [defaultSetting, setDefaultSetting] = useState({
    page: 1,
    pageSize: 10,
    firstSort: "date",
    orderBy: "desc"
  });

  useEffect(() => {
    getProjectsData(defaultSetting.page, defaultSetting.firstSort, defaultSetting.orderBy);
    getCustomerName().then((res) => {
        setCustomers(res.data)
      }
    )
  }, []);

  const [projects, setProjects] = React.useState([]);
  const [pages, setPages] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState("1");
  const [lastPage, setLastPage] = React.useState("1");

  const [ editProjectID, setEditProjectID ] = useState(null);

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <FormProjectModal closeModal={onCloseModal} stateOpen={isOpen} isEdit={isEdit} customers={customers} projectID={editProjectID}/>
      <SimpleGrid
        mb='20px'
        columns={{ sm: 1, md: 1 }}
        spacing={{ base: "20px", xl: "20px" }}>
        <ColumnsTable
          columnsData={projectDataColumns}
          tableData={projects}
          setting={defaultSetting}
          selectSort={selectSortData}
          setAddFormOpen={setAddFormOpen}

          selectEdit={selectEditData}
        />
      </SimpleGrid>
      {
        projects.length > 0 && (
          <PaginationButton setPage={getProjectsData} pages={pages} currentPage={currentPage} lastPage={lastPage} />
        )
      }
    </Box>
  );

  async function getProjectsData(selectPage = 1, sortTitle = "", sortType = "") {
    showLoading();
    const result = await getProjects({ page: selectPage, pageSize: defaultSetting.pageSize, sortTitle:sortTitle, sortType:sortType });
    if (result) {
      const resultData = result.data.map((item) => {
        let returnData = item
        if (returnData.date) {
          returnData.date = moment(returnData.date).format('DD.MM.YYYY')
        }
        if (returnData.dateEnd) {
          returnData.dateEnd = moment(returnData.dateEnd).format('DD.MM.YYYY')
        }
        return returnData
      });
      setLastPage(result.lastPage);
      setCurrentPage(result.currentPage);
      setPages(result.pages);
      setProjects(resultData);
      
    }
    hideLoading();
  }

  function selectSortData (sortTitle, sortType) {
    setDefaultSetting({
      ...defaultSetting,
      firstSort: sortTitle,
      orderBy: sortType
    })
    getProjectsData(currentPage, sortTitle, sortType)
  }

  function setAddFormOpen () {
    onOpen()
    setEdit(false)
  }

  function selectEditData (projectID) {
    setEditProjectID(projectID)
    setEdit(true)
    onOpen()
  }
  
  function onCloseModal () {
    setEditProjectID(null)
    setEdit(false)
    onClose()
  }
}
