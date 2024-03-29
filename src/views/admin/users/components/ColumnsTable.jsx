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
import Card from "/components/card/Card";
import {
  DeleteIcon,
  EditIcon,
  SearchIcon,
  TriangleDownIcon,
  TriangleUpIcon,
} from "@chakra-ui/icons";
import { RangeDatepicker } from "chakra-dayzed-datepicker";
import { isEmpty } from "/util/helper";
import { useSelector } from "react-redux";
export default function ColumnsTable(props) {
  const {
    columnsData,
    tableData,
    setting,
    selectSort,
    setAddFormOpen,
    selectEdit,
    setDeleteData,
    setSearchBar,
    setSearchFilter,
    searchBar,
    searchFilterBar,
    searchTrigger,
  } = props;
  const [columnsDataE, setColumnsDataE] = useState(columnsData);
  const columns = useMemo(() => columnsData, [columnsData]);
  const data = useMemo(() => tableData, [tableData]);
  const userID = useSelector((state) => state.auth.user.userProfile.userID);
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

  const selectedDates = () => {
    return searchBar.split(",").length === 2 &&
      !isEmpty(searchBar.split(",")[1])
      ? [new Date(searchBar.split(",")[0]), new Date(searchBar.split(",")[1])]
      : !isEmpty(searchBar.split(",")[0]) && isEmpty(searchBar.split(",")[1])
      ? [new Date(searchBar.split(",")[0])]
      : [new Date()];
  };

  const auth = useSelector((state) => state.auth);
  const permissions = auth.user
    ? auth.user.userProfile.userType.permission.user
    : null;

  const permissionCheck = (permission) => {
    if (permissions) {
      //check permission include in object
      if (permissions[permission]) {
        return true;
      }
    }
    return false;
  };

  return (
    <Card
      direction="column"
      w="100%"
      px="0px"
      overflowX={{ sm: "scroll", lg: "hidden" }}
      style={{ minHeight: "50vh" }}
    >
      <Flex px="25px" justify="space-between" mb="20px" align="center">
        <Text
          color={textColor}
          fontSize="22px"
          fontWeight="700"
          lineHeight="100%"
        >
          ผู้ใช้งาน
        </Text>
        <Flex w="30%" align="center">
          {searchFilterBar === "profit" ? (
            <Flex w="80%" justify="space-between">
              <Input
                w="45%"
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
                value={searchBar ? searchBar.split(",")[0] : ""}
                onChange={(e) => {
                  const x = e.target.value;
                  const y = searchBar ? searchBar.split(",")[1] : "";
                  if (x === "" && y === "") {
                    setSearchBar("");
                    return;
                  }
                  setSearchBar(`${x},${y}`);
                }}
              />
              <Input
                w="45%"
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
                value={searchBar ? searchBar.split(",")[1] : ""}
                onChange={(e) => {
                  const x = searchBar ? searchBar.split(",")[0] : "";
                  const y = e.target.value;
                  if (x === "" && y === "") {
                    setSearchBar("");
                    return;
                  }
                  setSearchBar(`${x},${y}`);
                }}
              />
            </Flex>
          ) : searchFilterBar === "date" ? (
            <RangeDatepicker
              selectedDates={selectedDates()}
              onDateChange={(date) => {
                if (date.length === 0) {
                  setSearchBar("");
                  return;
                }
                if (date.length === 1) {
                  setSearchBar(`${new Date(date[0]).toISOString()},`);
                }
                if (date.length === 2) {
                  setSearchBar(
                    `${new Date(date[0]).toISOString()},${new Date(
                      date[1]
                    ).toISOString()}`
                  );
                }
              }}
            />
          ) : (
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
              value={searchBar}
              onChange={(e) => setSearchBar(e.target.value)}
            />
          )}

          <Select
            name="searchfilter"
            fontSize="sm"
            width="unset"
            variant="subtle"
            value={searchFilterBar}
            onChange={(e) => {
              setSearchFilter(e.target.value);
              setSearchBar("");
            }}
          >
            <option value="username">ชื่อผู้ใช้</option>
            <option value="userType">ประเภทผู้ใช้</option>
            <option value="date">วันที่สร้าง</option>
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
        {permissionCheck("canEdit") && (
          <Button onClick={setAddFormOpen}>เพิ่ม +</Button>
        )}
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
                      {columnsDataE[index].isSort &&
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
                  if (cell.column.id === "username") {
                    data = (
                      <Flex align="center">
                        <Text color={textColor} fontSize="sm" fontWeight="700">
                          {cell.value}
                        </Text>
                      </Flex>
                    );
                  } else if (cell.column.id === "userType") {
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
                  } else if (cell.column.id === "date") {
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
                  {userID !== row.original.userID && (
                    <Flex justify="space-around">
                      {permissionCheck("canEdit") && (
                        <IconButton
                          aria-label="edit"
                          icon={<EditIcon />}
                          size="sm"
                          colorScheme="blue"
                          onClick={() => selectEdit(row.original.userID)}
                        />
                      )}
                      {permissionCheck("canRemove") && (
                        <IconButton
                          aria-label="delete"
                          icon={<DeleteIcon />}
                          size="sm"
                          colorScheme="red"
                          onClick={() => setDeleteData(row.original.userID)}
                        />
                      )}
                    </Flex>
                  )}
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
