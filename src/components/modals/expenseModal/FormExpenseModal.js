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
} from "@chakra-ui/react";
import Select from "react-select";
import React, { useEffect, useState } from "react";
import { isEmpty } from "util/helper";
import _ from "lodash";
import { addExpense } from "api/expenses";
import { updateExpense } from "api/expenses";
import { getExpenseByID } from "api/expenses";
import { IoRemoveCircleOutline } from "react-icons/io5";
import { SingleDatepicker } from "chakra-dayzed-datepicker";
import moment from "moment";

export default function FormExpenseModal({
  stateOpen = false,
  isEdit = false,
  closeModal,
  expenseID = null,
  projects = [],
}) {
  const defaultForm = {
    title: "",
    detail: "",
    date: new Date(),
    lists: [
      {
        title: "",
        price: "",
      },
    ],
    currentVat: 0,
    workRef: "",
  };
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(defaultForm);
  const [formOldData, setFormOldData] = useState(defaultForm);
  const [isVat, setIsVat] = useState(false);

  useEffect(() => {
    if (isEdit) {
      getEditExpenseData();
    } else {
      setFormData(defaultForm);
      setFormOldData(defaultForm);
    }
  }, [isEdit]);

  useEffect(() => {
    if (isVat) {
      if (isEdit) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          currentVat: formOldData.currentVat > 0 ? formOldData.currentVat : 7,
        }));
      } else {
        setFormData((prevFormData) => ({
          ...prevFormData,
          currentVat: 7,
        }));
      }
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        currentVat: 0,
      }));
    }
  }, [isVat]);

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

  const addCommas = (num) =>
    num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const removeNonNumeric = (num) => num.toString().replace(/[^0-9]/g, "");

  const validation = () => {
    const requried = ["title"];
    for (let i = 0; i < requried.length; i++) {
      const req = requried[i];
      if (isEmpty(formData[req])) {
        return true;
      }
    }
    return false;
  };

  const handleListChange = (e, index) => {
    if (e.target) {
      let { name, value } = e.target;
      if (name === "lists_price") {
        value = addCommas(removeNonNumeric(value));
      }
      const true_name = e.target.name.split("_")[1];
      let lists = [...formData.lists];
      lists[index][true_name] = value;
      setFormData((prevFormData) => ({
        ...prevFormData,
        lists: lists,
      }));
    }
  };

  const editValidtion = () => {
    //check if form data is not change
    const compareData = formData;
    const compareDataOld = formOldData;
    if (JSON.stringify(compareData) === JSON.stringify(compareDataOld)) {
      return true;
    }
    return false;
  };

  const onAddLists = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      lists: [
        ...prevFormData.lists,
        {
          title: "",
          price: "",
        },
      ],
    }));
  };

  const handleRemoveList = (index) => {
    let lists = [...formData.lists];
    lists.splice(index, 1);
    setFormData((prevFormData) => ({
      ...prevFormData,
      lists: lists,
    }));
  };

  const formAddExpense = (
    <form>
      <Grid templateColumns="repeat(2, 1fr)" gap={6}>
        <GridItem>
          <FormControl marginBottom="1rem">
            <FormLabel htmlFor="title">ชื่อรายการ</FormLabel>
            <Input
              type="text"
              id="title"
              name="title"
              placeholder="ชื่อรายการ"
              value={formData.title}
              onChange={handleChange}
            />
            {isEmpty(formData.title) && (
              <Text color="red.500" marginBottom="1rem">
                กรุณากรอกชื่อรายการใช้จ่าย
              </Text>
            )}
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl marginBottom="1rem">
            <FormLabel htmlFor="expense">รายละเอียด</FormLabel>
            <Textarea
              type="text"
              id="detail"
              name="detail"
              placeholder="รายละเอียด"
              value={formData.detail}
              onChange={handleChange}
            />
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl marginBottom="1rem">
            <FormLabel htmlFor="date">วันที่</FormLabel>
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
        </GridItem>

        <FormControl marginBottom="1rem">
          <FormLabel htmlFor="workRef">อ้างอิงงาน</FormLabel>
          <Select
            placeholder="เลือกงาน"
            name="workRef"
            value={{
              label: projects.find((project) => project.id === formData.workRef)
                ?.title,
            }}
            onChange={(e) => {
              setFormData((prevFormData) => ({
                ...prevFormData,
                workRef: e.value,
              }));
            }}
            options={projects.map((project) => {
              return {
                value: project.id,
                label: project.title,
              };
            })}
          />
        </FormControl>
      </Grid>
      <Grid>
        <GridItem>
          <FormControl marginBottom="1rem">
            <FormLabel htmlFor="lists">รายการ</FormLabel>
            {
              <Grid templateColumns="repeat(12, 1fr)" gap={1}>
                {formData.lists.map((list, index) => (
                  <GridItem colSpan={12} key={`list${index}`}>
                    <Grid templateColumns="repeat(12, 1fr)" gap={1}>
                      <GridItem colSpan={9}>
                        <Input
                          type="text"
                          id="lists_title"
                          name="lists_title"
                          placeholder="รายการใช้จ่าย"
                          value={list.title}
                          onChange={(e) => handleListChange(e, index)}
                        />
                      </GridItem>
                      <GridItem colSpan={2}>
                        <Input
                          type="text"
                          id="lists_price"
                          name="lists_price"
                          placeholder="ราคา"
                          value={list.price}
                          onChange={(e) => handleListChange(e, index)}
                        />
                      </GridItem>
                      <GridItem colSpan={1}>
                        <IoRemoveCircleOutline
                          size={20}
                          color="red"
                          onClick={() => handleRemoveList(index)}
                          style={{ cursor: "pointer" }}
                        />
                      </GridItem>
                    </Grid>
                  </GridItem>
                ))}
              </Grid>
            }
            <Button
              marginTop={"1rem"}
              left={"50%"}
              type="button"
              onClick={onAddLists}
            >
              <AddIcon />
            </Button>

            <GridItem colSpan={12}>
              <Grid templateColumns="repeat(12, 1fr)" gap={1}>
                <GridItem colStart={10} colSpan={1}>
                  <Text fontSize="sm" fontWeight="700">
                    ราคารวม
                  </Text>
                </GridItem>
                <GridItem colStart={11} colSpan={1}>
                  <Text fontSize="sm" color={`red.400`} fontWeight="700">
                    {formData.lists
                      .reduce((sum, list) => {
                        return sum + Number(removeNonNumeric(list.price));
                      }, 0)
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </Text>
                </GridItem>
                <GridItem colStart={10} colSpan={2}>
                  <Checkbox
                    id="isVat"
                    name="isVat"
                    isChecked={isVat}
                    onChange={() => {
                      setIsVat((prevIsVat) => !prevIsVat);
                    }}
                  >
                    บิลภาษี
                  </Checkbox>
                </GridItem>
                {isVat && (
                  <>
                    <GridItem colStart={10} colSpan={1}>
                      <Text fontWeight="700">ภาษีมูลค่าเพิ่ม</Text>
                      <NumberInput
                        defaultValue={7}
                        id="currentVat"
                        name="currentVat"
                        value={formData.currentVat}
                        onChange={(e) => {
                          handleChange({
                            target: {
                              name: "currentVat",
                              value: e,
                            },
                          });
                        }}
                      >
                        <NumberInputField />
                      </NumberInput>
                      %
                    </GridItem>
                    <GridItem colStart={11} colSpan={1}>
                      <Text fontSize="sm" color={`green.400`} fontWeight="700">
                        {(
                          formData.lists.reduce((sum, list) => {
                            return sum + Number(removeNonNumeric(list.price));
                          }, 0) *
                          (formData.currentVat / 100)
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        ).toFixed(2)}
                      </Text>
                    </GridItem>
                  </>
                )}
              </Grid>
            </GridItem>
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
                {!isEdit ? "เพิ่มรายการงาน" : "แก้ไขรายการงาน"}
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>{formAddExpense}</ModalBody>
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

  async function getEditExpenseData() {
    setIsSubmitting(true);
    const res = await getExpenseByID(expenseID);
    const expense = res.data;

    const form = {
      ...expense,
      detail: expense.detail ? expense.detail : "",
      date: new Date(expense.date),
      lists: expense.lists
        ? expense.lists.map((list) => {
            return {
              title: list.title,
              price: addCommas(removeNonNumeric(list.price)),
            };
          })
        : [],
      workRef: expense.workRef ? expense.workRef : "",
    };
    setFormData(_.cloneDeep(form));
    setFormOldData(_.cloneDeep(form));
    if (expense.currentVat > 0) {
      setIsVat(true);
    }
    setIsSubmitting(false);
  }

  async function addSubmit() {
    setIsSubmitting(true);
    const lists = formData.lists.filter((list) => {
      return list.title !== "" && list.price !== "";
    });

    let passData = {
      ...formData,
      date: moment(formData.date).format("YYYY-MM-DD"),
      lists: lists.map((list) => {
        return {
          title: list.title,
          price: removeCommaParseFloat(list.price),
        };
      }),
      currentVat: isVat ? formData.currentVat : 0,
    };
    try {
      await addExpense(passData)
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
    const lists = formData.lists.filter((list) => {
      return list.title !== "" && list.price !== "";
    });
    const trueLists = lists.map((list) => {
      return {
        title: list.title,
        price: removeCommaParseFloat(list.price),
      };
    });
    const trueOldData = formOldData.lists.map((list) => {
      return {
        title: list.title,
        price: removeCommaParseFloat(list.price),
      };
    });
    const addLists = trueLists.filter((list) => {
      return !trueOldData.some((oldList) => {
        return oldList.title === list.title && oldList.price === list.price;
      });
    });
    const removeLists = trueOldData.filter((oldList) => {
      return !trueLists.some((list) => {
        return list.title === oldList.title && list.price === oldList.price;
      });
    });

    let passData;
    passData = {
      ..._.cloneDeep(formData),
      date: moment(formData.date).format("YYYY-MM-DD"),
      expenseID: expenseID,
      addLists: addLists,
      removeLists: removeLists,
      currentVat: isVat ? formData.currentVat : 0,
    };
    delete passData.lists;
    delete passData._id;
    try {
      await updateExpense(passData)
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

  function removeCommaParseFloat(value) {
    return parseFloat(value.replace(/,/g, ""));
  }
  function closingModal() {
    setFormData(defaultForm);
    setFormOldData(defaultForm);
    closeModal();
  }
}
