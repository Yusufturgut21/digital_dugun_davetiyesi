/**
 * Silinmiş davetiyelerle ilişkili kullanıcıları temizler
 * Kullanım: npx tsx scripts/cleanup-orphan-users.ts
 */

import { connectDB } from "../lib/mongodb";
import { User } from "../lib/models/User";
import { Invitation } from "../lib/models/Invitation";

async function cleanupOrphanUsers() {
  await connectDB();

  // Tüm kullanıcıları al
  const users = await User.find({ role: "couple" }).lean();
  console.log(`Toplam ${users.length} kullanıcı bulundu.`);

  let deletedCount = 0;

  for (const user of users) {
    if (!user.invitationId) {
      console.log(`⚠️  ${user.username} kullanıcısının invitationId yok, atlanıyor.`);
      continue;
    }

    // İlgili davetiye var mı kontrol et
    const invitation = await Invitation.findById(user.invitationId);
    
    if (!invitation) {
      console.log(`❌ ${user.username} - Davetiye bulunamadı, kullanıcı siliniyor...`);
      await User.findByIdAndDelete(user._id);
      deletedCount++;
    } else {
      console.log(`✅ ${user.username} - ${invitation.groomName} & ${invitation.brideName}`);
    }
  }

  console.log(`\n✨ Temizlik tamamlandı. ${deletedCount} yetim kullanıcı silindi.`);
  process.exit(0);
}

cleanupOrphanUsers().catch((err) => {
  console.error("Hata:", err);
  process.exit(1);
});
