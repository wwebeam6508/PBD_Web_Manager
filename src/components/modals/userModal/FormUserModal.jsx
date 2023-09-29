import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  Grid,
  GridItem,
  Center,
  Spinner,
  Container,
} from "@chakra-ui/react";
import Select from "react-select";
import React, { useEffect, useState } from "react";
import { isEmpty } from "/util/helper";
import _ from "lodash";
import { addUser } from "/api/users";
import { updateUser } from "/api/users";
import { getUserByID } from "/api/users";

//import sweet alert
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);
export default function FormUserModal({
  stateOpen = false,
  isEdit = false,
  closeModal,
  userID = null,
  userTypes = [],
}) {
  const defaultForm = {
    username: "",
    password: "",
    userType: "",
  };
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(defaultForm);
  const [formOldData, setFormOldData] = useState(defaultForm);

  useEffect(() => {
    if (isEdit) {
      getEditUserData();
    } else {
      setFormData(defaultForm);
      setFormOldData(defaultForm);
    }
  }, [isEdit]);

  const handleChange = (e) => {
    if (e.target) {
      let { name, value } = e.target;
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    } else {
      e.value.setHours(0, 0, 0, 0);
      setFormData((prevFormData) => ({
        ...prevFormData,
        [e.name]: e.value,
      }));
    }
  };

  const validation = () => {
    const requried = ["username", "userType", "password"];
    for (let i = 0; i < requried.length; i++) {
      const req = requried[i];
      if (isEmpty(formData[req])) {
        return true;
      }
    }
    return false;
  };

  const editValidtion = () => {
    const requried = ["username", "userType"];
    for (let i = 0; i < requried.length; i++) {
      const req = requried[i];
      if (isEmpty(formData[req])) {
        return true;
      }
    }
    //check if form data is not change
    const compareData = formData;
    const compareDataOld = formOldData;
    if (JSON.stringify(compareData) === JSON.stringify(compareDataOld)) {
      return true;
    }
    return false;
  };

  const formAddUser = (
    <form>
      <Container maxW="container.xl">
        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
          <GridItem>
            <FormControl marginBottom="1rem">
              <FormLabel fontSize={20} htmlFor="name">
                Username
              </FormLabel>
              <Input
                type="text"
                id="username"
                name="username"
                placeholder="ชื่อผู้ใช้"
                value={formData.username}
                onChange={handleChange}
              />
              {isEmpty(formData.username) && (
                <Text color="red.500" marginBottom="1rem">
                  กรุณากรอก Username
                </Text>
              )}
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl marginBottom="1rem">
              <FormLabel fontSize={20} htmlFor="password">
                Password
              </FormLabel>
              <Input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              {isEmpty(formData.password) && !isEdit && (
                <Text color="red.500" marginBottom="1rem">
                  กรุณากรอก Password
                </Text>
              )}
            </FormControl>
          </GridItem>

          <FormControl marginBottom="1rem">
            <FormLabel fontSize={20} htmlFor="userType">
              ประเภทผู้ใช้งาน
            </FormLabel>
            <Select
              placeholder="เลือกประเภทผู้ใช้"
              name="userType"
              value={{
                label: userTypes.find(
                  (userType) => userType.id === formData.userType
                )?.name,
              }}
              onChange={(e) => {
                setFormData((prevFormData) => ({
                  ...prevFormData,
                  userType: e.value,
                }));
              }}
              options={userTypes.map((userType) => {
                return {
                  value: userType.id,
                  label: userType.name,
                };
              })}
            />
          </FormControl>
        </Grid>
        <div style={{ textAlign: "center" }}>
          {!isEdit ? (
            <Button
              onClick={addSubmit}
              disabled={validation()}
              type="button"
              color="green.500"
            >
              เพิ่ม
            </Button>
          ) : (
            <Button
              onClick={editSubmit}
              disabled={editValidtion()}
              type="button"
              color="yellow.500"
            >
              แก้ไข
            </Button>
          )}
        </div>
      </Container>
    </form>
  );

  return (
    <>
      <Modal
        autoFocus={true}
        isOpen={stateOpen}
        onClose={closeModal}
        size="6xl"
      >
        <ModalOverlay />
        <ModalContent>
          {isSubmitting ? (
            <Center
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
            >
              <Spinner />
            </Center>
          ) : (
            <>
              <ModalHeader>
                {!isEdit ? "เพิ่มผู้ใช้" : "แก้ไขผู้ใช้"}
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>{formAddUser}</ModalBody>
              <ModalFooter>
                <Button colorScheme="red" mr={3} onClick={closeModal}>
                  ยกเลิก
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );

  async function getEditUserData() {
    setIsSubmitting(true);
    const res = await getUserByID(userID);
    const user = res.data;

    const form = {
      ...user,
      userType: user.userType,
      password: "",
    };
    setFormData(_.cloneDeep(form));
    setFormOldData(_.cloneDeep(form));
    if (user.currentVat > 0) {
      setIsVat(true);
    }
    setIsSubmitting(false);
  }

  async function addSubmit() {
    setIsSubmitting(true);
    let passData = {
      ...formData,
    };
    const res = await addUser(passData);
    if (res && res.message === "success") {
      closingModal();
      MySwal.fire({
        icon: "success",
        title: "เพิ่มรายการงานสำเร็จ",
        showConfirmButton: false,
        timer: 1500,
      });
    }
    setIsSubmitting(false);
  }

  async function editSubmit() {
    setIsSubmitting(true);

    let passData;
    passData = {
      ..._.cloneDeep(formData),
      userID: userID,
    };
    delete passData._id;
    const res = await updateUser(passData);
    if (res && res.message === "success") {
      closingModal();
      MySwal.fire({
        icon: "success",
        title: "แก้ไขรายการงานสำเร็จ",
        showConfirmButton: false,
        timer: 1500,
      });
    }
    setIsSubmitting(false);
  }
  function closingModal() {
    setFormData(defaultForm);
    setFormOldData(defaultForm);
    closeModal();
  }
}
