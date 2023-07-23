export const expenseDataColumns = [
  {
    Header: "ชื่อรายการ",
    accessor: "title",
  },
  {
    Header: "รายจ่าย(บาท)",
    accessor: "totalPrice",
  },
  {
    Header: "วันที่เริ่ม",
    accessor: "date",
    sort: "desc",
    isSort: true,
  },
  {
    Header: "บิลภาษี",
    accessor: "isVat",
  },
  {
    Header: "งานที่เกี่ยวข้อง",
    accessor: "workRef",
  },
];
