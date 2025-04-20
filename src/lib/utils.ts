import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { DataTable as DataTableType, AGEGROUP, BaseQueue } from '@/types/types' // Import AGEGROUP and SERVICES
import { SERVICES } from '@/types/enums'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Function to generate random data for DataTableType
export function generateDataTableData(amount: number) {
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
  const genders = ['Male', 'Female', 'Other']

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
      uuid: uuidv4(), // Generate UUID
      name: `Person ${i + 1}`,
      ethnicity: ethnicities[Math.floor(Math.random() * ethnicities.length)],
      gender: genders[Math.floor(Math.random() * genders.length)],
      ageGroup: ageGroups[Math.floor(Math.random() * ageGroups.length)],
      benefits: benefits,
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
  return { data }
}

export const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export const generateFakeStuff = (amount: number) => {
  const data: BaseQueue[] = []
  const serviceTypes: SERVICES[] = [
    SERVICES.SHOWER,
    SERVICES.LAUNDRY,
    SERVICES.MNGMT,
  ]
  const names = [
    'John Doe',
    'Jane Smith',
    'Alice Johnson',
    'Bob Brown',
    'Charlie Davis',
    'Diana Prince',
    'Ethan Hunt',
    'Felicity Smoak',
    'George Clooney',
    'Hannah Montana',
  ]
  const createdAt = new Date().toISOString()
  for (let i = 0; i < amount; i++) {
    const entry: BaseQueue = {
      type: serviceTypes[Math.floor(Math.random() * serviceTypes.length)],
      name: names[Math.floor(Math.random() * names.length)],
      uuid: `uuid-${i}-${Date.now()}`,
      createdAt,
    }
    data.push(entry)
  }
  return { data }
}
export const generateDataTableUuids = (): DataTableType & { uuid: string } => {
  // Added uuid to return type
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
  const genders = ['Male', 'Female', 'Other']
  const names = [
    'John Doe',
    'Jane Smith',
    'Alice Johnson',
    'Bob Brown',
    'Charlie Davis',
    'Diana Prince',
    'Ethan Hunt',
    'Felicity Smoak',
    'George Clooney',
    'Hannah Montana',
  ]

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

  const entry: DataTableType & { uuid: string } = {
    // Added uuid property
    uuid: uuidv4(), // Generate UUID
    name: names[Math.floor(Math.random() * names.length)], // Pick a random name from the list
    ethnicity: ethnicities[Math.floor(Math.random() * ethnicities.length)],
    gender: genders[Math.floor(Math.random() * genders.length)],
    ageGroup: ageGroups[Math.floor(Math.random() * ageGroups.length)],
    benefits: benefits,
    createAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  return entry // Return a single instance
}

export const handleTwo = async (uuid: string, servicesToUpdate: SERVICES[]) => {
  try {
    // 1. Fetch the current profile data
    const fetchResponse = await fetch(`/api/fetchProfile?uuid=${uuid}`)

    if (!fetchResponse.ok) {
      let errorPayload: any = {
        message: `HTTP error! status: ${fetchResponse.status}`,
      }
      let errorText = ''
      try {
        errorText = await fetchResponse.text()
        if (errorText) {
          errorPayload = JSON.parse(errorText) // Attempt to parse as JSON
        }
      } catch (parseError) {
        console.error(
          'Failed to parse fetch profile error response:',
          parseError
        )
        errorPayload.message =
          errorText || fetchResponse.statusText || errorPayload.message
      }
      console.error(
        'Error fetching profile:',
        fetchResponse.statusText,
        errorPayload
      )
      return
    }
    const initialData: DataTableType = await fetchResponse.json() // Assuming fetchProfile returns DataTableType
    const currentBenefits = initialData.benefits || [] // Ensure benefits array exists

    const benefitsMap = new Map<SERVICES, number>()
    currentBenefits.forEach((benefit) => {
      benefitsMap.set(benefit.name, benefit.value)
    })

    // 3. Update counts for the provided services
    servicesToUpdate.forEach((service) => {
      const currentValue = benefitsMap.get(service) || 0
      benefitsMap.set(service, currentValue + 1)
    })

    // 4. Convert the map back to the array format required by Firestore
    const updatedBenefits = Array.from(benefitsMap.entries()).map(
      ([name, value]) => ({ name, value })
    )

    // 5. Prepare the data payload for the PUT request
    const updateData = {
      benefits: updatedBenefits,
      updatedAt: new Date().toISOString(), // Also update the updatedAt timestamp
    }

    // 6. Send the PUT request to update the profile
    const updateResponse = await fetch(`/api/updateProfile?uuid=${uuid}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    })

    // --- Improved Response Handling ---
    if (!updateResponse.ok) {
      let errorPayload: any = {
        message: `HTTP error! status: ${updateResponse.status}`,
      }
      let errorText = ''
      try {
        errorText = await updateResponse.text()
        if (errorText) {
          errorPayload = JSON.parse(errorText) // Attempt to parse as JSON
        }
      } catch (parseError) {
        console.error(
          'Failed to parse update profile error response:',
          parseError
        )
        errorPayload.message =
          errorText || updateResponse.statusText || errorPayload.message
      }
      console.error(
        'Error updating profile:',
        updateResponse.statusText,
        errorPayload
      )
      return
    }

    // Handle successful response (status 2xx)
    let responseText = '' // Define outside try block
    try {
      responseText = await updateResponse.text() // Read response body as text first
      if (responseText) {
        const result = JSON.parse(responseText) // Attempt to parse as JSON
        console.log('Profile update successful:', result)
      } else {
        // Handle empty successful response (e.g., 204 No Content, or unexpected empty 200)
        console.log(
          'Profile update successful (empty response body). Status:',
          updateResponse.status
        )
      }
    } catch (parseError) {
      console.error('Failed to parse successful response as JSON:', parseError)
      // Log the raw text to see what was actually received
      console.error('Raw response text that failed parsing:', responseText)
    }
    // --- End of Improved Response Handling ---
  } catch (error) {
    console.error('Error in handleTwo function:', error)
  }
}
