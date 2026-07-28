/**\n * Purpose: Định nghĩa route cho màn hình quản trị viên.\n * Dùng cho các trang chỉ admin có thể truy cập.\n */
//import AdminLayout from \"../../layouts/AdminLayout\";\nimport AdminScreen from \"../../pages/admin\";\n\nexport const adminRoutes = [\n  {\n    path: \"/admin\",\n    element: <AdminLayout><AdminScreen /></AdminLayout>,\n  },\n];\n
