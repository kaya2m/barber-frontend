// src/app/page.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { 
  CalendarIcon, 
  ClockIcon, 
  CreditCardIcon, 
  ShieldCheckIcon,
  StarIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

export default function HomePage() {
  const features = [
    {
      icon: CalendarIcon,
      title: 'Kolay Randevu',
      description: 'Birkaç tıkla istediğiniz tarihe randevu alın.'
    },
    {
      icon: ClockIcon,
      title: '7/24 Erişim',
      description: 'İstediğiniz zaman online randevu oluşturun.'
    },
    {
      icon: CreditCardIcon,
      title: 'Güvenli Ödeme',
      description: 'Güvenli ödeme sistemi ile kapora ödeyin.'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Güvenli Platform',
      description: 'Verileriniz güvenli şekilde korunur.'
    }
  ];

  const services = [
    {
      name: 'Klasik Kesim',
      price: '50₺',
      duration: '30 dk',
      features: ['Saç kesimi', 'Şampuan', 'Föntaşlama']
    },
    {
      name: 'Saç + Sakal',
      price: '80₺',
      duration: '45 dk',
      features: ['Saç kesimi', 'Sakal tıraş', 'Şampuan', 'Cilt bakımı']
    },
    {
      name: 'VIP Paket',
      price: '150₺',
      duration: '60 dk',
      features: ['Saç kesimi', 'Sakal tıraş', 'Cilt bakımı', 'Masaj', 'VIP oda'],
      popular: true
    }
  ];

  const testimonials = [
    {
      name: 'Ahmet K.',
      rating: 5,
      comment: 'Mükemmel hizmet kalitesi ve çok pratik randevu sistemi. Herkese tavsiye ederim.'
    },
    {
      name: 'Mehmet S.',
      rating: 5,
      comment: 'Online randevu alma çok kolay. Berberler çok profesyonel ve işlerini gerçekten iyi yapıyorlar.'
    },
    {
      name: 'Ali Y.',
      rating: 5,
      comment: 'VIP hizmet paketini denedim, harika bir deneyimdi. Kesinlikle tekrar geleceğim.'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
          <div className="page-container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[600px]">
              <div className="space-y-8">
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Modern Berber
                  <span className="block text-primary-200">Deneyimi</span>
                </h1>
                <p className="text-xl text-primary-100 leading-relaxed">
                  Profesyonel berber hizmetleri ile saç, sakal ve tıraş işlemlerinizi 
                  güvenle yaptırın. Online randevu sistemi ile zamandan tasarruf edin.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/appointment">
                    <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100 font-semibold">
                      Hemen Randevu Al
                    </Button>
                  </Link>
                  <Link href="/services">
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary-600">
                      Hizmetleri İncele
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="hidden lg:block">
                <div className="relative">
                  <div className="w-full h-96 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CalendarIcon className="w-12 h-12" />
                      </div>
                      <p className="text-lg font-medium">Randevu Sistemi</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="page-container">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Neden Bizi Seçmelisiniz?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Modern teknoloji ile geleneksel berberlik deneyimini birleştiriyoruz.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="w-6 h-6 text-primary-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 bg-gray-50">
          <div className="page-container">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Hizmetlerimiz
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                İhtiyaçlarınıza uygun paketler ve profesyonel hizmet kalitesi.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <Card key={index} className={`relative ${service.popular ? 'ring-2 ring-primary-500 shadow-lg' : ''}`}>
                  {service.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                        Popüler
                      </span>
                    </div>
                  )}
                  <CardContent className="p-6">
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {service.name}
                      </h3>
                      <div className="text-3xl font-bold text-primary-600 mb-1">
                        {service.price}
                      </div>
                      <p className="text-gray-500">{service.duration}</p>
                    </div>
                    
                    <ul className="space-y-3 mb-6">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center space-x-3">
                          <CheckCircleIcon className="w-5 h-5 text-green-500" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Link href="/appointment">
                      <Button className="w-full" variant={service.popular ? 'primary' : 'outline'}>
                        Randevu Al
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-white">
          <div className="page-container">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Müşteri Yorumları
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Memnun müşterilerimizin deneyimleri.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-4 italic">
                      "{testimonial.comment}"
                    </p>
                    <p className="font-semibold text-gray-900">
                      {testimonial.name}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary-600">
          <div className="page-container text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Randevunuzu Hemen Alın
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Profesyonel berber hizmetleri için online randevu sistemi ile 
              birkaç dakikada randevunuzu oluşturun.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/appointment">
                <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100 font-semibold">
                  Randevu Al
                </Button>
              </Link>
              <Link href="/register">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary-600">
                  Hesap Oluştur
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}