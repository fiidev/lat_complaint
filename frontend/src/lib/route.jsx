import { createBrowserRouter, Navigate } from 'react-router-dom'
import Layout from '../components/Layout'
import Login from '../pages/Auth/Login'
import Register from '../pages/Auth/Register'
import RoomList from '../pages/Rooms/RoomList'
import RoomCreate from '../pages/Rooms/RoomCreate'
import RoomEdit from '../pages/Rooms/RoomEdit'
import CategoryList from '../pages/Categories/CategoryList'
import CategoryCreate from '../pages/Categories/CategoryCreate'
import CategoryEdit from '../pages/Categories/CategoryEdit'
import ComplaintList from '../pages/Complaints/ComplaintList'
import ComplaintCreate from '../pages/Complaints/ComplaintCreate'
import ComplaintDetail from '../pages/Complaints/ComplaintDetail'
import AdminComplaints from '../pages/Complaints/AdminComplaints'
import TicketCreate from '../pages/Tickets/TicketCreate'
import TicketList from '../pages/Tickets/TicketList'
import TicketDetail from '../pages/Tickets/TicketDetail'
import ReportDashboard from '../pages/Reports/ReportDashboard'

export const router = createBrowserRouter([
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Navigate to="/login" replace /> },
      { path: '/rooms', element: <RoomList /> },
      { path: '/rooms/create', element: <RoomCreate /> },
      { path: '/rooms/:id/edit', element: <RoomEdit /> },
      { path: '/categories', element: <CategoryList /> },
      { path: '/categories/create', element: <CategoryCreate /> },
      { path: '/categories/:id/edit', element: <CategoryEdit /> },
      { path: '/complaints', element: <ComplaintList /> },
      { path: '/complaints/create', element: <ComplaintCreate /> },
      { path: '/complaints/:id', element: <ComplaintDetail /> },
      { path: '/admin/complaints', element: <AdminComplaints /> },
      { path: '/complaints/:id/create-ticket', element: <TicketCreate /> },
      { path: '/tickets', element: <TicketList /> },
      { path: '/tickets/:id', element: <TicketDetail /> },
      { path: '/reports', element: <ReportDashboard /> },
    ],
  },
  { path: '*', element: <Navigate to="/login" replace /> },
])
