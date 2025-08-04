import { decryptData, encryptData } from "./encryption";
import CFG from "@/config/config.json";

/**
 * Interface defining the configuration for the BrowserStorage class.
 * @property {Storage} storageObject - The storage object (localStorage or sessionStorage).
 * @property {string} [keyPrefix] - Optional prefix for storage keys.
 * @property {boolean} [encryptionEnabled] - Enables or disables encryption.
 */
interface StorageConfig {
  storageObject: Storage; // localStorage or sessionStorage
  keyPrefix?: string; // Optional prefix for keys
  encryptionEnabled?: boolean; // Enable or disable encryption
}

/**
 * Interface defining the methods for the BrowserStorage class.
 */
interface BrowserStorageType {
  serialize<T>(value: T): string;
  deserialize<T>(value: string): T;
  encrypt(value: string): string;
  decrypt(value: string): string;
  isJSON(value: string): boolean;
  setItem<T>(key: string, value: T): void;
  getItem<T>(key: string): T | null;
  removeItem(key: string): void;
  clear(): void;
}

/**
 * Class to handle localStorage or sessionStorage with optional encryption and key prefixing.
 */
class BrowserStorage implements BrowserStorageType {
  private storageObject: Storage;
  private keyPrefix: string;
  private encryptionEnabled: boolean;

  /**
   * Constructor to initialize storage instance.
   * @param {StorageConfig} config - Configuration object for the storage instance.
   */
  constructor(config: StorageConfig) {
    this.storageObject = config.storageObject;
    this.keyPrefix = config.keyPrefix || "";
    this.encryptionEnabled = config.encryptionEnabled || false;
  }

  /**
   * Serializes a value to a JSON string.
   * @param {T} value - The value to serialize.
   * @returns {string} Serialized JSON string.
   */
  serialize<T>(value: T): string {
    return typeof value === "string" ? value : JSON.stringify(value);
  }

  /**
   * Deserializes a JSON string to its original value.
   * @param {string} value - The JSON string to deserialize.
   * @returns {T} The deserialized value.
   */
  deserialize<T>(value: string): T {
    return JSON.parse(value);
  }

  /**
   * Encrypts a value if encryption is enabled.
   * @param {string} value - The value to encrypt.
   * @returns {string} Encrypted value or the original value if encryption is disabled.
   */
  encrypt(value: string): string {
    try {
      return this.encryptionEnabled ? encryptData(value) : value;
    } catch (error) {
      console.error("Encryption failed:", error);
      throw new Error("Encryption failed");
    }
  }

  /**
   * Decrypts a value if encryption is enabled.
   * @param {string} value - The value to decrypt.
   * @returns {string} Decrypted value or the original value if encryption is disabled.
   */
  decrypt(value: string): string {
    try {
      return this.encryptionEnabled ? decryptData(value) : value;
    } catch (error) {
      console.error("Decryption failed:", error);
      throw new Error("Decryption failed");
    }
  }

