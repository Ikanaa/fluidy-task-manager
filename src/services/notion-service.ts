/**
 * Service pour intéragir avec l'API Notion
 * Généré par Claude 3.7 Sonnet
 */



import streamDeck from "@elgato/streamdeck";
import { Client } from "@notionhq/client";

interface NotionCredentials {
  apiKey: string;
}

export class NotionService {
  private client: Client | null = null;
  
  initialize(credentials: NotionCredentials) {
    this.client = new Client({
      auth: credentials.apiKey,
    });
  }
  
  isInitialized(): boolean {
    return this.client !== null;
  }
  
  /**
   * Récupère une base de données Notion par son ID
   */
  async getDatabase(databaseId: string) {
    if (!this.client) {
      throw new Error("Notion client not initialized");
    }
    
    try {
      return await this.client.databases.query({
        database_id: databaseId,
      });
    } catch (error) {
      streamDeck.logger.warn(`Failed to fetch Notion database: ${error}`);
      throw error;
    }
  }
  
  /**
   * Récupère une page spécifique
   */
  async getPage(pageId: string) {
    if (!this.client) {
      throw new Error("Notion client not initialized");
    }
    
    try {
      return await this.client.pages.retrieve({
        page_id: pageId,
      });
    } catch (error) {
      streamDeck.logger.warn(`Failed to fetch Notion page: ${error}`);
      throw error;
    }
  }
  
  /**
   * Récupère des entrées d'une base de données avec filtrage
   */
  async queryDatabase(databaseId: string, filter?: any, sorts?: any[]) {
    if (!this.client) {
      throw new Error("Notion client not initialized");
    }
    
    try {

      const response = await this.client.databases.query({
        database_id: databaseId,
        filter: filter,
        sorts: sorts,
      });
      
      return response.results;
    } catch (error) {
      streamDeck.logger.warn(`Failed to query Notion database: ${error}`);
      throw error;
    }
  }
  
  /**
   * Crée une nouvelle entrée dans une base de données
   */
  async createDatabaseItem(databaseId: string, properties: any) {
    if (!this.client) {
      throw new Error("Notion client not initialized");
    }
    
    try {
      return await this.client.pages.create({
        parent: { database_id: databaseId },
        properties: properties,
      });
    } catch (error) {
      streamDeck.logger.warn(`Failed to create Notion database item: ${error}`);
      throw error;
    }
  }
}