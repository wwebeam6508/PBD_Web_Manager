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
  Textarea,
  Select,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { isEmpty } from "/util/helper";
import _ from "lodash";
import { addInventory } from "/api/inventory";
import { updateInventory } from "/api/inventory";
import { getInventoryByID } from "/api/inventory";

//import sweet alert
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useSelector } from "react-redux";
import { PermissionCheck } from "/util/helper";
const MySwal = withReactContent(Swal);
export default function FormInventoryModal({
  stateOpen = false,
  isEdit = false,
  closeModal,
  inventoryID = null,
}) {
  const defaultForm = {
    name: "",
    permission: {},
  };
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(defaultForm);
  const [formOldData, setFormOldData] = useState(defaultForm);
  const [inventoryTypeOptions, setInventoryTypeOptions] = useState([]);
  const prePermission = useSelector((state) => state.auth.prePermission);
  const auth = useSelector((state) => state.auth);
  const permissions = auth.user
    ? auth.user.userProfile.userType.permission.userType
    : null;
  useEffect(() => {
    if (isEdit) {
      getEditInventoryData();
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
    const compareData = formData;
    const compareDataOld = formOldData;
    if (JSON.stringify(compareData) === JSON.stringify(compareDataOld)) {
      return true;
    }
    return false;
  };

  const formAddInventory = (
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
                disabled={!PermissionCheck("canEdit", permissions)}
              />
              {isEmpty(formData.name) && (
                <Text color="red.500" marginBottom="1rem">
                  กรุณากรอกชื่อประเภทเครื่องใช้
                </Text>
              )}
            </FormControl>
          </GridItem>
          {/* description */}
          <GridItem>
            <FormControl marginBottom="1rem">
              <FormLabel fontSize={20} htmlFor="description">
                รายละเอียด
              </FormLabel>
              <Textarea
                type="text"
                id="description"
                name="description"
                placeholder="รายละเอียด"
                value={formData.description}
                onChange={handleChange}
                disabled={!PermissionCheck("canEdit", permissions)}
              />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl marginBottom="1rem">
              <FormLabel fontSize={20} htmlFor="quantity">
                จำนวน
              </FormLabel>
              <Input
                type="number"
                id="quantity"
                name="quantity"
                placeholder="จำนวน"
                value={formData.quantity}
                onChange={handleChange}
                disabled={!PermissionCheck("canEdit", permissions)}
              />
              {isEmpty(formData.quantity) && (
                <Text color="red.500" marginBottom="1rem">
                  กรุณากรอกจำนวน
                </Text>
              )}
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl marginBottom="1rem">
              <FormLabel fontSize={20} htmlFor="price">
                ราคา
              </FormLabel>
              <Input
                type="number"
                id="price"
                name="price"
                placeholder="ราคา"
                value={formData.price}
                onChange={handleChange}
                disabled={!PermissionCheck("canEdit", permissions)}
              />
              {isEmpty(formData.price) && (
                <Text color="red.500" marginBottom="1rem">
                  กรุณากรอกราคา
                </Text>
              )}
            </FormControl>
          </GridItem>
          {/* selection option of inventoryTypeOptions  */}
          <GridItem>
            <FormControl marginBottom="1rem">
              <FormLabel fontSize={20} htmlFor="inventoryType">
                ประเภทเครื่องใช้
              </FormLabel>
              <Select
                id="inventoryType"
                name="inventoryType"
                value={formData.inventoryType}
                onChange={handleChange}
                disabled={!PermissionCheck("canEdit", permissions)}
              >
                {inventoryTypeOptions.map((inventoryType) => {
                  return (
                    <option
                      key={inventoryType.inventoryTypeID}
                      value={inventoryType.inventoryTypeID}
                    >
                      {inventoryType.name}
                    </option>
                  );
                })}
              </Select>
            </FormControl>
          </GridItem>
        </Grid>
        <div
          hidden={!PermissionCheck("canEdit", permissions)}
          style={{ textAlign: "center" }}
        >
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
              <ModalBody>{formAddInventory}</ModalBody>
              <ModalFooter>
                <Button colorScheme="red" mr={3} onClick={closeModal}>
                  ปิด
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );

  async function getEditInventoryData() {
    try {
      setIsSubmitting(true);
      const res = await getInventoryByID(inventoryID);
      const inventory = res.data;
      const form = {
        ...inventory,
      };
      setInventoryTypeOptions(_.cloneDeep(form.inventoryTypeName));
      delete form.inventoryType;
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
    const res = await addInventory(passData);
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
      inventoryID: inventoryID,
    };
    delete passData._id;
    const res = await updateInventory(passData);
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
