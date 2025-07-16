import { useState, useEffect } from "react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { Users, Plus, TestTube, Trash2, Edit, X, Loader2, Image, Eye, EyeOff, Search, Copy, Check, UserCheck, UserX, Fingerprint } from 'lucide-react'

const MOCK_ACCOUNTS = [
  {
    id: 1,
    account_username: "tiktok_creator1",
    is_active: true,
    cookies_data: "sample_cookie_data",
    avatar: "",
    fingerprint: "demo123abc987", // demo
    created_at: "2023-07-10T09:30:00Z",
    last_used: "2023-08-15T14:20:00Z"
  },
  {
    id: 2,
    account_username: "effect_publisher",
    is_active: false,
    cookies_data: "sample_cookie_data",
    avatar: "",
    fingerprint: "fingerprintxyz123", // demo
    created_at: "2023-06-05T10:15:00Z",
    last_used: null
  }
];

const initialForm = {
  username: "",
  cookies: "",
  is_active: true,
  avatar: "",
  fingerprint: ""
};

const TikTokAccounts = () => {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [browserFingerprint, setBrowserFingerprint] = useState("")
  const [fingerprintLoading, setFingerprintLoading] = useState(false)

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showCookies, setShowCookies] = useState({}); // show/hide per id

  // Progress bar states
  const [isUploading, setIsUploading] = useState(false)
  const [testingId, setTestingId] = useState(null)
  const [copiedId, setCopiedId] = useState(null)

  // Form states
  const [newAccount, setNewAccount] = useState(initialForm)
  const [editAccount, setEditAccount] = useState(initialForm)
  const [editId, setEditId] = useState(null)
  const [search, setSearch] = useState("")

  const { toast } = useToast()

  // Dapatkan fingerprint browser saat mount
  useEffect(() => {
    getFingerprint()
    fetchAccounts()
  }, [])

  const getFingerprint = async () => {
    setFingerprintLoading(true)
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    setBrowserFingerprint(result.visitorId);
    setFingerprintLoading(false)
  }

  const fetchAccounts = async () => {
    try {
      setTimeout(() => {
        setAccounts(MOCK_ACCOUNTS)
        setLoading(false)
      }, 500)
    } catch (error) {
      setAccounts(MOCK_ACCOUNTS)
      toast({
        title: "Gagal memuat akun",
        description: "Menggunakan data contoh sebagai fallback",
        variant: "destructive"
      })
      setLoading(false)
    }
  }

  // ====== Tambah akun baru ======
  const handleSaveAccount = async (e) => {
    e.preventDefault()
    if (!newAccount.username.trim() || !newAccount.cookies.trim()) {
      toast({
        title: "Data tidak lengkap",
        description: "Username dan cookies wajib diisi",
        variant: "destructive"
      })
      return
    }
    let avatarUrl = ""
    if (newAccount.avatar) {
      setIsUploading(true)
      avatarUrl = await fakeUpload(newAccount.avatar)
      setIsUploading(false)
    }
    // Fingerprint otomatis dari browser
    setAccounts(prev => [
      ...prev,
      {
        id: Date.now(),
        account_username: newAccount.username,
        is_active: newAccount.is_active,
        cookies_data: newAccount.cookies,
        avatar: avatarUrl,
        fingerprint: browserFingerprint,
        created_at: new Date().toISOString(),
        last_used: null
      }
    ])
    setShowAddModal(false)
    setNewAccount(initialForm)
    toast({
      title: "Akun ditambahkan",
      description: `Akun @${newAccount.username} berhasil ditambahkan`
    })
  }

  // ====== Edit akun ======
  const handleEditOpen = (account) => {
    setEditAccount({
      username: account.account_username,
      cookies: account.cookies_data,
      is_active: account.is_active,
      avatar: account.avatar || "",
      fingerprint: account.fingerprint || browserFingerprint
    })
    setEditId(account.id)
    setShowEditModal(true)
  }

  const handleEditSave = async (e) => {
    e.preventDefault()
    if (!editAccount.username.trim() || !editAccount.cookies.trim()) {
      toast({
        title: "Data tidak lengkap",
        description: "Username dan cookies wajib diisi",
        variant: "destructive"
      })
      return
    }
    let avatarUrl = editAccount.avatar
    if (typeof avatarUrl === "object" && avatarUrl) {
      setIsUploading(true)
      avatarUrl = await fakeUpload(avatarUrl)
      setIsUploading(false)
    }
    setAccounts(prev =>
      prev.map(acc =>
        acc.id === editId
          ? {
              ...acc,
              account_username: editAccount.username,
              cookies_data: editAccount.cookies,
              is_active: editAccount.is_active,
              avatar: avatarUrl,
              fingerprint: editAccount.fingerprint || browserFingerprint
            }
          : acc
      )
    )
    setShowEditModal(false)
    setEditId(null)
    setEditAccount(initialForm)
    toast({
      title: "Akun diupdate",
      description: `Akun @${editAccount.username} berhasil diperbarui`
    })
  }

  // ====== Hapus akun ======
  const handleDeleteAccount = (accountId) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus akun ini?")) {
      setAccounts(prev => prev.filter(acc => acc.id !== accountId))
      toast({
        title: "Akun dihapus",
        description: "Akun berhasil dihapus"
      })
    }
  }

  // ====== Test koneksi akun TikTok ======
  const testAccount = async (accountId) => {
    setTestingId(accountId)
    try {
      await new Promise(resolve => setTimeout(resolve, 1200)) // Simulasi API
      setAccounts(accs =>
        accs.map(acc =>
          acc.id === accountId
            ? { ...acc, last_used: new Date().toISOString() }
            : acc
        )
      )
      toast({
        title: "Test berhasil",
        description: "Koneksi ke akun TikTok berhasil"
      })
    } catch (error) {
      toast({
        title: "Test gagal",
        description: "Tidak dapat terhubung ke server",
        variant: "destructive"
      })
    }
    setTestingId(null)
  }

  // ====== Upload Avatar Helper (simulasi) ======
  function fakeUpload(fileObj) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(URL.createObjectURL(fileObj))
      }, 1000)
    })
  }

  // ====== Toggle Active Status ======
  const toggleActive = (id) => {
    setAccounts(accs =>
      accs.map(acc =>
        acc.id === id
          ? { ...acc, is_active: !acc.is_active }
          : acc
      )
    )
    toast({
      title: "Status akun diubah"
    })
  }

  // ====== Search ======
  const filteredAccounts = accounts.filter(acc =>
    acc.account_username.toLowerCase().includes(search.toLowerCase())
  )

  // ====== Copy to clipboard ======
  function handleCopy(val, id) {
    navigator.clipboard.writeText(val)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 1200)
    toast({
      title: "Disalin ke clipboard"
    })
  }

  // ====== UI ======
  if (loading || fingerprintLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Modal Tambah Akun */}
      {showAddModal && (
        <Modal title="Tambah Akun TikTok" onClose={() => setShowAddModal(false)}>
          <form onSubmit={handleSaveAccount} className="space-y-4">
            <InputField
              label="Username TikTok"
              value={newAccount.username}
              onChange={v => setNewAccount(acc => ({ ...acc, username: v }))}
              placeholder="cth: my_username"
              autoFocus
            />
            <InputField
              label="Cookies (dari TikTok)"
              value={newAccount.cookies}
              onChange={v => setNewAccount(acc => ({ ...acc, cookies: v }))}
              placeholder="Paste cookies di sini"
              textarea
            />
            <InputFile
              label="Avatar TikTok (optional)"
              value={newAccount.avatar}
              onChange={file => setNewAccount(acc => ({ ...acc, avatar: file }))}
              preview={newAccount.avatar}
            />
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={newAccount.is_active}
                onChange={e => setNewAccount(acc => ({ ...acc, is_active: e.target.checked }))}
                id="is_active_add"
              />
              <label htmlFor="is_active_add" className="text-sm">Akun Aktif</label>
            </div>
            <div className="flex items-center gap-2">
              <Fingerprint className="h-4 w-4 text-blue-500" />
              <span className="text-xs text-gray-700">
                Browser fingerprint: <span className="font-mono">{browserFingerprint}</span>
              </span>
            </div>
            {isUploading && <ProgressBar />}
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={isUploading}>
                <Plus className="mr-2 h-4 w-4" />
                Simpan Akun
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal Edit Akun */}
      {showEditModal && (
        <Modal title="Edit Akun TikTok" onClose={() => setShowEditModal(false)}>
          <form onSubmit={handleEditSave} className="space-y-4">
            <InputField
              label="Username TikTok"
              value={editAccount.username}
              onChange={v => setEditAccount(acc => ({ ...acc, username: v }))}
              placeholder="cth: my_username"
              autoFocus
            />
            <InputField
              label="Cookies (dari TikTok)"
              value={editAccount.cookies}
              onChange={v => setEditAccount(acc => ({ ...acc, cookies: v }))}
              placeholder="Paste cookies di sini"
              textarea
            />
            <InputFile
              label="Avatar TikTok (optional)"
              value={editAccount.avatar}
              onChange={file => setEditAccount(acc => ({ ...acc, avatar: file }))}
              preview={editAccount.avatar}
            />
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={editAccount.is_active}
                onChange={e => setEditAccount(acc => ({ ...acc, is_active: e.target.checked }))}
                id="is_active_edit"
              />
              <label htmlFor="is_active_edit" className="text-sm">Akun Aktif</label>
            </div>
            <div className="flex items-center gap-2">
              <Fingerprint className="h-4 w-4 text-blue-500" />
              <span className="text-xs text-gray-700">
                Browser fingerprint: <span className="font-mono">{editAccount.fingerprint || browserFingerprint}</span>
              </span>
            </div>
            {isUploading && <ProgressBar />}
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowEditModal(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={isUploading}>
                <Edit className="mr-2 h-4 w-4" />
                Simpan Perubahan
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Header, Search, & Tambah akun */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Akun TikTok</h2>
          <p className="text-muted-foreground">
            Kelola akun TikTok untuk publikasi efek dan kampanye
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              className="rounded-lg border px-3 py-2 pr-9 text-sm"
              placeholder="Cari username..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ minWidth: 160 }}
            />
            <Search className="absolute right-2 top-2.5 w-4 h-4 text-gray-400" />
          </div>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Akun
          </Button>
        </div>
      </div>

      {/* Daftar akun */}
      {filteredAccounts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Users className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Belum ada akun TikTok</h3>
            <p className="text-gray-500 text-center mb-6">
              Tambahkan akun TikTok untuk mulai mempublikasikan efek dan menjalankan kampanye
            </p>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Akun Pertama
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredAccounts.map((account) => (
            <Card key={account.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div>
                      {account.avatar ? (
                        <img src={account.avatar} alt="avatar" className="w-10 h-10 rounded-full object-cover border" />
                      ) : (
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 border">
                          <Users className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        @{account.account_username}
                        <button
                          title="Salin username"
                          className="ml-1 text-gray-400 hover:text-blue-500"
                          onClick={() => handleCopy(account.account_username, account.id + "-user")}
                        >
                          {copiedId === account.id + "-user" ? <Check size={16} /> : <Copy size={16} />}
                        </button>
                      </CardTitle>
                      <CardDescription>
                        Ditambahkan: {new Date(account.created_at).toLocaleDateString('id-ID')}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge
                    variant={account.is_active ? 'default' : 'secondary'}
                    className="cursor-pointer"
                    onClick={() => toggleActive(account.id)}
                  >
                    {account.is_active ? (
                      <span className="flex items-center gap-1"><UserCheck size={14}/> Aktif</span>
                    ) : (
                      <span className="flex items-center gap-1"><UserX size={14}/> Nonaktif</span>
                    )}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status Cookies</p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">
                        {account.cookies_data ? (
                          showCookies[account.id] ? (
                            <span className="break-all">
                              {account.cookies_data}
                            </span>
                          ) : (
                            <span className="text-gray-600">Tersedia</span>
                          )
                        ) : (
                          "Belum diatur"
                        )}
                      </span>
                      {account.cookies_data && (
                        <>
                          <button
                            onClick={() =>
                              setShowCookies((prev) => ({
                                ...prev,
                                [account.id]: !prev[account.id],
                              }))
                            }
                            title={showCookies[account.id] ? "Sembunyikan" : "Lihat"}
                            className="text-gray-400 hover:text-blue-500"
                          >
                            {showCookies[account.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                          <button
                            title="Salin cookies"
                            className="text-gray-400 hover:text-blue-500"
                            onClick={() => handleCopy(account.cookies_data, account.id + "-cookies")}
                          >
                            {copiedId === account.id + "-cookies" ? <Check size={16} /> : <Copy size={16} />}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Terakhir Digunakan</p>
                    <p className="text-sm">
                      {account.last_used 
                        ? new Date(account.last_used).toLocaleDateString('id-ID')
                        : 'Belum pernah'
                      }
                    </p>
                  </div>
                </div>
                {/* FINGERPRINT INFO */}
                <div className="flex items-center gap-2 mb-2">
                  <Fingerprint className="h-4 w-4 text-blue-500" />
                  <span className="text-xs text-gray-700 font-mono break-all">
                    {account.fingerprint || "-"}
                  </span>
                  <button
                    title="Salin fingerprint"
                    className="text-gray-400 hover:text-blue-500"
                    onClick={() => handleCopy(account.fingerprint, account.id + "-fp")}
                  >
                    {copiedId === account.id + "-fp" ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => testAccount(account.id)}
                      disabled={testingId === account.id}
                    >
                      {testingId === account.id ? (
                        <Loader2 className="animate-spin h-4 w-4 mr-1" />
                      ) : (
                        <TestTube className="h-4 w-4 mr-1" />
                      )}
                      Test Koneksi
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditOpen(account)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteAccount(account.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Hapus
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Instructions Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Cara Menambah Akun TikTok</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-800">
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Login ke akun TikTok Anda di browser</li>
            <li>Buka Developer Tools (F12) dan pergi ke tab Application/Storage</li>
            <li>Copy semua cookies dari domain tiktok.com</li>
            <li>Paste cookies tersebut saat menambah akun baru</li>
            <li>Test koneksi untuk memastikan akun dapat digunakan</li>
          </ol>
        </CardContent>
      </Card>

      {/* FINGERPRINT EXPLANATION */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex gap-2 items-center">
            <Fingerprint className="h-5 w-5 text-blue-500" /> Apa itu Browser Fingerprint?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Browser fingerprint adalah identitas unik dari browser/device kamu (misal: hardware, OS, konfigurasi unik).
            Dengan fingerprint berbeda pada setiap akun/penonton, peluang lolos dari deteksi spam/banned TikTok/YouTube lebih besar.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default TikTokAccounts

// ----------------- Komponen Kecil -----------------
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

function InputField({ label, value, onChange, textarea, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {textarea ? (
        <textarea
          className="border rounded px-3 py-2 w-full"
          value={value}
          onChange={e => onChange(e.target.value)}
          {...props}
        />
      ) : (
        <input
          className="border rounded px-3 py-2 w-full"
          value={value}
          onChange={e => onChange(e.target.value)}
          {...props}
        />
      )}
    </div>
  )
}

function InputFile({ label, value, onChange, preview }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type="file"
        accept="image/*"
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700"
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
      <div className="bg-blue-600 h-2.5 animate-pulse w-full" />
    </div>
  )
}
