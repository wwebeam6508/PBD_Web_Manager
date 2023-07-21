export const projectDataColumns = [
  {
    Header: "ชื่อโครงการ",
    accessor: "title",
  },
  {
    Header: "ผู้ว่าจ้าง",
    accessor: "customer",
  },
  {
    Header: "รายได้(บาท)",
    accessor: "profit",
    sort: "desc",
    isSort: false,
  },
  {
    Header: "วันที่เริ่ม",
    accessor: "date",
    sort: "desc",
    isSort: true,
  },
  {
    Header: "วันที่สิ้นสุด",
    accessor: "dateEnd",
  },
];
