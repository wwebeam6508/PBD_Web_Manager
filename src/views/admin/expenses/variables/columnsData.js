export const expenseDataColumns = [
  {
    Header: "ชื่อรายการ",
    accessor: "title",
    sort: "desc",
    isSort: false,
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
  // sorry for my bad english but now i am lazy because i have to fix  in database too
  {
    Header: "ผู้ขาย",
    accessor: "customerRef",
  },
  {
    Header: "งานที่เกี่ยวข้อง",
    accessor: "workRef",
  },
];
