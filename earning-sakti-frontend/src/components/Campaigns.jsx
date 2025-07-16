import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/hooks/use-toast'
import { 
  Target, Plus, Play, Pause, Trash2, Edit, Globe, 
  Youtube, Music, BarChart, Sparkles, Zap, Facebook, 
  Instagram, Share2, TrendingUp, Upload, UserPlus
} from 'lucide-react'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter
} from "@/components/ui/dialog"

// Mock data for campaigns
const MOCK_CAMPAIGNS = [
  {
    id: 1,
    campaign_name: "Kampanye TikTok Effect House",
    campaign_type: "effect_house",
    current_count: 120,
    target_count: 500,
    status: "running",
    created_at: "2023-08-15T12:00:00Z",
    settings: {
      countries: ["US", "UK", "ID"],
      device: "all",
      blockRules: {
        proxy: true,
        vpn: true,
        badIp: true,
        tooManyBots: true
      },
      hackTarget: {
        facebook: false,
        youtube: false,
        google: false,
        tiktok: true,
        deviceOn: true
      },
      adsSource: {
        recommendation: true,
        socialMedia: true,
        search: false,
        interest: true,
        spam: false
      }
    }
  },
  {
    id: 2,
    campaign_name: "YouTube View Campaign",
    campaign_type: "youtube",
    current_count: 450,
    target_count: 1000,
    status: "stopped",
    created_at: "2023-07-22T14:30:00Z",
    settings: {
      countries: ["US", "CA", "AU"],
      device: "desktop",
      blockRules: {
        proxy: true,
        vpn: true,
        badIp: true,
        tooManyBots: false
      },
      hackTarget: {
        facebook: false,
        youtube: true,
        google: false,
        tiktok: false,
        deviceOn: true
      },
      adsSource: {
        recommendation: true,
        socialMedia: false,
        search: true,
        interest: true,
        spam: false
      }
    }
  },
  {
    id: 3,
    campaign_name: "Adsterra Revenue Boost",
    campaign_type: "adsterra",
    current_count: 750,
    target_count: 2000,
    status: "running",
    created_at: "2023-09-10T08:45:00Z",
    settings: {
      countries: ["US", "UK", "CA", "AU"],
      device: "all",
      blockRules: {
        proxy: true,
        vpn: true,
        badIp: true,
        tooManyBots: true
      },
      hackTarget: {
        facebook: false,
        youtube: false,
        google: true,
        tiktok: false,
        deviceOn: true
      },
      adsSource: {
        recommendation: true,
        socialMedia: true,
        search: true,
        interest: true,
        spam: false
      }
    }
  }
];

// Campaign types with their configurations
const CAMPAIGN_TYPES = [
  { 
    id: "effect_house", 
    name: "Up Pendapatan Effect House", 
    icon: Sparkles,
    description: "Otomatisasi pendapatan dari TikTok Effect House"
  },
  { 
    id: "youtube", 
    name: "Up Pendapatan YouTube", 
    icon: Youtube,
    description: "Tingkatkan pendapatan dari monetisasi YouTube"
  },
  { 
    id: "web", 
    name: "Up Pendapatan Web", 
    icon: Globe,
    description: "Optimasi pendapatan dari website dan blog"
  },
  { 
    id: "soundon", 
    name: "Up Pendapatan SoundOn", 
    icon: Music,
    description: "Maksimalkan pendapatan dari platform SoundOn"
  },
  { 
    id: "adsterra", 
    name: "Up Pendapatan Adsterra", 
    icon: BarChart,
    description: "Tingkatkan pendapatan dari iklan Adsterra"
  },
  { 
    id: "spam_facebook", 
    name: "Spam Facebook", 
    icon: Facebook,
    description: "Otomatisasi konten Facebook untuk engagement"
  },
  { 
    id: "spam_youtube", 
    name: "Spam YouTube", 
    icon: Youtube,
    description: "Tingkatkan views dan engagement YouTube"
  },
  { 
    id: "spam_pinterest", 
    name: "Spam Pinterest", 
    icon: Share2,
    description: "Otomatisasi posting dan engagement Pinterest"
  },
  { 
    id: "tiktok_follower", 
    name: "TikTok Follower Boost", 
    icon: UserPlus,
    description: "Tingkatkan follower akun TikTok"
  },
  { 
    id: "tiktok_jam_tayang", 
    name: "TikTok Jam Tayang", 
    icon: TrendingUp,
    description: "Tingkatkan jam tayang untuk monetisasi"
  }
];

