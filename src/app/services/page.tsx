import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { formatCurrency } from '@/lib/utils';
import { 
  CheckCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function ServicesPage() {
  const services = [
    {
      id: '1',
      name: 'Klasik Kesim',
      description: 'Geleneksel saç kesimi ve şampuan ile profesyonel görünüm',
      price: 50,
      duration: 30,
      serviceType: 'Regular',
      features: ['Saç kesimi', 'Şampuan', 'Föntaşlama', 'Saç maskesi'],
      popular: false
    },
    {
      id: '2',
      name: 'Saç + Sakal Paketi',
      description: 'Saç kesimi ve özenli sakal tıraşı kombinasyonu',
      price: 80,
      duration: 45,
      serviceType: 'Regular',
      features: ['Saç kesimi', 'Sakal tıraş', 'Şampuan', 'Cilt bakımı', 'Aftershave'],
      popular: true
    },
    {
      id: '3',
      name: 'VIP Oda Hizmeti',
      description: 'Özel odada lüks berber deneyimi',
      price: 150,
      duration: 60,
      serviceType: 'VIPRoom',
      features: ['Saç kesimi', 'Sakal tıraş', 'Cilt bakımı', 'Kafa masajı', 'İçecek ikramı', 'Özel oda'],
      popular: false
    },
    {
      id: '4',
      name: 'VIP Araba Hizmeti',
      description: 'Arabanızda profesyonel berber hizmeti',
      price: 200,
      duration: 75,
      serviceType: 'VIPCar',
      features: ['Mobil hizmet', 'Saç kesimi', 'Sakal tıraş', 'Cilt bakımı', 'Kafa masajı', 'Premium ürünler'],
      popular: false
    }
  ];

  const getServiceTypeLabel = (type: string) => {
    switch (type) {
      case 'Regular': return 'Salon';
      case 'VIPRoom': return 'VIP Oda';
      case 'VIPCar': return 'VIP Mobil';
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
          <div className="page-container text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Hizmetlerimiz
            </h1>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Profesyonel berber hizmetleri ile kendinizi şımartın. 
              Klasik salondan VIP hizmetlere kadar geniş seçenek yelpazesi.
            </p>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 bg-gray-50">
          <div className="page-container">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Size Uygun Hizmeti Seçin
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                İhtiyaçlarınıza ve bütçenize uygun profesyonel berber hizmetleri
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {services.map((service) => (
                <Card key={service.id} className={`relative h-full ${service.popular ? 'ring-2 ring-primary-500 shadow-xl' : 'shadow-soft'}`}>
                  {service.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                      <div className="flex items-center space-x-1 bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                        <StarIcon className="w-4 h-4" />
                        <span>Popüler</span>
                      </div>
                    </div>
                  )}
                  
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{service.name}</CardTitle>
                        <Badge variant={getServiceTypeColor(service.serviceType) as any} className="mb-3">
                          {getServiceTypeLabel(service.serviceType)}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-gray-600">{service.description}</p>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    {/* Price and Duration */}
                    <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <CurrencyDollarIcon className="w-5 h-5 text-green-500" />
                          <span className="text-2xl font-bold text-primary-600">
                            {formatCurrency(service.price)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <ClockIcon className="w-5 h-5 text-blue-500" />
                          <span className="text-gray-600">{service.duration} dk</span>
                        </div>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-2 mb-6">
                      <h4 className="font-medium text-gray-900">Dahil Olan Hizmetler:</h4>
                      <ul className="space-y-2">
                        {service.features.map((feature, index) => (
                          <li key={index} className="flex items-center space-x-2 text-sm">
                            <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA */}
                    <Link href="/appointment" className="block">
                      <Button 
                        className="w-full" 
                        variant={service.popular ? 'primary' : 'outline'}
                        size="lg"
                      >
                        Randevu Al
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-20 bg-white">
          <div className="page-container">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Nasıl Çalışır?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Randevu alma süreciniz 3 basit adımda tamamlanır
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-600">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Hizmet Seçin</h3>
                <p className="text-gray-600">
                  İhtiyacınıza uygun hizmet paketini seçin ve tercih ettiğiniz berberle randevu alın.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-600">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Tarih Belirleyin</h3>
                <p className="text-gray-600">
                  Uygun tarih ve saati seçin. Kapora ödemesi ile randevunuzu garantileyin.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-600">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Hizmet Alın</h3>
                <p className="text-gray-600">
                  Belirlediğiniz tarihte geliniz ve profesyonel hizmetimizin keyfini çıkarın.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-gray-50">
          <div className="page-container">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Sıkça Sorulan Sorular
              </h2>
            </div>
            
            <div className="max-w-3xl mx-auto space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">VIP hizmetler için tam ödeme neden gerekli?</h3>
                  <p className="text-gray-600">
                    VIP hizmetlerimiz özel ekipman ve kişiselleştirilmiş yaklaşım gerektirdiği için, 
                    randevu garantisi açısından tam ödeme talep edilmektedir.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Randevumu iptal edebilir miyim?</h3>
                  <p className="text-gray-600">
                    Randevunuzdan en az 24 saat önce iptal ederseniz, ödediğiniz kapora iade edilir. 
                    VIP hizmetler için 48 saat önceden iptal gereklidir.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">VIP araba hizmeti nasıl çalışır?</h3>
                  <p className="text-gray-600">
                    Berberimiz belirlenen adrese mobil ekipmanlarıyla gelir ve arabanızda 
                    tüm işlemleri profesyonelce gerçekleştirir.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary-600">
          <div className="page-container text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Hemen Randevunuzu Alın
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Profesyonel berber hizmetleri için online randevu sistemi ile 
              birkaç dakikada randevunuzu oluşturun.
            </p>
            <Link href="/appointment">
              <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100 font-semibold">
                Randevu Al
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}