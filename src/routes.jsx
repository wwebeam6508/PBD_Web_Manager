import React from "react";

import { Icon } from "@chakra-ui/react";
import {
  MdBarChart,
  MdPerson,
  MdHome,
  MdLock,
  MdOutlineShoppingCart,
  MdWorkHistory,
  MdPeople,
  MdBuild,
  MdCellTower,
  MdMoneyOff,
} from "react-icons/md";

// Admin Imports
import MainDashboard from "/views/admin/default";
import NFTMarketplace from "/views/admin/marketplace";
import Profile from "/views/admin/profile";
import Projects from "/views/admin/projects";
import Customers from "/views/admin/customers";
import Expenses from "/views/admin/expenses";

// Auth Imports
import SignInCentered from "/views/auth/signIn";

const routes = [
  {
    name: "หน้าหลัก",
    layout: "/admin",
    path: "/default",
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: MainDashboard,
    isShow: true,
  },
  // {
  //   name: "NFT Marketplace",
  //   layout: "/admin",
  //   path: "/nft-marketplace",
  //   icon: (
  //     <Icon
  //       as={MdOutlineShoppingCart}
  //       width="20px"
  //       height="20px"
  //       color="inherit"
  //     />
  //   ),
  //   component: NFTMarketplace,
  //   secondary: true,
  //   isShow: true,
  // },
  {
    category: "accounting",
    name: "จัดการค่าใช้จ่ายรายได้",
    items: [
      {
        name: "ค่าใช้จ่าย",
        layout: "/admin",
        path: "/expenses",
        icon: (
          <Icon as={MdMoneyOff} width="20px" height="20px" color="inherit" />
        ),
        component: Expenses,
        isShow: true,
      },
      {
        name: "รายได้จากงาน",
        layout: "/admin",
        path: "/projects",
        icon: (
          <Icon as={MdWorkHistory} width="20px" height="20px" color="inherit" />
        ),
        component: Projects,
        isShow: true,
      },
    ],
  },
  {
    category: "management",
    name: "จัดการข้อมูล",
    items: [
      {
        name: "คู่ค้า/ลูกค้า",
        layout: "/admin",
        path: "/customers",
        icon: (
          <Icon as={MdCellTower} width="20px" height="20px" color="inherit" />
        ),
        component: Customers,
        isShow: true,
      },
    ],
  },
  {
    name: "Profile",
    layout: "/admin",
    path: "/profile",
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    component: Profile,
    isShow: false,
  },
  {
    name: "Sign In",
    layout: "/auth",
    path: "/sign-in",
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: SignInCentered,
    isShow: false,
  },
];

export default routes;
