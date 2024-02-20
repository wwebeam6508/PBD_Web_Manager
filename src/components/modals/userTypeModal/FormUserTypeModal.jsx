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
import { addUserType } from "/api/userTypes";
import { updateUserType } from "/api/userTypes";
import { getUserTypeByID } from "/api/userTypes";

//import sweet alert
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useSelector } from "react-redux";
const MySwal = withReactContent(Swal);
export default function FormUserTypeModal({
  stateOpen = false,
  isEdit = false,
  closeModal,
  userTypeID = null,
}) {
  const defaultForm = {
    name: "",
    permission: {},
  };
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(defaultForm);
  const [formOldData, setFormOldData] = useState(defaultForm);
  const prePermission = useSelector((state) => state.auth.prePermission);
  const isEditPermission = useSelector((state) =>
    state.auth.user
      ? state.auth.user.userProfile.userType.permission.userType.canEdit
      : false
  );
  useEffect(() => {
    if (isEdit) {
      getEditUserTypeData();
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

  const formAddUserType = (
    <form>
      <Container maxW="container.xl">
        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
          <GridItem>
            <FormControl marginBottom="1rem">
              <FormLabel fontSize={20} htmlFor="name">
                ชื่อประเภทผู้ใช้
              </FormLabel>
              <Input
                disabled={!isEditPermission}
                type="text"
                id="name"
                name="name"
                placeholder="ชื่อประเภทผู้ใช้"
                value={formData.name}
                onChange={handleChange}
              />
              {isEmpty(formData.name) && (
                <Text color="red.500" marginBottom="1rem">
                  กรุณากรอกชื่อประเภทผู้ใช้
                </Text>
              )}
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl marginBottom="1rem">
              <FormLabel fontSize={20} htmlFor="name">
                สิทธิ์การใช้งาน
              </FormLabel>
              {formData.permission &&
                Object.entries(formData.permission).map(([key, value]) => {
                  return (
                    <GridItem key={key}>
                      <FormLabel fontSize={20} htmlFor="name">
                        {key}
                      </FormLabel>
                      {Object.entries(value).map(([key2, value2]) => {
                        return (
                          <Checkbox
                            disabled={!isEditPermission}
                            key={key2}
                            isChecked={value2}
                            onChange={(e) => {
                              setFormData((prevFormData) => ({
                                ...prevFormData,
                                permission: {
                                  ...prevFormData.permission,
                                  [key]: {
                                    ...prevFormData.permission[key],
                                    [key2]: e.target.checked,
                                  },
                                },
                              }));
                            }}
                          >
                            {key2}
                          </Checkbox>
                        );
                      })}
                    </GridItem>
                  );
                })}
            </FormControl>
          </GridItem>
        </Grid>
        <div hidden={!isEditPermission} style={{ textAlign: "center" }}>
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
              <ModalBody>{formAddUserType}</ModalBody>
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

  async function getEditUserTypeData() {
    setIsSubmitting(true);
    const res = await getUserTypeByID(userTypeID);
    const userType = res.data;

    const form = {
      ...userType,
    };
    setFormData(_.cloneDeep(form));
    setFormOldData(_.cloneDeep(form));
    setIsSubmitting(false);
  }

  async function addSubmit() {
    setIsSubmitting(true);
    let passData = {
      ...formData,
    };
    const res = await addUserType(passData);
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
      userTypeID: userTypeID,
    };
    delete passData._id;
    const res = await updateUserType(passData);
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
