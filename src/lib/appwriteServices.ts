import { Account, Databases, Storage, ID } from "appwrite";
import appwriteClient from "./appwrite";

const account = new Account(appwriteClient);
const databases = new Databases(appwriteClient);
const storage = new Storage(appwriteClient);

export { account, databases, storage, ID, appwriteClient };