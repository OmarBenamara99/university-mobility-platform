// src/app/models/ordre-mission.ts
export interface OrdreMission {
  id?: number;
  fileName: string;
  originalFileName: string;
  uploadedAt: string; // or Date if you prefer
  fileData?: any; // ArrayBuffer or blob for file data
  offer?: any; // You can create a proper interface if needed
}