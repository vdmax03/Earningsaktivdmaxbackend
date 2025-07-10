import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Target, Clock, Zap, Save, AlertCircle } from 'lucide-react';

export default function HackTargetSettings() {
  const [settings, setSettings] = useState({
    enabled: false,
    triggerType: 'time_based',
    timeBasedSettings: {
      startTime: '09:00',
      endTime: '17:00',
      timezone: 'Asia/Jakarta',
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
    },
    eventBasedSettings: {
      targetReached: true,
      campaignCompleted: false,
      errorOccurred: true,
      lowPerformance: false
    },
    hackMethods: {
      increaseSpeed: true,
      bypassLimits: false,
      useProxies: true,
      multipleInstances: false
    },
    safetySettings: {
      maxSpeedMultiplier: 2,
      cooldownPeriod: 30,
      emergencyStop: true,
      logActivity: true
    }
  });

  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const weekDays = [
    { value: 'monday', label: 'Senin' },
    { value: 'tuesday', label: 'Selasa' },
    { value: 'wednesday', label: 'Rabu' },
    { value: 'thursday', label: 'Kamis' },
    { value: 'friday', label: 'Jumat' },
    { value: 'saturday', label: 'Sabtu' },
    { value: 'sunday', label: 'Minggu' }
  ];

  useEffect(() => {
    const savedSettings = localStorage.getItem('settings_hack_target');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
    setLoading(false);
  }, []);

  const handleSave = () => {
    localStorage.setItem('settings_hack_target', JSON.stringify(settings));
    toast({
      title: "Pengaturan disimpan",
      description: "Pengaturan Hack Target berhasil diperbarui."
    });
  };

  const updateSetting = (path, value) => {
    setSettings(prev => {
      const newSettings = { ...prev };
      const keys = path.split('.');
      let current = newSettings;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newSettings;
    });
  };

  const toggleDay = (day) => {
    const currentDays = settings.timeBasedSettings.days;
    const newDays = currentDays.includes(day)
      ? currentDays.filter(d => d !== day)
      : [...currentDays, day];
    
    updateSetting('timeBasedSettings.days', newDays);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Hack to Target</h2>
          <p className="text-muted-foreground">
            Konfigurasi kapan dan bagaimana fitur hack akan aktif
          </p>
        </div>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Simpan Pengaturan
        </Button>
      </div>

      {/* Warning Card */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-orange-800">Peringatan Penting</h4>
              <p className="text-sm text-orange-700 mt-1">
                Fitur ini dapat melanggar Terms of Service dari platform target. 
                Gunakan dengan hati-hati dan tanggung jawab sendiri.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Toggle */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="mr-2 h-5 w-5 text-yellow-500" />
            Status Hack Target
          </CardTitle>
          <CardDescription>Aktifkan atau nonaktifkan fitur hack target</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Aktifkan Hack Target</Label>
              <p className="text-sm text-muted-foreground">
                Master switch untuk semua fitur hack
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={settings.enabled}
                onCheckedChange={(checked) => updateSetting('enabled', checked)}
              />
              <Badge variant={settings.enabled ? "default" : "secondary"}>
                {settings.enabled ? "Aktif" : "Nonaktif"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trigger Settings */}
      {settings.enabled && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-blue-500" />
                Trigger Settings
              </CardTitle>
              <CardDescription>Kapan fitur hack akan diaktifkan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Tipe Trigger</Label>
                <Select 
                  value={settings.triggerType} 
                  onValueChange={(value) => updateSetting('triggerType', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="time_based">Berdasarkan Waktu</SelectItem>
                    <SelectItem value="event_based">Berdasarkan Event</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {settings.triggerType === 'time_based' && (
                <div className="space-y-4">
                  <h4 className="font-medium">Pengaturan Waktu</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Jam Mulai</Label>
                      <Input
                        type="time"
                        value={settings.timeBasedSettings.startTime}
                        onChange={(e) => updateSetting('timeBasedSettings.startTime', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Jam Selesai</Label>
                      <Input
                        type="time"
                        value={settings.timeBasedSettings.endTime}
                        onChange={(e) => updateSetting('timeBasedSettings.endTime', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Zona Waktu</Label>
                      <Select 
                        value={settings.timeBasedSettings.timezone} 
                        onValueChange={(value) => updateSetting('timeBasedSettings.timezone', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Asia/Jakarta">Asia/Jakarta (WIB)</SelectItem>
                          <SelectItem value="Asia/Makassar">Asia/Makassar (WITA)</SelectItem>
                          <SelectItem value="Asia/Jayapura">Asia/Jayapura (WIT)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label>Hari Aktif</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {weekDays.map(day => (
                        <Button
                          key={day.value}
                          variant={settings.timeBasedSettings.days.includes(day.value) ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleDay(day.value)}
                        >
                          {day.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {settings.triggerType === 'event_based' && (
                <div className="space-y-4">
                  <h4 className="font-medium">Event Triggers</h4>
                  <div className="space-y-3">
                    {Object.entries(settings.eventBasedSettings).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <Label className="capitalize">
                          {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                        </Label>
                        <Checkbox
                          checked={value}
                          onCheckedChange={(checked) => updateSetting(`eventBasedSettings.${key}`, checked)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Hack Methods */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="mr-2 h-5 w-5 text-red-500" />
                Metode Hack
              </CardTitle>
              <CardDescription>Pilih metode hack yang akan digunakan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(settings.hackMethods).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label className="font-medium">
                      {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {key === 'increaseSpeed' && 'Meningkatkan kecepatan eksekusi'}
                      {key === 'bypassLimits' && 'Melewati batas rate limiting'}
                      {key === 'useProxies' && 'Menggunakan proxy untuk menyembunyikan IP'}
                      {key === 'multipleInstances' && 'Menjalankan multiple instance'}
                    </p>
                  </div>
                  <Checkbox
                    checked={value}
                    onCheckedChange={(checked) => updateSetting(`hackMethods.${key}`, checked)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Safety Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Keamanan</CardTitle>
              <CardDescription>Konfigurasi untuk menjaga keamanan akun</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Max Speed Multiplier: {settings.safetySettings.maxSpeedMultiplier}x</Label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.5"
                    value={settings.safetySettings.maxSpeedMultiplier}
                    onChange={(e) => updateSetting('safetySettings.maxSpeedMultiplier', parseFloat(e.target.value))}
                    className="w-full mt-2"
                  />
                </div>
                <div>
                  <Label>Cooldown Period (menit): {settings.safetySettings.cooldownPeriod}</Label>
                  <input
                    type="range"
                    min="5"
                    max="120"
                    step="5"
                    value={settings.safetySettings.cooldownPeriod}
                    onChange={(e) => updateSetting('safetySettings.cooldownPeriod', parseInt(e.target.value))}
                    className="w-full mt-2"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <Label>Emergency Stop</Label>
                  <Checkbox
                    checked={settings.safetySettings.emergencyStop}
                    onCheckedChange={(checked) => updateSetting('safetySettings.emergencyStop', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Log Activity</Label>
                  <Checkbox
                    checked={settings.safetySettings.logActivity}
                    onCheckedChange={(checked) => updateSetting('safetySettings.logActivity', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}