// install zod

// view only for a sheet

export type DataTable = {
  uuid: string
  name: string
  ethnicity: string
  ageGroup: AGEGROUP
  benefits: {
    SERVICES: number
  }[]
  location: string
  createAt: string
  updatedAt: string
  Journeys: {
    housingSecure: boolean
    housingEnrollment: boolean
    notes?: string
  }
  // track how long someone is staying for
}

export enum AGEGROUP {
  'MINOR' = 'minor',
  'ADULT' = 'adult',
  'SENIOR' = 'senior',
}

export type SERVICES = 'SHOWER' | 'LAUNDRY' | 'MNGMT'

export type Journeys = {}

// name Joe
// beneiftse: {
// .   "shower": 10
//

// keep in mind: serviceTypes
