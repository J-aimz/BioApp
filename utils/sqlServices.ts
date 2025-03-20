import db from "./database";
import { BioDataFormUpload } from "./types";
import * as FileSystem from 'expo-file-system';

// Function to save BioData into the database

export const sqlSaveBioData = async (data: BioDataFormUpload): Promise<boolean> => {
  try {
    await db.runAsync(
      `INSERT INTO BioData (
        firstName, lastName, otherNames, dateOfBirth, stateOfOrigin, lga, ward, address, contact, 
        passportPhoto, votersCard, nin, email, gender,selectedSkillCategory, selectedSkill, meansOfIdentification, otherMeansOfIdentification, IdCardPhoto, isUploaded
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?);`, // 17 placeholders
      [
        data.firstName,
        data.lastName,
        data.otherNames ?? null,
        data.dateOfBirth,
        data.stateOfOrigin,
        data.lga,
        data.ward,
        data.address ?? null,
        data.contact,
        data.passportPhoto ?? null,  // Ensure NULL if empty
        data.votersCard ?? null,      // Ensure NULL if empty
        data.nin ?? null,
        data.email ?? null,
        data.gender,
        data.selectedSkillCategory ?? null,  // Added skill category
        data.selectedSkill ?? null, 
        data.meansOfIdentification ?? null,
        data.otherMeansOfIdentification ??
        data.IdCardPhoto ?? null,
        data.isUploaded ?? false
      ]
    );
    
    console.log("Data saved successfully");
    return true;
  } catch (error) {
    console.log("Error saving BioData:", error);
    console.error("Error saving BioData:", error);
    return false;
  }
};

// Function to fetch all BioData records
export const sqlGetBioData = async () => {
  try {
    const results = await db.getAllAsync("SELECT * FROM BioData");
    console.log("Fetched BioData records:", results);
    return results;
  } catch (error) {
    console.error("Error fetching BioData:", error);
    return [];
  }
};

export const sqlGetUnuploadedBioData = async (): Promise<BioDataFormUpload[]>   => {
  try {
    const results = await db.getAllAsync("SELECT * FROM BioData WHERE isUploaded = 0;");
    console.log("Fetched unuploaded BioData records:", results);
    return results as BioDataFormUpload[];
  } catch (error) {
    console.error("Error fetching unuploaded BioData:", error);
    return [];
  }
};


export const sqlDeleteAllBioData = async (): Promise<boolean> => {
  try {
    await db.runAsync("DELETE FROM BioData");
    console.log("All BioData records deleted successfully!");
    return true;
  } catch (error) {
    console.error("Error deleting BioData records:", error);
    return false;
  }
};

export const sqlDeleteDatabase = async (): Promise<boolean> => {
  try {
    const dbPath = `${FileSystem.documentDirectory}SQLite/biodata.db`;
    const fileInfo = await FileSystem.getInfoAsync(dbPath);

    if (fileInfo.exists) {
      await FileSystem.deleteAsync(dbPath);
      console.log("Database deleted successfully!");
      return true;
    } else {
      console.warn("Database file does not exist.");
      return false;
    }
  } catch (error) {
    console.error("Error deleting database:", error);
    return false;
  }
};

export const sqlGetBioDataCount = async (): Promise<number> => {
  try {
    const result = await db.getFirstAsync<{ count: number }>("SELECT COUNT(*) as count FROM BioData");

    console.log("Raw result from database:", result); 

    if (!result || typeof result.count !== "number") {
      console.warn("Invalid count result:", result);
      return 0;
    }

    console.log("Total BioData count:", result.count);
    return result.count;
  } catch (error) {
    console.error("Error fetching BioData count:", error);
    return 0;
  }
};

export const isVoterCardUnique = async (voterCard: string): Promise<boolean> => {
  try {
    const result = await db.getFirstAsync<{ count: number }>(
      "SELECT COUNT(*) as count FROM BioData WHERE votersCard = ?",
      [voterCard]
    );

    return result?.count === 0; 
  } catch (error) {
    console.error("Error checking unique voter card:", error);
    return false; 
  }
};

