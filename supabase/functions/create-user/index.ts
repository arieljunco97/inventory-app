// supabase/functions/create-user/index.ts
//
// Esta función corre en el servidor de Supabase, NUNCA en el navegador.
// Usa la service_role key (con privilegios de administrador) para crear
// usuarios sin afectar la sesión de quien hace la petición.
//
// Solo un usuario ya autenticado con rol "admin" puede invocarla.

import { createClient } from 'jsr:@supabase/supabase-js@2'

// Cabeceras necesarias para que el navegador pueda llamar a esta función (CORS)
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // El navegador manda una petición OPTIONS antes del POST real (preflight CORS)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Cliente con la clave pública, solo para verificar quién está llamando
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // Verifica que quien llama esté logueado
    const { data: { user: callingUser }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !callingUser) {
      return new Response(
        JSON.stringify({ error: 'No autenticado' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Cliente con privilegios de administrador, SOLO se usa en el servidor
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // DESPUÉS (con logs temporales para diagnosticar)
    console.log('callingUser.id:', callingUser.id)

    const { data: callingProfile, error: profileError } = await supabaseAdmin
      .from('perfiles')
      .select('rol')
      .eq('id', callingUser.id)
      .single()

    console.log('callingProfile:', JSON.stringify(callingProfile))
    console.log('profileError:', JSON.stringify(profileError))

    if (profileError) {
      return new Response(
        JSON.stringify({ error: `Error al verificar perfil: ${profileError.message}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (callingProfile?.rol !== 'admin') {
      return new Response(
        JSON.stringify({ error: `Solo administradores pueden crear usuarios (rol detectado: ${callingProfile?.rol})` }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Datos del nuevo usuario que llegan desde el frontend
    const { email, password, nombre_completo, rol } = await req.json()

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Email y contraseña son obligatorios' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Crea el usuario con privilegios de admin — esto NO afecta
    // la sesión de quien está llamando, porque corre en el servidor
    const { data: newUserData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // confirma el email automáticamente, no hace falta que el usuario confirme por mail
      user_metadata: { full_name: nombre_completo || '' }
    })

    if (createError) {
      return new Response(
        JSON.stringify({ error: createError.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // El trigger de la base ya crea el perfil automáticamente con rol "empleado".
    // Si se pidió rol "admin", lo actualizamos.
    if (rol === 'admin' && newUserData?.user?.id) {
      await supabaseAdmin
        .from('perfiles')
        .update({ rol: 'admin' })
        .eq('id', newUserData.user.id)
    }

    return new Response(
      JSON.stringify({ data: newUserData, error: null }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
