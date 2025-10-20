import RoomsGrid from '@/components/RoomsGrid';
import RoomFilter from '@/components/RoomFilter';

export const metadata = {
  title: 'Rooms & Suites - Godatin Hotel',
  description: 'Choose from our luxury rooms and suites. From cozy Alcove rooms to spacious Diplomatic Suites, find your perfect accommodation.',
};

export default function RoomsPage() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="bg-royal-900 text-white py-20">
        <div className="container-custom text-center">
          <h1 className="text-5xl md:text-6xl font-bold font-serif mb-6">
            Our <span className="text-gradient">Rooms & Suites</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Experience luxury and comfort in our carefully designed accommodations. 
            Each room is thoughtfully crafted to provide the ultimate guest experience.
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <RoomFilter />
        </div>
      </section>

      {/* Rooms Grid */}
      <section className="section-padding">
        <div className="container-custom">
          <RoomsGrid />
        </div>
      </section>
    </div>
  );
}
