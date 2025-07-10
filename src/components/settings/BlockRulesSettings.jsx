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
import { Shield, Plus, Trash2, Save, AlertTriangle, Globe, User, Clock } from 'lucide-react';

export default function BlockRulesSettings() {
  const [rules, setRules] = useState([
    {
      id: 1,
      name: 'Block VPN/Proxy',
      type: 'ip_type',
      condition: 'contains',
      value: 'proxy,vpn,tor',
      action: 'block',
      active: true,
      description: 'Blokir traffic dari VPN dan Proxy'
    },
    {
      id: 2,
      name: 'Suspicious Countries',
      type: 'country',
      condition: 'in',
      value: 'CN,RU,KP',
      action: 'redirect',
      active: true,
      description: 'Redirect traffic dari negara tertentu'
    },
    {
      id: 3,
      name: 'Bot User Agents',
      type: 'user_agent',
      condition: 'contains',
      value: 'bot,crawler,spider',
      action: 'block',
      active: true,
      description: 'Blokir bot dan crawler'
    }
  ]);

  const [newRule, setNewRule] = useState({
    name: '',
    type: 'ip',
    condition: 'equals',
    value: '',
    action: 'block',
    description: '',
    active: true
  });

  const [globalSettings, setGlobalSettings] = useState({
    enableBlocking: true,
    logBlocked: true,
    showBlockedMessage: true,
    redirectUrl: '',
    rateLimitEnabled: true,
    maxRequestsPerMinute: 60,
    blockDuration: 60
  });

  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const ruleTypes = [
    { value: 'ip', label: 'IP Address', icon: Globe },
    { value: 'country', label: 'Country Code', icon: Globe },
    { value: 'user_agent', label: 'User Agent', icon: User },
    { value: 'referer', label: 'Referer', icon: Globe },
    { value: 'ip_type', label: 'IP Type (VPN/Proxy)', icon: Shield },
    { value: 'rate_limit', label: 'Rate Limit', icon: Clock }
  ];

  const conditions = [
    { value: 'equals', label: 'Sama dengan' },
    { value: 'contains', label: 'Mengandung' },
    { value: 'starts_with', label: 'Dimulai dengan' },
    { value: 'ends_with', label: 'Diakhiri dengan' },
    { value: 'in', label: 'Dalam daftar' },
    { value: 'not_in', label: 'Tidak dalam daftar' },
    { value: 'regex', label: 'Regular Expression' }
  ];

  const actions = [
    { value: 'block', label: 'Block (403)', color: 'bg-red-100 text-red-800' },
    { value: 'redirect', label: 'Redirect', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'captcha', label: 'Show Captcha', color: 'bg-blue-100 text-blue-800' },
    { value: 'rate_limit', label: 'Rate Limit', color: 'bg-orange-100 text-orange-800' },
    { value: 'log_only', label: 'Log Only', color: 'bg-gray-100 text-gray-800' }
  ];

  useEffect(() => {
    const savedRules = localStorage.getItem('settings_block_rules');
    const savedGlobalSettings = localStorage.getItem('settings_block_global');
    
    if (savedRules) {
      setRules(JSON.parse(savedRules));
    }
    if (savedGlobalSettings) {
      setGlobalSettings(JSON.parse(savedGlobalSettings));
    }
    setLoading(false);
  }, []);

  const handleSave = () => {
    localStorage.setItem('settings_block_rules', JSON.stringify(rules));
    localStorage.setItem('settings_block_global', JSON.stringify(globalSettings));
    toast({
      title: "Pengaturan disimpan",
      description: "Aturan blocking berhasil diperbarui."
    });
  };

  const handleAddRule = () => {
    if (!newRule.name || !newRule.value) {
      toast({
        title: "Error",
        description: "Nama rule dan nilai harus diisi.",
        variant: "destructive"
      });
      return;
    }

    const rule = {
      id: Date.now(),
      ...newRule
    };

    setRules(prev => [...prev, rule]);
    setNewRule({
      name: '',
      type: 'ip',
      condition: 'equals',
      value: '',
      action: 'block',
      description: '',
      active: true
    });

    toast({
      title: "Rule ditambahkan",
      description: `${rule.name} berhasil ditambahkan.`
    });
  };

  const handleDeleteRule = (id) => {
    setRules(prev => prev.filter(rule => rule.id !== id));
    toast({
      title: "Rule dihapus",
      description: "Rule blocking berhasil dihapus."
    });
  };

  const toggleRuleActive = (id) => {
    setRules(prev => 
      prev.map(rule => 
        rule.id === id ? { ...rule, active: !rule.active } : rule
      )
    );
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
          <h2 className="text-3xl font-bold tracking-tight">Type Block Settings</h2>
          <p className="text-muted-foreground">
            Konfigurasi aturan pemblokiran IP dan traffic
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
          <CardDescription>Konfigurasi umum sistem blocking</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between">
              <div>
                <Label>Aktifkan Blocking</Label>
                <p className="text-sm text-muted-foreground">Master switch untuk semua rules</p>
              </div>
              <Checkbox
                checked={globalSettings.enableBlocking}
                onCheckedChange={(checked) => updateGlobalSetting('enableBlocking', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Log Blocked Requests</Label>
                <p className="text-sm text-muted-foreground">Catat semua request yang diblokir</p>
              </div>
              <Checkbox
                checked={globalSettings.logBlocked}
                onCheckedChange={(checked) => updateGlobalSetting('logBlocked', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Show Block Message</Label>
                <p className="text-sm text-muted-foreground">Tampilkan pesan saat diblokir</p>
              </div>
              <Checkbox
                checked={globalSettings.showBlockedMessage}
                onCheckedChange={(checked) => updateGlobalSetting('showBlockedMessage', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Rate Limiting</Label>
                <p className="text-sm text-muted-foreground">Aktifkan pembatasan rate</p>
              </div>
              <Checkbox
                checked={globalSettings.rateLimitEnabled}
                onCheckedChange={(checked) => updateGlobalSetting('rateLimitEnabled', checked)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="redirectUrl">Redirect URL (opsional)</Label>
              <Input
                id="redirectUrl"
                value={globalSettings.redirectUrl}
                onChange={(e) => updateGlobalSetting('redirectUrl', e.target.value)}
                placeholder="https://example.com"
              />
            </div>
            <div>
              <Label>Max Requests/Menit: {globalSettings.maxRequestsPerMinute}</Label>
              <input
                type="range"
                min="10"
                max="1000"
                step="10"
                value={globalSettings.maxRequestsPerMinute}
                onChange={(e) => updateGlobalSetting('maxRequestsPerMinute', parseInt(e.target.value))}
                className="w-full mt-2"
              />
            </div>
            <div>
              <Label>Block Duration (menit): {globalSettings.blockDuration}</Label>
              <input
                type="range"
                min="1"
                max="1440"
                step="1"
                value={globalSettings.blockDuration}
                onChange={(e) => updateGlobalSetting('blockDuration', parseInt(e.target.value))}
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
            Tambah Rule Baru
          </CardTitle>
          <CardDescription>Buat aturan blocking baru</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ruleName">Nama Rule</Label>
              <Input
                id="ruleName"
                value={newRule.name}
                onChange={(e) => setNewRule(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Contoh: Block Suspicious IPs"
              />
            </div>
            <div>
              <Label htmlFor="ruleType">Tipe Rule</Label>
              <Select 
                value={newRule.type} 
                onValueChange={(value) => setNewRule(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ruleTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="condition">Kondisi</Label>
              <Select 
                value={newRule.condition} 
                onValueChange={(value) => setNewRule(prev => ({ ...prev, condition: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {conditions.map(condition => (
                    <SelectItem key={condition.value} value={condition.value}>
                      {condition.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="ruleValue">Nilai</Label>
              <Input
                id="ruleValue"
                value={newRule.value}
                onChange={(e) => setNewRule(prev => ({ ...prev, value: e.target.value }))}
                placeholder="Contoh: 192.168.1.1 atau bot,crawler"
              />
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
          
          <div>
            <Label htmlFor="ruleDesc">Deskripsi</Label>
            <Textarea
              id="ruleDesc"
              value={newRule.description}
              onChange={(e) => setNewRule(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Deskripsi singkat tentang rule ini"
              rows={2}
            />
          </div>
          
          <Button onClick={handleAddRule} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Rule
          </Button>
        </CardContent>
      </Card>

      {/* Existing Rules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5 text-red-500" />
            Daftar Rules ({rules.length})
          </CardTitle>
          <CardDescription>Kelola aturan blocking yang sudah ada</CardDescription>
        </CardHeader>
        <CardContent>
          {rules.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Shield className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Belum ada rules blocking. Tambahkan rule pertama Anda!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {rules.map((rule) => (
                <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium">{rule.name}</h4>
                      <Badge className={getActionColor(rule.action)}>
                        {actions.find(a => a.value === rule.action)?.label}
                      </Badge>
                      <Badge variant={rule.active ? "default" : "secondary"}>
                        {rule.active ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">{ruleTypes.find(t => t.value === rule.type)?.label}</span>
                      {' '}{conditions.find(c => c.value === rule.condition)?.label.toLowerCase()}{' '}
                      <code className="bg-gray-100 px-1 rounded">{rule.value}</code>
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