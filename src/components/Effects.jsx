import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { Sparkles, Plus, Upload, Share, Trash2, Edit, DollarSign, X } from 'lucide-react'

// Mock data untuk fallback
const MOCK_EFFECTS = [
  {
    id: 1,
    effect_name: "Glitter Face",
    category: "Beauty",
    tags: "makeup, beauty, glitter",
    status: "published",
    created_at: "2023-08-12T10:30:00Z",
    hint: "Try this effect with good lighting for best results!",
    icon: "",
    file: "",
  },
  {
    id: 2,
    effect_name: "Dancing Robot",
    category: "Entertainment",
    tags: "dance, robot, fun",
    status: "draft",
    created_at: "2023-09-05T14:20:00Z",
    icon: "",
    file: "",
  }
];

const MOCK_EARNINGS = {
  total_earnings: 2580,
  effects_earnings: [
    { effect_id: 1, total_earnings: 2400, views: 120000, uses: 58000 },
    { effect_id: 2, total_earnings: 180, views: 9000, uses: 3000 }
  ]
};

const initialForm = {
  effect_name: "",
  category: "",
  tags: "",
  hint: "",
  status: "draft",
  icon: "",
  file: "",
};

const Effects = () => {
  const [effects, setEffects] = useState([])
  const [earnings, setEarnings] = useState({ total_earnings: 0, effects_earnings: [] })
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(initialForm)
  const [isUploading, setIsUploading] = useState(false)
  const [showEarningModal, setShowEarningModal] = useState(false)
  const [earningForm, setEarningForm] = useState({ effect_id: null, total_earnings: 0, views: 0, uses: 0 })
  const { toast } = useToast()

  useEffect(() => {
    fetchEffects()
    fetchEarnings()
  }, [])

  const fetchEffects = async () => {
    try {
      setTimeout(() => {
        setEffects(MOCK_EFFECTS)
        setLoading(false)
      }, 500)
    } catch (error) {
      setEffects(MOCK_EFFECTS)
      toast({
        title: "Gagal memuat efek",
        description: "Menggunakan data contoh sebagai fallback",
        variant: "destructive"
      })
      setLoading(false)
    }
  }

  const fetchEarnings = async () => {
    try {
      setTimeout(() => {
        setEarnings(MOCK_EARNINGS)
      }, 500)
    } catch (error) {
      setEarnings(MOCK_EARNINGS)
    }
  }

  // ===== Add/Edit =====
  const handleOpenModal = (effect = null) => {
    if (effect) {
      setForm({
        effect_name: effect.effect_name,
        category: effect.category,
        tags: effect.tags,
        hint: effect.hint || "",
        status: effect.status || "draft",
        icon: effect.icon || "",
        file: effect.file || "",
      })
      setEditId(effect.id)
    } else {
      setForm(initialForm)
      setEditId(null)
    }
    setShowModal(true)
  }

  const handleSaveEffect = async (e) => {
    e.preventDefault()
    if (!form.effect_name.trim() || !form.category.trim()) {
      toast({
        title: "Data tidak lengkap",
        description: "Nama efek dan kategori wajib diisi",
        variant: "destructive"
      })
      return
    }
    setIsUploading(true)
    let iconUrl = form.icon
    let fileUrl = form.file
    // Simulasi upload file/icon
    if (typeof form.icon === "object" && form.icon) {
      iconUrl = await fakeUpload(form.icon)
    }
    if (typeof form.file === "object" && form.file) {
      fileUrl = await fakeUpload(form.file)
    }
    setTimeout(() => {
      if (editId) {
        setEffects(effects =>
          effects.map(e =>
            e.id === editId
              ? {
                  ...e,
                  ...form,
                  icon: iconUrl,
                  file: fileUrl,
                }
              : e
          )
        )
        toast({ title: "Efek diupdate", description: `Efek "${form.effect_name}" berhasil diperbarui` })
      } else {
        const newId = Date.now()
        setEffects(effects =>
          [
            ...effects,
            {
              id: newId,
              ...form,
              icon: iconUrl,
              file: fileUrl,
              created_at: new Date().toISOString(),
            }
          ]
        )
        setEarnings(prev => ({
          ...prev,
          effects_earnings: [
            ...prev.effects_earnings,
            { effect_id: newId, total_earnings: 0, views: 0, uses: 0 }
          ]
        }))
        toast({ title: "Efek ditambahkan", description: `Efek "${form.effect_name}" berhasil ditambahkan` })
      }
      setIsUploading(false)
      setShowModal(false)
      setForm(initialForm)
      setEditId(null)
    }, 800)
  }

  function fakeUpload(fileObj) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(URL.createObjectURL(fileObj))
      }, 900)
    })
  }

  // ===== Publish
  const handlePublishEffect = (effectId) => {
    setEffects(effects =>
      effects.map(e =>
        e.id === effectId ? { ...e, status: "published" } : e
      )
    )
    toast({
      title: "Efek dipublish",
      description: `Efek ID ${effectId} siap dipublikasikan (hanya di UI)`
    })
  }

  // ===== Delete
  const handleDeleteEffect = (effectId) => {
    const confirmed = window.confirm("Apakah Anda yakin ingin menghapus efek ini?")
    if (confirmed) {
      setEffects(prevEffects => prevEffects.filter(effect => effect.id !== effectId))
      setEarnings(prev => ({
        ...prev,
        effects_earnings: prev.effects_earnings.filter(e => e.effect_id !== effectId)
      }))
      toast({
        title: "Efek dihapus",
        description: "Efek & pendapatan terkait berhasil dihapus"
      })
    }
  }

  // ===== Badge UI
  const getStatusBadge = (status) => {
    const statusConfig = {
      'draft': { variant: 'outline', label: 'Draft' },
      'publishing': { variant: 'default', label: 'Publishing' },
      'published': { variant: 'secondary', label: 'Published' },
      'partially_published': { variant: 'destructive', label: 'Partially Published' },
      'failed': { variant: 'destructive', label: 'Failed' }
    }
    const config = statusConfig[status] || { variant: 'outline', label: status }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  // ===== Earnings Helper
  const getEffectEarnings = (effectId) => {
    const effectEarning = earnings.effects_earnings?.find(e => e.effect_id === effectId)
    return effectEarning || { total_earnings: 0, views: 0, uses: 0 }
  }

  // ===== Edit Earnings =====
  const handleOpenEarningModal = (effectId) => {
    const ee = getEffectEarnings(effectId);
    setEarningForm({
      effect_id: effectId,
      total_earnings: ee.total_earnings,
      views: ee.views,
      uses: ee.uses,
    });
    setShowEarningModal(true);
  }

  const handleSaveEarning = (e) => {
    e.preventDefault();
    setEarnings(prev => ({
      ...prev,
      effects_earnings: prev.effects_earnings.map(ee =>
        ee.effect_id === earningForm.effect_id
          ? { ...earningForm }
          : ee
      )
    }));
    setShowEarningModal(false);
    toast({ title: "Pendapatan diupdate", description: "Data earning berhasil diubah" });
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
      {/* Modal Tambah/Edit Effect */}
      {showModal && (
        <Modal
          title={editId ? "Edit Efek" : "Tambah Efek Baru"}
          onClose={() => setShowModal(false)}
        >
          <form className="space-y-4" onSubmit={handleSaveEffect}>
            <InputField
              label="Nama Efek"
              value={form.effect_name}
              onChange={v => setForm(f => ({ ...f, effect_name: v }))}
              placeholder="cth: My Cool Effect"
              autoFocus
            />
            <InputField
              label="Kategori"
              value={form.category}
              onChange={v => setForm(f => ({ ...f, category: v }))}
              placeholder="cth: Beauty / Entertainment"
            />
            <InputField
              label="Tags (pisahkan koma)"
              value={form.tags}
              onChange={v => setForm(f => ({ ...f, tags: v }))}
              placeholder="makeup, glowing, viral"
            />
            <InputField
              label="Hint (opsional)"
              value={form.hint}
              onChange={v => setForm(f => ({ ...f, hint: v }))}
              placeholder="Tips efek ini…"
            />
            <InputFile
              label="Upload Icon Efek (jpg/png)"
              value={form.icon}
              onChange={file => setForm(f => ({ ...f, icon: file }))}
              preview={form.icon}
            />
            <InputFile
              label="Upload File Efek (.zip)"
              value={form.file}
              onChange={file => setForm(f => ({ ...f, file: file }))}
              preview={null}
            />
            {isUploading && <ProgressBar />}
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Batal</Button>
              <Button type="submit" disabled={isUploading}>
                {editId ? <Edit className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                {editId ? "Simpan Perubahan" : "Tambah Efek"}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal Edit Earnings */}
      {showEarningModal && (
        <Modal title="Edit Earnings Efek" onClose={() => setShowEarningModal(false)}>
          <form onSubmit={handleSaveEarning} className="space-y-3">
            <InputField
              label="Total Earnings ($)"
              type="number"
              value={earningForm.total_earnings}
              onChange={v => setEarningForm(f => ({ ...f, total_earnings: Number(v) }))}
            />
            <InputField
              label="Views"
              type="number"
              value={earningForm.views}
              onChange={v => setEarningForm(f => ({ ...f, views: Number(v) }))}
            />
            <InputField
              label="Uses"
              type="number"
              value={earningForm.uses}
              onChange={v => setEarningForm(f => ({ ...f, uses: Number(v) }))}
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowEarningModal(false)}>Batal</Button>
              <Button type="submit">
                <DollarSign className="mr-2 h-4 w-4" /> Simpan Earnings
              </Button>
            </div>
          </form>
        </Modal>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Effect House</h2>
          <p className="text-muted-foreground">
            Kelola efek TikTok dan otomatisasi publikasi untuk meningkatkan pendapatan
          </p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="mr-2 h-4 w-4" />
          Upload Efek Baru
        </Button>
      </div>

      {/* Earnings Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Pendapatan</p>
                <p className="text-2xl font-bold">${earnings.effects_earnings.reduce((a, b) => a + (b.total_earnings || 0), 0).toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Efek</p>
                <p className="text-2xl font-bold">{effects.length}</p>
              </div>
              <Sparkles className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Efek Published</p>
                <p className="text-2xl font-bold">
                  {effects.filter(e => e.status === 'published').length}
                </p>
              </div>
              <Share className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rata-rata per Efek</p>
                <p className="text-2xl font-bold">
                  ${effects.length > 0
                    ? (earnings.effects_earnings.reduce((a, b) => a + (b.total_earnings || 0), 0) / effects.length).toFixed(2)
                    : '0.00'}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {effects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Sparkles className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Belum ada efek</h3>
            <p className="text-gray-500 text-center mb-6">
              Upload efek pertama Anda untuk mulai menghasilkan pendapatan dari TikTok Effect House
            </p>
            <Button onClick={() => handleOpenModal()}>
              <Upload className="mr-2 h-4 w-4" />
              Upload Efek Pertama
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {effects.map((effect) => {
            const effectEarnings = getEffectEarnings(effect.id)
            return (
              <Card key={effect.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2 items-center">
                      {effect.icon ? (
                        <img src={effect.icon} alt="icon" className="w-10 h-10 rounded-md object-cover border" />
                      ) : (
                        <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center border">
                          <Sparkles className="h-6 w-6 text-gray-300" />
                        </div>
                      )}
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {effect.effect_name}
                        </CardTitle>
                        <CardDescription>
                          {effect.category} • {effect.tags}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(effect.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Pendapatan</p>
                      <p className="text-lg font-bold text-green-600">
                        ${effectEarnings.total_earnings?.toFixed(2) || '0.00'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Views</p>
                      <p className="text-sm">{effectEarnings.views?.toLocaleString() || '0'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Uses</p>
                      <p className="text-sm">{effectEarnings.uses?.toLocaleString() || '0'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Dibuat</p>
                      <p className="text-sm">
                        {new Date(effect.created_at).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                  </div>
                  {effect.hint && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">
                        <strong>Hint:</strong> {effect.hint}
                      </p>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {effect.status === 'draft' && (
                        <Button 
                          size="sm"
                          onClick={() => handlePublishEffect(effect.id)}
                        >
                          <Share className="h-4 w-4 mr-1" />
                          Publish ke Akun
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleOpenModal(effect)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenEarningModal(effect.id)}
                      >
                        <DollarSign className="h-4 w-4 mr-1" />
                        Edit Earnings
                      </Button>
                    </div>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleDeleteEffect(effect.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Hapus
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Instructions Card */}
      <Card className="bg-purple-50 border-purple-200">
        <CardHeader>
          <CardTitle className="text-purple-900">Fitur Up Pendapatan Effect House</CardTitle>
        </CardHeader>
        <CardContent className="text-purple-800">
          <div className="space-y-3 text-sm">
            <p><strong>Cara Kerja:</strong></p>
            <ol className="list-decimal list-inside space-y-1 ml-4">
              <li>Upload file efek (.zip) dan icon efek</li>
              <li>Atur kategori, tags, dan hint untuk efek</li>
              <li>Pilih akun TikTok untuk publikasi otomatis</li>
              <li>Sistem akan login menggunakan cookies dan submit efek ke Effect House</li>
              <li>Monitor status review dan earnings secara real-time</li>
              <li>Otomatis re-submit jika ditolak dengan revisi</li>
            </ol>
            <p className="mt-3">
              <strong>Keuntungan:</strong> Dengan multiple akun, Anda dapat mempublikasikan efek yang sama 
              ke banyak akun sekaligus untuk memaksimalkan reach dan pendapatan.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Effects

// --------------- Komponen kecil (Modal, Input, Progress) ---------------
function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
          aria-label="Tutup"
          type="button"
        >
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        {children}
      </div>
    </div>
  )
}

function InputField({ label, value, onChange, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        className="border rounded px-3 py-2 w-full"
        value={value}
        onChange={e => onChange(e.target.value)}
        {...props}
      />
    </div>
  )
}

function InputFile({ label, value, onChange, preview }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type="file"
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700"
        onChange={e => {
          if (e.target.files?.length) onChange(e.target.files[0])
        }}
      />
      {preview && (
        <img
          src={typeof preview === "object" ? URL.createObjectURL(preview) : preview}
          alt="preview"
          className="mt-2 w-20 h-20 object-cover rounded border"
        />
      )}
    </div>
  )
}

function ProgressBar() {
  return (
    <div className="w-full bg-gray-100 rounded-full h-2.5 mb-2 overflow-hidden">
      <div className="bg-purple-600 h-2.5 animate-pulse w-full" />
    </div>
  )
}
