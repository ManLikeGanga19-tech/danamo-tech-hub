import { Account, ID } from 'appwrite';
import appwriteClient from './appwrite';

const account = new Account(appwriteClient);

export { account, ID, appwriteClient };
