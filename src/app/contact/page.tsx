    'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema } from '@/lib/validations';
import { toast } from 'react-hot-toast';
import { 
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { ContactFormData } from '@/types/auth';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setLoading(true);
    try {
      // Contact form submission would be implemented here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      toast.success('Mesajınız başarıyla gönderildi!');
      reset();
    } catch (error) {
      toast.error('Mesaj gönderilemedi. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: MapPinIcon,
      title: 'Adres',
      details: ['Merkez Mahallesi', 'Berber Sokak No:123', 'Düzce, Türkiye']
    },
    {
      icon: PhoneIcon,
      title: 'Telefon',
      details: ['+90 555 123 45 67', '+90 380 123 45 67']
    },
    {
      icon: EnvelopeIcon,
      title: 'Email',
      details: ['info@berberrandevu.com', 'destek@berberrandevu.com']
    },
    {
      icon: ClockIcon,
      title: 'Çalışma Saatleri',
      details: ['Pazartesi - Cuma: 09:00 - 21:00', 'Cumartesi: 10:00 - 18:00', 'Pazar: Kapalı']
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
          <div className="page-container text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              İletişim
            </h1>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Sorularınız için bize ulaşın. Size en kısa sürede dönüş yapacağız.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 bg-gray-50">
          <div className="page-container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Info */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Bizimle İletişime Geçin
                  </h2>
                  <p className="text-gray-600">
                    Randevu alma, hizmetlerimiz hakkında bilgi almak veya 
                    önerilerinizi paylaşmak için bize ulaşabilirsiniz.
                  </p>
                </div>

                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <Card key={index}>
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <info.icon className="w-5 h-5 text-primary-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-2">
                              {info.title}
                            </h3>
                            <div className="space-y-1">
                              {info.details.map((detail, detailIndex) => (
                                <p key={detailIndex} className="text-gray-600">
                                  {detail}
                                </p>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Contact Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Mesaj Gönderin</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <Input
                      {...register('name')}
                      label="Ad Soyad"
                      placeholder="Adınız ve soyadınız"
                      error={errors.name?.message}
                    />

                    <Input
                      {...register('email')}
                      type="email"
                      label="Email"
                      placeholder="ornek@email.com"
                      error={errors.email?.message}
                    />

                    <Input
                      {...register('phone')}
                      type="tel"
                      label="Telefon"
                      placeholder="+90 555 123 45 67"
                      error={errors.phone?.message}
                    />

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mesajınız
                      </label>
                      <textarea
                        {...register('message')}
                        rows={5}
                        className="form-textarea"
                        placeholder="Mesajınızı buraya yazın..."
                      />
                      {errors.message && (
                        <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                      )}
                    </div>

                    <Button type="submit" loading={loading} className="w-full">
                      Mesaj Gönder
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-20 bg-white">
          <div className="page-container">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Konumumuz
              </h2>
              <p className="text-xl text-gray-600">
                Merkezi konumumuzda sizi bekliyoruz
              </p>
            </div>
            
            <Card>
              <CardContent className="p-0">
                <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">Harita buraya gelecek</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}