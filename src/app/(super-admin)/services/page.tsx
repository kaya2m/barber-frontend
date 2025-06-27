// src/app/(super-admin)/services/page.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { useApi } from '@/hooks/use-api';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ClockIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

// Validation schema for service form
const serviceSchema = z.object({
  name: z.string().min(2, 'Hizmet adı en az 2 karakter olmalıdır'),
  description: z.string().min(10, 'Açıklama en az 10 karakter olmalıdır'),
  price: z.number().min(1, 'Fiyat 0\'dan büyük olmalıdır'),
  duration: z.number().min(5, 'Süre en az 5 dakika olmalıdır'),
  serviceType: z.enum(['Regular', 'VIPRoom', 'VIPCar']),
  requiresFullPayment: z.boolean(),
  isActive: z.boolean().optional(),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

async function getServices() {
  const response = await api.get('/services');
  return response.data;
}

async function createService(data: ServiceFormData) {
  const response = await api.post('/services', data);
  return response.data;
}

async function updateService(id: string, data: Partial<ServiceFormData>) {
  const response = await api.put(`/services/${id}`, data);
  return response.data;
}

export default function ServicesPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  
  const { data: services, loading, execute: refetch } = useApi(getServices);

  // Add Service Form
  const {
    register: registerAdd,
    handleSubmit: handleSubmitAdd,
    reset: resetAdd,
    formState: { errors: errorsAdd },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      requiresFullPayment: false,
      isActive: true,
    },
  });

  // Edit Service Form
  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    setValue: setValueEdit,
    formState: { errors: errorsEdit },
  } = useForm<Partial<ServiceFormData>>();

  // Mock data for development
  const mockServices = [
    {
      id: '1',
      name: 'Klasik Kesim',
      description: 'Geleneksel saç kesimi ve şampuan',
      price: 50,
      duration: 30,
      serviceType: 'Regular',
      isActive: true,
      requiresFullPayment: false
    },
    {
      id: '2',
      name: 'Saç + Sakal',
      description: 'Saç kesimi ve sakal tıraşı',
      price: 80,
      duration: 45,
      serviceType: 'Regular',
      isActive: true,
      requiresFullPayment: false
    },
    {
      id: '3',
      name: 'VIP Oda Hizmeti',
      description: 'Özel odada VIP hizmet paketi',
      price: 150,
      duration: 60,
      serviceType: 'VIPRoom',
      isActive: true,
      requiresFullPayment: true
    },
    {
      id: '4',
      name: 'VIP Araba Hizmeti',
      description: 'Arabada VIP hizmet paketi',
      price: 200,
      duration: 75,
      serviceType: 'VIPCar',
      isActive: true,
      requiresFullPayment: true
    }
  ];

  const servicesData = Array.isArray(services) ? services : mockServices;

  const getServiceTypeLabel = (type: string) => {
    switch (type) {
      case 'Regular': return 'Normal Salon';
      case 'VIPRoom': return 'VIP Oda';
      case 'VIPCar': return 'VIP Araba';
      default: return type;
    }
  };

  const getServiceTypeColor = (type: string) => {
    switch (type) {
      case 'Regular': return 'default';
      case 'VIPRoom': return 'warning';
      case 'VIPCar': return 'error';
      default: return 'default';
    }
  };

  const handleAddService = async (data: ServiceFormData) => {
    try {
      await createService(data);
      toast.success('Hizmet başarıyla eklendi');
      setIsAddModalOpen(false);
      resetAdd();
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Hizmet eklenemedi');
    }
  };

  const handleEditService = async (data: Partial<ServiceFormData>) => {
    if (!editingService) return;
    
    try {
      await updateService(editingService.id, data);
      toast.success('Hizmet başarıyla güncellendi');
      setEditingService(null);
      resetEdit();
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Hizmet güncellenemedi');
    }
  };

  const openEditModal = (service: any) => {
    setEditingService(service);
    setValueEdit('name', service.name);
    setValueEdit('description', service.description);
    setValueEdit('price', service.price);
    setValueEdit('duration', service.duration);
    setValueEdit('serviceType', service.serviceType);
    setValueEdit('requiresFullPayment', service.requiresFullPayment);
    setValueEdit('isActive', service.isActive);
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm('Bu hizmet silinecek. Emin misiniz?')) return;
    
    try {
      await api.delete(`/services/${serviceId}`);
      toast.success('Hizmet başarıyla silindi');
      refetch();
    } catch (error) {
      toast.error('Hizmet silinemedi');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Hizmetler</h1>
            <p className="page-subtitle">
              Salon hizmetleri ve fiyatlandırma yönetimi
            </p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <PlusIcon className="w-4 h-4 mr-2" />
            Yeni Hizmet Ekle
          </Button>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="animate-pulse">Hizmetler yükleniyor...</div>
            </CardContent>
          </Card>
        ) : (
          servicesData.map((service: any) => (
            <Card key={service.id} className="relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant={getServiceTypeColor(service.serviceType) as any}>
                        {getServiceTypeLabel(service.serviceType)}
                      </Badge>
                      <Badge variant={service.isActive ? 'success' : 'error'}>
                        {service.isActive ? 'Aktif' : 'Pasif'}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => openEditModal(service)}
                    >
                      <PencilIcon className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="danger"
                      onClick={() => handleDeleteService(service.id)}
                    >
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CurrencyDollarIcon className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-600">Fiyat</span>
                    </div>
                    <span className="text-xl font-bold text-primary-600">
                      {formatCurrency(service.price)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <ClockIcon className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-gray-600">Süre</span>
                    </div>
                    <span className="font-medium">{service.duration} dakika</span>
                  </div>

                  {service.requiresFullPayment && (
                    <div className="mt-3 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
                      Full ödeme gerekli
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Add Service Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          resetAdd();
        }}
        title="Yeni Hizmet Ekle"
        size="md"
      >
        <form onSubmit={handleSubmitAdd(handleAddService)} className="space-y-4">
          <Input 
            {...registerAdd('name')}
            label="Hizmet Adı" 
            placeholder="Örn: Saç Kesimi"
            error={errorsAdd.name?.message}
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Açıklama
            </label>
            <textarea
              {...registerAdd('description')}
              rows={3}
              className="form-textarea"
              placeholder="Hizmet açıklaması..."
            />
            {errorsAdd.description && (
              <p className="mt-1 text-sm text-red-600">{errorsAdd.description.message}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              {...registerAdd('price', { valueAsNumber: true })}
              label="Fiyat (₺)" 
              type="number" 
              placeholder="50"
              error={errorsAdd.price?.message}
            />
            <Input 
              {...registerAdd('duration', { valueAsNumber: true })}
              label="Süre (dakika)" 
              type="number" 
              placeholder="30"
              error={errorsAdd.duration?.message}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hizmet Tipi
            </label>
            <select 
              {...registerAdd('serviceType')}
              className="form-select"
            >
              <option value="Regular">Normal Salon</option>
              <option value="VIPRoom">VIP Oda</option>
              <option value="VIPCar">VIP Araba</option>
            </select>
            {errorsAdd.serviceType && (
              <p className="mt-1 text-sm text-red-600">{errorsAdd.serviceType.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <input 
              {...registerAdd('requiresFullPayment')}
              type="checkbox" 
              id="requiresFullPayment" 
            />
            <label htmlFor="requiresFullPayment" className="text-sm">
              Full ödeme gerekli
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <input 
              {...registerAdd('isActive')}
              type="checkbox" 
              id="isActive"
              defaultChecked 
            />
            <label htmlFor="isActive" className="text-sm">
              Aktif
            </label>
          </div>
          
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
              Hizmet Ekle
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Service Modal */}
      {editingService && (
        <Modal
          isOpen={!!editingService}
          onClose={() => {
            setEditingService(null);
            resetEdit();
          }}
          title="Hizmet Düzenle"
          size="md"
        >
          <form onSubmit={handleSubmitEdit(handleEditService)} className="space-y-4">
            <Input 
              {...registerEdit('name')}
              label="Hizmet Adı" 
              placeholder="Örn: Saç Kesimi"
              error={errorsEdit.name?.message}
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Açıklama
              </label>
              <textarea
                {...registerEdit('description')}
                rows={3}
                className="form-textarea"
                placeholder="Hizmet açıklaması..."
              />
              {errorsEdit.description && (
                <p className="mt-1 text-sm text-red-600">{errorsEdit.description.message}</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                {...registerEdit('price', { valueAsNumber: true })}
                label="Fiyat (₺)" 
                type="number" 
                placeholder="50"
                error={errorsEdit.price?.message}
              />
              <Input 
                {...registerEdit('duration', { valueAsNumber: true })}
                label="Süre (dakika)" 
                type="number" 
                placeholder="30"
                error={errorsEdit.duration?.message}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hizmet Tipi
              </label>
              <select 
                {...registerEdit('serviceType')}
                className="form-select"
              >
                <option value="Regular">Normal Salon</option>
                <option value="VIPRoom">VIP Oda</option>
                <option value="VIPCar">VIP Araba</option>
              </select>
              {errorsEdit.serviceType && (
                <p className="mt-1 text-sm text-red-600">{errorsEdit.serviceType.message}</p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <input 
                {...registerEdit('requiresFullPayment')}
                type="checkbox" 
                id="editRequiresFullPayment" 
              />
              <label htmlFor="editRequiresFullPayment" className="text-sm">
                Full ödeme gerekli
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <input 
                {...registerEdit('isActive')}
                type="checkbox" 
                id="editIsActive" 
              />
              <label htmlFor="editIsActive" className="text-sm">
                Aktif
              </label>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button 
                type="button"
                variant="outline" 
                onClick={() => {
                  setEditingService(null);
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