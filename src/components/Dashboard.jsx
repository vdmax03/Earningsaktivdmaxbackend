import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { useNavigate } from 'react-router-dom'
import { 
  TrendingUp, 
  Users, 
  Target, 
  Sparkles, 
  DollarSign,
  Activity,
  Play,
  Pause
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

// Mock data untuk fallback jika API tidak tersedia
const MOCK_CAMPAIGNS = [
  {
    id: 1,
    campaign_name: "Kampanye TikTok Effect House",
    campaign_type: "effect_house",
    current_count: 120,
    target_count: 500,
    status: "running",
    created_at: "2023-08-15T12:00:00Z"
  },
  {
    id: 2,
    campaign_name: "YouTube View Campaign",
    campaign_type: "youtube",
    current_count: 450,
    target_count: 1000,
    status: "stopped",
    created_at: "2023-07-22T14:30:00Z"
  }
];

const MOCK_EARNINGS_DATA = [
  { name: 'Jan', earnings: 120 },
  { name: 'Feb', earnings: 190 },
  { name: 'Mar', earnings: 300 },
  { name: 'Apr', earnings: 500 },
  { name: 'May', earnings: 200 },
  { name: 'Jun', earnings: 280 },
  { name: 'Jul', earnings: 400 }
];

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalAccounts: 0,
    totalEffects: 0,
    totalEarnings: 0
  })
  const [recentCampaigns, setRecentCampaigns] = useState([])
  const [earningsData, setEarningsData] = useState([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token')
      const headers = {
        'Authorization': `Bearer ${token}`,  // Perbaiki template literal
        'Content-Type': 'application/json'
      }
      
      // Helper to fetch data and handle HTTP errors gracefully
      const fetchData = async (endpoint) => {
        try {
          const response = await fetch(endpoint, { headers });
          if (!response.ok) {
            console.error(`HTTP Error: ${response.status} for endpoint ${endpoint}`);
            return null;
          }
          return response.json();
        } catch (error) {
          console.error(`Failed to fetch ${endpoint}:`, error);
          return null;
        }
      };

      // Fetch all data concurrently for better performance
      const [campaignsData, accountsData, effectsData, earningsDataResponse] = await Promise.all([
        fetchData('/api/campaigns'),
        fetchData('/api/accounts'),
        fetchData('/api/effects'),
        fetchData('/api/effect-house/earnings')
      ]);

      // Fallback ke mock data jika API tidak tersedia
      const campaigns = campaignsData?.campaigns || MOCK_CAMPAIGNS;
      
      setStats({
        totalCampaigns: campaigns.length || 0,
        activeCampaigns: campaigns.filter(c => c.status === 'running').length || 0,
        totalAccounts: accountsData?.accounts?.length || 0,
        totalEffects: effectsData?.effects?.length || 0,
        totalEarnings: earningsDataResponse?.total_earnings || 0
      })

      setRecentCampaigns(campaigns.slice(0, 5) || [])
      setEarningsData(earningsDataResponse?.earnings_data || MOCK_EARNINGS_DATA)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast({
        title: "Error loading dashboard",
        description: "Failed to load dashboard data. Using sample data instead.",
        variant: "destructive"
      })
      
      // Fallback ke mock data
      setStats({
        totalCampaigns: MOCK_CAMPAIGNS.length,
        activeCampaigns: MOCK_CAMPAIGNS.filter(c => c.status === 'running').length,
        totalAccounts: 1,
        totalEffects: 3,
        totalEarnings: 1590
      })
      setRecentCampaigns(MOCK_CAMPAIGNS)
      setEarningsData(MOCK_EARNINGS_DATA)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCampaign = () => {
    navigate('/campaigns', { state: { openCreate: true } });
  }

  const handleToggleCampaignStatus = (campaignId, currentStatus) => {
    const newStatus = currentStatus === 'running' ? 'stopped' : 'running';
    
    // Update local state immediately for responsive UI
    setRecentCampaigns(prevCampaigns => 
      prevCampaigns.map(campaign => 
        campaign.id === campaignId 
          ? { ...campaign, status: newStatus } 
          : campaign
      )
    );
    
    toast({
      title: newStatus === 'running' ? "Kampanye dijalankan" : "Kampanye dihentikan",
      description: `Status kampanye telah diubah menjadi ${newStatus === 'running' ? 'berjalan' : 'berhenti'}.`
    });
    
    // API call would go here in a real app
  }

  const statCards = [
    {
      title: 'Total Kampanye',
      value: stats.totalCampaigns,
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Kampanye Aktif',
      value: stats.activeCampaigns,
      icon: Activity,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Akun TikTok',
      value: stats.totalAccounts,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Total Efek',
      value: stats.totalEffects,
      icon: Sparkles,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      title: 'Pendapatan',
      value: `$${stats.totalEarnings.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100'
    }
  ]

  const getStatusBadge = (status) => {
    const statusConfig = {
      'running': { variant: 'default', label: 'Berjalan' },
      'completed': { variant: 'secondary', label: 'Selesai' },
      'stopped': { variant: 'destructive', label: 'Dihentikan' },
      'inactive': { variant: 'outline', label: 'Tidak Aktif' }
    }
    
    const config = statusConfig[status] || { variant: 'outline', label: status }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Selamat Datang di Earning Sakti</h2>
        <p className="text-blue-100">
          Platform otomatisasi pendapatan digital yang membantu Anda mengoptimalkan kampanye dan efek TikTok
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="bg-background/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Earnings Chart */}
        <Card className="bg-background/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Pendapatan Bulanan</CardTitle>
            <CardDescription>
              Grafik pendapatan dari Effect House dalam 7 bulan terakhir
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={earningsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Pendapatan']} />
                <Line 
                  type="monotone" 
                  dataKey="earnings" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Campaign Types Chart */}
        <Card className="bg-background/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Jenis Kampanye</CardTitle>
            <CardDescription>
              Distribusi kampanye berdasarkan jenis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[
                { name: 'Web', value: 12 },
                { name: 'YouTube', value: 8 },
                { name: 'Effect House', value: 15 },
                { name: 'SoundOn', value: 5 },
                { name: 'Adisterra', value: 3 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Campaigns */}
      <Card className="bg-background/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Kampanye Terbaru</CardTitle>
          <CardDescription>
            5 kampanye yang baru dibuat atau diperbarui
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentCampaigns.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Target className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Belum ada kampanye. Buat kampanye pertama Anda!</p>
              <Button className="mt-4" onClick={handleCreateCampaign}>Buat Kampanye</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {recentCampaigns.map((campaign) => (
                <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Target className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">{campaign.campaign_name}</h4>
                      <p className="text-sm text-gray-500">
                        {campaign.campaign_type} • {campaign.current_count}/{campaign.target_count}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(campaign.status)}
                    {campaign.status === 'running' ? (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleToggleCampaignStatus(campaign.id, campaign.status)}
                      >
                        <Pause className="h-4 w-4 mr-1" />
                        Pause
                      </Button>
                    ) : (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleToggleCampaignStatus(campaign.id, campaign.status)}
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Start
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard