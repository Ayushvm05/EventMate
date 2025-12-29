export const EVENTS_DATA = [
    {
      id: 1,
      title: "Music Concert 2025",
      date: "March 15, 2025",
      location: "New York City Hall",
      price: 120,
      category: "Music",
      image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 2,
      title: "Tech Conference India",
      date: "April 10, 2025",
      location: "Bangalore Tech Park",
      price: 50,
      category: "Technology",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 3,
      title: "Art & Design Workshop",
      date: "May 22, 2025",
      location: "London Creative Hub",
      price: 35,
      category: "Workshop",
      image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 4,
      title: "Jazz Night Live",
      date: "June 12, 2025",
      location: "Blue Note Club",
      price: 80,
      category: "Music",
      image: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 5,
      title: "AI Summit 2025",
      date: "July 08, 2025",
      location: "Silicon Valley Center",
      price: 300,
      category: "Technology",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80"
    }
];

export const BOOKINGS_DATA = [
    { id: "BK001", user: "John Doe", event: "Music Concert 2025", date: "2025-03-01", amount: 240, status: "Confirmed" },
    { id: "BK002", user: "Sarah Smith", event: "Tech Conference", date: "2025-03-02", amount: 50, status: "Confirmed" }
];

export const USERS_DATA = {
    id: "U001",
    name: "John Doe",
    email: "john@eventmate.com",
    role: "User",
    bio: "Music lover and tech enthusiast."
};

export const RECOMMENDED_DATA = [
    EVENTS_DATA[3], 
    EVENTS_DATA[4]
];