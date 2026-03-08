import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('plates')
    .select('*, categories(name_en, name_fr, name_ar)')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const supabase = createAdminClient()
  const body = await request.json()

  const { data, error } = await supabase
    .from('plates')
    .insert({
      category_id: body.category_id,
      name_en: body.name_en,
      name_fr: body.name_fr,
      name_ar: body.name_ar,
      description_en: body.description_en ?? '',
      description_fr: body.description_fr ?? '',
      description_ar: body.description_ar ?? '',
      price: body.price,
      image_url: body.image_url ?? null,
      available: body.available ?? true,
    })
    .select('*, categories(name_en, name_fr, name_ar)')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
