import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, Target, Users, Sparkles, Settings, Shield, 
  Globe, Zap, AlertTriangle, BarChart, Database, MonitorSmartphone, 
  Megaphone, Goal, List
} from 'lucide-react'

const navigation = [
  // Main Menu
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Kampanye', href: '/campaigns', icon: Target },
  { name: 'Akun TikTok', href: '/accounts', icon: Users },
  { name: 'Effect House', href: '/effects', icon: Sparkles },
  
  // Settings Menu Header (Non-clickable divider)
  { name: 'PENGATURAN', href: null, icon: null, divider: true },
  
  // Settings Sub-menu
  { name: 'General', href: '/settings/general', icon: Settings },
  { name: 'Lock Phone Country', href: '/settings/lock-phone', icon: AlertTriangle },
  { name: 'Sumber Ads', href: '/settings/ads-source', icon: Megaphone },
  { name: 'Type Block', href: '/settings/block-rules', icon: Shield },
  { name: 'Hack to target', href: '/settings/hack-target', icon: Goal },
  { name: 'Country target', href: '/settings/countries', icon: Globe },
  { name: 'Tujuan', href: '/settings/destinations', icon: List },
]

const Sidebar = () => {
  const location = useLocation()

  return (
    <div className="flex flex-col w-64 bg-gray-900">
      <div className="flex items-center justify-center h-16 px-4 bg-gray-800">
        <div className="flex items-center">
          <Zap className="h-8 w-8 text-yellow-400 mr-2" />
          <span className="text-xl font-bold text-white">Earning Sakti</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          // If it's a divider, render a divider
          if (item.divider) {
            return (
              <div key={item.name} className="pt-4 pb-2">
                <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {item.name}
                </p>
              </div>
            );
          }
          
          // If it's a regular navigation item
          const isActive = location.pathname === item.href;
          return item.href ? (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              )}
            >
              {item.icon && <item.icon className="mr-3 h-5 w-5" />}
              {item.name}
            </Link>
          ) : null;
        })}
      </nav>

      <div className="px-4 py-4 border-t border-gray-700">
        <div className="flex items-center px-3 py-2 text-sm text-gray-400">
          <BarChart className="mr-3 h-4 w-4" />
          <span>Status: Online</span>
        </div>
      </div>
    </div>
  )
}

export default Sidebar