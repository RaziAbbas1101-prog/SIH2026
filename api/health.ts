export default function handler(req: any, res: any) {
  res.status(200).json({
    status: 'ok',
    service: 'SevaSync AI',
    platform: 'Vercel Serverless',
    timestamp: new Date().toISOString()
  });
}
