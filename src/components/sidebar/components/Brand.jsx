import React from "react";

// Chakra imports
import { Flex, useColorModeValue } from "@chakra-ui/react";

// Custom components
import { HSeparator } from "/components/separator/Separator";
import { ReactComponent as PBDLogo } from "/assets/img/logo/pbd_logo.svg";

export function SidebarBrand() {
  //   Chakra color mode
  let logoColor = useColorModeValue("navy.700", "white");

  return (
    <Flex align="center" direction="column">
      <PBDLogo height="150px" width="150px" color={logoColor} />
      <HSeparator mb="20px" />
    </Flex>
  );
}

export default SidebarBrand;
