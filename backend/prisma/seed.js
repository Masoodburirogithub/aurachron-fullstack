const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@aurachronsys.com' },
    update: {},
    create: {
      email: 'admin@aurachronsys.com',
      password: adminPassword,
      role: 'admin'
    }
  });
  console.log('✅ Admin user created');

  // Create sample case studies
  const caseStudies = [
    {
      title: "Gulf Oil — Eliminated 85% of Safety Incident Reporting Time",
      industry: "Oil & Gas",
      technology: "AI Agents, RAG Pipeline",
      challenge: "500+ sites reporting safety incidents manually taking 4+ hours per incident, leading to delayed responses and incomplete data.",
      solution: "Developed an AI-powered safety reporting system with computer vision for automatic incident detection, RAG pipeline for regulatory compliance, and mobile-first app for field workers.",
      result: "85% reduction in reporting time (from 4 hours to 30 minutes). Real-time dashboards for HQ with live incident tracking.",
      imageUrl: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=800",
      displayOrder: 1,
      isActive: true
    },
    {
      title: "Real Estate AI — From Minutes to Seconds",
      industry: "PropTech",
      technology: "LLM Integration, RAG",
      challenge: "Proposal creation took 45 minutes per document with inconsistent quality and formatting issues across the team.",
      solution: "LLM-based proposal generation system that pulls client data, property details, and market analysis to create professional proposals.",
      result: "70% faster proposal turnaround (45 minutes → 15 seconds). 90% client satisfaction rate.",
      imageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800",
      displayOrder: 2,
      isActive: true
    }
  ];

  for (const study of caseStudies) {
    await prisma.caseStudy.upsert({
      where: { id: study.title },
      update: {},
      create: study
    });
  }
  console.log('✅ Sample case studies created');

  // Create sample career positions
  const positions = [
    {
      title: "Senior Full Stack Engineer",
      department: "Engineering",
      location: "Karachi (Hybrid)",
      type: "Full-time",
      experience: "5+ years",
      description: "We are looking for a Senior Full Stack Engineer to join our growing team...",
      requirements: ["React/Next.js", "Node.js", "PostgreSQL", "TypeScript"],
      isActive: true
    },
    {
      title: "AI/ML Engineer",
      department: "AI",
      location: "Karachi (Hybrid)",
      type: "Full-time",
      experience: "3+ years",
      description: "Join our AI team to build cutting-edge solutions...",
      requirements: ["Python", "TensorFlow/PyTorch", "LLMs", "RAG"],
      isActive: true
    }
  ];

  for (const position of positions) {
    await prisma.careerPosition.upsert({
      where: { id: position.title },
      update: {},
      create: position
    });
  }
  console.log('✅ Sample career positions created');

  console.log('🎉 Seeding completed!');
}

main()
  .catch(e => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });