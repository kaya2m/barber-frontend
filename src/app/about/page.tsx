import { Card, CardContent } from '@/components/ui/card';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { 
  UserGroupIcon,
  ClockIcon,
  ShieldCheckIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

export default function AboutPage() {
  const values = [
    {
      icon: UserGroupIcon,
      title: 'Müşteri Odaklı',
      description: 'Her müşterimizin memnuniyeti bizim için en önemli önceliktir.'
    },
    {
      icon: ClockIcon,
      title: 'Güvenilir Hizmet',
      description: 'Randevu saatlerinize saygılı, kaliteli hizmet garantisi.'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Hijyen & Güvenlik',
      description: 'En yüksek hijyen standartları ve güvenlik önlemleri.'
    },
    {
      icon: HeartIcon,
      title: 'Tutkulu Ekip',
      description: 'İşini seven, deneyimli ve profesyonel berber kadromuz.'
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
              Hakkımızda
            </h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Modern teknoloji ile geleneksel berberlik sanatını birleştiren, 
              müşteri memnuniyetini her şeyin üstünde tutan bir ekibiz.
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20 bg-white">
          <div className="page-container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                  Hikayemiz
                </h2>
                <div className="space-y-4 text-gray-600">
                  <p>
                    2015 yılında küçük bir berber dükkanı olarak başladığımız yolculukta, 
                    bugün modern teknoloji ile desteklenmiş kaliteli hizmet anlayışımızla 
                    sektörde öncü konumdayız.
                  </p>
                  <p>
                    Geleneksel berberlik sanatını koruyarak, müşterilerimize en iyi deneyimi 
                    sunmak için sürekli kendimizi geliştiriyoruz. Online randevu sistemimiz 
                    ile zamandan tasarruf etmenizi sağlarken, VIP hizmetlerimizle de özel 
                    anlarınızı unutulmaz kılıyoruz.
                  </p>
                  <p>
                    Her müşterimizin benzersiz ihtiyaçları olduğunu biliyoruz ve bu nedenle 
                    kişiselleştirilmiş hizmet yaklaşımımızla herkesin memnun ayrılmasını sağlıyoruz.
                  </p>
                </div>
              </div>
              <div className="bg-gray-100 rounded-2xl h-96 flex items-center justify-center">
                <span className="text-gray-500">Berber Dükkanı Görseli</span>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-gray-50">
          <div className="page-container">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Değerlerimiz
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Çalışma prensiplerimiş ve değerlerimiz
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="text-center h-full">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <value.icon className="w-6 h-6 text-primary-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {value.title}
                    </h3>
                    <p className="text-gray-600">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-white">
          <div className="page-container">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Ekibimiz
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Deneyimli ve tutkulu berber kadromuz
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: 'Mehmet Kılıç', role: 'Usta Berber', experience: '15 yıl deneyim' },
                { name: 'Kemal Arslan', role: 'Senior Berber', experience: '10 yıl deneyim' },
                { name: 'Hasan Demir', role: 'Berber', experience: '5 yıl deneyim' }
              ].map((member, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {member.name}
                    </h3>
                    <p className="text-primary-600 font-medium mb-1">
                      {member.role}
                    </p>
                    <p className="text-sm text-gray-600">
                      {member.experience}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-primary-600">
          <div className="page-container">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center text-white">
              <div>
                <div className="text-4xl font-bold mb-2">500+</div>
                <div className="text-primary-200">Mutlu Müşteri</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">2000+</div>
                <div className="text-primary-200">Tamamlanan Randevu</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">4.9</div>
                <div className="text-primary-200">Müşteri Memnuniyeti</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">8</div>
                <div className="text-primary-200">Yıllık Deneyim</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
