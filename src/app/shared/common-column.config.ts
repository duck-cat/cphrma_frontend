  
  
  export const menuItems: NavMenuItem[] = [
    { label: 'Inventory', icon: 'pi pi-box', key: 'inventory' },
    { label: 'Orders', icon: 'pi pi-shopping-cart', key: 'orders', badge: 6 },
    { label: 'Customers', icon: 'pi pi-user', key: 'customer', badge: 0 },
    { label: 'Supplier', icon: 'pi pi-verified', key: 'supplier', badge: 0 },
    { label: 'Billing', icon: 'pi pi-receipt', key: 'billing', badge: 0 },
    { label: 'Approvals', icon: 'pi pi-check-circle', key: 'approvals', badge: 3 },
    { label: 'Settings', icon: 'pi pi-cog', key: 'settings' },
  ];

 export const orderStatusOptions = [
    { label: 'Pending', value: 'Pending' },
    { label: 'Processing', value: 'Processing' },
    { label: 'Shipped', value: 'Shipped' },
    { label: 'Delivered', value: 'Delivered' },
    { label: 'Cancelled', value: 'Cancelled' },
  ];

  interface NavMenuItem {
  label: string;
  icon: string;
  key: string;
  badge?: number;
}

  export const priorityOptions = [
    { label: 'High', value: 'High' },
    { label: 'Medium', value: 'Medium' },
    { label: 'Low', value: 'Low' },
  ];

  export const approvalStatusOptions = [
    { label: 'Pending', value: 'Pending' },
    { label: 'Approved', value: 'Approved' },
    { label: 'Rejected', value: 'Rejected' },
  ];


   export const columnsMap: Record<string, Array<any>> = {
    inventory: [
       { field: 'barcode', title: 'Scan',type:"barcode",required:true,show_tbl:0},
      { field: 'item_number', title: 'Item #',type:"text",required:true,show_tbl:1},
      { field: 'item_name', title: 'Name' ,type:"text",required:true,show_tbl:1},
      { field: 'quantity', title: 'Qty',type:"number",required:true ,show_tbl:1},
      { field: 'price', title: 'Price',type:"text",required:true ,show_tbl:1},
      { field: 'location', title: 'Location',type:"text",required:true ,show_tbl:1},
      { field: 'expiry_date', title: 'Expiry' , type: 'datepicker',show_tbl:1},
       { field: 'supplier', title: 'Supplier' , type: 'dropdown',required:true,show_tbl:1},
        { field: 'type', title: 'Type' , type: 'dropdown',required:true,show_tbl:1},
    ],
    orders: [
      { field: 'id', title: 'Order ID' ,required:true,show_tbl:1},
      { field: 'customer', title: 'Customer' ,required:true,show_tbl:1},
      { field: 'product', title: 'Product' ,required:true,show_tbl:1},
      { field: 'quantity', title: 'Qty' ,required:true,show_tbl:1},
      { field: 'date', title: 'Date',required:true,show_tbl:1 },
      { field: 'status', title: 'Status' ,required:true,show_tbl:1},
    ],
       customer: [
      { field: 'member_id', title: 'Member ID' ,required:true,show_tbl:1},
      { field: 'name', title: 'Full Name' ,required:true,show_tbl:1},
      { field: 'gender', title: 'Gender',required:true,show_tbl:1 },
      { field: 'mobile', title: 'Mobile' ,required:true,show_tbl:1},
      { field: 'dob', title: 'Date of Birth',required:true,show_tbl:1 },
      { field: 'catogary', title: 'Catogary' ,required:true,show_tbl:1},
      { field: 'purchage', title: 'Purchage History',required:true,show_tbl:1 },
      { field: 'd_name', title: 'Doctor Name',required:true,show_tbl:1 },
      { field: 'address', title: 'AddressName',required:true,show_tbl:1 }
    ],
    approvals: [
      { field: 'id', title: 'Request ID',required:true,show_tbl:1 },
      { field: 'requestedBy', title: 'Requested By' ,required:true,show_tbl:1},
      { field: 'type', title: 'Type' ,required:true,show_tbl:1},
      { field: 'date', title: 'Date',required:true,show_tbl:1 },
      { field: 'priority', title: 'Priority',required:true,show_tbl:1 },
      { field: 'status', title: 'Status' ,required:true,show_tbl:1},
    ],
    settings: [
      { field: 'id', title: '#' },
      { field: 'setting', title: 'Setting' },
      { field: 'value', title: 'Value' },
      { field: 'category', title: 'Category' },
      { field: 'description', title: 'Description' },
    ],
    supplier:[
  { field: 'supplierId', title: 'Supplier ID', required: true, show_tbl: 1,type:"text" },
  { field: 'supplierName', title: 'Supplier Name', required: true, show_tbl: 1,type:"text" },
  { field: 'supplierType', title: 'Supplier Type', type: 'dropdown', required: false, show_tbl: 1 },
  { field: 'mobileNumber', title: 'Mobile Number', type: 'text', required: true, show_tbl: 1 },
  { field: 'emailAddress', title: 'Email Address', type: 'text', required: true, show_tbl: 1 },
  { field: 'addressLine', title: 'Address Line', type: 'textarea', required: true, show_tbl: 1 }
]
  };