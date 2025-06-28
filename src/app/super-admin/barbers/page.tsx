'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { useApi } from '@/hooks/use-api';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  PlusIcon,
  MagnifyingGlassIcon, 
  UserIcon, 
  PhoneIcon, 
  EnvelopeIcon,
  CalendarIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

// Validation schema for barber form
const barberSchema = z.object({
  firstName: z.string().min(2, 'Ad en az 2 karakter olmalıdır'),
  lastName: z.string().min(2, 'Soyad en az 2 karakter olmalıdır'),
  email: z.string().email('Geçerli bir email adresi girin'),
  phoneNumber: z.string().min(10, 'Geçerli bir telefon numarası girin'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
});

type BarberFormData = z.infer<typeof barberSchema>;

async function getBarbers() {
  const response = await api.get('/barbers');
  return response.data;
}

async function createBarber(data: BarberFormData) {
  const response = await api.post('/barbers', data);
  return response.data;
}

async function updateBarber(id: string, data: Partial<BarberFormData>) {
  const response = await api.put(`/barbers/${id}`, data);
  return response.data;
}

export default function BarbersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBarber, setEditingBarber] = useState<any>(null);
  
  const { data: barbers, loading, execute: refetch } = useApi(getBarbers);

  // Add Barber Form
  const {
    register: registerAdd,
    handleSubmit: handleSubmitAdd,
    reset: resetAdd,
    formState: { errors: errorsAdd },
  } = useForm<BarberFormData>({
    resolver: zodResolver(barberSchema),
  });

  // Edit Barber Form
  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    setValue: setValueEdit,
    formState: { errors: errorsEdit },
  } = useForm<Partial<BarberFormData>>();

  // Mock data for development
  const mockBarbers = [
    {
      id: '1',
      firstName: 'Mehmet',
      lastName: 'Kılıç',
      email: 'mehmet.kilic@berber.com',
      phoneNumber: '0555 111 22 33',
      isActive: true,
      totalAppointments: 245,
      rating: 4.9,
      specialties: ['Klasik Kesim', 'Sakal Tıraş'],
      createdAt: new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000).toISOString(),
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '2',
      firstName: 'Kemal',
      lastName: 'Arslan',
      email: 'kemal.arslan@berber.com',
      phoneNumber: '0555 222 33 44',
      isActive: true,
      totalAppointments: 189,
      rating: 4.7,
      specialties: ['Modern Kesim', 'Saç Boyama'],
      createdAt: new Date(Date.now() - 8 * 30 * 24 * 60 * 60 * 1000).toISOString(),
      lastActive: new Date(Date.now() - 30 * 60 * 1000).toISOString()
    },
    {
      id: '3',
      firstName: 'Hasan',
      lastName: 'Demir',
      email: 'hasan.demir@berber.com',
      phoneNumber: '0555 333 44 55',
      isActive: false,
      totalAppointments: 67,
      rating: 4.5,
      specialties: ['Klasik Kesim'],
      createdAt: new Date(Date.now() - 4 * 30 * 24 * 60 * 60 * 1000).toISOString(),
      lastActive: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  const barbersData = Array.isArray(barbers) ? barbers : mockBarbers;

  const filteredBarbers = barbersData.filter((barber: any) => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    const fullName = `${barber.firstName} ${barber.lastName}`.toLowerCase();
    const phone = barber.phoneNumber.toLowerCase();
    const email = barber.email.toLowerCase();
    
    return fullName.includes(query) || phone.includes(query) || email.includes(query);
  });

  const handleToggleStatus = async (barberId: string, currentStatus: boolean) => {
    try {
      await api.put(`/barbers/${barberId}/status`, { isActive: !currentStatus });
      toast.success(currentStatus ? 'Berber pasif edildi' : 'Berber aktif edildi');
      refetch();
    } catch (error) {
      toast.error('İşlem başarısız');
    }
  };

  const handleAddBarber = async (data: BarberFormData) => {
    try {
      await createBarber(data);
      toast.success('Berber başarıyla eklendi');
      setIsAddModalOpen(false);
      resetAdd();
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Berber eklenemedi');
    }
  };

  const handleEditBarber = async (data: Partial<BarberFormData>) => {
    if (!editingBarber) return;
    
    try {
      await updateBarber(editingBarber.id, data);
      toast.success('Berber başarıyla güncellendi');
      setEditingBarber(null);
      resetEdit();
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Berber güncellenemedi');
    }
  };

  const openEditModal = (barber: any) => {
    setEditingBarber(barber);
    setValueEdit('firstName', barber.firstName);
    setValueEdit('lastName', barber.lastName);
    setValueEdit('email', barber.email);
    setValueEdit('phoneNumber', barber.phoneNumber);
  };

  const handleDeleteBarber = async (barberId: string) => {
    if (!confirm('Bu berber silinecek. Emin misiniz?')) return;
    
    try {
      await api.delete(`/barbers/${barberId}`);
      toast.success('Berber başarıyla silindi');
      refetch();
    } catch (error) {
      toast.error('Berber silinemedi');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Berberler</h1>
            <p className="page-subtitle">
              Berber personeli yönetimi
            </p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <PlusIcon className="w-4 h-4 mr-2" />
            Yeni Berber Ekle
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Berber ara (ad, telefon, email)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Barbers List */}
      <div className="space-y-4">
        {loading ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="animate-pulse">Berberler yükleniyor...</div>
            </CardContent>
          </Card>
        ) : filteredBarbers.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <UserIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Berber bulunamadı
              </h3>
              <p className="text-gray-600">
                {searchQuery 
                  ? 'Arama kriterlerinize uygun berber bulunamadı.'
                  : 'Henüz berber bulunmuyor.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredBarbers.map((barber: any) => (
            <Card key={barber.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    {/* Name & Status */}
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold">
                        {barber.firstName} {barber.lastName}
                      </h3>
                      <Badge variant={barber.isActive ? 'success' : 'error'}>
                        {barber.isActive ? 'Aktif' : 'Pasif'}
                      </Badge>
                      <div className="flex items-center space-x-1">
                        <span className="text-yellow-500">★</span>
                        <span className="text-sm font-medium">{barber.rating}</span>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <PhoneIcon className="w-4 h-4" />
                        <span>{barber.phoneNumber}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <EnvelopeIcon className="w-4 h-4" />
                        <span>{barber.email}</span>
                      </div>
                    </div>

                    {/* Specialties */}
                    <div className="flex flex-wrap gap-2">
                      {barber.specialties.map((specialty: string, index: number) => (
                        <Badge key={index} variant="default" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <CalendarIcon className="w-4 h-4 text-blue-500" />
                        <span>{barber.totalAppointments} randevu</span>
                      </div>
                      <div className="text-gray-600">
                        Son aktif: {formatDate(barber.lastActive)}
                      </div>
                      <div className="text-gray-600">
                        Kayıt: {formatDate(barber.createdAt)}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="ml-6 flex space-x-2">
                    <Button size="sm" variant="outline">
                      <EyeIcon className="w-4 h-4 mr-1" />
                      Detaylar
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => openEditModal(barber)}
                    >
                      <PencilIcon className="w-4 h-4 mr-1" />
                      Düzenle
                    </Button>
                    <Button 
                      size="sm" 
                      variant={barber.isActive ? 'danger' : 'primary'}
                      onClick={() => handleToggleStatus(barber.id, barber.isActive)}
                    >
                      {barber.isActive ? 'Pasif Et' : 'Aktif Et'}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="danger"
                      onClick={() => handleDeleteBarber(barber.id)}
                    >
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Add Barber Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          resetAdd();
        }}
        title="Yeni Berber Ekle"
        size="md"
      >
        <form onSubmit={handleSubmitAdd(handleAddBarber)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              {...registerAdd('firstName')}
              label="Ad" 
              placeholder="Berber adı"
              error={errorsAdd.firstName?.message}
            />
            <Input 
              {...registerAdd('lastName')}
              label="Soyad" 
              placeholder="Berber soyadı"
              error={errorsAdd.lastName?.message}
            />
          </div>

          <Input 
            {...registerAdd('email')}
            label="Email" 
            type="email" 
            placeholder="email@berber.com"
            error={errorsAdd.email?.message}
          />

          <Input 
            {...registerAdd('phoneNumber')}
            label="Telefon" 
            placeholder="0555 123 45 67"
            error={errorsAdd.phoneNumber?.message}
          />

          <Input 
            {...registerAdd('password')}
            label="Şifre" 
            type="password" 
            placeholder="Geçici şifre"
            error={errorsAdd.password?.message}
          />
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button 
              type="button"
              variant="outline" 
              onClick={() => {
                setIsAddModalOpen(false);
                resetAdd();
              }}
            >
              İptal
            </Button>
            <Button type="submit">
              Berber Ekle
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Barber Modal */}
      {editingBarber && (
        <Modal
          isOpen={!!editingBarber}
          onClose={() => {
            setEditingBarber(null);
            resetEdit();
          }}
          title="Berber Düzenle"
          size="md"
        >
          <form onSubmit={handleSubmitEdit(handleEditBarber)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                {...registerEdit('firstName')}
                label="Ad" 
                placeholder="Berber adı"
                error={errorsEdit.firstName?.message}
              />
              <Input 
                {...registerEdit('lastName')}
                label="Soyad" 
                placeholder="Berber soyadı"
                error={errorsEdit.lastName?.message}
              />
            </div>

            <Input 
              {...registerEdit('email')}
              label="Email" 
              type="email" 
              placeholder="email@berber.com"
              error={errorsEdit.email?.message}
            />

            <Input 
              {...registerEdit('phoneNumber')}
              label="Telefon" 
              placeholder="0555 123 45 67"
              error={errorsEdit.phoneNumber?.message}
            />

            <Input 
              {...registerEdit('password')}
              label="Yeni Şifre (Opsiyonel)" 
              type="password" 
              placeholder="Boş bırakılırsa değişmez"
              error={errorsEdit.password?.message}
            />
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button 
                type="button"
                variant="outline" 
                onClick={() => {
                  setEditingBarber(null);
                  resetEdit();
                }}
              >
                İptal
              </Button>
              <Button type="submit">
                Güncelle
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}