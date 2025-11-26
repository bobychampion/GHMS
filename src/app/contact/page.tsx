import ContactForm from '@/components/ContactForm';
import ContactInfo from '@/components/ContactInfo';

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
      <section className="h-96 bg-gray-200">
        <div className="h-full w-full flex items-center justify-center">
          <div className="text-center text-gray-600">
            <h3 className="text-2xl font-semibold mb-4">Find Us</h3>
            <p className="text-lg">No 2, Ayoro lane, Enerhen road</p>
            <p className="text-lg">UVWIE, WARRI, Delta State, Nigeria</p>
            <p className="text-sm mt-2">Interactive map will be integrated here</p>
          </div>
        </div>
      </section>
    </div>
  );
}
