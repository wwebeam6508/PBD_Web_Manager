import { AddIcon } from "@chakra-ui/icons";
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
  Checkbox,
  Textarea,
  Grid,
  GridItem,
  Center,
  Spinner,
  NumberInput,
  NumberInputField,
  Container,
} from "@chakra-ui/react";
import Select from "react-select";
import React, { useEffect, useState } from "react";
import { isEmpty } from "/util/helper";
import _ from "lodash";
import { addUser } from "/api/users";
import { updateUser } from "/api/users";
import { getUserByID } from "/api/users";
import moment from "moment";

export default function FormUserModal({
  stateOpen = false,
  isEdit = false,
  closeModal,
  userID = null,
  userTypes = [],
}) {
  const defaultForm = {
    name: "",
    date: new Date(),
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
    const requried = ["name", "userType"];
    for (let i = 0; i < requried.length; i++) {
      const req = requried[i];
      if (isEmpty(formData[req])) {
        return true;
      }
    }
    return false;
  };

  const editValidtion = () => {
    //check if form data is not change
    const compareData = formData;
    const compareDataOld = formOldData;
    if (JSON.stringify(compareData) === JSON.stringify(compareDataOld)) {
      return true;
    }
    if (formData.lists.length === 0) {
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
                id="name"
                name="name"
                placeholder="ชื่อรายการ"
                value={formData.name}
                onChange={handleChange}
              />
              {isEmpty(formData.name) && (
                <Text color="red.500" marginBottom="1rem">
                  กรุณากรอก Username
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
              disabled={editValidtion() || validation()}
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
      <Modal isOpen={stateOpen} onClose={closeModal} size="full">
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
      date: new Date(user.date),
      userType: user.userType,
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
      date: moment(new Date()).format("YYYY-MM-DD"),
    };
    try {
      await addUser(passData)
        .then((res) => {
          if (res.message === "success") {
            closeModal();
          }
          setIsSubmitting(false);
        })
        .catch((err) => {
          setIsSubmitting(false);
          throw err;
        });
    } catch (error) {}
  }

  async function editSubmit() {
    setIsSubmitting(true);

    let passData;
    passData = {
      ..._.cloneDeep(formData),
      date: moment(formData.date).format("YYYY-MM-DD"),
      userID: userID,
    };
    delete passData._id;
    try {
      await updateUser(passData)
        .then((res) => {
          if (res.message === "success") {
            closingModal();
          }
          setIsSubmitting(false);
        })
        .catch((err) => {
          setIsSubmitting(false);
          throw err;
        });
    } catch (error) {
      console.log(error);
    }
  }
  function closingModal() {
    setFormData(defaultForm);
    setFormOldData(defaultForm);
    closeModal();
  }
}
