import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth, AuthenticatedRequest } from '../utils/authMiddleware';
import { StateIISDataSource } from '../datasources/stateIISDataSource';
import { SmartOnFhirDataSource } from '../datasources/smartOnFhirDataSource';
import { PharmacyFhirDataSource } from '../datasources/pharmacyFhirDataSource';
import { normalizeImmunizations } from '@whitecloud/shared-utils';
import patientData from '../data/patient.json';
import { SmartHealthCardService } from '../services/SmartHealthCardService';
import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();
const router = Router();
const sources = {
  state_iis: new StateIISDataSource(),
  smart_on_fhir: new SmartOnFhirDataSource(),
  pharmacy: new PharmacyFhirDataSource(),
};
const shcService = new SmartHealthCardService();

router.get('/sources', requireAuth, async (req: AuthenticatedRequest, res) => {
  const connections = await prisma.dataSourceConnection.findMany({ where: { userId: req.user!.sub } });
  res.json(connections);
});

router.post('/sources/:id/connect', requireAuth, async (req: AuthenticatedRequest, res) => {
  const id = req.params.id as keyof typeof sources;
  const connection = sources[id];
  if (!connection) return res.status(404).json({ message: 'Unknown source' });
  await connection.connect(req.user!.sub);
  await prisma.dataSourceConnection.update({ where: { userId_type: { userId: req.user!.sub, type: id } }, data: { status: 'connected', demoMode: true } });
  res.json({ status: 'connected' });
});

router.post('/sync', requireAuth, async (req: AuthenticatedRequest, res) => {
  const all = await Promise.all(
    Object.values(sources).map((source) => source.fetchImmunizations(req.user!.sub))
  );
  const normalized = normalizeImmunizations(all.flat());
  await prisma.cachedImmunization.deleteMany({ where: { userId: req.user!.sub } });
  await prisma.cachedImmunization.createMany({
    data: normalized.map((record) => ({
      fhirId: record.id || randomUUID(),
      sourceType: 'demo',
      data: record,
      userId: req.user!.sub,
    })),
  });
  res.json({ count: normalized.length });
});

router.get('/immunizations', requireAuth, async (req: AuthenticatedRequest, res) => {
  const records = await prisma.cachedImmunization.findMany({ where: { userId: req.user!.sub } });
  res.json(records.map((r) => r.data));
});

router.post('/shc', requireAuth, async (req: AuthenticatedRequest, res) => {
  const records = await prisma.cachedImmunization.findMany({ where: { userId: req.user!.sub } });
  const bundle = shcService.buildBundle(patientData as any, records.map((r) => r.data as any));
  const jws = await shcService.signBundle(bundle);
  const numeric = shcService.jwsToShcNumeric(jws);
  fs.writeFileSync(path.join(process.cwd(), 'shc-latest.txt'), numeric);
  res.json({ jws, numeric });
});

router.get('/shc/:id/qr', requireAuth, async (_req: AuthenticatedRequest, res) => {
  const saved = path.join(process.cwd(), 'shc-latest.txt');
  const numeric = fs.existsSync(saved) ? fs.readFileSync(saved, 'utf-8') : 'shc:/';
  res.send(numeric);
});

export default router;
