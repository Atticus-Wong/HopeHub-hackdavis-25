// install zod

// view only for a sheet

export type DataTable = {
  uuid: string;
  name: string;
  ethnicity: string;
  gender: string;
  ageGroup: AGEGROUP;
  benefits: {
    name: SERVICES;
    value: number;
  }[];
  location: string;
  createAt: string;
  updatedAt: string;
  stayDuration?: {
    start: string;
    end: string;
  };
};

export enum AGEGROUP {
  "MINOR" = "minor",
  "ADULT" = "adult",
  "SENIOR" = "senior",
}

export type SERVICES = "SHOWER" | "LAUNDRY" | "MNGMT";

export type Journeys = {};

// name Joe
// beneiftse: {
// .   "shower": 10
//

// keep in mind: serviceTypes
