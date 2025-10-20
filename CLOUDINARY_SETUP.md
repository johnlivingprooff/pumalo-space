# 🖼️ Cloudinary Integration Guide for Pumalo Space

## What is Cloudinary?
Cloudinary is a cloud-based service that manages all your images and videos. Instead of storing images in your project, you upload them to Cloudinary and use URLs to display them.

---

## 📋 Step 1: Get Your Cloudinary Credentials

1. **Go to your Cloudinary Dashboard**: https://console.cloudinary.com/
2. **Find these 3 values** (on the dashboard homepage):
   - **Cloud Name** (e.g., `pumalo-space`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz123`)

3. **Add them to your `.env` file**:
   ```bash
   # Add these Cloudinary credentials to your .env file:
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
   CLOUDINARY_API_KEY="your-api-key"
   CLOUDINARY_API_SECRET="your-api-secret"
   ```

---

## 📁 Step 2: Organize Your Images in Cloudinary

### Create Folders in Cloudinary:
1. Go to **Media Library** in your dashboard
2. Create these folders:
   - `pumalo/properties/` - For property images
   - `pumalo/destinations/` - For destination/city images
   - `pumalo/users/` - For user profile images

### Upload Images:
- Drag and drop images into each folder
- Cloudinary will give each image a **Public ID** (like `pumalo/properties/luxury-apartment-nairobi`)

---

## 🔗 Step 3: Understanding Cloudinary URLs

Cloudinary generates URLs for your images automatically:

**Format:**
```
https://res.cloudinary.com/[CLOUD_NAME]/image/upload/[TRANSFORMATIONS]/[PUBLIC_ID]
```

**Example:**
```
https://res.cloudinary.com/pumalo-space/image/upload/w_800,h_600,c_fill/pumalo/properties/luxury-apartment-nairobi.jpg
```

**What each part means:**
- `pumalo-space` = Your cloud name
- `w_800,h_600,c_fill` = Resize to 800x600, crop to fill
- `pumalo/properties/luxury-apartment-nairobi.jpg` = Path to your image

---

## 🎨 Step 4: Image Transformations (Cloudinary Magic!)

You can modify images on-the-fly by changing the URL:

### Common Transformations:
```
w_400,h_300          → Resize to 400x300
c_fill               → Crop to fill the space
c_thumb,g_face       → Smart crop focusing on faces
q_auto               → Auto quality optimization
f_auto               → Auto format (WebP, AVIF)
e_blur:300           → Blur effect
e_grayscale          → Black and white
```

### Example Uses:
```javascript
// Thumbnail for property cards
https://res.cloudinary.com/pumalo-space/image/upload/w_400,h_300,c_fill,q_auto/pumalo/properties/apartment-1.jpg

// Full size for property details
https://res.cloudinary.com/pumalo-space/image/upload/w_1200,q_auto,f_auto/pumalo/properties/apartment-1.jpg

// Profile picture
https://res.cloudinary.com/pumalo-space/image/upload/w_150,h_150,c_thumb,g_face/pumalo/users/user-123.jpg
```

---

## 🚀 Step 5: How to Use in Your App

### Option A: Direct URLs in Database (Easiest)

When adding properties to your database, use full Cloudinary URLs:

```typescript
// In your seed file or API
images: [
  'https://res.cloudinary.com/pumalo-space/image/upload/w_800,h_600,c_fill,q_auto/pumalo/properties/apartment-1.jpg',
  'https://res.cloudinary.com/pumalo-space/image/upload/w_800,h_600,c_fill,q_auto/pumalo/properties/apartment-1-2.jpg',
]
```

### Option B: Store Public IDs (More Flexible)

Store just the path in database, build URLs in your app:

**Database:**
```typescript
images: [
  'pumalo/properties/apartment-1',
  'pumalo/properties/apartment-1-2',
]
```

**In your component:**
```typescript
const imageUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_800,h_600,c_fill,q_auto/${publicId}`;
```

---

## 📦 Step 6: Using the Cloudinary Component (Recommended)

We've installed `next-cloudinary` which provides optimized components:

```tsx
import { CldImage } from 'next-cloudinary';

// Simple usage
<CldImage
  src="pumalo/properties/apartment-1"
  width={800}
  height={600}
  alt="Luxury Apartment"
  crop="fill"
/>

// With transformations
<CldImage
  src="pumalo/properties/apartment-1"
  width={400}
  height={300}
  alt="Luxury Apartment"
  crop="thumb"
  gravity="auto"
  quality="auto"
  format="auto"
/>
```

---

## 🛠️ Step 7: Upload Widget (For User Uploads)

Allow users to upload property images directly:

```tsx
'use client';
import { CldUploadWidget } from 'next-cloudinary';

export function ImageUploader() {
  return (
    <CldUploadWidget
      uploadPreset="pumalo_uploads" // Create this in Cloudinary settings
      onSuccess={(result) => {
        console.log('Uploaded:', result.info.secure_url);
        // Save URL to your database
      }}
    >
      {({ open }) => (
        <button onClick={() => open()}>
          Upload Images
        </button>
      )}
    </CldUploadWidget>
  );
}
```

**To create Upload Preset:**
1. Go to Settings → Upload in Cloudinary
2. Scroll to "Upload presets"
3. Click "Add upload preset"
4. Set:
   - Preset name: `pumalo_uploads`
   - Signing Mode: `Unsigned`
   - Folder: `pumalo/properties`
5. Save

---

## 📝 Quick Start Summary

### 1. Add to `.env`:
```bash
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### 2. Upload images to Cloudinary folders:
- `pumalo/properties/`
- `pumalo/destinations/`

### 3. Use URLs in your database:
```typescript
images: [
  'https://res.cloudinary.com/your-cloud-name/image/upload/w_800,h_600,c_fill,q_auto/pumalo/properties/image-1.jpg'
]
```

### 4. Display with Next.js Image or CldImage component

---

## 🔍 Next Steps

I've created:
1. ✅ A helper utility (`src/lib/cloudinary.ts`)
2. ✅ An image upload component (`src/components/ui/ImageUpload.tsx`)
3. ✅ Updated PropertyCard to use Cloudinary
4. ✅ Sample seed data with Cloudinary URLs

**You just need to:**
1. Add your credentials to `.env`
2. Upload images to Cloudinary
3. Update seed data with your image Public IDs

---

## 📚 Resources

- **Cloudinary Docs**: https://cloudinary.com/documentation/next_integration
- **Image Transformations**: https://cloudinary.com/documentation/image_transformations
- **Upload Widget**: https://cloudinary.com/documentation/upload_widget
- **Next.js Integration**: https://next.cloudinary.dev/

---

## ❓ Common Questions

**Q: Do I need to pay for Cloudinary?**
A: Free tier includes 25GB storage and 25GB bandwidth/month - plenty for starting!

**Q: Can I use my existing images?**
A: Yes! Just upload them to Cloudinary or use the bulk upload feature.

**Q: What if images don't load?**
A: Check that:
- Cloud name is correct in `.env`
- Images are uploaded to Cloudinary
- Public IDs match exactly (case-sensitive)

**Q: How do I make images load faster?**
A: Use transformations like `q_auto,f_auto` - Cloudinary automatically optimizes!
