import db from '../config/database';

const roles = [
  { name: 'system_admin' },
  { name: 'ban_manager' },
  { name: 'coin_manager' },
  { name: 'support_staff' },
];

const permissions = [
  { name: 'view_dashboard' },
  { name: 'view_admin_panel' },
  { name: 'manage_users' },
  { name: 'manage_roles' },
  { name: 'manage_bans' },
  { name: 'view_ban_logs' },
  { name: 'manage_coins' },
  { name: 'view_economy_logs' },
];

// Mappatura tra ruoli e permessi
const rolePermissionsMap = {
  system_admin: [
    'view_dashboard', 'view_admin_panel', 'manage_users', 'manage_roles',
    'manage_bans', 'view_ban_logs', 'manage_coins', 'view_economy_logs'
  ],
  ban_manager: ['view_dashboard', 'manage_bans', 'view_ban_logs'],
  coin_manager: ['view_dashboard', 'manage_coins', 'view_economy_logs'],
  support_staff: ['view_dashboard'], // Per ora, solo accesso alla dashboard
};

const seedDatabase = async () => {
  const connection = await db.getConnection();
  try {
    console.log('Inizio seeding del database...');
    await connection.beginTransaction();

    // Inserisci i ruoli
    const [roleResult]: any = await connection.query('INSERT INTO roles (name) VALUES ?', [roles.map(r => [r.name])]);
    console.log(`${roleResult.affectedRows} ruoli inseriti.`);

    // Inserisci i permessi
    const [permResult]: any = await connection.query('INSERT INTO permissions (name) VALUES ?', [permissions.map(p => [p.name])]);
    console.log(`${permResult.affectedRows} permessi inseriti.`);

    // Recupera gli ID appena creati
    const [dbRoles]: any = await connection.query('SELECT * FROM roles');
    const [dbPermissions]: any = await connection.query('SELECT * FROM permissions');

    const rolePermsData = [];
    for (const roleName in rolePermissionsMap) {
      const role = dbRoles.find((r: any) => r.name === roleName);
      if (role) {
        const permsForRole = rolePermissionsMap[roleName as keyof typeof rolePermissionsMap];
        for (const permName of permsForRole) {
          const perm = dbPermissions.find((p: any) => p.name === permName);
          if (perm) {
            rolePermsData.push([role.id, perm.id]);
          }
        }
      }
    }

    // Inserisci le relazioni ruolo-permesso
    if (rolePermsData.length > 0) {
        const [rolePermsResult]: any = await connection.query('INSERT INTO role_permissions (role_id, permission_id) VALUES ?', [rolePermsData]);
        console.log(`${rolePermsResult.affectedRows} relazioni ruolo-permesso inserite.`);
    }

    await connection.commit();
    console.log('✅ Seeding completato con successo!');

  } catch (error) {
    await connection.rollback();
    console.error('❌ Errore durante il seeding:', error);
  } finally {
    connection.release();
    process.exit();
  }
};

seedDatabase();