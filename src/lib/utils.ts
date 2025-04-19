import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { DataTable as DataTableType, AGEGROUP } from '@/types/types' // Import AGEGROUP and SERVICES
import { SERVICES } from '@/types/enums'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Function to generate random data for DataTableType
export function generateDataTableData(amount: number): DataTableType[] {
  const data: DataTableType[] = []
  const ageGroups = Object.values(AGEGROUP)
  const serviceTypes: SERVICES[] = [
    SERVICES.SHOWER,
    SERVICES.LAUNDRY,
    SERVICES.MNGMT,
  ]
  const ethnicities = [
    'Caucasian',
    'Hispanic',
    'Asian',
    'African American',
    'Other',
  ]
  const genders = ['Male', 'Female', 'Non-binary', 'Other']

  for (let i = 0; i < amount; i++) {
    const benefitsCount = Math.floor(Math.random() * (serviceTypes.length + 1)) // 0 to 3 benefits
    const benefits: { name: SERVICES; value: number }[] = []
    const usedServices = new Set<SERVICES>()

    for (let j = 0; j < benefitsCount; j++) {
      let service: SERVICES
      do {
        service = serviceTypes[Math.floor(Math.random() * serviceTypes.length)]
      } while (usedServices.has(service)) // Ensure unique services per client
      usedServices.add(service)
      benefits.push({
        name: service,
        value: Math.floor(Math.random() * 10) + 1, // Random value 1-10
      })
    }

    const entry: DataTableType = {
      uuid: `uuid-${i}-${Date.now()}`, // Simple unique ID
      name: `Person ${i + 1}`,
      ethnicity: ethnicities[Math.floor(Math.random() * ethnicities.length)],
      gender: genders[Math.floor(Math.random() * genders.length)],
      ageGroup: ageGroups[Math.floor(Math.random() * ageGroups.length)],
      benefits: benefits,
      location: `City ${String.fromCharCode(65 + (i % 26))}`, // Cycle through A-Z
      createAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // Optionally add stayDuration
      // stayDuration: {
      //   start: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 30).toISOString(), // Random start within last 30 days
      //   end: Math.random() > 0.5 ? new Date().toISOString() : undefined // 50% chance of having an end date
      // }
    }
    data.push(entry)
  }
  return data
}

const generateRandomService = (amount: number) => {

}
