"use client";

export default function PanelAccountPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="font-serif text-2xl font-light" style={{ color: "#E8D5A3" }}>Hesap Ayarları</h2>

      <div className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,168,76,0.12)" }}>
        <div className="flex items-start gap-4">
          <div className="text-3xl">🔒</div>
          <div>
            <h3 className="font-serif text-lg mb-2" style={{ color: "#E8D5A3" }}>Kullanıcı Adı ve Şifre Değişikliği</h3>
            <p className="font-sans text-sm leading-relaxed" style={{ color: "rgba(201,168,76,0.7)" }}>
              Güvenlik nedeniyle kullanıcı adı ve şifre değişiklikleri sadece <strong>Sahra Admin</strong> tarafından yapılabilir.
            </p>
            <p className="font-sans text-sm leading-relaxed mt-3" style={{ color: "rgba(201,168,76,0.7)" }}>
              Kullanıcı adınızı veya şifrenizi değiştirmek için lütfen Sahra Admin ile iletişime geçin.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,168,76,0.12)" }}>
        <div className="flex items-start gap-4">
          <div className="text-3xl">💡</div>
          <div>
            <h3 className="font-serif text-lg mb-2" style={{ color: "#E8D5A3" }}>Davetiye Düzenleme</h3>
            <p className="font-sans text-sm leading-relaxed" style={{ color: "rgba(201,168,76,0.7)" }}>
              Düğün bilgilerinizi, fotoğraflarınızı ve davetiye içeriğinizi sol menüden düzenleyebilirsiniz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
