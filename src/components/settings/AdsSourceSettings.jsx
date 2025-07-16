import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Megaphone, Plus, Trash2, Save, Settings, TrendingUp, ExternalLink } from 'lucide-react';

export default function AdsSourceSettings() {
  const [adsSources, setAdsSources] = useState([
    {
      id: 1,
      name: 'Google AdSense',
      type: 'google_adsense',
      apiKey: 'ca-pub-1234567890123456',
      status: 'active',
      priority: 1,
      configuration: {
        adFormat: 'auto',
        targeting: 'contextual',
        frequency: 'high'
      },
      metrics: {
        impressions: 15420,
        clicks: 234,
        revenue: 45.67,
        ctr: 1.52
      }
    },
    {
      id: 2,
      name: 'Adisterra',
      type: 'adisterra',
      apiKey: 'adk_123456789abcdef',
      status: 'active',
      priority: 2,
      configuration: {
        adFormat: 'popup',
        targeting: 'geographic',
        frequency: 'medium'
      },
      metrics: {
        impressions: 8950,
        clicks: 456,
        revenue: 89.23,
        ctr: 5.09
      }
    }
  ]);

  const [newSource, setNewSource] = useState({
    name: '',
    type: 'custom',
    apiKey: '',
    configuration: {
      adFormat: 'banner',
      targeting: 'contextual',
      frequency: 'medium'
    }
  });

  const [globalSettings, setGlobalSettings] = useState({
    enableAds: true,
    autoOptimize: true,
    respectAdBlockers: false,
    maxAdsPerPage: 3,
    minTimeBetweenAds: 5,
    enableGeoTargeting: true,
    enableAnalytics: true
  });

  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const sourceTypes = [
    { value: 'google_adsense', label: 'Google AdSense' },
    { value: 'adisterra', label: 'Adisterra' },
    { value: 'propeller_ads', label: 'PropellerAds' },
    { value: 'media_net', label: 'Media.net' },
    { value: 'amazon_associates', label: 'Amazon Associates' },
    { value: 'outbrain', label: 'Outbrain' },
    { value: 'taboola', label: 'Taboola' },
    { value: 'custom', label: 'Custom/Lainnya' }
  ];

  const adFormats = [
    { value: 'banner', label: 'Banner' },
    { value: 'popup', label: 'Pop-up' },
    { value: 'popunder', label: 'Pop-under' },
    { value: 'native', label: 'Native Ads' },
    { value: 'video', label: 'Video Ads' },
    { value: 'auto', label: 'Auto' }
  ];

  const targetingOptions = [
    { value: 'contextual', label: 'Contextual' },
    { value: 'geographic', label: 'Geographic' },
    { value: 'demographic', label: 'Demographic' },
    { value: 'behavioral', label: 'Behavioral' },
    { value: 'interest', label: 'Interest-based' }
  ];

  const frequencyOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'aggressive', label: 'Aggressive' }
  ];

  useEffect(() => {
    const savedSources = localStorage.getItem('settings_ads_sources');
    const savedGlobalSettings = localStorage.getItem('settings_ads_global');
    
    if (savedSources) {
      setAdsSources(JSON.parse(savedSources));
    }
    if (savedGlobalSettings) {
      setGlobalSettings(JSON.parse(savedGlobalSettings));
    }
    setLoading(false);
  }, []);

  const handleSave = () => {
    localStorage.setItem('settings_ads_sources', JSON.stringify(adsSources));
    localStorage.setItem('settings_ads_global', JSON.stringify(globalSettings));
    toast({
      title: "Pengaturan disimpan",
      description: "Konfigurasi sumber iklan berhasil diperbarui."
    });
  };

  const handleAddSource = () => {
    if (!newSource.name || !newSource.apiKey) {
      toast({
        title: "Error",
        description: "Nama dan API key harus diisi.",
        variant: "destructive"
      });
      return;
    }

    const source = {
      id: Date.now(),
      ...newSource,
      status: 'active',
      priority: adsSources.length + 1,
      metrics: {
        impressions: 0,
        clicks: 0,
        revenue: 0,
        ctr: 0
      }
    };

    setAdsSources(prev => [...prev, source]);
    setNewSource({
      name: '',
      type: 'custom',
      apiKey: '',
      configuration: {
        adFormat: 'banner',
        targeting: 'contextual',
        frequency: 'medium'
      }
    });

    toast({
      title: "Sumber iklan ditambahkan",
      description: `${source.name} berhasil ditambahkan.`
    });
  };

  const handleDeleteSource = (id) => {
    setAdsSources(prev => prev.filter(source => source.id !== id));
    toast({
      title: "Sumber iklan dihapus",
      description: "Sumber iklan berhasil dihapus."
    });
  };

  const toggleSourceStatus = (id) => {
    setAdsSources(prev => 
      prev.map(source => 
        source.id === id 
          ? { ...source, status: source.status === 'active' ? 'inactive' : 'active' }
          : source
      )
    );
  };

  const updatePriority = (id, priority) => {
    setAdsSources(prev => 
      prev.map(source => 
        source.id === id ? { ...source, priority: parseInt(priority) } : source
      )
    );
  };

  const updateGlobalSetting = (key, value) => {
    setGlobalSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getStatusColor = (status) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Sumber Ads</h2>
          <p className="text-muted-foreground">
            Konfigurasi sumber iklan yang diproses
          </p>
        </div>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Simpan Pengaturan
        </Button>
      </div>

      {/* Global Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="mr-2 h-5 w-5 text-blue-500" />
            Pengaturan Global Iklan
          </CardTitle>
          <CardDescription>Konfigurasi umum sistem iklan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between">
              <div>
                <Label>Aktifkan Iklan</Label>
                <p className="text-sm text-muted-foreground">Master switch untuk semua iklan</p>
              </div>
              <Checkbox
                checked={globalSettings.enableAds}
                onCheckedChange={(checked) => updateGlobalSetting('enableAds', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Auto Optimize</Label>
                <p className="text-sm text-muted-foreground">Optimasi otomatis performa iklan</p>
              </div>
              <Checkbox
                checked={globalSettings.autoOptimize}
                onCheckedChange={(checked) => updateGlobalSetting('autoOptimize', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Respect AdBlockers</Label>
                <p className="text-sm text-muted-foreground">Hormati penggunaan ad blocker</p>
              </div>
              <Checkbox
                checked={globalSettings.respectAdBlockers}
                onCheckedChange={(checked) => updateGlobalSetting('respectAdBlockers', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Geo Targeting</Label>
                <p className="text-sm text-muted-foreground">Aktifkan targeting geografis</p>
              </div>
              <Checkbox
                checked={globalSettings.enableGeoTargeting}
                onCheckedChange={(checked) => updateGlobalSetting('enableGeoTargeting', checked)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Max Ads per Halaman: {globalSettings.maxAdsPerPage}</Label>
              <input
                type="range"
                min="1"
                max="10"
                value={globalSettings.maxAdsPerPage}
                onChange={(e) => updateGlobalSetting('maxAdsPerPage', parseInt(e.target.value))}
                className="w-full mt-2"
              />
            </div>
            <div>
              <Label>Min Time Between Ads (detik): {globalSettings.minTimeBetweenAds}</Label>
              <input
                type="range"
                min="1"
                max="60"
                value={globalSettings.minTimeBetweenAds}
                onChange={(e) => updateGlobalSetting('minTimeBetweenAds', parseInt(e.target.value))}
                className="w-full mt-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ad Sources Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sources</p>
                <p className="text-2xl font-bold">{adsSources.length}</p>
              </div>
              <Megaphone className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Sources</p>
                <p className="text-2xl font-bold text-green-600">
                  {adsSources.filter(s => s.status === 'active').length}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {formatCurrency(adsSources.reduce((sum, s) => sum + s.metrics.revenue, 0))}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg CTR</p>
                <p className="text-2xl font-bold text-blue-600">
                  {(adsSources.reduce((sum, s) => sum + s.metrics.ctr, 0) / adsSources.length || 0).toFixed(2)}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add New Source */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Plus className="mr-2 h-5 w-5 text-green-500" />
            Tambah Sumber Iklan Baru
          </CardTitle>
          <CardDescription>Tambahkan platform iklan baru</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sourceName">Nama Sumber</Label>
              <Input
                id="sourceName"
                value={newSource.name}
                onChange={(e) => setNewSource(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Contoh: Google AdSense"
              />
            </div>
            <div>
              <Label htmlFor="sourceType">Tipe Platform</Label>
              <Select 
                value={newSource.type} 
                onValueChange={(value) => setNewSource(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sourceTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="apiKey">API Key / Publisher ID</Label>
            <Input
              id="apiKey"
              value={newSource.apiKey}
              onChange={(e) => setNewSource(prev => ({ ...prev, apiKey: e.target.value }))}
              placeholder="Masukkan API key atau Publisher ID"
              type="password"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Format Iklan</Label>
              <Select 
                value={newSource.configuration.adFormat} 
                onValueChange={(value) => setNewSource(prev => ({ 
                  ...prev, 
                  configuration: { ...prev.configuration, adFormat: value }
                }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {adFormats.map(format => (
                    <SelectItem key={format.value} value={format.value}>
                      {format.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Targeting</Label>
              <Select 
                value={newSource.configuration.targeting} 
                onValueChange={(value) => setNewSource(prev => ({ 
                  ...prev, 
                  configuration: { ...prev.configuration, targeting: value }
                }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {targetingOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Frekuensi</Label>
              <Select 
                value={newSource.configuration.frequency} 
                onValueChange={(value) => setNewSource(prev => ({ 
                  ...prev, 
                  configuration: { ...prev.configuration, frequency: value }
                }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {frequencyOptions.map(freq => (
                    <SelectItem key={freq.value} value={freq.value}>
                      {freq.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button onClick={handleAddSource} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Sumber Iklan
          </Button>
        </CardContent>
      </Card>

      {/* Existing Sources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Megaphone className="mr-2 h-5 w-5 text-purple-500" />
            Daftar Sumber Iklan ({adsSources.length})
          </CardTitle>
          <CardDescription>Kelola platform iklan yang sudah terdaftar</CardDescription>
        </CardHeader>
        <CardContent>
          {adsSources.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Megaphone className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Belum ada sumber iklan. Tambahkan platform iklan pertama Anda!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {adsSources
                .sort((a, b) => a.priority - b.priority)
                .map((source) => (
                  <div key={source.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium">{source.name}</h4>
                          <Badge className={getStatusColor(source.status)}>
                            {source.status === 'active' ? 'Aktif' : 'Nonaktif'}
                          </Badge>
                          <Badge variant="outline">
                            {sourceTypes.find(t => t.value === source.type)?.label}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 mb-3">
                          <span>Format: {adFormats.find(f => f.value === source.configuration.adFormat)?.label}</span>
                          {' • '}
                          <span>Targeting: {targetingOptions.find(t => t.value === source.configuration.targeting)?.label}</span>
                          {' • '}
                          <span>Frekuensi: {frequencyOptions.find(f => f.value === source.configuration.frequency)?.label}</span>
                        </div>
                        
                        {/* Metrics */}
                        <div className="grid grid-cols-4 gap-4">
                          <div className="text-center p-2 bg-blue-50 rounded">
                            <p className="text-xs text-gray-600">Impressions</p>
                            <p className="font-medium text-blue-600">{source.metrics.impressions.toLocaleString()}</p>
                          </div>
                          <div className="text-center p-2 bg-green-50 rounded">
                            <p className="text-xs text-gray-600">Clicks</p>
                            <p className="font-medium text-green-600">{source.metrics.clicks.toLocaleString()}</p>
                          </div>
                          <div className="text-center p-2 bg-emerald-50 rounded">
                            <p className="text-xs text-gray-600">Revenue</p>
                            <p className="font-medium text-emerald-600">{formatCurrency(source.metrics.revenue)}</p>
                          </div>
                          <div className="text-center p-2 bg-purple-50 rounded">
                            <p className="text-xs text-gray-600">CTR</p>
                            <p className="font-medium text-purple-600">{source.metrics.ctr}%</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 ml-4">
                        <div className="flex items-center gap-2">
                          <Label className="text-xs">Prioritas:</Label>
                          <Select 
                            value={source.priority.toString()} 
                            onValueChange={(value) => updatePriority(source.id, value)}
                          >
                            <SelectTrigger className="w-16 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: adsSources.length }, (_, i) => (
                                <SelectItem key={i + 1} value={(i + 1).toString()}>
                                  {i + 1}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Checkbox
                          checked={source.status === 'active'}
                          onCheckedChange={() => toggleSourceStatus(source.id)}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteSource(source.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}