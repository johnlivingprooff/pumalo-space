# 🚀 Cloudinary Quick Start - 3 Minutes Setup

## Step 1: Get Your Credentials (1 min)
1. Go to: https://console.cloudinary.com/
2. Copy these from your dashboard:
   - **Cloud Name**
   - **API Key** 
   - **API Secret**

## Step 2: Add to .env (30 sec)
```bash
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="paste-cloud-name-here"
CLOUDINARY_API_KEY="paste-api-key-here"
CLOUDINARY_API_SECRET="paste-api-secret-here"
```

## Step 3: Upload Images (1 min)
1. Go to Media Library in Cloudinary
2. Create folder: `pumalo/properties`
3. Drag & drop your property images
4. Note the file names (e.g., `apartment-1.jpg`)

## Step 4: Update Seed File (30 sec)
Edit `prisma/seed.ts`:

**Replace YOUR-CLOUD-NAME with your actual cloud name:**
```typescript
images: [
  'https://res.cloudinary.com/YOUR-CLOUD-NAME/image/upload/w_800,h_600,c_fill,q_auto/pumalo/properties/apartment-1.jpg',
]
```

**Or use Unsplash temporarily (no upload needed):**
```typescript
images: [
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
]
```

## Step 5: Re-seed (10 sec)
```bash
npm run db:seed
```

## Done! ✅
Your images are now stored in the cloud and will load from Cloudinary!

---

## 🆘 Quick Troubleshooting

**"Images not showing"**
- Check cloud name is correct in `.env`
- Restart dev server: `npm run dev`

**"Don't have images yet"**
- Use Unsplash URLs (see seed.example.cloudinary.ts)
- Or use Cloudinary's sample images:
  ```typescript
  'samples/landscapes/architecture-signs'
  ```

**"Want to upload from website"**
1. Go to Cloudinary Settings → Upload
2. Add preset: `pumalo_uploads` (Unsigned)
3. Use the `<ImageUpload />` component

---

## 📚 Full Documentation
- Complete guide: `CLOUDINARY_SETUP.md`
- Migration steps: `cloudinary-migration-guide.md`
- Example code: `prisma/seed.example.cloudinary.ts`
