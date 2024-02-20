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
  Checkbox,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { isEmpty } from "/util/helper";
import _ from "lodash";
import { addInventoryType } from "/api/inventoryTypes";
import { updateInventoryType } from "/api/inventoryTypes";
import { getInventoryTypeByID } from "/api/inventoryTypes";

//import sweet alert
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useSelector } from "react-redux";
const MySwal = withReactContent(Swal);
export default function FormInventoryTypeModal({
  stateOpen = false,
  isEdit = false,
  closeModal,
  inventoryTypeID = null,
}) {
  const defaultForm = {
    name: "",
    permission: {},
  };
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(defaultForm);
  const [formOldData, setFormOldData] = useState(defaultForm);
  const prePermission = useSelector((state) => state.auth.prePermission);

  useEffect(() => {
    if (isEdit) {
      getEditInventoryTypeData();
    } else {
      setFormData(defaultForm);
      setFormOldData(defaultForm);
      //prePermission as default permission
      setFormData((prevFormData) => ({
        ...prevFormData,
        permission: prePermission,
      }));
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
    const requried = ["name"];
    for (let i = 0; i < requried.length; i++) {
      const req = requried[i];
      if (isEmpty(formData[req])) {
        return true;
      }
    }
    return false;
  };

  const editValidtion = () => {
    const requried = ["name"];
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

  const formAddInventoryType = (
    <form>
      <Container maxW="container.xl">
        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
          <GridItem>
            <FormControl marginBottom="1rem">
              <FormLabel fontSize={20} htmlFor="name">
                ชื่อประเภทเครื่องใช้
              </FormLabel>
              <Input
                type="text"
                id="name"
                name="name"
                placeholder="ชื่อประเภทผู้ใช้"
                value={formData.name}
                onChange={handleChange}
              />
              {isEmpty(formData.name) && (
                <Text color="red.500" marginBottom="1rem">
                  กรุณากรอกชื่อประเภทเครื่องใช้
                </Text>
              )}
            </FormControl>
          </GridItem>
          <GridItem>
          </GridItem>
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
              <ModalBody>{formAddInventoryType}</ModalBody>
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

  async function getEditInventoryTypeData() {
    try {
      setIsSubmitting(true);
      const res = await getInventoryTypeByID(inventoryTypeID);
      const inventoryType = res.data;
      const form = {
        ...inventoryType,
      };
      setFormData(_.cloneDeep(form));
      setFormOldData(_.cloneDeep(form));
    } catch (error) {
      closeModal();
    } finally {
      setIsSubmitting(false);
    }
  }

  async function addSubmit() {
    setIsSubmitting(true);
    let passData = {
      ...formData,
    };
    const res = await addInventoryType(passData);
    if (res && res.code === 200) {
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
      inventoryTypeID: inventoryTypeID,
    };
    delete passData._id;
    const res = await updateInventoryType(passData);
    if (res && res.code === 200) {
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
