const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
admin.initializeApp();

// Callable function to delete a user account
exports.deleteUserAccount = functions.https.onCall(async (data, context) => {
    // Verify that the user is authenticated
    if (!context.auth) {
        throw new functions.https.HttpsError(
            'unauthenticated',
            'Request must be made by an authenticated user'
        );
    }

    // Verify that only admin (chunhiem@lscm.vn) can delete accounts
    const callerEmail = context.auth.token.email;
    if (callerEmail !== 'chunhiem@lscm.vn') {
        throw new functions.https.HttpsError(
            'permission-denied',
            'Only admins can delete user accounts'
        );
    }

    const { uid } = data;

    if (!uid) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'Missing uid parameter'
        );
    }

    try {
        // Delete the user from Firebase Auth
        await admin.auth().deleteUser(uid);
        console.log(`Successfully deleted user with uid: ${uid}`);
        return { success: true, message: `User ${uid} has been deleted` };
    } catch (error) {
        console.error('Error deleting user:', error);
        throw new functions.https.HttpsError(
            'internal',
            `Failed to delete user: ${error.message}`
        );
    }
});

// Callable function to delete user account by email
exports.deleteUserByEmail = functions.https.onCall(async (data, context) => {
    // Verify that the user is authenticated
    if (!context.auth) {
        throw new functions.https.HttpsError(
            'unauthenticated',
            'Request must be made by an authenticated user'
        );
    }

    // Verify that only admin can delete accounts
    const callerEmail = context.auth.token.email;
    if (callerEmail !== 'chunhiem@lscm.vn') {
        throw new functions.https.HttpsError(
            'permission-denied',
            'Only admins can delete user accounts'
        );
    }

    const { email } = data;

    if (!email) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'Missing email parameter'
        );
    }

    try {
        // Get user by email
        const user = await admin.auth().getUserByEmail(email);
        // Delete the user from Firebase Auth
        await admin.auth().deleteUser(user.uid);
        console.log(`Successfully deleted user with email: ${email}`);
        return { success: true, message: `User ${email} has been deleted` };
    } catch (error) {
        console.error('Error deleting user:', error);
        throw new functions.https.HttpsError(
            'internal',
            `Failed to delete user: ${error.message}`
        );
    }
});
