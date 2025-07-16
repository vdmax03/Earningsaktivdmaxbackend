import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, Plus, Trash2, Save, Phone, Shield, Globe } from 'lucide-react';

export default function LockPhoneSettings() {
  const [phoneRules, setPhoneRules] = useState([
    {
      id: 1,
      countryCode: '+1',
      countryName: 'United States',
      action: 'allow',
      maxAttempts: 5,
      cooldownPeriod: 30,
      active: true,
      description: 'US phone numbers allowed'
    },
    {
      id: 2,
      countryCode: '+62',
      countryName: 'Indonesia',
      action: 'allow',
      maxAttempts: 3,
      cooldownPeriod: 15,
      active: true,
      description: 'Indonesian phone numbers allowed'
    },
    {
      id: 3,
      countryCode: '+86',
      countryName: 'China',
      action: 'block',
      maxAttempts: 0,
      cooldownPeriod: 0,
      active: true,
      description: 'Block Chinese phone numbers'
    }
  ]);

  const [newRule, setNewRule] = useState({
    countryCode: '',
    countryName: '',
    action: 'allow',
    maxAttempts: 3,
    cooldownPeriod: 15,
    description: ''
  });

  const [globalSettings, setGlobalSettings] = useState({
    enablePhoneLock: true,
    requirePhoneVerification: true,
    allowInternational: true,
    blockVirtualNumbers: true,
    logAttempts: true,
    defaultAction: 'allow',
    globalMaxAttempts: 5,
    globalCooldownPeriod: 60,
    enableWhitelist: false,
    enableBlacklist: true
  });

  const [whitelistedNumbers, setWhitelistedNumbers] = useState([
    '+1234567890',
    '+628123456789'
  ]);

  const [blacklistedNumbers, setBlacklistedNumbers] = useState([
    '+8612345678',
    '+7123456789'
  ]);

  const [newWhitelistNumber, setNewWhitelistNumber] = useState('');
  const [newBlacklistNumber, setNewBlacklistNumber] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const commonCountries = [
    { code: '+1', name: 'United States' },
    { code: '+62', name: 'Indonesia' },
    { code: '+65', name: 'Singapore' },
    { code: '+60', name: 'Malaysia' },
    { code: '+66', name: 'Thailand' },
    { code: '+84', name: 'Vietnam' },
    { code: '+63', name: 'Philippines' },
    { code: '+91', name: 'India' },
    { code: '+61', name: 'Australia' },
    { code: '+81', name: 'Japan' },
    { code: '+82', name: 'South Korea' },
    { code: '+86', name: 'China' },
    { code: '+44', name: 'United Kingdom' },
    { code: '+49', name: 'Germany' },
    { code: '+33', name: 'France' },
    { code: '+7', name: 'Russia' },
    { code: '+55', name: 'Brazil' },
    { code: '+52', name: 'Mexico' }
  ];

  const actions = [
    { value: 'allow', label: 'Allow', color: 'bg-green-100 text-green-800' },
    { value: 'block', label: 'Block', color: 'bg-red-100 text-red-800' },
    { value: 'verify', label: 'Require Verification', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'limit', label: 'Rate Limit', color: 'bg-blue-100 text-blue-800' }
  ];

  useEffect(() => {
    const savedRules = localStorage.getItem('settings_phone_rules');
    const savedGlobalSettings = localStorage.getItem('settings_phone_global');
    const savedWhitelist = localStorage.getItem('settings_phone_whitelist');
    const savedBlacklist = localStorage.getItem('settings_phone_blacklist');
    
    if (savedRules) {
      setPhoneRules(JSON.parse(savedRules));
    }
    if (savedGlobalSettings) {
      setGlobalSettings(JSON.parse(savedGlobalSettings));
    }
    if (savedWhitelist) {
      setWhitelistedNumbers(JSON.parse(savedWhitelist));
    }
    if (savedBlacklist) {
      setBlacklistedNumbers(JSON.parse(savedBlacklist));
    }
    setLoading(false);
  }, []);

  const handleSave = () => {
    localStorage.setItem('settings_phone_rules', JSON.stringify(phoneRules));
    localStorage.setItem('settings_phone_global', JSON.stringify(globalSettings));
    localStorage.setItem('settings_phone_whitelist', JSON.stringify(whitelistedNumbers));
    localStorage.setItem('settings_phone_blacklist', JSON.stringify(blacklistedNumbers));
    
    toast({
      title: "Pengaturan disimpan",
      description: "Pengaturan Lock Phone Country berhasil diperbarui."
    });
  };

  const handleAddRule = () => {
    if (!newRule.countryCode || !newRule.countryName) {
      toast({
        title: "Error",
        description: "Kode negara dan nama negara harus diisi.",
        variant: "destructive"
      });
      return;
    }

    const rule = {
      id: Date.now(),
      ...newRule,
      active: true
    };

    setPhoneRules(prev => [...prev, rule]);
    setNewRule({
      countryCode: '',
      countryName: '',
      action: 'allow',
      maxAttempts: 3,
      cooldownPeriod: 15,
      description: ''
    });

    toast({
      title: "Rule ditambahkan",
      description: `Aturan untuk ${rule.countryName} berhasil ditambahkan.`
    });
  };

  const handleDeleteRule = (id) => {
    setPhoneRules(prev => prev.filter(rule => rule.id !== id));
    toast({
      title: "Rule dihapus",
      description: "Aturan phone country berhasil dihapus."
    });
  };

  const toggleRuleActive = (id) => {
    setPhoneRules(prev => 
      prev.map(rule => 
        rule.id === id ? { ...rule, active: !rule.active } : rule
      )
    );
  };

  const handleAddWhitelistNumber = () => {
    if (!newWhitelistNumber) return;
    
    if (!whitelistedNumbers.includes(newWhitelistNumber)) {
      setWhitelistedNumbers(prev => [...prev, newWhitelistNumber]);
      setNewWhitelistNumber('');
      toast({
        title: "Nomor ditambahkan",
        description: "Nomor berhasil ditambahkan ke whitelist."
      });
    }
  };

  const handleAddBlacklistNumber = () => {
    if (!newBlacklistNumber) return;
    
    if (!blacklistedNumbers.includes(newBlacklistNumber)) {
      setBlacklistedNumbers(prev => [...prev, newBlacklistNumber]);
      setNewBlacklistNumber('');
      toast({
        title: "Nomor ditambahkan",
        description: "Nomor berhasil ditambahkan ke blacklist."
      });
    }
  };

  const removeWhitelistNumber = (number) => {
    setWhitelistedNumbers(prev => prev.filter(n => n !== number));
  };

  const removeBlacklistNumber = (number) => {
    setBlacklistedNumbers(prev => prev.filter(n => n !== number));
  };

  const updateGlobalSetting = (key, value) => {
    setGlobalSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getActionColor = (action) => {
    const actionObj = actions.find(a => a.value === action);
    return actionObj ? actionObj.color : 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Lock Phone Country</h2>
          <p className="text-muted-foreground">
            Konfigurasi pembatasan negara berdasarkan kode telepon
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
            <Shield className="mr-2 h-5 w-5 text-blue-500" />
            Pengaturan Global
          </CardTitle>
          <CardDescription>Konfigurasi umum sistem phone lock</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between">
              <div>
                <Label>Aktifkan Phone Lock</Label>
                <p className="text-sm text-muted-foreground">Master switch untuk semua rules</p>
              </div>
              <Checkbox
                checked={globalSettings.enablePhoneLock}
                onCheckedChange={(checked) => updateGlobalSetting('enablePhoneLock', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Require Phone Verification</Label>
                <p className="text-sm text-muted-foreground">Wajibkan verifikasi nomor telepon</p>
              </div>
              <Checkbox
                checked={globalSettings.requirePhoneVerification}
                onCheckedChange={(checked) => updateGlobalSetting('requirePhoneVerification', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Allow International</Label>
                <p className="text-sm text-muted-foreground">Izinkan nomor internasional</p>
              </div>
              <Checkbox
                checked={globalSettings.allowInternational}
                onCheckedChange={(checked) => updateGlobalSetting('allowInternational', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Block Virtual Numbers</Label>
                <p className="text-sm text-muted-foreground">Blokir nomor virtual/temporary</p>
              </div>
              <Checkbox
                checked={globalSettings.blockVirtualNumbers}
                onCheckedChange={(checked) => updateGlobalSetting('blockVirtualNumbers', checked)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Default Action</Label>
              <Select 
                value={globalSettings.defaultAction} 
                onValueChange={(value) => updateGlobalSetting('defaultAction', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {actions.map(action => (
                    <SelectItem key={action.value} value={action.value}>
                      {action.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Global Max Attempts: {globalSettings.globalMaxAttempts}</Label>
              <input
                type="range"
                min="1"
                max="20"
                value={globalSettings.globalMaxAttempts}
                onChange={(e) => updateGlobalSetting('globalMaxAttempts', parseInt(e.target.value))}
                className="w-full mt-2"
              />
            </div>
            <div>
              <Label>Global Cooldown (menit): {globalSettings.globalCooldownPeriod}</Label>
              <input
                type="range"
                min="1"
                max="1440"
                value={globalSettings.globalCooldownPeriod}
                onChange={(e) => updateGlobalSetting('globalCooldownPeriod', parseInt(e.target.value))}
                className="w-full mt-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add New Rule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Plus className="mr-2 h-5 w-5 text-green-500" />
            Tambah Rule Negara Baru
          </CardTitle>
          <CardDescription>Buat aturan baru untuk kode negara tertentu</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="countryCode">Kode Negara</Label>
              <Select 
                value={newRule.countryCode} 
                onValueChange={(value) => {
                  const country = commonCountries.find(c => c.code === value);
                  setNewRule(prev => ({ 
                    ...prev, 
                    countryCode: value,
                    countryName: country ? country.name : ''
                  }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kode negara" />
                </SelectTrigger>
                <SelectContent>
                  {commonCountries.map(country => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.code} - {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="action">Aksi</Label>
              <Select 
                value={newRule.action} 
                onValueChange={(value) => setNewRule(prev => ({ ...prev, action: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {actions.map(action => (
                    <SelectItem key={action.value} value={action.value}>
                      {action.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Max Attempts: {newRule.maxAttempts}</Label>
              <input
                type="range"
                min="0"
                max="20"
                value={newRule.maxAttempts}
                onChange={(e) => setNewRule(prev => ({ ...prev, maxAttempts: parseInt(e.target.value) }))}
                className="w-full mt-2"
              />
            </div>
            <div>
              <Label>Cooldown Period (menit): {newRule.cooldownPeriod}</Label>
              <input
                type="range"
                min="0"
                max="1440"
                value={newRule.cooldownPeriod}
                onChange={(e) => setNewRule(prev => ({ ...prev, cooldownPeriod: parseInt(e.target.value) }))}
                className="w-full mt-2"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="ruleDesc">Deskripsi</Label>
            <Input
              id="ruleDesc"
              value={newRule.description}
              onChange={(e) => setNewRule(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Deskripsi singkat tentang rule ini"
            />
          </div>
          
          <Button onClick={handleAddRule} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Rule
          </Button>
        </CardContent>
      </Card>

      {/* Whitelist & Blacklist */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Whitelist */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5 text-green-500" />
              Whitelist Numbers
            </CardTitle>
            <CardDescription>Nomor yang selalu diizinkan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newWhitelistNumber}
                onChange={(e) => setNewWhitelistNumber(e.target.value)}
                placeholder="+628123456789"
              />
              <Button onClick={handleAddWhitelistNumber} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {whitelistedNumbers.map((number, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded">
                  <span className="font-mono text-sm">{number}</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => removeWhitelistNumber(number)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Blacklist */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
              Blacklist Numbers
            </CardTitle>
            <CardDescription>Nomor yang selalu diblokir</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newBlacklistNumber}
                onChange={(e) => setNewBlacklistNumber(e.target.value)}
                placeholder="+8612345678"
              />
              <Button onClick={handleAddBlacklistNumber} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {blacklistedNumbers.map((number, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-red-50 rounded">
                  <span className="font-mono text-sm">{number}</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => removeBlacklistNumber(number)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Existing Rules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Phone className="mr-2 h-5 w-5 text-purple-500" />
            Daftar Rules ({phoneRules.length})
          </CardTitle>
          <CardDescription>Kelola aturan phone lock yang sudah ada</CardDescription>
        </CardHeader>
        <CardContent>
          {phoneRules.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Phone className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Belum ada rules phone lock. Tambahkan rule pertama Anda!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {phoneRules.map((rule) => (
                <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium">{rule.countryName}</h4>
                      <Badge variant="outline">{rule.countryCode}</Badge>
                      <Badge className={getActionColor(rule.action)}>
                        {actions.find(a => a.value === rule.action)?.label}
                      </Badge>
                      <Badge variant={rule.active ? "default" : "secondary"}>
                        {rule.active ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 mb-1">
                      Max Attempts: {rule.maxAttempts} • Cooldown: {rule.cooldownPeriod} menit
                    </div>
                    {rule.description && (
                      <p className="text-sm text-gray-500">{rule.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={rule.active}
                      onCheckedChange={() => toggleRuleActive(rule.id)}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteRule(rule.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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