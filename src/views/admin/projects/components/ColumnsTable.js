import {
  Button,
  Flex,
  Icon,
  IconButton,
  Input,
  Select,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useEffect, useMemo, useState } from "react";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";

// Custom components
import Card from "components/card/Card";
import {
  DeleteIcon,
  EditIcon,
  SearchIcon,
  TriangleDownIcon,
  TriangleUpIcon,
} from "@chakra-ui/icons";
export default function ColumnsTable(props) {
  const {
    columnsData,
    tableData,
    setting,
    selectSort,
    setAddFormOpen,
    selectEdit,
    setDeleteProjectData,
    setSearchBar,
    setSearchFilter,
    searchTrigger,
  } = props;
  const [columnsDataE, setColumnsDataE] = useState(columnsData);
  const columns = useMemo(() => columnsData, [columnsData]);
  const data = useMemo(() => tableData, [tableData]);
  useEffect(() => {
    if (setting) {
      columnsDataE.forEach((column) => {
        if (setting.firstSort === column.accessor) {
          setColumnsDataE((prev) => {
            return prev.map((col) => {
              if (col.accessor === column.accessor) {
                return { ...col, isSort: true, sort: setting.orderBy };
              }
              return col;
            });
          });
        } else {
          setColumnsDataE((prev) => {
            return prev.map((col) => {
              if (col.accessor === column.accessor) {
                return { ...col, isSort: false };
              }
              return col;
            });
          });
        }
      });
    }
  }, [setting]);

  const tableInstance = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    initialState,
  } = tableInstance;
  initialState.pageSize = 999;

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  return (
    <Card
      direction="column"
      w="100%"
      px="0px"
      overflowX={{ sm: "scroll", lg: "hidden" }}
    >
      <Flex px="25px" justify="space-between" mb="20px" align="center">
        <Text
          color={textColor}
          fontSize="22px"
          fontWeight="700"
          lineHeight="100%"
        >
          งาน
        </Text>
        <Flex w="30%" align="center">
          <Input
            w="80%"
            name="search"
            placeholder="ค้นหา"
            borderRadius="10px"
            borderColor="gray.200"
            fontSize="sm"
            _placeholder={{
              color: "gray.400",
            }}
            _focus={{
              borderColor: "gray.200",
            }}
            value={props.searchBar}
            onChange={(e) => props.setSearchBar(e.target.value)}
          />
          <Select
            name="searchfilter"
            fontSize="sm"
            width="unset"
            variant="subtle"
            value={props.searchFilter}
            onChange={(e) => props.setSearchFilter(e.target.value)}
          >
            <option value="title">ชื่องาน</option>
            <option value="customer">ชื่อผู้ว่าจ้าง</option>
          </Select>
          <Button onClick={searchTrigger} marginLeft="10px">
            <Icon
              as={SearchIcon}
              color="gray.400"
              fontSize="20px"
              cursor="pointer"
            />
          </Button>
        </Flex>

        <Button onClick={setAddFormOpen}>เพิ่ม +</Button>
      </Flex>
      <Table {...getTableProps()} variant="simple" color="gray.500" mb="24px">
        <Thead>
          {headerGroups.map((headerGroup, index) => (
            <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
              {headerGroup.headers.map((column, index) => (
                <Th
                  // {...column.getHeaderProps(column.getSortByToggleProps())}
                  pe="10px"
                  key={index}
                  borderColor={borderColor}
                >
                  <Flex
                    justify="space-between"
                    align="center"
                    fontSize={{ sm: "10px", lg: "12px" }}
                  >
                    <Flex
                      color="gray.400"
                      justify="space-around"
                      cursor={column.sort ? "pointer" : "default"}
                      onClick={() => {
                        if (column.sort) {
                          selectSort(
                            column.id,
                            sortCondition(columnsDataE[index].sort)
                          );
                        }
                      }}
                    >
                      {column.render("Header")}
                      {column.id === "profit" &&
                        columnsDataE[index].isSort &&
                        (columnsDataE[index].sort === "desc" ? (
                          <TriangleDownIcon />
                        ) : (
                          <TriangleUpIcon />
                        ))}

                      {column.id === "date" &&
                        columnsDataE[index].isSort &&
                        (columnsDataE[index].sort === "desc" ? (
                          <TriangleDownIcon />
                        ) : (
                          <TriangleUpIcon />
                        ))}
                    </Flex>
                  </Flex>
                </Th>
              ))}
              <Th pe="10px" borderColor={borderColor}>
                <Flex
                  justify="space-between"
                  align="center"
                  fontSize={{ sm: "10px", lg: "12px" }}
                >
                  <Flex color="gray.400" justify="space-around">
                    จัดการ
                  </Flex>
                </Flex>
              </Th>
            </Tr>
          ))}
        </Thead>
        <Tbody {...getTableBodyProps()}>
          {page.map((row, index) => {
            prepareRow(row);
            return (
              <Tr {...row.getRowProps()} key={index}>
                {row.cells.map((cell, index) => {
                  let data = "";
                  if (cell.column.id === "title") {
                    data = (
                      <Flex align="center">
                        <Text color={textColor} fontSize="sm" fontWeight="700">
                          {cell.value}
                        </Text>
                      </Flex>
                    );
                  } else if (cell.column.id === "customer") {
                    data = (
                      <Flex align="center">
                        <Text
                          me="10px"
                          color={textColor}
                          fontSize="sm"
                          fontWeight="700"
                        >
                          {cell.value}
                        </Text>
                      </Flex>
                    );
                  } else if (cell.column.id === "profit") {
                    data = (
                      <Text color={textColor} fontSize="sm" fontWeight="700">
                        {cell.value
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </Text>
                    );
                  } else if (cell.column.id === "date") {
                    data = (
                      <Text color={textColor} fontSize="sm" fontWeight="700">
                        {cell.value}
                      </Text>
                    );
                  } else if (cell.column.id === "dateEnd") {
                    data = (
                      <Text color={textColor} fontSize="sm" fontWeight="700">
                        {cell.value}
                      </Text>
                    );
                  }
                  return (
                    <Td
                      {...cell.getCellProps()}
                      key={index}
                      fontSize={{ sm: "14px" }}
                      minW={{ sm: "150px", md: "200px", lg: "auto" }}
                      borderColor="transparent"
                    >
                      {data}
                    </Td>
                  );
                })}
                <Td
                  borderColor="transparent"
                  fontSize={{ sm: "14px" }}
                  minW={{ sm: "150px", md: "200px", lg: "auto" }}
                >
                  <Flex justify="space-around">
                    <IconButton
                      aria-label="edit"
                      icon={<EditIcon />}
                      size="sm"
                      colorScheme="blue"
                      onClick={() => selectEdit(row.original.projectID)}
                    />
                    <IconButton
                      aria-label="delete"
                      icon={<DeleteIcon />}
                      size="sm"
                      colorScheme="red"
                      onClick={() =>
                        setDeleteProjectData(row.original.projectID)
                      }
                    />
                  </Flex>
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </Card>
  );

  function sortCondition(sort) {
    if (sort === "desc") {
      return "asc";
    } else if (sort === "asc") {
      return "desc";
    }
  }
}
