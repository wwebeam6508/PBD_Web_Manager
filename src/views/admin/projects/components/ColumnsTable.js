import {
  Button,
  Flex,
  Icon,
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
import Menu from "components/menu/MainMenu";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
export default function ColumnsTable(props) {
  const { columnsData, tableData, setting, selectSort } = props;
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
        <Button>เพิ่ม +</Button>
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
                      {column.id === "date" &&
                        columnsDataE[index].isSort &&
                        (columnsDataE[index].sort === "desc" ? (
                          <TriangleDownIcon />
                        ) : (
                          <TriangleUpIcon />
                        ))}
                      {column.id === "dateEnd" &&
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
                  } else if (cell.column.id === "contractor") {
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
