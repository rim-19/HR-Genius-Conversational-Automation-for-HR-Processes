# Testing Role-Based Access Control

## Quick Start

1. **Clear your browser's localStorage** (important if you've logged in before):
   - Open browser DevTools (F12)
   - Go to Application/Storage tab
   - Find "Local Storage" → `http://localhost:5173` (or your dev URL)
   - Delete the `hr_genius_user` key
   - OR run this in the browser console: `localStorage.removeItem('hr_genius_user')`

2. **Start the dev server**:
   ```bash
   cd frontend
   npm run dev
   ```

3. **Login with different roles**:
   - On the login page, you'll see a "Select Role" dropdown
   - Choose a role (Admin, HR, Manager, or Employee)
   - Enter any email and password
   - Click "Sign in"

## Testing Each Role

### 🔴 Admin Role
- **Sidebar**: Dashboard, Assistant, Employees, Documents, Workflows, **Settings**
- **Dashboard**: System overview with user management links
- **Can access**: Everything
- **Test**: Try accessing `/settings` - should work
- **Test**: Try accessing `/workflows` - should work

### 🔵 HR Role
- **Sidebar**: Dashboard, Assistant, Employees, Documents, Workflows
- **Dashboard**: HR stats with "Generate Document" shortcut
- **Can access**: Employees, Documents, Workflows
- **Test**: Try accessing `/settings` - should show "Not Authorized"
- **Test**: "Add Employee" button should be visible

### 🟢 Manager Role
- **Sidebar**: Dashboard, Assistant, Employees, Documents
- **Dashboard**: "My Team" view with pending approvals
- **Can access**: Team employees and documents only
- **Test**: Try accessing `/workflows` - should show "Not Authorized"
- **Test**: "Add Employee" button should NOT be visible
- **Test**: Page title should say "My Team" not "Employees"

### ⚪ Employee Role
- **Sidebar**: Dashboard, Assistant, Documents
- **Dashboard**: Personal stats with document request form
- **Can access**: Only personal documents
- **Test**: Try accessing `/employees` - should show "Not Authorized"
- **Test**: Try accessing `/workflows` - should show "Not Authorized"
- **Test**: "Request Document" button should be visible (not "Generate")

## Visual Differences

### Role Badge
- Check the Navbar - you should see a colored badge next to your name:
  - Admin: Purple badge
  - HR: Blue badge
  - Manager: Green badge
  - Employee: Gray badge

### Sidebar Items
- Count the sidebar items - they should change based on role:
  - Admin: 6 items (including Settings)
  - HR: 5 items
  - Manager: 4 items
  - Employee: 3 items

### Dashboard Content
- The dashboard content should be completely different for each role

## Troubleshooting

### If UI doesn't change:
1. **Clear localStorage**:
   ```javascript
   localStorage.removeItem('hr_genius_user')
   ```
   Then refresh the page and login again

2. **Check browser console** for errors

3. **Verify role is correct**:
   ```javascript
   JSON.parse(localStorage.getItem('hr_genius_user')).role
   ```
   Should return: `"ADMIN"`, `"HR"`, `"MANAGER"`, or `"EMPLOYEE"`

### If you see "Not Authorized":
- This is correct! The route protection is working
- Try accessing a page that your role can access

### If old role persists:
- The role is stored in localStorage
- Clear it and login again with a different role

## Quick Test Script

Run this in browser console to quickly switch roles:

```javascript
// Test Admin
const adminUser = {
  id: '1',
  name: 'Admin User',
  email: 'admin@test.com',
  role: 'ADMIN',
  avatar: 'https://ui-avatars.com/api/?name=Admin&background=0ea5e9&color=fff'
};
localStorage.setItem('hr_genius_user', JSON.stringify(adminUser));
window.location.reload();

// Test HR
const hrUser = { ...adminUser, role: 'HR', name: 'HR User' };
localStorage.setItem('hr_genius_user', JSON.stringify(hrUser));
window.location.reload();

// Test Manager
const managerUser = { ...adminUser, role: 'MANAGER', name: 'Manager User' };
localStorage.setItem('hr_genius_user', JSON.stringify(managerUser));
window.location.reload();

// Test Employee
const employeeUser = { ...adminUser, role: 'EMPLOYEE', name: 'Employee User' };
localStorage.setItem('hr_genius_user', JSON.stringify(employeeUser));
window.location.reload();
```

