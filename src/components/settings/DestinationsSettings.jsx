import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ListChecks, Save, Plus, X, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function DestinationsSettings() {
  const [settings, setSettings] = useState({
    destinations: [
      { id: 1, name: 'Website Utama', url: 'https://example.com', enabled: true, openNewTab: true },
      { id: 2, name: 'Landing Page Produk', url: 'https://example.com/product', enabled: true, openNewTab: false },
      { id: 3, name: 'Halaman Affiliate', url: 'https://affiliate.example.com', enabled: false, openNewTab: true }
    ],
    rotateDestinations: true,
    defaultDestination: 1,
    trackClicks: true
  });
  
  const [newDestination, setNewDestination] = useState({ name: '', url: '', openNewTab: true });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Load saved settings from localStorage
    const savedSettings = localStorage.getItem('settings_destinations');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
    setLoading(false);
  }, []);

  const handleSaveSettings = () => {
    localStorage.setItem('settings_destinations', JSON.stringify(settings));
    toast({
      title: "Pengaturan disimpan",
      description: "Pengaturan Tujuan telah berhasil diperbarui."
    });
  };

  const handleToggleDestination = (id, checked) => {
    setSettings(prev => ({
      ...prev,
      destinations: prev.destinations.map(dest => 
        dest.id === id ? { ...dest, enabled: checked } : dest
      )
    }));
  };

  const handleToggleNewTab = (id, checked) => {
    setSettings(prev => ({
      ...prev,
      destinations: prev.destinations.map(dest => 
        dest.id === id ? { ...dest, openNewTab: checked } : dest
      )
    }));
  };

  const handleRemoveDestination = (id) => {
    setSettings(prev => ({
      ...prev,
      destinations: prev.destinations.filter(dest => dest.id !== id),
      // If the default destination is being removed, set to the first available destination or null
      defaultDestination: prev.defaultDestination === id 
        ? (prev.destinations.filter(d => d.id !== id)[0]?.id || null)
        : prev.defaultDestination
    }));
    
    toast({
      title: "Tujuan dihapus",
      description: "Tujuan telah dihapus dari daftar."
    });
  };

  const handleAddDestination = () => {
    if (!newDestination.name || !newDestination.url) {
      toast({
        title: "Input tidak lengkap",
        description: "Mohon isi nama dan URL tujuan.",
        variant: "destructive"
      });
      return;
    }

    // Validate URL
    try {
      new URL(newDestination.url);
    } catch (e) {
      toast({
        title: "URL tidak valid",
        description: "Mohon masukkan URL yang valid (termasuk http:// atau https://).",
        variant: "destructive"
      });
      return;
    }
    
    const newId = Math.max(0, ...settings.destinations.map(d => d.id)) + 1;
    
    setSettings(prev => ({
      ...prev,
      destinations: [
        ...prev.destinations,
        { 
          id: newId, 
          name: newDestination.name, 
          url: newDestination.url, 
          enabled: true, 
          openNewTab: newDestination.openNewTab 
        }
      ],
      // If no default destination set, set this as default
      defaultDestination: prev.defaultDestination || newId
    }));
    
    setNewDestination({ name: '', url: '', openNewTab: true });
    
    toast({
      title: "Tujuan ditambahkan",
      description: `${newDestination.name} telah ditambahkan ke daftar tujuan.`
    });
  };

  const handleSetDefaultDestination = (id) => {
    setSettings(prev => ({
      ...prev,
      defaultDestination: id
    }));
    
    toast({
      title: "Default diatur",
      description: "Tujuan default telah diperbarui."
    });
  };

  const handleToggleRotate = (checked) => {
    setSettings(prev => ({
      ...prev,
      rotateDestinations: checked
    }));
  };

  const handleToggleTracking = (checked) => {
    setSettings(prev => ({
      ...prev,
      trackClicks: checked
    }));
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Tujuan</h2>
          <p className="text-muted-foreground">
            Konfigurasi tujuan untuk kampanye Anda
          </p>
        </div>
        <Button onClick={handleSaveSettings}>
          <Save className="mr-2 h-4 w-4" />
          Simpan Pengaturan
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ListChecks className="mr-2 h-5 w-5 text-blue-500" />
            Pengaturan Tujuan
          </CardTitle>
          <CardDescription>
            Atur tujuan yang akan digunakan dalam kampanye Anda
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Destinations List */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Daftar Tujuan</h3>
              <div className="flex gap-2">
                <Badge variant="outline" className="py-1">
                  {settings.destinations.filter(d => d.enabled).length} Aktif
                </Badge>
                <Badge variant="outline" className="py-1">
                  {settings.destinations.length} Total
                </Badge>
              </div>
            </div>
            
            {settings.destinations.length > 0 ? (
              <div className="space-y-3">
                {settings.destinations.map(destination => (
                  <div key={destination.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-secondary rounded-md">
                    <div className="flex flex-col gap-1 mb-3 md:mb-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{destination.name}</span>
                        {settings.defaultDestination === destination.id && (
                          <Badge variant="secondary" className="text-xs">Default</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <ExternalLink className="h-3 w-3" />
                        <a href={destination.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          {destination.url}
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id={`dest-enabled-${destination.id}`}
                          checked={destination.enabled}
                          onCheckedChange={(checked) => handleToggleDestination(destination.id, !!checked)}
                        />
                        <Label htmlFor={`dest-enabled-${destination.id}`} className="text-sm">Aktif</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id={`dest-newtab-${destination.id}`}
                          checked={destination.openNewTab}
                          onCheckedChange={(checked) => handleToggleNewTab(destination.id, !!checked)}
                        />
                        <Label htmlFor={`dest-newtab-${destination.id}`} className="text-sm">Tab Baru</Label>
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleSetDefaultDestination(destination.id)}
                        disabled={settings.defaultDestination === destination.id}
                      >
                        Set Default
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleRemoveDestination(destination.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Belum ada tujuan yang ditambahkan.</p>
            )}
            
            {/* Add New Destination */}
            <div className="space-y-3 pt-4 border-t">
              <h3 className="text-sm font-medium">Tambah Tujuan Baru</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="new-dest-name">Nama Tujuan</Label>
                  <Input
                    id="new-dest-name"
                    placeholder="contoh: Landing Page Utama"
                    value={newDestination.name}
                    onChange={(e) => setNewDestination(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="new-dest-url">URL</Label>
                  <Input
                    id="new-dest-url"
                    placeholder="contoh: https://example.com"
                    value={newDestination.url}
                    onChange={(e) => setNewDestination(prev => ({ ...prev, url: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="new-dest-newtab"
                  checked={newDestination.openNewTab}
                  onCheckedChange={(checked) => setNewDestination(prev => ({ ...prev, openNewTab: !!checked }))}
                />
                <Label htmlFor="new-dest-newtab">Buka di tab baru</Label>
              </div>
              
              <Button 
                variant="outline" 
                onClick={handleAddDestination}
              >
                <Plus className="mr-2 h-4 w-4" />
                Tambah Tujuan
              </Button>
            </div>
          </div>
          
          {/* Additional Settings */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-sm font-medium">Pengaturan Tambahan</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 bg-secondary rounded-md">
                <div>
                  <Label htmlFor="rotate-destinations" className="font-medium">Rotasi Tujuan</Label>
                  <p className="text-xs text-muted-foreground">Putar tujuan secara otomatis untuk setiap klik</p>
                </div>
                <Checkbox 
                  id="rotate-destinations"
                  checked={settings.rotateDestinations}
                  onCheckedChange={(checked) => handleToggleRotate(!!checked)}
                />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-secondary rounded-md">
                <div>
                  <Label htmlFor="track-clicks" className="font-medium">Lacak Klik</Label>
                  <p className="text-xs text-muted-foreground">Aktifkan pelacakan klik untuk analitik</p>
                </div>
                <Checkbox 
                  id="track-clicks"
                  checked={settings.trackClicks}
                  onCheckedChange={(checked) => handleToggleTracking(!!checked)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}