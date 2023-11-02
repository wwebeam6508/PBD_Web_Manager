// Chakra Imports
import {
  Avatar,
  Button,
  Flex,
  Icon,
  Image,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
// Custom Components
import { SidebarResponsive } from "/components/sidebar/Sidebar";
import PropTypes from "prop-types";
import React from "react";
// Assets
import routes from "/routes";
import { store } from "/redux/store";
import { logout } from "/redux/auth/authAction";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

export default function HeaderLinks(props) {
  const { secondary } = props;
  // Chakra Color Mode
  let menuBg = useColorModeValue("white", "navy.800");
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("#E6ECFA", "rgba(135, 140, 189, 0.3)");
  const shadow = useColorModeValue(
    "14px 17px 40px 4px rgba(112, 144, 176, 0.18)",
    "14px 17px 40px 4px rgba(112, 144, 176, 0.06)"
  );

  const stateAuth = useSelector((state) => state.auth);
  return (
    <Flex
      w={{ sm: "100%", md: "auto" }}
      alignItems="center"
      flexDirection="row"
      bg={menuBg}
      flexWrap={secondary ? { base: "wrap", md: "nowrap" } : "unset"}
      p="10px"
      borderRadius="30px"
      boxShadow={shadow}
    >
      <SidebarResponsive routes={routes} />

      <Menu>
        <MenuButton p="0px">
          <Avatar
            _hover={{ cursor: "pointer" }}
            color="white"
            name={`${
              stateAuth.user ? stateAuth.user.userProfile.username : ""
            }`}
            bg="#11047A"
            size="sm"
            w="40px"
            h="40px"
          />
        </MenuButton>
        <MenuList
          boxShadow={shadow}
          p="0px"
          mt="10px"
          borderRadius="20px"
          bg={menuBg}
          border="none"
        >
          <Flex w="100%" mb="0px">
            <Text
              ps="20px"
              pt="16px"
              pb="10px"
              w="100%"
              borderBottom="1px solid"
              borderColor={borderColor}
              fontSize="sm"
              fontWeight="700"
              color={textColor}
            >
              {stateAuth.user ? stateAuth.user.userProfile.username : ""}
            </Text>
          </Flex>
          <Flex flexDirection="column" p="10px">
            <NavLink to="/admin/profile">
              <MenuItem
                _hover={{ bg: "none" }}
                _focus={{ bg: "none" }}
                borderRadius="8px"
                px="14px"
              >
                <Text fontSize="sm">ตั้งค่า</Text>
              </MenuItem>
            </NavLink>
            <MenuItem
              _hover={{ bg: "none" }}
              _focus={{ bg: "none" }}
              color="red.400"
              borderRadius="8px"
              px="14px"
            >
              <Text fontSize="sm" onClick={logoutSubmit}>
                ลงชื่อออก
              </Text>
            </MenuItem>
          </Flex>
        </MenuList>
      </Menu>
    </Flex>
  );

  function logoutSubmit(e) {
    e.preventDefault();
    store.dispatch(logout({ userID: stateAuth.user.userProfile.userID }));
  }
}

HeaderLinks.propTypes = {
  variant: PropTypes.string,
  fixed: PropTypes.bool,
  secondary: PropTypes.bool,
  onOpen: PropTypes.func,
};
