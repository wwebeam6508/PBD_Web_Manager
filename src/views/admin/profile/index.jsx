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
import {
  Box,
  Button,
  FormControl,
  Grid,
  GridItem,
  Input,
} from "@chakra-ui/react";

// Custom components
import Banner from "/views/admin/profile/components/Banner";
// Assets
import banner from "/assets/img/auth/banner.png";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import Card from "/components/card/Card";
import { changePasswordData } from "/api/auth";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);

export default function Overview() {
  const profileState = useSelector((state) => state.auth.user.userProfile);
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const checkPassword = () => {
    if (form.password === "" || form.confirmPassword === "") {
      return false;
    }
    if (form.password === form.confirmPassword) {
      return true;
    }
    return false;
  };

  const InputForm = (
    <Card
      columns={{ base: 1, md: 2, lg: 3, "2xl": 6 }}
      mb={{ base: "0px", "2xl": "20px" }}
      width={{ base: "100%", "2xl": "40%" }}
      style={{ margin: "auto" }}
    >
      <FormControl>
        <Grid templateColumns="repeat(7, 1fr)" gap={1}>
          <GridItem colSpan={3}>
            <Input
              type="password"
              placeholder="รหัสผ่านใหม่"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </GridItem>
          <GridItem colSpan={3}>
            <Input
              type="password"
              placeholder="ยืนยันรหัสผ่านใหม่"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
            />
          </GridItem>
          <GridItem colSpan={1}>
            <Button
              colorScheme="yellow"
              variant="solid"
              width="100%"
              style={{ margin: "auto" }}
              disabled={!checkPassword()}
              onClick={changePassword}
            >
              ยืนยัน
            </Button>
          </GridItem>
        </Grid>
        {form.confirmPassword !== form.password && (
          <Grid templateColumns="repeat(1, 1fr)" gap={1}>
            <strong
              style={{ textAlign: "center", color: "red", marginTop: "10px" }}
            >
              กรุณากรอกรหัสผ่านใหม่กับยืนยันรหัสผ่านใหม่ให้ตรงกัน
            </strong>
          </Grid>
        )}
      </FormControl>
    </Card>
  );
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      {/* Main Fields */}
      <Grid
        templateColumns={{
          base: "1fr",
          lg: "1fr",
        }}
        templateRows={{
          base: "repeat(3, 1fr)",
          lg: "1fr",
        }}
        gap={{ base: "20px", xl: "20px" }}
      >
        <Banner
          columns={{ base: 1, md: 2, lg: 3, "2xl": 6 }}
          banner={banner}
          username={profileState.username}
          userType={profileState.userType}
        />
        {InputForm}
      </Grid>
    </Box>
  );

  async function changePassword() {
    try {
      await changePasswordData(form);
      setForm({
        password: "",
        confirmPassword: "",
      });
      MySwal.fire({
        title: "เปลี่ยนรหัสผ่านสำเร็จ",
        icon: "success",
        confirmButtonText: "ตกลง",
      });
    } catch (error) {
      MySwal.fire({
        title: "เปลี่ยนรหัสผ่านไม่สำเร็จ",
        icon: "error",
        confirmButtonText: "ตกลง",
      });
    }
  }
}
