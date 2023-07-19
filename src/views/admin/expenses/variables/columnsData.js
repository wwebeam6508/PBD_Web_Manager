export const projectDataColumns = [
  {
    Header: "ชื่อรายการ",
    accessor: "title",
  },
  {
    Header: "รายจ่าย(บาท)",
    accessor: "expense",
  },
  {
    Header: "วันที่เริ่ม",
    accessor: "date",
    sort: "desc",
    isSort: true,
  },
  {
    Header: "งานที่เกี่ยวข้อง",
    accessor: "project",
  }
];
