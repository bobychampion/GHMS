import ContactForm from '@/components/ContactForm';
import ContactInfo from '@/components/ContactInfo';
import CommuteMap from '@/components/CommuteMap';

export const metadata = {
  title: 'Contact Us - Godatin Hotel',
  description: 'Get in touch with Godatin Hotel. Find our location, contact information, and send us a message.',
};

export default function ContactPage() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="bg-royal-900 text-white py-20">
        <div className="container-custom text-center">
          <h1 className="text-5xl md:text-6xl font-bold font-serif mb-6">
            Contact <span className="text-gradient">Us</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            We'd love to hear from you. Get in touch with us for reservations, 
            inquiries, or any assistance you may need.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <ContactForm />
            <ContactInfo />
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-navy-900 mb-3">
              Find <span className="text-gradient">Us</span>
            </h2>
            <p className="text-gray-600">No 2, Ayoro lane, Enerhen road, UVWIE, Warri, Delta State</p>
          </div>
          <div className="h-[480px]">
            <CommuteMap />
          </div>
        </div>
      </section>
    </div>
  );
}
