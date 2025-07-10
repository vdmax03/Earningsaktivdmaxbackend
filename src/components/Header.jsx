import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Bell, LogOut, User, Settings, Sun, Moon } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '@/components/theme-provider'

const Header = ({ user, onLogout }) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()
  const { theme, setTheme } = useTheme()

  const getInitials = (username) => {
    return username ? username.substring(0, 2).toUpperCase() : 'U'
  }

  const handleProfile = () => {
    toast({
      title: "Profil",
      description: "Fitur profil akan segera tersedia"
    })
  }

  const handleSettings = () => {
    toast({
      title: "Pengaturan",
      description: "Fitur pengaturan akan segera tersedia"
    })
  }

  const handleNotifications = () => {
    setNotificationsOpen(!notificationsOpen)
    toast({
      title: "Notifikasi",
      description: "Anda memiliki 3 notifikasi baru"
    })
  }

  const handleThemeToggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
    toast({
      title: `Mode ${theme === 'dark' ? 'Terang' : 'Gelap'} Aktif`,
      description: `Tampilan berubah ke mode ${theme === 'dark' ? 'terang' : 'gelap'}`
    })
  }

  const handleLogout = () => {
    // Confirm logout
    const confirmed = window.confirm("Apakah Anda yakin ingin keluar?")
    
    if (confirmed) {
      // Call the onLogout prop function
      onLogout()
      
      // Navigate to login page (will be handled by auth check in App.jsx)
      // This is optional since App.jsx should handle redirects based on auth status
      navigate('/')
    }
  }

  return (
    <header className="bg-background shadow-sm border-b">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
          <h1 className="text-2xl font-semibold text-foreground">
            Dashboard Earning Sakti
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <Button variant="ghost" size="sm" onClick={handleThemeToggle}>
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative" onClick={handleNotifications}>
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-blue-600 text-white">
                    {getInitials(user?.username)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.username || 'User'}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email || 'user@example.com'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleProfile}>
                <User className="mr-2 h-4 w-4" />
                <span>Profil</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSettings}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Pengaturan</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Keluar</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

export default Header