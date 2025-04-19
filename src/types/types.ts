import { SERVICES } from './enums'
// view only for a sheet

export type DataTable = {
  uuid: string;
  name: string;
  ethnicity: string;
  gender: string;
  ageGroup: AGEGROUP;
  benefits: {
<<<<<<< HEAD
    name: SERVICES;
    value: number;
  }[];
  location: string;
  createAt: string;
  updatedAt: string;
=======
    name: SERVICES
    value: number
  }[]
  location: string
  createAt: string
  updatedAt: string
>>>>>>> 536d980 (feat: more frontend stuff)
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

<<<<<<< HEAD
export type SERVICES = "SHOWER" | "LAUNDRY" | "MNGMT";

export type Journeys = {};

// name Joe
// beneiftse: {
// .   "shower": 10
//

// keep in mind: serviceTypes
=======
export type providedServices = {
  name: string
  status: 'online' | 'offline'
  lastSeen: string
  timeCompleted: string
}
>>>>>>> 536d980 (feat: more frontend stuff)
