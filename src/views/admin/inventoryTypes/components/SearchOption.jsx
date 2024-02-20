import { SearchIcon } from "@chakra-ui/icons";
import { Button, Flex, Icon, Input, Select } from "@chakra-ui/react";

export default function SearchOption(props) {
  const {
    searchBar,
    setSearchBar,
    searchFilterBar,
    setSearchFilter,
    searchTrigger,
  } = props;
  return (
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
        value={searchBar}
        onChange={(e) => setSearchBar(e.target.value)}
      />

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
        <option value="name">ชื่อประเภทของใช้</option>
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
  );
}
