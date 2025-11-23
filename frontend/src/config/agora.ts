export interface AgoraConfig {
  appId: string;
  token?: string;
  channel: string;
  uid?: number;
}

class AgoraService {
  private appId: string;
  private token: string | null = null;
  private channel: string | null = null;
  private uid: number | null = null;

  constructor() {
    this.appId = process.env.EXPO_PUBLIC_AGORA_APP_ID || '';

    if (!this.appId) {
      console.warn('⚠️ Agora App ID not configured. Set EXPO_PUBLIC_AGORA_APP_ID in .env');
    }
  }

  /**
   * Configure Agora
   */
  configure(config: AgoraConfig): void {
    this.appId = config.appId || this.appId;
    this.token = config.token || null;
    this.channel = config.channel;
    this.uid = config.uid;

    console.log('✅ Agora configured for channel:', this.channel);
  }

  /**
   * Get Agora App ID
   */
  getAppId(): string {
    return this.appId;
  }

  /**
   * Get current token
   */
  getToken(): string | null {
    return this.token;
  }

  /**
   * Set token
   */
  setToken(token: string): void {
    this.token = token;
  }

  /**
   * Get current channel
   */
  getChannel(): string | null {
    return this.channel;
  }

  /**
   * Set channel
   */
  setChannel(channel: string): void {
    this.channel = channel;
  }

  /**
   * Get current UID
   */
  getUid(): number | null {
    return this.uid;
  }

  /**
   * Set UID
   */
  setUid(uid: number): void {
    this.uid = uid;
  }

  /**
   * Generate token (call your backend API)
   */
  async generateToken(
    channel: string,
    uid: number,
    role: 'publisher' | 'subscriber' = 'publisher'
  ): Promise<string> {
    try {
      // Call your backend to generate token
      const response = await fetch('/api/agora/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channel, uid, role }),
      });

      const data = await response.json();
      if (data.token) {
        this.setToken(data.token);
        return data.token;
      }

      throw new Error('Failed to generate token');
    } catch (error) {
      console.error('Error generating Agora token:', error);
      throw error;
    }
  }

  /**
   * Validate configuration
   */
  isConfigured(): boolean {
    return !!this.appId && !!this.channel && this.uid !== null;
  }
}

export default new AgoraService();