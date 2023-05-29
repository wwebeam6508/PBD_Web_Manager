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
import { Box, SimpleGrid } from "@chakra-ui/react";
import ColumnsTable from "views/admin/projects/components/ColumnsTable";
import React, { useEffect } from "react";
import { getProjects } from "api/projects";
import { projectDataColumns } from "./variables/columnsData";
import moment from "moment";

export default function Settings() {

  useEffect(() => {
    getProjectsData();
  }, []);

  const [projects, setProjects] = React.useState([]);

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid
        mb='20px'
        columns={{ sm: 1, md: 1 }}
        spacing={{ base: "20px", xl: "20px" }}>
        <ColumnsTable
          columnsData={projectDataColumns}
          tableData={projects}
        />
      </SimpleGrid>
    </Box>
  );

  async function getProjectsData() {
    const result = await getProjects({ page: 1 });
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
      setProjects(resultData);
    }
  }
}
