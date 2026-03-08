import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = createAdminClient()
  const body = await request.json()

  const { data, error } = await supabase
    .from('plates')
    .update({
      category_id: body.category_id,
      name_en: body.name_en,
      name_fr: body.name_fr,
      name_ar: body.name_ar,
      description_en: body.description_en ?? '',
      description_fr: body.description_fr ?? '',
      description_ar: body.description_ar ?? '',
      price: body.price,
      image_url: body.image_url,
      available: body.available,
    })
    .eq('id', id)
    .select('*, categories(name_en, name_fr, name_ar)')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = createAdminClient()

  const { error } = await supabase.from('plates').delete().eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
