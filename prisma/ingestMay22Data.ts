import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import { parse } from 'csv-parse';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting ingestion of May 22 data...');

  // 1. Wipe old data
  console.log('Wiping existing database records...');
  await prisma.chromatogramPeak.deleteMany();
  await prisma.metaboliteProfile.deleteMany();
  await prisma.timeSeriesData.deleteMany();
  await prisma.experiment.deleteMany();
  await prisma.strain.deleteMany();
  await prisma.cultureCondition.deleteMany();
  await prisma.sensorArray.deleteMany();
  await prisma.organism.deleteMany();

  // 2. Setup Base Metadata
  console.log('Creating base Organisms and Metadata...');
  
  // Pa (Pseudomonas aeruginosa)
  const orgPa = await prisma.organism.create({
    data: {
      genus: 'Pseudomonas',
      species: 'aeruginosa',
      gramStatus: 'Gram-negative',
      kingdom: 'Bacteria',
      clinicalRelevance: 'Wound, Bloodstream, Respiratory'
    }
  });

  // Control / Blank
  const orgControl = await prisma.organism.create({
    data: {
      genus: 'Baseline',
      species: 'Control',
      gramStatus: 'N/A',
      kingdom: 'N/A',
      clinicalRelevance: 'Negative Control'
    }
  });

  const condition = await prisma.cultureCondition.create({
    data: {
      mediaName: 'Tryptic Soy Broth',
      temperature: 37,
      oxygenCondition: 'Aerobic'
    }
  });

  const sensorArray = await prisma.sensorArray.create({
    data: {
      arrayVersion: 'Aim 3 Validation',
      sensorGeneration: 'LW-Series',
      qcStatus: 'Pass'
    }
  });

  // 3. Process CSV
  const csvFilePath = '/Users/ruotingyang/Documents/nao/multi-test/Source/May 22/normalized_master_long.csv';
  console.log(`Reading CSV from ${csvFilePath}...`);

  const parser = fs.createReadStream(csvFilePath).pipe(
    parse({
      columns: true,
      skip_empty_lines: true
    })
  );

  const strainMap = new Map<string, string>(); // sampleId -> strainId
  const expMap = new Map<string, string>(); // sampleId -> expId

  let batch: any[] = [];
  const BATCH_SIZE = 5000;
  let totalRows = 0;

  for await (const row of parser) {
    const sampleId = row['Sample'];
    const sampleClass = row['Class']; // e.g. "Control (-)" or "Pa 10^4"
    const elapsed = parseFloat(row['ElapsedHours']);
    const sensor = row['Sensor'];
    const rawVal = parseFloat(row['Raw_Unsmoothed']);
    const smoothedVal = parseFloat(row['Raw_Smoothed']);

    if (isNaN(rawVal)) continue;

    // Create Strain & Experiment lazily for each new Sample ID
    if (!expMap.has(sampleId)) {
      const isPa = sampleClass.includes('Pa');
      const strain = await prisma.strain.create({
        data: {
          organismId: isPa ? orgPa.id : orgControl.id,
          strainName: sampleClass,
          sourceType: 'Aim 3 Experiment',
          clinicalContext: 'Validation'
        }
      });
      
      const exp = await prisma.experiment.create({
        data: {
          isolateId: strain.id,
          conditionId: condition.id,
          arrayId: sensorArray.id,
          duration: 4320 // max 72 hrs approx
        }
      });

      strainMap.set(sampleId, strain.id);
      expMap.set(sampleId, exp.id);
    }

    const experimentId = expMap.get(sampleId)!;

    batch.push({
      experimentId,
      sensorId: sensor, // Keeps the native 'LW60' formatting
      time: Math.round(elapsed * 3600), // convert hours to seconds
      rawSignal: rawVal,
      normalizedSignal: isNaN(smoothedVal) ? rawVal : smoothedVal
    });

    if (batch.length >= BATCH_SIZE) {
      await prisma.timeSeriesData.createMany({ data: batch });
      totalRows += batch.length;
      console.log(`Inserted ${totalRows} time-series records...`);
      batch = [];
    }
  }

  // Insert remaining batch
  if (batch.length > 0) {
    await prisma.timeSeriesData.createMany({ data: batch });
    totalRows += batch.length;
    console.log(`Inserted ${totalRows} time-series records...`);
  }

  console.log('Data ingestion complete!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
