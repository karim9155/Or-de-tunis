import { createAdminClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import PlateForm from '@/components/admin/plate-form'

export default async function EditPlatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createAdminClient()

  const { data: plate } = await supabase
    .from('plates')
    .select('*')
    .eq('id', id)
    .single()

  if (!plate) notFound()

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Plate</h1>
      <PlateForm plate={plate} />
    </div>
  )
}
