  
  
  export const menuItems: NavMenuItem[] = [
    { label: 'Inventory', icon: 'pi pi-box', key: 'inventory' },
    { label: 'Orders', icon: 'pi pi-shopping-cart', key: 'orders', badge: 6 },
    { label: 'Customer', icon: 'pi pi-user', key: 'customer', badge: 0 },
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


   export const columnsMap: Record<string, Array<{ field: string; header: string }>> = {
    inventory: [
      { field: 'item_number', header: 'Item #' },
      { field: 'item_name', header: 'Name' },
      { field: 'quantity', header: 'Qty' },
      { field: 'price', header: 'Price' },
      { field: 'location', header: 'Location' },
      { field: 'expiry_date', header: 'Expiry' },
    ],
    orders: [
      { field: 'id', header: 'Order ID' },
      { field: 'customer', header: 'Customer' },
      { field: 'product', header: 'Product' },
      { field: 'quantity', header: 'Qty' },
      { field: 'date', header: 'Date' },
      { field: 'status', header: 'Status' },
    ],
       customer: [
      { field: 'member_id', header: 'Member ID' },
      { field: 'name', header: 'Full Name' },
      { field: 'gender', header: 'Gender' },
      { field: 'mobile', header: 'Mobile' },
      { field: 'dob', header: 'Date of Birth' },
      { field: 'catogary', header: 'Catogary' },
      { field: 'purchage', header: 'Purchage History' },
      { field: 'd_name', header: 'Doctor Name' },
      { field: 'address', header: 'AddressName' }
    ],
    approvals: [
      { field: 'id', header: 'Request ID' },
      { field: 'requestedBy', header: 'Requested By' },
      { field: 'type', header: 'Type' },
      { field: 'date', header: 'Date' },
      { field: 'priority', header: 'Priority' },
      { field: 'status', header: 'Status' },
    ],
    settings: [
      { field: 'id', header: '#' },
      { field: 'setting', header: 'Setting' },
      { field: 'value', header: 'Value' },
      { field: 'category', header: 'Category' },
      { field: 'description', header: 'Description' },
    ],
  };