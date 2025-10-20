import BookingFlow from '@/components/BookingFlow';

export const metadata = {
  title: 'Book Your Stay - Godatin Hotel',
  description: 'Book your luxury stay at Godatin Hotel. Choose your dates, room type, and complete your reservation.',
};

export default function BookingPage() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="bg-royal-900 text-white py-16">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-serif mb-6">
            Book Your <span className="text-gradient">Stay</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Reserve your perfect room at Godatin Hotel. 
            Experience luxury and comfort in Warri, Delta State.
          </p>
        </div>
      </section>

      {/* Booking Flow */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <BookingFlow />
        </div>
      </section>
    </div>
  );
}
