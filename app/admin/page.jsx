import { redirect } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import NavAdmin from "@/components/NavAdmin";
import TabelProduk from "@/components/TabelProduk";
import Tombol from "@/components/Tombol";

export const dynamic = "force-dynamic";

export default async function HalamanAdmin() {
  const supabase = await getSupabaseAdmin();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/admin/login");
  }

  let daftarProduk = [];
  let pesanError = null;

  try {
    const { data, error } = await supabase
      .from("produk")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      pesanError = error.message;
    } else {
      daftarProduk = data || [];
    }
  } catch (err) {
    pesanError = err.message || "Terjadi kesalahan saat memuat data produk.";
  }

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold">Produk</h1>
        {/* US-08 (bonus): tambah produk */}
        <Tombol href="/admin/produk/baru">Tambah produk</Tombol>
      </div>

      {pesanError ? (
        <div className="rounded-lg border border-garis bg-permukaan px-4 py-3 text-sm text-bahaya">
          <p className="font-semibold">Gagal memuat produk</p>
          <p className="mt-1">{pesanError}</p>
        </div>
      ) : daftarProduk.length === 0 ? (
        <p className="text-teks-lembut">Belum ada produk.</p>
      ) : (
        <TabelProduk daftarProduk={daftarProduk} />
      )}
    </div>
  );
}
