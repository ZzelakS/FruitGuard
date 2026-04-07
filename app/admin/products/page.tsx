import ProductsTable from '@/components/admin/ProductsTable'

export default function AdminProductsPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl text-[#111110]">Products</h1>
        <p className="text-[13px] text-[#6B6860] mt-1">
          Add, edit and remove products — changes sync live to the storefront via Firestore.
        </p>
      </div>
      <ProductsTable initialProducts={[]} />
    </div>
  )
}
