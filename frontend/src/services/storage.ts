import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

class StorageService {
  private cacheDir = FileSystem.cacheDirectory;
  private documentDir = FileSystem.documentDirectory;

  /**
   * Save file to local storage
   */
  async saveFile(filename: string, content: string, useDocuments = false): Promise<string> {
    try {
      const dir = useDocuments ? this.documentDir : this.cacheDir;
      if (!dir) throw new Error('Storage directory not available');

      const filePath = `${dir}${filename}`;
      await FileSystem.writeAsStringAsync(filePath, content);

      console.log('✅ File saved:', filePath);
      return filePath;
    } catch (error) {
      console.error('Error saving file:', error);
      throw error;
    }
  }

  /**
   * Read file from local storage
   */
  async readFile(filename: string, useDocuments = false): Promise<string> {
    try {
      const dir = useDocuments ? this.documentDir : this.cacheDir;
      if (!dir) throw new Error('Storage directory not available');

      const filePath = `${dir}${filename}`;
      const content = await FileSystem.readAsStringAsync(filePath);

      return content;
    } catch (error) {
      console.error('Error reading file:', error);
      throw error;
    }
  }

  /**
   * Delete file
   */
  async deleteFile(filename: string, useDocuments = false): Promise<void> {
    try {
      const dir = useDocuments ? this.documentDir : this.cacheDir;
      if (!dir) throw new Error('Storage directory not available');

      const filePath = `${dir}${filename}`;
      await FileSystem.deleteAsync(filePath);

      console.log('✅ File deleted:', filePath);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }

  /**
   * Get file size
   */
  async getFileSize(filename: string, useDocuments = false): Promise<number> {
    try {
      const dir = useDocuments ? this.documentDir : this.cacheDir;
      if (!dir) throw new Error('Storage directory not available');

      const filePath = `${dir}${filename}`;
      const info = await FileSystem.getInfoAsync(filePath);

      return info.size || 0;
    } catch (error) {
      console.error('Error getting file size:', error);
      return 0;
    }
  }

  /**
   * Check if file exists
   */
  async fileExists(filename: string, useDocuments = false): Promise<boolean> {
    try {
      const dir = useDocuments ? this.documentDir : this.cacheDir;
      if (!dir) throw new Error('Storage directory not available');

      const filePath = `${dir}${filename}`;
      const info = await FileSystem.getInfoAsync(filePath);

      return info.exists;
    } catch (error) {
      console.error('Error checking file:', error);
      return false;
    }
  }

  /**
   * List files in directory
   */
  async listFiles(useDocuments = false): Promise<string[]> {
    try {
      const dir = useDocuments ? this.documentDir : this.cacheDir;
      if (!dir) throw new Error('Storage directory not available');

      const files = await FileSystem.readDirectoryAsync(dir);
      return files;
    } catch (error) {
      console.error('Error listing files:', error);
      return [];
    }
  }

  /**
   * Clear cache directory
   */
  async clearCache(): Promise<void> {
    try {
      if (!this.cacheDir) throw new Error('Cache directory not available');

      const files = await FileSystem.readDirectoryAsync(this.cacheDir);
      for (const file of files) {
        await FileSystem.deleteAsync(`${this.cacheDir}${file}`);
      }

      console.log('✅ Cache cleared');
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }

  /**
   * Save JSON data
   */
  async saveJSON(key: string, data: any): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
      console.log('✅ JSON saved:', key);
    } catch (error) {
      console.error('Error saving JSON:', error);
      throw error;
    }
  }

  /**
   * Read JSON data
   */
  async readJSON(key: string): Promise<any> {
    try {
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error reading JSON:', error);
      throw error;
    }
  }

  /**
   * Delete JSON data
   */
  async deleteJSON(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
      console.log('✅ JSON deleted:', key);
    } catch (error) {
      console.error('Error deleting JSON:', error);
      throw error;
    }
  }

  /**
   * Clear all AsyncStorage
   */
  async clearAsyncStorage(): Promise<void> {
    try {
      await AsyncStorage.clear();
      console.log('✅ AsyncStorage cleared');
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
    }
  }

  /**
   * Get storage size
   */
  async getStorageSize(): Promise<{
    cache: number;
    documents: number;
  }> {
    try {
      const cacheInfo = await FileSystem.getInfoAsync(this.cacheDir || '');
      const docInfo = await FileSystem.getInfoAsync(this.documentDir || '');

      return {
        cache: cacheInfo.size || 0,
        documents: docInfo.size || 0,
      };
    } catch (error) {
      console.error('Error getting storage size:', error);
      return { cache: 0, documents: 0 };
    }
  }
}

export default new StorageService();