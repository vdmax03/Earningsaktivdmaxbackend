import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Globe, Save, Search } from 'lucide-react';

// List of countries for targeting
const COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "UK", name: "United Kingdom" },
  { code: "ID", name: "Indonesia" },
  { code: "AU", name: "Australia" },
  { code: "CA", name: "Canada" },
  { code: "ES", name: "Spain" },
  { code: "GE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "IT", name: "Italy" },
  { code: "JP", name: "Japan" },
  { code: "KR", name: "South Korea" },
  { code: "RU", name: "Russia" },
  { code: "BR", name: "Brazil" },
  { code: "IN", name: "India" },
  { code: "CN", name: "China" },
  { code: "NL", name: "Netherlands" },
  { code: "MX", name: "Mexico" },
  { code: "SG", name: "Singapore" },
  { code: "MY", name: "Malaysia" },
  { code: "TH", name: "Thailand" }
];

export default function CountriesSettings() {
  const [settings, setSettings] = useState({
    selectedCountries: ["US", "UK", "ID", "AU"],
    excludedCountries: ["CN", "RU"],
    geoTargeting: true,
    regionSpecific: false,
    regions: []
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Load saved settings from localStorage
    const savedSettings = localStorage.getItem('settings_countries');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
    setLoading(false);
  }, []);

  const handleSaveSettings = () => {
    localStorage.setItem('settings_countries', JSON.stringify(settings));
    toast({
      title: "Pengaturan disimpan",
      description: "Pengaturan Country Target telah berhasil diperbarui."
    });
  };

  const handleToggleCountry = (code, checked) => {
    if (checked) {
      // Add to selected countries and remove from excluded if present
      setSettings(prev => ({
        ...prev,
        selectedCountries: [...prev.selectedCountries, code],
        excludedCountries: prev.excludedCountries.filter(c => c !== code)
      }));
    } else {
      // Remove from selected countries
      setSettings(prev => ({
        ...prev,
        selectedCountries: prev.selectedCountries.filter(c => c !== code)
      }));
    }
  };

  const handleToggleExcluded = (code, checked) => {
    if (checked) {
      // Add to excluded countries and remove from selected if present
      setSettings(prev => ({
        ...prev,
        excludedCountries: [...prev.excludedCountries, code],
        selectedCountries: prev.selectedCountries.filter(c => c !== code)
      }));
    } else {
      // Remove from excluded countries
      setSettings(prev => ({
        ...prev,
        excludedCountries: prev.excludedCountries.filter(c => c !== code)
      }));
    }
  };

  const handleSelectAll = () => {
    setSettings(prev => ({
      ...prev,
      selectedCountries: COUNTRIES.map(country => country.code),
      excludedCountries: []
    }));
    
    toast({
      title: "Semua negara dipilih",
      description: "Semua negara telah ditambahkan ke daftar target."
    });
  };

  const handleClearAll = () => {
    setSettings(prev => ({
      ...prev,
      selectedCountries: [],
      excludedCountries: []
    }));
    
    toast({
      title: "Semua pilihan dihapus",
      description: "Daftar negara target telah dikosongkan."
    });
  };

  const handleToggleGeoTargeting = (checked) => {
    setSettings(prev => ({
      ...prev,
      geoTargeting: checked
    }));
  };

  const handleToggleRegionSpecific = (checked) => {
    setSettings(prev => ({
      ...prev,
      regionSpecific: checked
    }));
  };

  // Filter countries based on search query
  const filteredCountries = COUNTRIES.filter(country => 
    country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    country.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Country Target</h2>
          <p className="text-muted-foreground">
            Pilih negara target untuk kampanye Anda
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
            <Globe className="mr-2 h-5 w-5 text-blue-500" />
            Target Countries
          </CardTitle>
          <CardDescription>
            Pilih negara yang ingin Anda targetkan dalam kampanye Anda
          </CardDescription>
          <div className="flex gap-2 mt-2">
            <Button variant="outline" size="sm" onClick={handleSelectAll}>Pilih Semua</Button>
            <Button variant="outline" size="sm" onClick={handleClearAll}>Hapus Semua</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search and Stats */}
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari negara..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="py-1 px-2">
                {settings.selectedCountries.length} Negara Dipilih
              </Badge>
              <Badge variant="outline" className="py-1 px-2 border-red-200 text-red-800">
                {settings.excludedCountries.length} Negara Dikecualikan
              </Badge>
            </div>
          </div>
          
          {/* Country List */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredCountries.map(country => (
              <div key={country.code} className="flex items-center space-x-4 p-3 bg-secondary rounded-md">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{country.code}</Badge>
                    <span className="font-medium">{country.name}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center space-x-1">
                    <Checkbox 
                      id={`country-${country.code}`}
                      checked={settings.selectedCountries.includes(country.code)}
                      onCheckedChange={(checked) => handleToggleCountry(country.code, !!checked)}
                    />
                    <Label htmlFor={`country-${country.code}`} className="text-xs">Target</Label>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Checkbox 
                      id={`exclude-${country.code}`}
                      checked={settings.excludedCountries.includes(country.code)}
                      onCheckedChange={(checked) => handleToggleExcluded(country.code, !!checked)}
                    />
                    <Label htmlFor={`exclude-${country.code}`} className="text-xs">Exclude</Label>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Additional Settings */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-sm font-medium">Pengaturan Tambahan</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 bg-secondary rounded-md">
                <Label htmlFor="geo-targeting">Aktifkan Geo-Targeting</Label>
                <Checkbox 
                  id="geo-targeting"
                  checked={settings.geoTargeting}
                  onCheckedChange={(checked) => handleToggleGeoTargeting(!!checked)}
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-secondary rounded-md">
                <Label htmlFor="region-specific">Mode Region Spesifik</Label>
                <Checkbox 
                  id="region-specific"
                  checked={settings.regionSpecific}
                  onCheckedChange={(checked) => handleToggleRegionSpecific(!!checked)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}