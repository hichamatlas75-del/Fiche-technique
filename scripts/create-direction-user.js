/**
 * GREY CORNER — Création d'un compte utilisateur Direction dans Supabase Auth
 * Usage : node scripts/create-direction-user.js <email> <password>
 * Ex:    node scripts/create-direction-user.js direction@greycorner.com MonMotDePasseFort123!
 */

const SUPABASE_URL = 'https://bxgguavmuiefthqmzygy.supabase.co';

async function createUser(email, password, serviceKey) {
  const finalKey = serviceKey || process.env.SUPABASE_SERVICE_KEY;
  if (!email || !password || !finalKey) {
    console.error('Usage : node scripts/create-direction-user.js <email> <password> [service_role_key]');
    process.exit(1);
  }

  console.log(`🔐 Création du compte Direction : ${email}...`);

  const response = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
    method: 'POST',
    headers: {
      apikey: finalKey,
      Authorization: `Bearer ${finalKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: { role: 'direction', organization: 'Grey Corner' }
    })
  });

  const result = await response.json();

  if (!response.ok) {
    console.error('❌ Erreur création utilisateur :', result.message || result);
    process.exit(1);
  }

  console.log('======================================================');
  console.log('✅ COMPTE DIRECTION CRÉÉ AVEC SUCCÈS !');
  console.log(`   - ID : ${result.id}`);
  console.log(`   - Email : ${result.email}`);
  console.log(`   - Email confirmé : ${result.email_confirmed_at ? 'OUI' : 'NON'}`);
  console.log('======================================================');
  console.log('Vous pouvez dès maintenant vous connecter sur votre dashboard !');
}

const args = process.argv.slice(2);
createUser(args[0], args[1], args[2]).catch(console.error);
