import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Settings, Save, RefreshCw } from 'lucide-react';

export default function GeneralSettings() {
  const [settings, setSettings] = useState({
    siteName: 'Earning Sakti',
    siteDescription: 'Platform otomasi TikTok untuk meningkatkan pendapatan',
    timezone: 'Asia/Jakarta',
    currency: 'USD',
    language: 'id',
    autoSave: true,
    notifications: true,
    darkMode: false,
    maxConcurrentTasks: 5,
    sessionTimeout: 30,
    apiTimeout: 10,
    retryAttempts: 3
  });

  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Load saved settings
    const savedSettings = localStorage.getItem('settings_general');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
    setLoading(false);
  }, []);

  const handleSaveSettings = () => {
    localStorage.setItem('settings_general', JSON.stringify(settings));
    toast({
      title: "Pengaturan disimpan",
      description: "Pengaturan general telah berhasil diperbarui."
    });
  };

  const handleResetSettings = () => {
    const defaultSettings = {
      siteName: 'Earning Sakti',
      siteDescription: 'Platform otomasi TikTok untuk meningkatkan pendapatan',
      timezone: 'Asia/Jakarta',
      currency: 'USD',
      language: 'id',
      autoSave: true,
      notifications: true,
      darkMode: false,
      maxConcurrentTasks: 5,
      sessionTimeout: 30,
      apiTimeout: 10,
      retryAttempts: 3
    };
    setSettings(defaultSettings);
    toast({
      title: "Pengaturan direset",
      description: "Semua pengaturan telah dikembalikan ke default."
    });
  };

  const updateSetting = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">General Settings</h2>
          <p className="text-muted-foreground">
            Pengaturan umum aplikasi dan preferensi sistem
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleResetSettings}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button onClick={handleSaveSettings}>
            <Save className="mr-2 h-4 w-4" />
            Simpan
          </Button>
        </div>
      </div>

      {/* Site Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="mr-2 h-5 w-5 text-blue-500" />
            Informasi Situs
          </CardTitle>
          <CardDescription>Konfigurasi dasar aplikasi</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="siteName">Nama Situs</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) => updateSetting('siteName', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="language">Bahasa</Label>
              <Select value={settings.language} onValueChange={(value) => updateSetting('language', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="id">Bahasa Indonesia</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="siteDescription">Deskripsi Situs</Label>
            <Textarea
              id="siteDescription"
              value={settings.siteDescription}
              onChange={(e) => updateSetting('siteDescription', e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Localization */}
      <Card>
        <CardHeader>
          <CardTitle>Lokalisasi</CardTitle>
          <CardDescription>Pengaturan zona waktu dan mata uang</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="timezone">Zona Waktu</Label>
              <Select value={settings.timezone} onValueChange={(value) => updateSetting('timezone', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Asia/Jakarta">Asia/Jakarta (WIB)</SelectItem>
                  <SelectItem value="Asia/Makassar">Asia/Makassar (WITA)</SelectItem>
                  <SelectItem value="Asia/Jayapura">Asia/Jayapura (WIT)</SelectItem>
                  <SelectItem value="UTC">UTC</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="currency">Mata Uang</Label>
              <Select value={settings.currency} onValueChange={(value) => updateSetting('currency', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="IDR">IDR (Rp)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Preferensi Sistem</CardTitle>
          <CardDescription>Pengaturan perilaku aplikasi</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between">
              <div>
                <Label>Auto Save</Label>
                <p className="text-sm text-muted-foreground">Simpan otomatis perubahan</p>
              </div>
              <Checkbox
                checked={settings.autoSave}
                onCheckedChange={(checked) => updateSetting('autoSave', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Notifikasi</Label>
                <p className="text-sm text-muted-foreground">Tampilkan notifikasi sistem</p>
              </div>
              <Checkbox
                checked={settings.notifications}
                onCheckedChange={(checked) => updateSetting('notifications', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Mode Gelap</Label>
                <p className="text-sm text-muted-foreground">Gunakan tema gelap</p>
              </div>
              <Checkbox
                checked={settings.darkMode}
                onCheckedChange={(checked) => updateSetting('darkMode', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Pengaturan Performa</CardTitle>
          <CardDescription>Konfigurasi performa dan timeout</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Maksimal Task Bersamaan: {settings.maxConcurrentTasks}</Label>
              <input
                type="range"
                min="1"
                max="20"
                value={settings.maxConcurrentTasks}
                onChange={(e) => updateSetting('maxConcurrentTasks', parseInt(e.target.value))}
                className="w-full mt-2"
              />
            </div>
            <div>
              <Label>Session Timeout (menit): {settings.sessionTimeout}</Label>
              <input
                type="range"
                min="5"
                max="120"
                step="5"
                value={settings.sessionTimeout}
                onChange={(e) => updateSetting('sessionTimeout', parseInt(e.target.value))}
                className="w-full mt-2"
              />
            </div>
            <div>
              <Label>API Timeout (detik): {settings.apiTimeout}</Label>
              <input
                type="range"
                min="5"
                max="60"
                value={settings.apiTimeout}
                onChange={(e) => updateSetting('apiTimeout', parseInt(e.target.value))}
                className="w-full mt-2"
              />
            </div>
            <div>
              <Label>Retry Attempts: {settings.retryAttempts}</Label>
              <input
                type="range"
                min="1"
                max="10"
                value={settings.retryAttempts}
                onChange={(e) => updateSetting('retryAttempts', parseInt(e.target.value))}
                className="w-full mt-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}