  /**
   * Checks if a string is a valid JSON.
   * @param {string} value - The string to check.
   * @returns {boolean} True if the string is valid JSON, false otherwise.
   */
  isJSON(value: string): boolean {
    if (typeof value !== "string") return false; // Only check strings
    try {
      JSON.parse(value);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Stores a value in storage after serializing and optionally encrypting it.
   * @param {string} key - The key to store the value under.
   * @param {T} value - The value to store.
   */
  setItem<T>(key: string, value: T): void {
    if (!key) throw new Error("Invalid key: Key must not be empty");
    if (value === undefined || value === null)
      throw new Error("Invalid value: Value must not be null or undefined");

    const serializedValue = this.serialize(value);
    const encryptedValue = this.encrypt(serializedValue);
    
    try {
      this.storageObject.setItem(this.keyPrefix + key, encryptedValue);
    } catch (error) {
      console.error(
        `Error setting storage value for key "${this.keyPrefix + key}":`,
        error
      );
    }
  }

  /**
   * Retrieves a value from storage and deserializes and decrypts it if necessary.
   * @param {string} key - The key of the value to retrieve.
   * @returns {T | null} The retrieved value or null if not found.
   */
  getItem<T>(key: string): T | null {
    if (!key) throw new Error("Invalid key: Key must not be empty");

    const storedValue = this.storageObject.getItem(this.keyPrefix + key);
    if (storedValue === null || storedValue === undefined) return null;

    try {
      const decryptedValue = this.decrypt(storedValue);
      return this.isJSON(decryptedValue)
        ? this.deserialize(decryptedValue)
        : (decryptedValue as unknown as T);
    } catch (error) {
      console.error(`Failed to get item "${this.keyPrefix + key}":`, error);
      return null;
    }
  }

  /**
   * Removes a value from storage.
   * @param {string} key - The key of the value to remove.
   */
  removeItem(key: string): void {
    if (!key) throw new Error("Invalid key: Key must not be empty");

    try {
      this.storageObject.removeItem(this.keyPrefix + key);
    } catch (error) {
      console.error(
        `Error removing storage value for key "${this.keyPrefix + key}":`,
        error
      );
    }
  }

  /**
   * Clears all values in the storage object.
   */
  clear(): void {
    try {
      this.storageObject.clear();
    } catch (error) {
      console.error("Error clearing storage:", error);
    }
  }
}

/**
 * Creates an accessor function for a storage instance to get, set, and remove values.
 * @param {BrowserStorage} instance - The BrowserStorage instance.
 * @returns {Function} A function to destructure accessors for a specific key.
 */
const createStorageAccessor = (instance: BrowserStorage) => {
  return <T>(
    key: string,
    value?: any
  ): [() => T | null, (value: T) => void, () => void] => {
    if (!key) throw new Error("Invalid key: Key must not be empty");

    const storedValue = instance.getItem<T>(key);

    // Set default value only if no value exists
    if (value !== undefined && (storedValue === null || storedValue === undefined)) {
      instance.setItem(key, value);
    }

    return [
      () => instance.getItem(key), // Getter
      (value: any) => instance.setItem(key, value), // Setter
      () => instance.removeItem(key), // Remover
    ];
  };
};

/**
 * Local and session storage instances with encryption and prefix configurations.
 */
const ENABLE_ENCRYPTION: boolean = CFG?.encryption?.browser_storage_encryption;
const KEY_PREFIX: string = import.meta.env.VITE_BROWSER_STORAGE_PREFIX as string;

/* Local Storage instance */
const localStorageInstance = new BrowserStorage({
  storageObject: localStorage,
  keyPrefix: KEY_PREFIX,
  encryptionEnabled: ENABLE_ENCRYPTION, // Enable encryption if needed
});

/* Session Storage instance */
const sessionStorageInstance = new BrowserStorage({
  storageObject: sessionStorage,
  keyPrefix: KEY_PREFIX,
  encryptionEnabled: ENABLE_ENCRYPTION, // Disable encryption
});

/* Local storage accessor */
const localStorageAccessor = createStorageAccessor(localStorageInstance);
/* Session storage accessor */
const sessionStorageAccessor = createStorageAccessor(sessionStorageInstance);

export {
  localStorageAccessor,
  sessionStorageAccessor,
  localStorageInstance,
  sessionStorageInstance,
  BrowserStorage
};

/* USAGE
   const [Lusername, LsetUsername, LremoveUsername] = localStorageAccessor("username", "Infiniti");
   const [Stoken, SsetToken, SremoveToken] = sessionStorageAccessor("token");
  
   # remove in event handler
   const handleRemove = () => {
     LremoveUsername();
   };
  
- Always use 'L'(local storage) or 'S'(session storage) before the variables to highlight the localstorage variables
 */

/* ADVANTAGES
  - Encapsulates the logic for handling local storage/session storage, reducing boilerplate code.
  - Automatically handles JSON serialization and deserialization, allowing for storing complex data structures (arrays, objects) without additional code.
 */
