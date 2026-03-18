// lib/scoring/career-matching.ts
import type { SkillProfile } from "@/types/career";

export interface CareerDomainProfile {
  domain: string;
  requiredSkills: string[];
  preferredTools: string[];
  relatedConcepts: string[];
}

// Career domain definitions
const CAREER_DOMAINS: CareerDomainProfile[] = [
  {
    domain: "Software Engineering",
    requiredSkills: ["Programming", "Data Structures", "Algorithms", "Software Design"],
    preferredTools: ["Python", "Java", "C++", "JavaScript", "Git"],
    relatedConcepts: ["Object-Oriented Programming", "Design Patterns", "Testing"],
  },
  {
    domain: "Data Science",
    requiredSkills: ["Statistics", "Machine Learning", "Data Analysis", "Python"],
    preferredTools: ["Python", "R", "SQL", "TensorFlow", "Pandas"],
    relatedConcepts: ["Linear Algebra", "Probability", "Data Visualization"],
  },
  {
    domain: "Web Development",
    requiredSkills: ["JavaScript", "HTML/CSS", "Web APIs", "Databases"],
    preferredTools: ["React", "Node.js", "PostgreSQL", "TypeScript"],
    relatedConcepts: ["Frontend Development", "Backend Development", "Deployment"],
  },
  {
    domain: "DevOps / Cloud",
    requiredSkills: ["Linux", "Networking", "Containerization", "Cloud Platforms"],
    preferredTools: ["Docker", "Kubernetes", "AWS", "Linux", "Terraform"],
    relatedConcepts: ["Infrastructure as Code", "CI/CD", "Monitoring"],
  },
  {
    domain: "Machine Learning",
    requiredSkills: ["Machine Learning", "Mathematics", "Python", "Statistics"],
    preferredTools: ["Python", "TensorFlow", "PyTorch", "scikit-learn"],
    relatedConcepts: ["Neural Networks", "NLP", "Computer Vision"],
  },
  {
    domain: "Cybersecurity",
    requiredSkills: ["Security", "Networking", "Cryptography", "Systems"],
    preferredTools: ["Linux", "Networking Tools", "Security Tools"],
    relatedConcepts: ["Encryption", "Penetration Testing", "Compliance"],
  },
];

export function calculateCareerFitScore(
  skillProfile: SkillProfile,
  domainProfile: CareerDomainProfile
): number {
  const allSkills = [
    ...skillProfile.coreSkills,
    ...skillProfile.tools,
    ...skillProfile.concepts,
  ];

  let matchCount = 0;
  const requiredCount = domainProfile.requiredSkills.length;

  for (const required of domainProfile.requiredSkills) {
    if (
      allSkills.some(
        (skill) =>
          skill.toLowerCase().includes(required.toLowerCase()) ||
          required.toLowerCase().includes(skill.toLowerCase())
      )
    ) {
      matchCount++;
    }
  }

  // Base score is required skills match
  let score = matchCount / requiredCount;

  // Bonus for preferred tools
  for (const tool of domainProfile.preferredTools) {
    if (
      skillProfile.tools.some(
        (t) =>
          t.toLowerCase().includes(tool.toLowerCase()) ||
          tool.toLowerCase().includes(t.toLowerCase())
      )
    ) {
      score += 0.05;
    }
  }

  return Math.min(score, 1.0);
}

export function getTopDomains(skillProfile: SkillProfile, limit: number = 5) {
  const scores = CAREER_DOMAINS.map((domain) => ({
    ...domain,
    fitScore: calculateCareerFitScore(skillProfile, domain),
  }));

  return scores.sort((a, b) => b.fitScore - a.fitScore).slice(0, limit);
}

export function matchTargetDomain(
  skillProfile: SkillProfile,
  targetDomain: string
): CareerDomainProfile | null {
  return (
    CAREER_DOMAINS.find(
      (d) =>
        d.domain.toLowerCase() === targetDomain.toLowerCase() ||
        d.domain.toLowerCase().includes(targetDomain.toLowerCase())
    ) || null
  );
}
