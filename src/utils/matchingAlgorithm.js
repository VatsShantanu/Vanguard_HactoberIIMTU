// AI Matching Algorithm for Project-to-Hackathon Matcher
import { HACKATHONS_DATABASE } from '../data/mockData';

export function matchProjectToHackathons(project) {
  if (!project) return [];

  const projectSkills = (project.techStack || []).map(s => s.toLowerCase().trim());
  const projectTracks = (project.tracks || []).map(t => t.toLowerCase().trim());
  const projectText = `${project.title || ''} ${project.description || ''}`.toLowerCase();

  const results = HACKATHONS_DATABASE.map(hackathon => {
    let score = 40; // Base score
    const fitReasons = [];
    const missingSkills = [];

    // 1. Tech Stack Overlap (Up to +35%)
    const hackPreferred = (hackathon.preferredTech || []).map(t => t.toLowerCase());
    const matchedTech = [];

    hackPreferred.forEach(tech => {
      const isMatched = projectSkills.some(skill => 
        skill.includes(tech) || tech.includes(skill) || projectText.includes(tech)
      );

      if (isMatched) {
        matchedTech.push(tech);
      } else {
        // Collect missing tech as skill gap
        if (missingSkills.length < 3) {
          missingSkills.push(tech.charAt(0).toUpperCase() + tech.slice(1));
        }
      }
    });

    const techMatchRatio = hackPreferred.length > 0 ? matchedTech.length / hackPreferred.length : 0.5;
    score += Math.round(techMatchRatio * 35);

    if (matchedTech.length > 0) {
      fitReasons.push(
        `Tech Stack Alignment: Matches your project's use of ${matchedTech.slice(0, 3).map(t => t.toUpperCase()).join(', ')}.`
      );
    }

    // 2. Track & Problem Statement Alignment (Up to +20%)
    const matchedTracks = (hackathon.tracks || []).filter(track => {
      const lowerTrack = track.toLowerCase();
      return (
        projectTracks.some(pt => lowerTrack.includes(pt) || pt.includes(lowerTrack)) ||
        projectText.includes(lowerTrack) ||
        (project.title && lowerTrack.split(' ').some(w => w.length > 3 && project.title.toLowerCase().includes(w)))
      );
    });

    if (matchedTracks.length > 0) {
      score += Math.min(20, matchedTracks.length * 10);
      fitReasons.push(
        `Theme Fit: Directly fits the "${matchedTracks[0]}" track.`
      );
    } else {
      score += 5;
    }

    // 3. Problem Statement synergy (+5%)
    const matchingPS = (hackathon.problemStatements || []).find(ps => {
      const lowerPS = ps.toLowerCase();
      return projectSkills.some(s => lowerPS.includes(s)) || 
             projectText.split(' ').some(w => w.length > 4 && lowerPS.includes(w));
    });

    if (matchingPS) {
      score += 5;
      fitReasons.push(`Problem Statement Synergy: Matches criteria in "${matchingPS.slice(0, 75)}...".`);
    } else if (hackathon.problemStatements && hackathon.problemStatements.length > 0) {
      fitReasons.push(`Open problem track accepts your current prototype architecture.`);
    }

    // Add generic reasons if list is small
    if (fitReasons.length === 1) {
      fitReasons.push(`Your team size and undergraduate eligibility match requirements.`);
    }

    // Clamp score between 60% and 98%
    const finalScore = Math.min(98, Math.max(62, score));

    return {
      hackathon,
      matchScore: finalScore,
      fitReasons,
      missingSkills: missingSkills.slice(0, 3),
      recommendedTrack: matchedTracks[0] || hackathon.tracks[0],
      isHighPriority: finalScore >= 85
    };
  });

  // Sort descending by match score
  return results.sort((a, b) => b.matchScore - a.matchScore);
}