// Country list for targeting
const COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "UK", name: "United Kingdom" },
  { code: "ID", name: "Indonesia" },
  { code: "AU", name: "Australia" },
  { code: "CA", name: "Canada" },
  { code: "ES", name: "Spain" },
  { code: "GE", name: "Germany" }
];

// Device types
const DEVICE_TYPES = [
  { value: "all", label: "All Devices" },
  { value: "desktop", label: "Desktop Only" },
  { value: "mobile", label: "Mobile Only" },
  { value: "android", label: "Android" },
  { value: "ios", label: "iOS" },
  { value: "windows", label: "Windows" },
  { value: "mac", label: "Mac" },
  { value: "linux", label: "Linux" },
  { value: "ipad", label: "iPad" }
];

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  
  // State for create/edit modal
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [currentCampaign, setCurrentCampaign] = useState({
    campaign_name: "",
    campaign_type: "effect_house",
    target_count: 1000,
    settings: {
      countries: ["US", "UK", "ID"],
      device: "all",
      blockRules: {
        proxy: true,
        vpn: true,
        badIp: true,
        tooManyBots: true
      },
      hackTarget: {
        facebook: false,
        youtube: false,
        google: false,
        tiktok: true,
        deviceOn: true
      },
      adsSource: {
        recommendation: true,
        socialMedia: true,
        search: false,
        interest: true,
        spam: false
      },
      runningLimit: 9999999,
      urlSource: ""
    }
  })
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    // Try to load from localStorage first
    const savedCampaigns = localStorage.getItem('campaigns')
    if (savedCampaigns) {
      setCampaigns(JSON.parse(savedCampaigns))
      setLoading(false)
    } else {
      fetchCampaigns()
    }
  }, [])

  const fetchCampaigns = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/campaigns', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error('API request failed')
      }
      
      const data = await response.json()
      const loadedCampaigns = data.campaigns || []
      
      // Save to localStorage
      localStorage.setItem('campaigns', JSON.stringify(loadedCampaigns))
      setCampaigns(loadedCampaigns)
    } catch (error) {
      console.error('Error fetching campaigns:', error)
      
      // Use mock data if API fails
      toast({
        title: "Tidak dapat terhubung ke server",
        description: "Menggunakan data contoh sebagai fallback",
        variant: "destructive"
      })
      
      // Save mock data to localStorage
      localStorage.setItem('campaigns', JSON.stringify(MOCK_CAMPAIGNS))
      setCampaigns(MOCK_CAMPAIGNS)
    } finally {
      setLoading(false)
    }
  }

  const saveCampaigns = (updatedCampaigns) => {
    localStorage.setItem('campaigns', JSON.stringify(updatedCampaigns))
    setCampaigns(updatedCampaigns)
  }

  const handleCreateClick = () => {
    setCurrentCampaign({
      campaign_name: "",
      campaign_type: "effect_house",
      target_count: 1000,
      settings: {
        countries: ["US", "UK", "ID"],
        device: "all",
        blockRules: {
          proxy: true,
          vpn: true,
          badIp: true,
          tooManyBots: true
        },
        hackTarget: {
          facebook: false,
          youtube: false,
          google: false,
          tiktok: true,
          deviceOn: true
        },
        adsSource: {
          recommendation: true,
          socialMedia: true,
          search: false,
          interest: true,
          spam: false
        },
        runningLimit: 9999999,
        urlSource: ""
      }
    })
    setShowCreateModal(true)
  }

  const handleCreateSubmit = () => {
    if (!currentCampaign.campaign_name) {
      toast({
        title: "Nama kampanye diperlukan",
        description: "Silakan masukkan nama kampanye",
        variant: "destructive"
      })
      return
    }

    // Generate new ID (normally done by backend)
    const newId = campaigns.length > 0 
      ? Math.max(...campaigns.map(c => c.id)) + 1 
      : 1

    const newCampaign = {
      id: newId,
      campaign_name: currentCampaign.campaign_name,
      campaign_type: currentCampaign.campaign_type,
      current_count: 0,
      target_count: parseInt(currentCampaign.target_count) || 1000,
      status: "inactive",
      created_at: new Date().toISOString(),
      settings: currentCampaign.settings
    }

    const updatedCampaigns = [newCampaign, ...campaigns]
    saveCampaigns(updatedCampaigns)
    
    setShowCreateModal(false)
    toast({
      title: "Kampanye berhasil dibuat",
      description: `Kampanye "${newCampaign.campaign_name}" telah ditambahkan`
    })
  }

  const handleEditClick = (campaign) => {
    setCurrentCampaign({
      campaign_name: campaign.campaign_name,
      campaign_type: campaign.campaign_type,
      target_count: campaign.target_count,
      settings: campaign.settings || {
        countries: ["US", "UK", "ID"],
        device: "all",
        blockRules: {
          proxy: true,
          vpn: true,
          badIp: true,
          tooManyBots: true
        },
        hackTarget: {
          facebook: false,
          youtube: false,
          google: false,
          tiktok: true,
          deviceOn: true
        },
        adsSource: {
          recommendation: true,
          socialMedia: true,
          search: false,
          interest: true,
          spam: false
        },
        runningLimit: 9999999,
        urlSource: ""
      }
    })
    setEditingId(campaign.id)
    setShowEditModal(true)
  }

  const handleEditSubmit = () => {
    if (!currentCampaign.campaign_name) {
      toast({
        title: "Nama kampanye diperlukan",
        description: "Silakan masukkan nama kampanye",
        variant: "destructive"
      })
      return
    }

    const updatedCampaigns = campaigns.map(campaign => 
      campaign.id === editingId
        ? { 
            ...campaign, 
            campaign_name: currentCampaign.campaign_name,
            campaign_type: currentCampaign.campaign_type,
            target_count: parseInt(currentCampaign.target_count) || campaign.target_count,
            settings: currentCampaign.settings
          }
        : campaign
    )
    
    saveCampaigns(updatedCampaigns)
    setShowEditModal(false)
    toast({
      title: "Kampanye berhasil diperbarui",
      description: `Kampanye "${currentCampaign.campaign_name}" telah diperbarui`
    })
  }

  const handleDelete = (campaignId) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus kampanye ini?")) {
      const updatedCampaigns = campaigns.filter(campaign => campaign.id !== campaignId)
      saveCampaigns(updatedCampaigns)
      
      toast({
        title: "Kampanye dihapus",
        description: "Kampanye berhasil dihapus dari sistem"
      })
    }
  }

  const handleToggleStatus = (campaign) => {
    const newStatus = campaign.status === 'running' ? 'stopped' : 'running'
    
    const updatedCampaigns = campaigns.map(c => 
      c.id === campaign.id 
        ? { ...c, status: newStatus } 
        : c
    )
    
    saveCampaigns(updatedCampaigns)
    
    toast({
      title: newStatus === 'running' ? "Kampanye dijalankan" : "Kampanye dihentikan",
      description: `Status kampanye "${campaign.campaign_name}" berhasil diubah`
    })
  }

  const getCampaignIcon = (type) => {
    const campaignType = CAMPAIGN_TYPES.find(ct => ct.id === type)
    if (campaignType) {
      const Icon = campaignType.icon
      return <Icon className="h-5 w-5" />
    }
    return <Target className="h-5 w-5" />
  }

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

  const getCampaignTypeLabel = (type) => {
    const campaignType = CAMPAIGN_TYPES.find(ct => ct.id === type)
    return campaignType ? campaignType.name : type
  }

  // Function to update country selection
  const toggleCountry = (country) => {
    setCurrentCampaign({
      ...currentCampaign,
      settings: {
        ...currentCampaign.settings,
        countries: currentCampaign.settings.countries.includes(country)
          ? currentCampaign.settings.countries.filter(c => c !== country)
          : [...currentCampaign.settings.countries, country]
      }
    })
  }

  // Function to update block rules
  const toggleBlockRule = (rule, value) => {
    setCurrentCampaign({
      ...currentCampaign,
      settings: {
        ...currentCampaign.settings,
        blockRules: {
          ...currentCampaign.settings.blockRules,
          [rule]: value
        }
      }
    })
  }

  // Function to update hack target settings
  const toggleHackTarget = (target, value) => {
    setCurrentCampaign({
      ...currentCampaign,
      settings: {
        ...currentCampaign.settings,
        hackTarget: {
          ...currentCampaign.settings.hackTarget,
          [target]: value
        }
      }
    })
  }

  // Function to update ads source settings
  const toggleAdsSource = (source, value) => {
    setCurrentCampaign({
      ...currentCampaign,
      settings: {
        ...currentCampaign.settings,
        adsSource: {
          ...currentCampaign.settings.adsSource,
          [source]: value
        }
      }
    })
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Kampanye</h2>
          <p className="text-muted-foreground">
            Kelola kampanye otomatisasi pendapatan Anda
          </p>
        </div>
        <Button onClick={handleCreateClick}>
          <Plus className="mr-2 h-4 w-4" />
          Buat Kampanye
        </Button>
      </div>

      {campaigns.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Target className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Belum ada kampanye</h3>
            <p className="text-gray-500 text-center mb-6">
              Mulai dengan membuat kampanye pertama Anda untuk mengotomatisasi pendapatan
            </p>
            <Button onClick={handleCreateClick}>
              <Plus className="mr-2 h-4 w-4" />
              Buat Kampanye Pertama
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {campaigns.map((campaign) => (
            <Card key={campaign.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {getCampaignIcon(campaign.campaign_type)}
                      {campaign.campaign_name}
                    </CardTitle>
                    <CardDescription>
                      {getCampaignTypeLabel(campaign.campaign_type)}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(campaign.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Progress</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ 
                            width: `${campaign.target_count > 0 ? (campaign.current_count / campaign.target_count) * 100 : 0}%` 
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">
                        {campaign.current_count}/{campaign.target_count}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Dibuat</p>
                    <p className="text-sm">
                      {new Date(campaign.created_at).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Target Negara</p>
                    <p className="text-sm">
                      {campaign.settings?.countries?.join(', ') || 'Global'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {campaign.status === 'running' ? (
                      <Button size="sm" variant="outline" onClick={() => handleToggleStatus(campaign)}>
                        <Pause className="h-4 w-4 mr-1" />
                        Pause
                      </Button>
                    ) : (
                      <Button size="sm" onClick={() => handleToggleStatus(campaign)}>
                        <Play className="h-4 w-4 mr-1" />
                        Start
                      </Button>
                    )}
                    <Button size="sm" variant="outline" onClick={() => handleEditClick(campaign)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(campaign.id)}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Hapus
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Campaign Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Buat Kampanye Baru</DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="basic">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="countries">Country Target</TabsTrigger>
              <TabsTrigger value="block">Type Block</TabsTrigger>
              <TabsTrigger value="hack">Hack to Target</TabsTrigger>
              <TabsTrigger value="ads">Sumber Ads</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4 py-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="campaign_name">Nama Kampanye</Label>
                  <Input
                    id="campaign_name"
                    value={currentCampaign.campaign_name}
                    onChange={(e) => setCurrentCampaign({
                      ...currentCampaign, 
                      campaign_name: e.target.value
                    })}
                    placeholder="Masukkan nama kampanye"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="campaign_type">Jenis Kampanye</Label>
                  <select
                    id="campaign_type"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={currentCampaign.campaign_type}
                    onChange={(e) => setCurrentCampaign({
                      ...currentCampaign, 
                      campaign_type: e.target.value
                    })}
                  >
                    {CAMPAIGN_TYPES.map(type => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="url_source">URL / File Source</Label>
                  <Input
                    id="url_source"
                    value={currentCampaign.settings.urlSource}
                    onChange={(e) => setCurrentCampaign({
                      ...currentCampaign,
                      settings: {
                        ...currentCampaign.settings,
                        urlSource: e.target.value
                      }
                    })}
                    placeholder="E:/link monetag.txt"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="target_count">Target</Label>
                  <Input
                    id="target_count"
                    type="number"
                    value={currentCampaign.target_count}
                    onChange={(e) => setCurrentCampaign({
                      ...currentCampaign, 
                      target_count: e.target.value
                    })}
                    min="1"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="device">Device Target</Label>
                  <select
                    id="device"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={currentCampaign.settings.device}
                    onChange={(e) => setCurrentCampaign({
                      ...currentCampaign,
                      settings: {
                        ...currentCampaign.settings,
                        device: e.target.value
                      }
                    })}
                  >
                    {DEVICE_TYPES.map(device => (
                      <option key={device.value} value={device.value}>
                        {device.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="running_limit">Running Limit</Label>
                  <Input
                    id="running_limit"
                    type="number"
                    value={currentCampaign.settings.runningLimit}
                    onChange={(e) => setCurrentCampaign({
                      ...currentCampaign,
                      settings: {
                        ...currentCampaign.settings,
                        runningLimit: parseInt(e.target.value)
                      }
                    })}
                    min="1"
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="countries" className="py-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Select Target Countries</h3>
                <div className="grid grid-cols-3 gap-4">
                  {COUNTRIES.map(country => (
                    <div key={country.code} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`country-${country.code}`} 
                        checked={currentCampaign.settings.countries.includes(country.code)}
                        onCheckedChange={() => toggleCountry(country.code)}
                      />
                      <Label htmlFor={`country-${country.code}`}>{country.name} ({country.code})</Label>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="block" className="py-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Configure Block Rules</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="block-proxy" 
                      checked={currentCampaign.settings.blockRules.proxy}
                      onCheckedChange={(checked) => toggleBlockRule('proxy', !!checked)}
                    />
                    <Label htmlFor="block-proxy">Block IP Proxy</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="block-vpn" 
                      checked={currentCampaign.settings.blockRules.vpn}
                      onCheckedChange={(checked) => toggleBlockRule('vpn', !!checked)}
                    />
                    <Label htmlFor="block-vpn">Block IP VPN</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="block-badip" 
                      checked={currentCampaign.settings.blockRules.badIp}
                      onCheckedChange={(checked) => toggleBlockRule('badIp', !!checked)}
                    />
                    <Label htmlFor="block-badip">Block IP Bad</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="block-bots" 
                      checked={currentCampaign.settings.blockRules.tooManyBots}
                      onCheckedChange={(checked) => toggleBlockRule('tooManyBots', !!checked)}
                    />
                    <Label htmlFor="block-bots">Block Running Too Boot</Label>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="hack" className="py-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Configure Hack to Target</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="hack-facebook" 
                      checked={currentCampaign.settings.hackTarget.facebook}
                      onCheckedChange={(checked) => toggleHackTarget('facebook', !!checked)}
                    />
                    <Label htmlFor="hack-facebook">Aktif saat membuka Facebook</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="hack-youtube" 
                      checked={currentCampaign.settings.hackTarget.youtube}
                      onCheckedChange={(checked) => toggleHackTarget('youtube', !!checked)}
                    />
                    <Label htmlFor="hack-youtube">Aktif saat membuka YouTube</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="hack-google" 
                      checked={currentCampaign.settings.hackTarget.google}
                      onCheckedChange={(checked) => toggleHackTarget('google', !!checked)}
                    />
                    <Label htmlFor="hack-google">Aktif saat membuka Google</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="hack-tiktok" 
                      checked={currentCampaign.settings.hackTarget.tiktok}
                      onCheckedChange={(checked) => toggleHackTarget('tiktok', !!checked)}
                    />
                    <Label htmlFor="hack-tiktok">Aktif saat membuka TikTok</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="hack-device" 
                      checked={currentCampaign.settings.hackTarget.deviceOn}
                      onCheckedChange={(checked) => toggleHackTarget('deviceOn', !!checked)}
                    />
                    <Label htmlFor="hack-device">Aktif saat ON device</Label>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="ads" className="py-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Configure Sumber Ads</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="ads-recommendation" 
                      checked={currentCampaign.settings.adsSource.recommendation}
                      onCheckedChange={(checked) => toggleAdsSource('recommendation', !!checked)}
                    />
                    <Label htmlFor="ads-recommendation">Rekomendasi Ads</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="ads-social" 
                      checked={currentCampaign.settings.adsSource.socialMedia}
                      onCheckedChange={(checked) => toggleAdsSource('socialMedia', !!checked)}
                    />
                    <Label htmlFor="ads-social">Social Media Ads</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="ads-search" 
                      checked={currentCampaign.settings.adsSource.search}
                      onCheckedChange={(checked) => toggleAdsSource('search', !!checked)}
                    />
                    <Label htmlFor="ads-search">Pencarian Ads</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="ads-interest" 
                      checked={currentCampaign.settings.adsSource.interest}
                      onCheckedChange={(checked) => toggleAdsSource('interest', !!checked)}
                    />
                    <Label htmlFor="ads-interest">Minat Ads</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="ads-spam" 
                      checked={currentCampaign.settings.adsSource.spam}
                      onCheckedChange={(checked) => toggleAdsSource('spam', !!checked)}
                    />
                    <Label htmlFor="ads-spam">Spam Ads</Label>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="advanced" className="py-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Advanced Settings</h3>
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="lines_from_file">Lines From File</Label>
                    <Input
                      id="lines_from_file"
                      type="number"
                      placeholder="Jumlah baris dari file"
                      disabled
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label>Additional Notes</Label>
                    <textarea 
                      className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      placeholder="Catatan tambahan untuk kampanye ini..."
                    ></textarea>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Batal
            </Button>
            <Button onClick={handleCreateSubmit}>Buat Kampanye</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Campaign Modal - Struktur yang sama dengan Create Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit Kampanye</DialogTitle>
          </DialogHeader>
          
          {/* Sama dengan Create Modal, hanya tombol Submit berbeda */}
          <Tabs defaultValue="basic">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="countries">Country Target</TabsTrigger>
              <TabsTrigger value="block">Type Block</TabsTrigger>
              <TabsTrigger value="hack">Hack to Target</TabsTrigger>
              <TabsTrigger value="ads">Sumber Ads</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>
            
            {/* Konten tab sama seperti Create Modal */}
            {/* ... konten tab lainnya ... */}
          </Tabs>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Batal
            </Button>
            <Button onClick={handleEditSubmit}>Simpan Perubahan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Campaigns