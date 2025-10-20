import { PrismaClient, PropertyType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create a demo host user
  const host = await prisma.user.upsert({
    where: { email: 'host@pumalo.space' },
    update: {},
    create: {
      email: 'host@pumalo.space',
      name: 'Demo Host',
      firstName: 'Demo',
      lastName: 'Host',
      verified: true,
      isHost: true,
      bio: 'Experienced property host with 50+ properties',
    },
  });

  console.log('✅ Created demo host user');

  // Create demo properties
  const properties = [
    {
      title: 'Modern Downtown Apartment',
      description: 'Beautiful modern apartment in the heart of Nairobi with stunning city views. Features include high-speed WiFi, fully equipped kitchen, and 24/7 security.',
      propertyType: PropertyType.RENT,
      address: '123 Kenyatta Avenue',
      city: 'Nairobi',
      country: 'Kenya',
      latitude: -1.2864,
      longitude: 36.8172,
      price: 25000,
      currency: 'KSH',
      pricePeriod: 'night',
      images: [
        'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&h=600&fit=crop&q=80', // Modern apartment exterior, blue sky
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop&q=80', // Modern home interior
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop&q=80', // Contemporary house, blue sky
      ],
      amenities: ['WiFi', 'Kitchen', 'Air Conditioning', 'Parking', 'Security', 'Gym'],
      bedrooms: 2,
      bathrooms: 2,
      maxGuests: 4,
      featured: true,
      rating: 4.8,
      reviewCount: 124,
      hostId: host.id,
    },
    {
      title: 'Luxury Beachfront Villa',
      description: 'Stunning beachfront villa in Mombasa with private pool and direct beach access. Perfect for families and groups looking for a luxury getaway.',
      propertyType: PropertyType.LODGE,
      address: '45 Diani Beach Road',
      city: 'Mombasa',
      country: 'Kenya',
      latitude: -4.0435,
      longitude: 39.6682,
      price: 85000,
      currency: 'KSH',
      pricePeriod: 'night',
      images: [
        'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&h=600&fit=crop&q=80', // Beachfront villa, blue sky
        'https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=800&h=600&fit=crop&q=80', // Luxury villa with pool
        'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop&q=80', // Coastal property, blue sky
      ],
      amenities: ['Pool', 'Beach Access', 'WiFi', 'Kitchen', 'BBQ', 'Ocean View', 'Parking'],
      bedrooms: 4,
      bathrooms: 3,
      maxGuests: 8,
      featured: true,
      rating: 4.9,
      reviewCount: 89,
      hostId: host.id,
    },
    {
      title: 'Spacious Family Home',
      description: 'Perfect family home in Kisumu with large garden and modern amenities. Ideal for those looking to settle down in a peaceful neighborhood.',
      propertyType: PropertyType.BUY,
      address: '78 Milimani Estate',
      city: 'Kisumu',
      country: 'Kenya',
      latitude: -0.0917,
      longitude: 34.7680,
      price: 12500000,
      currency: 'KSH',
      images: [
        'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop&q=80', // Spacious family home, blue sky
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop&q=80', // Suburban house exterior
        'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop&q=80', // Family home with garden
      ],
      amenities: ['Garden', 'Garage', 'WiFi', 'Security', 'Solar Panels'],
      bedrooms: 4,
      bathrooms: 3,
      maxGuests: 6,
      featured: true,
      rating: 4.7,
      reviewCount: 56,
      hostId: host.id,
    },
    {
      title: 'Cozy Studio Apartment',
      description: 'Charming studio apartment in Nakuru, perfect for solo travelers or couples. Close to major attractions and public transport.',
      propertyType: PropertyType.RENT,
      address: '12 Kenyatta Street',
      city: 'Nakuru',
      country: 'Kenya',
      latitude: -0.3031,
      longitude: 36.0800,
      price: 15000,
      currency: 'KSH',
      pricePeriod: 'night',
      images: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop&q=80', // Cozy apartment building, blue sky
        'https://images.unsplash.com/photo-1460518451285-97b6aa326961?w=800&h=600&fit=crop&q=80', // Modern studio exterior
      ],
      amenities: ['WiFi', 'Kitchen', 'Heating', 'Workspace'],
      bedrooms: 1,
      bathrooms: 1,
      maxGuests: 2,
      featured: false,
      rating: 4.6,
      reviewCount: 92,
      hostId: host.id,
    },
    {
      title: 'Penthouse Suite with City Views',
      description: 'Luxurious penthouse in Westlands with panoramic city views. Features include a private terrace, home theater, and concierge service.',
      propertyType: PropertyType.RENT,
      address: '89 Westlands Road',
      city: 'Nairobi',
      country: 'Kenya',
      latitude: -1.2676,
      longitude: 36.8098,
      price: 55000,
      currency: 'KSH',
      pricePeriod: 'night',
      images: [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop&q=80', // Luxury penthouse building, blue sky
        'https://images.unsplash.com/photo-1567684014761-b65e2e59b9eb?w=800&h=600&fit=crop&q=80', // High-rise luxury apartment
        'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&h=600&fit=crop&q=80', // Penthouse exterior view
      ],
      amenities: ['WiFi', 'Terrace', 'Gym', 'Pool', 'Concierge', 'Parking', 'City View'],
      bedrooms: 3,
      bathrooms: 3,
      maxGuests: 6,
      featured: true,
      rating: 4.9,
      reviewCount: 145,
      hostId: host.id,
    },
    {
      title: 'Countryside Cottage',
      description: 'Peaceful cottage in the countryside near Eldoret. Perfect for a quiet retreat with nature trails and farm-fresh produce.',
      propertyType: PropertyType.LODGE,
      address: 'Soy Road',
      city: 'Eldoret',
      country: 'Kenya',
      latitude: 0.5143,
      longitude: 35.2698,
      price: 35000,
      currency: 'KSH',
      pricePeriod: 'night',
      images: [
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=600&fit=crop&q=80', // Countryside cottage, blue sky
        'https://images.unsplash.com/photo-1464146072230-91cabc968266?w=800&h=600&fit=crop&q=80', // Rural cottage landscape
      ],
      amenities: ['Garden', 'Fireplace', 'Kitchen', 'Hiking', 'Farm Tours'],
      bedrooms: 2,
      bathrooms: 1,
      maxGuests: 4,
      featured: false,
      rating: 4.5,
      reviewCount: 67,
      hostId: host.id,
    },
  ];

  for (const propertyData of properties) {
    await prisma.property.upsert({
      where: { 
        id: `seed-${propertyData.title.toLowerCase().replace(/\s+/g, '-')}` 
      },
      update: {},
      create: {
        id: `seed-${propertyData.title.toLowerCase().replace(/\s+/g, '-')}`,
        ...propertyData,
      },
    });
  }

  console.log('✅ Created demo properties');
  console.log(`🎉 Seed completed! Created ${properties.length} properties`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
