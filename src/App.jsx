import { Routes, Route } from 'react-router-dom'
import { Box } from '@mui/material'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Fields from './pages/Fields'
import FieldDetail from './pages/FieldDetail'
import Tournaments from './pages/Tournaments'
import TournamentDetail from './pages/TournamentDetail'
import Teams from './pages/Teams'
import TeamDetail from './pages/TeamDetail'
import Players from './pages/Players'
import PlayerProfile from './pages/PlayerProfile'
import Requests from './pages/Requests'
import Login from './pages/Login'
import OwnerDashboard from './pages/OwnerDashboard'
import RentalStore from './pages/RentalStore'

function App() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/fields" element={<Fields />} />
          <Route path="/field/:id" element={<FieldDetail />} />
          <Route path="/tournaments" element={<Tournaments />} />
          <Route path="/tournament/:id" element={<TournamentDetail />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/team/:id" element={<TeamDetail />} />
          <Route path="/players" element={<Players />} />
          <Route path="/player/:id" element={<PlayerProfile />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/login" element={<Login />} />
          <Route path="/owner-dashboard" element={<OwnerDashboard />} />
          <Route path="/rental" element={<RentalStore />} />
        </Routes>
      </Box>
      <Footer />
    </Box>
  )
}

export default App
