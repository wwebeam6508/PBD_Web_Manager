import { DeleteIcon } from "@chakra-ui/icons";
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
  Spinner,
  Center,
  Container,
} from "@chakra-ui/react";
import Select from "react-select";
import { getProjectByID } from "/api/projects";
import { addProject } from "/api/projects";
import { SingleDatepicker } from "chakra-dayzed-datepicker";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { fileToUrl } from "/util/helper";
import { isEmpty } from "/util/helper";
import _ from "lodash";
import { updateProject } from "/api/projects";
//import sweet alert
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);

export default function FormProjectModal({
  stateOpen = false,
  isEdit = false,
  closeModal,
  customers = [],
  projectID = null,
}) {
  const defaultForm = {
    title: "",
    detail: "",
    customer: "",
    profit: "",
    date: new Date(),
    dateEnd: new Date(),
    images: [],
  };
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(defaultForm);
  const [formOldData, setFormOldData] = useState(defaultForm);

  const [isDateEnd, setIsDateEnd] = useState(false);
  const [isDateEndOld, setIsDateEndOld] = useState(false);

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
      let { name, value } = e.target;

      if (name === "profit") {
        value = addCommas(removeNonNumeric(value));
      }
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    } else {
      console.log(formData);
      e.value.setHours(0, 0, 0, 0);
      setFormData((prevFormData) => ({
        ...prevFormData,
        [e.name]: e.value,
      }));
    }
  };

  const addCommas = (num) =>
    num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const removeNonNumeric = (num) => num.toString().replace(/[^0-9]/g, "");

  const handleFileChange = (e) => {
    const fileList = Array.from(e.target.files);
    const base64Promises = fileList.map((file) => {
      return new Promise((resolve) => {
        resolve(fileToUrl(file));
      });
    });
    Promise.all(base64Promises).then((base64Images) => {
      setFormData((prevFormData) => ({
        ...prevFormData,
        images: [...prevFormData.images, ...base64Images],
      }));
    });
  };

  const handleDeleteImage = (index) => {
    setFormData((prevFormData) => {
      const newImages = [...prevFormData.images];
      newImages.splice(index, 1);
      return {
        ...prevFormData,
        images: newImages,
      };
    });
  };

  const validation = () => {
    const requried = ["title", "customer", "profit"];
    for (let i = 0; i < requried.length; i++) {
      const req = requried[i];
      if (isEmpty(formData[req])) {
        return true;
      }
    }

    if (formData.dateEnd == null && isDateEnd) {
      return true;
    }
    return false;
  };

  const editValidtion = () => {
    //check if form data is not change
    const compareData = _.cloneDeep(formData);
    delete compareData.dateEnd;
    const compareDataOld = _.cloneDeep(formOldData);
    delete compareDataOld.dateEnd;
    if (
      isDateEnd === isDateEndOld &&
      JSON.stringify(formData.dateEnd) ===
        JSON.stringify(formOldData.dateEnd) &&
      JSON.stringify(compareData) === JSON.stringify(compareDataOld)
    ) {
      return true;
    }
    return false;
  };

  const formAddProject = (
    <form>
      <FormControl marginBottom="1rem">
        <FormLabel htmlFor="title">ชื่องาน</FormLabel>
        <Input
          type="text"
          id="title"
          name="title"
          placeholder="ชื่องาน"
          value={formData.title}
          onChange={handleChange}
        />
        {isEmpty(formData.title) && (
          <Text color="red.500" marginBottom="1rem">
            กรุณากรอกชื่องาน
          </Text>
        )}
      </FormControl>

      <FormControl marginBottom="1rem">
        <FormLabel htmlFor="detail">รายละเอียด</FormLabel>
        <Textarea
          type="text"
          id="detail"
          name="detail"
          rows={5}
          placeholder="รายละเอียด"
          value={formData.detail}
          onChange={handleChange}
        />
      </FormControl>
      <FormControl marginBottom="1rem">
        <FormLabel htmlFor="customer">ชื่อผู้ว่าจ้าง</FormLabel>
        <Select
          id="customer"
          name="customer"
          placeholder="เลือกชื่อผู้ว่าจ้าง"
          value={{
            label: customers.find(
              (customer) => customer.id === formData.customer
            )?.name,
          }}
          onChange={(e) => {
            setFormData((prevFormData) => ({
              ...prevFormData,
              customer: e.value,
            }));
          }}
          options={customers.map((customer, index) => ({
            value: customer.id,
            label: customer.name,
          }))}
        />
        {isEmpty(formData.customer) && (
          <Text color="red.500" marginBottom="1rem">
            กรุณากรอกชื่อผู้ว่าจ้าง
          </Text>
        )}
      </FormControl>

      <FormControl marginBottom="1rem">
        <FormLabel htmlFor="profit">รายได้</FormLabel>
        <Input
          type="text"
          id="profit"
          name="profit"
          pattern="[0-9]*"
          placeholder="กรอก 0 เป็นต้น"
          value={formData.profit}
          onChange={handleChange}
        />
        {isEmpty(formData.profit) && (
          <Text color="red.500" marginBottom="1rem">
            กรุณากรอกรายได้
          </Text>
        )}
      </FormControl>

      <FormControl marginBottom="1rem">
        <FormLabel htmlFor="date">วันที่เริ่ม</FormLabel>
        <SingleDatepicker
          name="date"
          id="date"
          date={formData.date}
          onDateChange={(e) => handleChange({ name: "date", value: e })}
          configs={{
            dateFormat: "dd-MM-yyyy",
          }}
          
        />
      </FormControl>

      <FormControl marginBottom="1rem">
        <FormLabel htmlFor="dateEnd">วันที่สิ้นสุด</FormLabel>
        <Checkbox
          name="isDateEnd"
          id="isDateEnd"
          isChecked={isDateEnd}
          value={isDateEnd}
          onChange={() => setIsDateEnd((prev) => !prev)}
        />
        {isDateEnd && (
          <SingleDatepicker
            name="dateEnd"
            id="dateEnd"
            date={formData.dateEnd}
            onDateChange={(e) => handleChange({ name: "dateEnd", value: e })}
            configs={{
              dateFormat: "dd-MM-yyyy",
            }}
            disabled={!isDateEnd}
            minDate={formData.date}
          />
        )}
      </FormControl>

      <FormControl marginBottom="1rem">
        <FormLabel htmlFor="images">รูปภาพ</FormLabel>
        <Grid templateColumns="repeat(5, 1fr)" gap={6}>
          {formData.images.map((image, index) => (
            <GridItem key={index} style={{ height: "300px", width: "300px" }}>
              <DeleteIcon
                marginLeft={2}
                marginTop={1}
                _hover={{ cursor: "pointer" }}
                position="absolute"
                color="red"
                onClick={() => handleDeleteImage(index)}
              />
              <img
                style={{ height: "300px", width: "300px" }}
                src={image}
                alt=""
              />
            </GridItem>
          ))}
        </Grid>
        <input
          type="file"
          id="images"
          name="images"
          multiple
          accept="image/*"
          onChange={handleFileChange}
        />
      </FormControl>
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
    <Modal isOpen={stateOpen} onClose={closeModal} size="full">
      <ModalOverlay />
      <ModalContent>
        <Container maxW="container.xl">
          {isSubmitting ? (
            <Center
              // make it middle of screen
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
              <ModalBody>{formAddProject}</ModalBody>
              <ModalFooter>
                <Button colorScheme="red" mr={3} onClick={closeModal}>
                  ยกเลิก
                </Button>
              </ModalFooter>
            </>
          )}
        </Container>
      </ModalContent>
    </Modal>
  );

  async function getEditProjectData() {
    setIsSubmitting(true);
    const res = await getProjectByID(projectID);
    const project = res.data;

    if (project.dateEnd) {
      setIsDateEnd(true);
      setIsDateEndOld(true);
    } else {
      setIsDateEnd(false);
      setIsDateEndOld(false);
    }
    const form = {
      title: project.title,
      detail: project.detail ? project.detail : "",
      customer: project.customer,
      profit: project.profit ? addCommas(removeNonNumeric(project.profit)) : "",
      date: new Date(project.date),
      images: project.images ? project.images : [],
      dateEnd: project.dateEnd ? new Date(project.dateEnd) : new Date(),
    };
    setFormData(form);
    setFormOldData(form);

    setIsSubmitting(false);
  }

  async function addSubmit() {
    setIsSubmitting(true);
    let passData = {
      title: formData.title,
      detail: formData.detail,
      customer: formData.customer,
      profit: removeCommaParseFloat(formData.profit),
      date: moment(formData.date).format("YYYY-MM-DD"),
    };
    if (formData.images.length > 0) {
      passData.images = formData.images;
    }

    if (isDateEnd) {
      passData.dateEnd = moment(formData.dateEnd).format("YYYY-MM-DD");
    }

    const res = await addProject(passData);
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
    const imageUpdate = checkImageUpdate();
    let passData;
    passData = {
      workID: projectID,
      title: formData.title,
      profit: removeCommaParseFloat(formData.profit),
      date: moment(formData.date).format("YYYY-MM-DD"),
      customer: formData.customer,
      detail: formData.detail,
    };
    if (isDateEnd) {
      passData.dateEnd = moment(formData.dateEnd).format("YYYY-MM-DD");
    }
    if (imageUpdate.imagesDelete.length > 0) {
      passData.imagesDelete = imageUpdate.imagesDelete;
    }
    if (imageUpdate.imagesAdd.length > 0) {
      passData.imagesAdd = imageUpdate.imagesAdd;
    }
    const res = await updateProject(passData);
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

  function removeCommaParseFloat(value) {
    return parseFloat(value.replace(/,/g, ""));
  }

  function closingModal() {
    setFormData(defaultForm);
    setFormOldData(defaultForm);
    closeModal();
  }

  function checkImageUpdate() {
    //find image delete or add from old data
    let imagesDelete = [];
    let imagesAdd = [];
    console.log(formData.images, formOldData.images);
    imagesDelete = formOldData.images.filter(
      (image) => !formData.images.includes(image)
    );
    imagesAdd = formData.images.filter(
      (image) => !formOldData.images.includes(image)
    );

    return {
      imagesDelete,
      imagesAdd,
    };
  }
}
