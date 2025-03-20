import * as SQLite from "expo-sqlite";

// Open the database
const db = SQLite.openDatabaseSync("biodata.db");

export const setupDatabase = async () => {
  try {
    await db.execAsync(
      `CREATE TABLE IF NOT EXISTS BioData (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        otherNames TEXT,
        dateOfBirth TEXT NOT NULL,
        stateOfOrigin TEXT NOT NULL,
        lga TEXT NOT NULL,
        ward TEXT NOT NULL,
        address TEXT,
        contact TEXT NOT NULL,
        passportPhoto TEXT,  -- Base64 Image
        votersCard TEXT,
        nin TEXT,
        email TEXT,
        gender TEXT NOT NULL,
        selectedSkillCategory TEXT,  
        selectedSkill TEXT,  
        meansOfIdentification TEXT,
        otherMeansOfIdentification TEXT, -- Optional
        IdCardPhoto TEXT,  -- Base64 Image
        isUploaded BOOLEAN DEFAULT 0  -- New field to track upload status
      );`
    );

    console.log("Database initialized successfully!");
  } catch (error) {
    console.error("Database initialization error:", error);
  }
};

export default db;
