import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET() {
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('user_id', session.user.id)
    .order('date', { ascending: true })

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { date, doctor, notes } = body

  const { data, error } = await supabase
    .from('appointments')
    .insert({ user_id: session.user.id, date, doctor, notes })
    .single()

  if (error) {
    return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 })
  }

  return NextResponse.json(data)
}