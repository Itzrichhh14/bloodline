import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
async function main() {
  const ranks: Array<[string, string, number, string]> = [
    ["Recruit","recruit",0,"neutral"],["Member","member",100,"blue"],["Veteran","veteran",300,"violet"],["Elite","elite",600,"pink"],["Bloodline","bloodline",1000,"red"]
  ];
  for (const [name,slug,points,color] of ranks) await db.ranking.upsert({where:{slug},update:{points,color},create:{name,slug,points,color}});
}
main().finally(()=>db.$disconnect());
