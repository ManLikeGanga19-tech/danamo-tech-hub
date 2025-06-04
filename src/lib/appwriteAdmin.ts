// src/lib/appwriteAdmin.ts (or wherever you store it)
import { Client, Users, Account, Databases } from 'node-appwrite';

const client = new Client();

client
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!) 
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!) 
    .setKey(process.env.NEXT_PUBLIC_APPWRITE_API_KEY!);       

// Export instances of services
export const adminUsers = new Users(client);
export const adminAccount = new Account(client);
export const adminDatabases = new Databases(client);
