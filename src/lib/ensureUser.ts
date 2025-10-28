import prisma from '@/lib/prisma';

export async function ensureUserInDatabase(stackUser: {
  id: string;
  primaryEmail: string | null;
  displayName: string | null;
  profileImageUrl?: string | null;
}) {
  try {
    // Check if user exists
    const existing = await prisma.user.findUnique({
      where: { id: stackUser.id },
      select: { id: true },
    });

    if (existing) {
      return existing;
    }

    // Create user if doesn't exist
    const newUser = await prisma.user.create({
      data: {
        id: stackUser.id,
        email: stackUser.primaryEmail || `${stackUser.id}@placeholder.local`,
        name: stackUser.displayName || 'User',
        avatar: stackUser.profileImageUrl,
        verified: false,
        isHost: false,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    console.log('Created new user in database:', newUser.id);
    return newUser;
  } catch (error) {
    console.error('Error ensuring user in database:', error);
    return null;
  }
}
