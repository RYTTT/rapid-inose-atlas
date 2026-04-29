import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create Organisms
  const org1 = await prisma.organism.create({
    data: {
      genus: 'Achromobacter',
      species: 'xylosoxidans',
      gramStatus: 'Gram-negative',
      kingdom: 'Bacteria',
      clinicalRelevance: 'Wound, Bloodstream'
    }
  })

  const org2 = await prisma.organism.create({
    data: {
      genus: 'Staphylococcus',
      species: 'aureus',
      gramStatus: 'Gram-positive',
      kingdom: 'Bacteria',
      clinicalRelevance: 'Wound, Implant, Bloodstream'
    }
  })

  // Create Strains
  const strain1 = await prisma.strain.create({
    data: {
      organismId: org1.id,
      strainName: 'ATCC 27061',
      sourceType: 'ATCC Reference',
      clinicalContext: 'Standard'
    }
  })

  const strain2 = await prisma.strain.create({
    data: {
      organismId: org2.id,
      strainName: 'MRSA Clinical 01',
      sourceType: 'Wound Isolate',
      clinicalContext: 'Chronic Wound',
      amrStatus: 'MRSA'
    }
  })

  // Create Culture Condition
  const condition = await prisma.cultureCondition.create({
    data: {
      mediaName: 'LB Broth',
      temperature: 37,
      oxygenCondition: 'Aerobic'
    }
  })

  // Create Sensor Array
  const sensorArray = await prisma.sensorArray.create({
    data: {
      arrayVersion: '6-sensor feasibility',
      sensorGeneration: 'Gen-2',
      qcStatus: 'Pass'
    }
  })

  // Create Experiment
  const exp1 = await prisma.experiment.create({
    data: {
      isolateId: strain1.id,
      conditionId: condition.id,
      arrayId: sensorArray.id,
      duration: 1440
    }
  })

  // Create TimeSeriesData mock (6 sensors over 20 time points)
  for (let t = 0; t < 20; t++) {
    for (let s = 1; s <= 6; s++) {
      // Simulate typical sensor response curves
      // Some respond fast, some slow.
      const baseSignal = Math.log(t + 1) * (s * 0.5);
      const noise = Math.random() * 0.1;
      
      await prisma.timeSeriesData.create({
        data: {
          experimentId: exp1.id,
          sensorId: `NBF-S0${s}`,
          time: t * 60, // e.g. every 60 seconds
          rawSignal: 10 + baseSignal + noise,
          normalizedSignal: baseSignal + noise
        }
      })
    }
  }

  console.log('Database seeded successfully.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
