# 🔄 Migrating Your Property Images to Cloudinary

## Quick Migration Steps

### Step 1: Get Your Cloudinary Credentials ⚡

1. **Login to Cloudinary**: https://console.cloudinary.com/
2. **Copy these values** from your dashboard:
   ```
   Cloud Name:  ___________________
   API Key:     ___________________
   API Secret:  ___________________
   ```

3. **Add to `.env` file**:
   ```bash
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-actual-cloud-name"
   CLOUDINARY_API_KEY="your-actual-api-key"
   CLOUDINARY_API_SECRET="your-actual-api-secret"
   ```

---

### Step 2: Create Folders in Cloudinary 📁

1. Go to **Media Library** → Create these folders:
   - `pumalo/properties` (for property images)
   - `pumalo/destinations` (for city images)
   - `pumalo/users` (for profile pictures)

---

### Step 3: Upload Your Images 📤

**Option A: Manual Upload (Simple)**
1. Go to Media Library
2. Select the `pumalo/properties` folder
3. Drag and drop your property images
4. Name them clearly: `luxury-apartment-nairobi`, `beach-villa-mombasa`, etc.

**Option B: Bulk Upload (Faster)**
1. Install Cloudinary CLI: `npm install -g cloudinary-cli`
2. Login: `cloudinary config set`
3. Upload folder: `cloudinary upload_dir ./your-images-folder pumalo/properties`

---

### Step 4: Update Your Seed Data 🌱

Replace the image paths in `prisma/seed.ts`:

**Before:**
```typescript
images: [
  '/images/properties/property-1.jpg',
]
```

**After (using your actual Cloudinary images):**
```typescript
images: [
  'https://res.cloudinary.com/YOUR-CLOUD-NAME/image/upload/w_800,h_600,c_fill,q_auto/pumalo/properties/luxury-apartment-nairobi.jpg',
]
```

Or store just the public ID:
```typescript
images: [
  'pumalo/properties/luxury-apartment-nairobi',
]
```
Then use the helper function in your components:
```typescript
import { getPropertyImageUrl } from '@/lib/cloudinary';
const imageUrl = getPropertyImageUrl(property.images[0], 'card');
```

---

### Step 5: Re-seed Your Database 🔄

```bash
npm run db:seed
```

---

## 🎯 Example: Complete Property Setup

### 1. Upload to Cloudinary:
- File: `luxury-apartment-nairobi.jpg`
- Upload to: `pumalo/properties/`
- Public ID becomes: `pumalo/properties/luxury-apartment-nairobi`

### 2. Update Seed Data:
```typescript
{
  title: 'Luxury Apartment in Nairobi',
  images: [
    'pumalo/properties/luxury-apartment-nairobi',
    'pumalo/properties/luxury-apartment-nairobi-2',
    'pumalo/properties/luxury-apartment-nairobi-3',
  ],
  // ... rest of property data
}
```

### 3. Display in Component:
```tsx
import { getPropertyImageUrl } from '@/lib/cloudinary';

<img 
  src={getPropertyImageUrl(property.images[0], 'card')} 
  alt={property.title}
/>
```

Or use the CldImage component:
```tsx
import { CldImage } from 'next-cloudinary';

<CldImage
  src={property.images[0]}
  width={600}
  height={400}
  alt={property.title}
  crop="fill"
/>
```

---

## ✅ Checklist

- [ ] Added Cloudinary credentials to `.env`
- [ ] Created `pumalo/properties` folder in Cloudinary
- [ ] Uploaded property images
- [ ] Updated `prisma/seed.ts` with Cloudinary URLs or public IDs
- [ ] Re-ran `npm run db:seed`
- [ ] Tested images load on http://localhost:3000

---

## 🆘 Troubleshooting

**Images not loading?**
1. Check cloud name is correct in `.env`
2. Verify images are in `pumalo/properties` folder
3. Make sure public IDs match exactly (case-sensitive)
4. Check browser console for errors

**"Upload preset not found"?**
1. Go to Cloudinary Settings → Upload
2. Add upload preset named `pumalo_uploads`
3. Set to "Unsigned" mode
4. Set folder to `pumalo/properties`

---

## 📞 Need Help?

Check the main guide: `CLOUDINARY_SETUP.md`
