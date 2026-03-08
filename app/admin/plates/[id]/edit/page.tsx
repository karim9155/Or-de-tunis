import { createAdminClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import EditPlateClient from './edit-client'

export default async function EditPlatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createAdminClient()

  const { data: plate } = await supabase
    .from('plates')
    .select('*')
    .eq('id', id)
    .single()

  if (!plate) notFound()

  return <EditPlateClient plate={plate} />
}
