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
  Select,
  Center,
  Spinner,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { isEmpty } from "/util/helper";
import _ from "lodash";
import { addCustomer } from "/api/customers";
import { updateCustomer } from "/api/customers";
import { getCustomerByID } from "/api/customers";
import { IoRemoveCircleOutline } from "react-icons/io5";

export default function FormCustomerModal({
  stateOpen = false,
  isEdit = false,
  closeModal,
  customerID = null,
}) {
  const defaultForm = {
    name: "",
    address: "",
    taxID: "",
    phones: [],
    emails: [],
  };
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(defaultForm);
  const [formOldData, setFormOldData] = useState(defaultForm);

  useEffect(() => {
    if (isEdit) {
      getEditProjectData();
    } else {
      setFormData(defaultForm);
      setFormOldData(defaultForm);
    }
  }, [isEdit]);

  const handleChange = (e) => {
    if (e.target) {
      const { name, value } = e.target;
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const handlePhoneChange = (e, index) => {
    const { value } = e.target;
    const newPhones = [...formData.phones];
    newPhones[index] = value;
    setFormData((prevFormData) => ({
      ...prevFormData,
      phones: newPhones,
    }));
  };

  const handleEmailChange = (e, index) => {
    const { value } = e.target;
    const newEmails = [...formData.emails];
    newEmails[index] = value;
    setFormData((prevFormData) => ({
      ...prevFormData,
      emails: newEmails,
    }));
  };

  const handleRemovePhone = (index) => {
    const newPhones = [...formData.phones];
    newPhones.splice(index, 1);
    setFormData((prevFormData) => ({
      ...prevFormData,
      phones: newPhones,
    }));
  };

  const handleRemoveEmail = (index) => {
    const newEmails = [...formData.emails];
    newEmails.splice(index, 1);
    setFormData((prevFormData) => ({
      ...prevFormData,
      emails: newEmails,
    }));
  };

  const onAddEmail = () => {
    const newEmails = [...formData.emails];
    newEmails.push("");
    setFormData((prevFormData) => ({
      ...prevFormData,
      emails: newEmails,
    }));
  };

  const onAddPhone = () => {
    const newPhones = [...formData.phones];
    newPhones.push("");
    setFormData((prevFormData) => ({
      ...prevFormData,
      phones: newPhones,
    }));
  };

  const validation = () => {
    const requried = ["name", "address", "taxID"];
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
    let compareData = _.cloneDeep(formData);
    //check phone and email if empty fill
    compareData.phones = compareData.phones.filter((phone) => !isEmpty(phone));
    compareData.emails = compareData.emails.filter((email) => !isEmpty(email));
    const compareDataOld = formOldData;
    if (JSON.stringify(compareData) === JSON.stringify(compareDataOld)) {
      return true;
    }
    return false;
  };

  const formAddCustomer = (
    <form>
      <FormControl marginBottom="1rem">
        <FormLabel htmlFor="name">ชื่องาน</FormLabel>
        <Input
          type="text"
          id="name"
          name="name"
          placeholder="ชื่องาน"
          value={formData.name}
          onChange={handleChange}
        />
        {isEmpty(formData.name) && (
          <Text color="red.500" marginBottom="1rem">
            กรุณากรอกชื่อคู้ค้า/ลูกค้า
          </Text>
        )}
      </FormControl>
      <FormControl marginBottom="1rem">
        <FormLabel htmlFor="address">ที่อยู่</FormLabel>
        <Textarea
          type="text"
          id="address"
          name="address"
          placeholder="ที่อยู่"
          value={formData.address}
          onChange={handleChange}
        />
        {isEmpty(formData.address) && (
          <Text color="red.500" marginBottom="1rem">
            กรุณากรอกที่อยู่
          </Text>
        )}
      </FormControl>
      <FormControl marginBottom="1rem">
        <FormLabel htmlFor="taxID">เลขประจำตัวผู้เสียภาษี</FormLabel>
        <Input
          type="text"
          id="taxID"
          name="taxID"
          placeholder="เลขประจำตัวผู้เสียภาษีหรือบัตรประชาชน"
          value={formData.taxID}
          onChange={handleChange}
        />
        {isEmpty(formData.taxID) && (
          <Text color="red.500" marginBottom="1rem">
            กรุณากรอกเลขประจำตัวผู้เสียภาษี
          </Text>
        )}
      </FormControl>
      <Grid templateColumns="repeat(2, 1fr)" gap={6}>
        <GridItem>
          <FormControl marginBottom="1rem">
            <FormLabel htmlFor="phones">เบอร์โทรศัพท์</FormLabel>
            {
              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                {formData.phones.map((phone, index) => (
                  <React.Fragment key={phone + index}>
                    <GridItem>
                      <Input
                        pattern="[0-9]*"
                        type="text"
                        id="phones"
                        name="phones"
                        placeholder="เบอร์โทรศัพท์"
                        value={phone}
                        onChange={(e) => handlePhoneChange(e, index)}
                      />
                    </GridItem>
                    <IoRemoveCircleOutline
                      size={20}
                      color="red"
                      onClick={() => handleRemovePhone(index)}
                      style={{ cursor: "pointer" }}
                    />
                  </React.Fragment>
                ))}
              </Grid>
            }
            <Button //middle of screen
              marginTop={"1rem"}
              left={"50%"}
              type="button"
              onClick={onAddPhone}
            >
              <AddIcon />
            </Button>
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl marginBottom="1rem">
            <FormLabel htmlFor="emails">อีเมล</FormLabel>
            {
              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                {formData.emails.map((email, index) => (
                  <React.Fragment key={email + index}>
                    <GridItem>
                      <Input
                        type="text"
                        id="emails"
                        name="emails"
                        placeholder="อีเมล"
                        value={email}
                        onChange={(e) => handleEmailChange(e, index)}
                      />
                    </GridItem>
                    <IoRemoveCircleOutline
                      size={20}
                      color="red"
                      onClick={() => handleRemoveEmail(index)}
                      style={{ cursor: "pointer" }}
                    />
                  </React.Fragment>
                ))}
              </Grid>
            }
            <Button
              marginTop={"1rem"}
              left={"50%"}
              type="button"
              onClick={onAddEmail}
            >
              <AddIcon />
            </Button>
          </FormControl>
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
            disabled={editValidtion() || validation()}
            type="button"
            color="yellow.500"
          >
            แก้ไข
          </Button>
        )}
      </div>
    </form>
  );

  return (
    <>
      <Modal isOpen={stateOpen} onClose={closeModal} size="6xl">
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
                {!isEdit ? "เพิ่มรายการงาน" : "แก้ไขรายการงาน"}
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>{formAddCustomer}</ModalBody>
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

  async function getEditProjectData() {
    setIsSubmitting(true);
    const res = await getCustomerByID(customerID);
    const customer = res.data;

    const form = {
      name: customer.name,
      address: customer.address ? customer.address : "",
      taxID: customer.taxID ? customer.taxID : "",
      phones: customer.phones ? customer.phones : [],
      emails: customer.emails ? customer.emails : [],
    };
    setFormData(_.cloneDeep(form));
    setFormOldData(_.cloneDeep(form));

    setIsSubmitting(false);
  }

  async function addSubmit() {
    setIsSubmitting(true);
    let passData = {
      name: formData.name,
      address: formData.address,
      taxID: formData.taxID,
      phones: formData.phones,
      emails: formData.emails,
    };
    await addCustomer(passData);
    setIsSubmitting(false);
    closingModal();
  }

  async function editSubmit() {
    setIsSubmitting(true);
    const addPhones = formData.phones.filter(
      (phone) => !formOldData.phones.includes(phone)
    );
    const removePhones = formOldData.phones.filter(
      (phone) => !formData.phones.includes(phone)
    );
    const addEmails = formData.emails.filter(
      (email) => !formOldData.emails.includes(email)
    );
    const removeEmails = formOldData.emails.filter(
      (email) => !formData.emails.includes(email)
    );
    let passData;
    passData = {
      ...formData,
      addPhones: addPhones,
      removePhones: removePhones,
      addEmails: addEmails,
      removeEmails: removeEmails,
    };
    delete passData.phones;
    delete passData.emails;
    await updateCustomer(customerID, passData)
      .then(() => {
        setIsSubmitting(false);
      })
      .catch(() => {
        setIsSubmitting(false);
      });
    closingModal();
  }

  function closingModal() {
    setFormData(defaultForm);
    setFormOldData(defaultForm);
    closeModal();
  }
}
