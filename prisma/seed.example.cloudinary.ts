// EXAMPLE: Updated seed.ts with Cloudinary images
// 
// This is a reference file showing how to use Cloudinary in your seed data
// Once you upload images to Cloudinary, copy this pattern to prisma/seed.ts

import { PrismaClient, PropertyType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with Cloudinary images...');

  // Create a demo host user
  const host = await prisma.user.upsert({
    where: { id: 'demo-host-1' },
    update: {},
    create: {
      id: 'demo-host-1',
      email: 'host@pumalo.com',
      name: 'John Doe',
      createdAt: new Date(),
    },
  });

  console.log('✅ Created host:', host.email);

  // Sample properties with Cloudinary URLs
  // REPLACE 'YOUR-CLOUD-NAME' with your actual Cloudinary cloud name
  const properties = [
    {
      id: 'prop-1',
      title: 'Luxury Apartment in Westlands',
      description: 'Modern 2-bedroom apartment with stunning city views in the heart of Westlands, Nairobi.',
      propertyType: PropertyType.RENT,
      
      // Demo: Use Unsplash stock images of houses with blue sky
      images: [
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=600&fit=crop', // House with blue sky
        'https://images.unsplash.com/photo-1460518451285-97b6aa326961?w=800&h=600&fit=crop', // Modern home, blue sky
        'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800&h=600&fit=crop', // Suburban house, blue sky
      ],
      
      price: 8500,
      pricePeriod: 'night',
      bedrooms: 2,
      bathrooms: 2,
      maxGuests: 4,
      address: '123 Parklands Road',
      city: 'Nairobi',
      country: 'Kenya',
      latitude: -1.2634,
      longitude: 36.8084,
      amenities: ['WiFi', 'Kitchen', 'Parking', 'Security', 'Gym', 'Pool'],
      availableDates: [],
      featured: true,
      hostId: host.id,
    },

    {
      id: 'prop-2',
      title: 'Beachfront Villa in Diani',
      description: 'Stunning beachfront villa with private access to the pristine white sand beaches of Diani.',
      propertyType: PropertyType.LODGE,
      images: [
        'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&h=600&fit=crop&q=80', // Beachfront villa, blue sky
        'https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=800&h=600&fit=crop&q=80', // Luxury villa with pool
        'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop&q=80', // Coastal property, blue sky
      ],
      price: 15000,
      pricePeriod: 'night',
      bedrooms: 4,
      bathrooms: 3,
      maxGuests: 8,
      address: 'Diani Beach Road',
      city: 'Mombasa',
      country: 'Kenya',
      latitude: -4.2983,
      longitude: 39.5747,
      amenities: ['WiFi', 'Kitchen', 'Parking', 'Pool', 'Beach Access', 'BBQ'],
      availableDates: [],
      featured: true,
      hostId: host.id,
    },

    // Using Unsplash as temporary placeholder (no upload needed)
    {
      id: 'prop-3',
      title: 'Cozy Studio in Kilimani',
      description: 'Affordable studio apartment perfect for solo travelers or couples.',
      propertyType: PropertyType.RENT,
      
      // Temporary: Use Unsplash images (free, no account needed)
      images: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop',
      ],
      
      price: 3500,
      pricePeriod: 'night',
      bedrooms: 1,
      bathrooms: 1,
      maxGuests: 2,
      address: 'Kilimani Road',
      city: 'Nairobi',
      country: 'Kenya',
      latitude: -1.2921,
      longitude: 36.7819,
      amenities: ['WiFi', 'Kitchen', 'Security'],
      availableDates: [],
      featured: false,
      hostId: host.id,
    },
  ];

  // Insert properties
  for (const property of properties) {
    await prisma.property.upsert({
      where: { id: property.id },
      update: property,
      create: property,
    });
    console.log(`✅ Created property: ${property.title}`);
  }

  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
