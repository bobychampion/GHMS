export interface RoomType {
  id: string;
  name: string;
  price: number;
  description: string;
  photos: string[];
  amenities: string[];
  maxOccupancy: number;
}

export interface BookingFormData {
  roomType: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  guestInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  specialRequests?: string;
}

export interface AdminDashboardStats {
  totalBookings: number;
  todayCheckIns: number;
  todayCheckOuts: number;
  occupancyRate: number;
  totalRevenue: number;
}

export interface BookingWithGuest {
  _id: string;
  guestId: {
    name: string;
    email: string;
    phone: string;
  };
  roomType: string;
  checkInDate: string;
  checkOutDate: string;
  status: string;
  totalAmount: number;
  paymentStatus: string;
  numberOfGuests: number;
  specialRequests?: string;
  createdAt: string;
}



