import { db } from '../database/database.config';
import { users } from '../database/schema';
import { eq } from 'drizzle-orm';

/**
 * Script to promote a user to admin role.
 * Usage: npx ts-node src/scripts/set-admin.ts <username>
 */
async function setAdmin() {
    const username = process.argv[2];

    if (!username) {
        console.error('❌ Please provide a username: npx ts-node src/scripts/set-admin.ts <username>');
        process.exit(1);
    }

    console.log(`🔍 Searching for user "${username}"...`);

    try {
        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.username, username))
            .limit(1);

        if (!user) {
            console.error(`❌ User "${username}" not found.`);
            process.exit(1);
        }

        if (user.role === 'admin') {
            console.log(`ℹ️ User "${username}" is already an admin.`);
            process.exit(0);
        }

        await db
            .update(users)
            .set({ role: 'admin' })
            .where(eq(users.id, user.id));

        console.log(`✅ User "${username}" has been successfully promoted to admin!`);
    } catch (error) {
        console.error('❌ Error updating user role:', error);
        process.exit(1);
    }

    process.exit(0);
}

setAdmin();
