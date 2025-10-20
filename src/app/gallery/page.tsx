import GalleryGrid from '@/components/GalleryGrid';

export const metadata = {
  title: 'Gallery - Godatin Hotel',
  description: 'Explore our beautiful hotel through stunning photos of our rooms, amenities, and facilities.',
};

export default function GalleryPage() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="bg-royal-900 text-white py-20">
        <div className="container-custom text-center">
          <h1 className="text-5xl md:text-6xl font-bold font-serif mb-6">
            Hotel <span className="text-gradient">Gallery</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Take a visual journey through our beautiful hotel and discover 
            the luxury and comfort that awaits you.
          </p>
        </div>
      </section>

      {/* Gallery */}
      <section className="section-padding">
        <div className="container-custom">
          <GalleryGrid />
        </div>
      </section>
    </div>
  );
}
