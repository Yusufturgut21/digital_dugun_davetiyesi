import { connectDB } from "../lib/mongodb";
import { VenueWebsite } from "../lib/models/VenueWebsite";
import { defaultVenueData } from "../lib/defaults-venue";
import { generateSlug } from "../lib/slug";

async function createSampleVenue() {
  try {
    await connectDB();
    console.log("✓ MongoDB bağlantısı başarılı");

    // Check if venue already exists
    const existingVenue = await VenueWebsite.findOne({ venueName: defaultVenueData.venueName });
    
    if (existingVenue) {
      console.log("✓ Örnek salon zaten mevcut:", existingVenue.venueName);
      console.log("  Slug:", existingVenue.slug);
      console.log("  URL: /salon/" + existingVenue.slug);
      return;
    }

    const slug = generateSlug(defaultVenueData.venueName);
    const venue = await VenueWebsite.create({
      ...defaultVenueData,
      slug,
    });

    console.log("✓ Örnek salon başarıyla oluşturuldu!");
    console.log("  Salon Adı:", venue.venueName);
    console.log("  Slug:", venue.slug);
    console.log("  URL: /salon/" + venue.slug);
    console.log("\n🎉 Düğün salonu web sitesi hazır!");
  } catch (error) {
    console.error("❌ Hata:", error);
    process.exit(1);
  }
}

createSampleVenue();
