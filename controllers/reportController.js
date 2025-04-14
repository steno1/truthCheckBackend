import Report from '../models/Report.js';

export const reportClaim = async (req, res) => {
  const { claim, reason } = req.body;
  if (!claim) return res.status(400).json({ error: 'Claim is required' });

  const report = await Report.create({ claim, reason });
  res.status(201).json(report);
};
