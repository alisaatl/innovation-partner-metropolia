import { 
  ProjectIdea, 
  Stakeholder, 
  SystemFactor, 
  CausalRelationship, 
  FeedbackLoop, 
  LeveragePoint, 
  SolutionAlternative, 
  AHPCriterion 
} from '../types/innovation';

export const DEMO_PROJECT_IDEA: ProjectIdea = {
  title: 'CleanBot Metropolia: Autonomous Off-Hours Campus Cleaning & Facility Operations',
  problemStatement: 'Metropolia campuses (Myllypuro, Karamalmi, Arabia, Myyrmäki) experience intense foot traffic across 120,000+ m² of classrooms and corridors. Night-shift manual cleaning suffers from chronic recruitment shortages, high physical strain, ergonomic injuries, and high labor costs, while daytime cleaning inevitably disrupts lectures and lab work. In addition, Finnish winter weather tracks abrasive gravel, street salt, and snow slush onto delicate terrazzo and linoleum floors.',
  proposedInnovation: 'An autonomous multi-task commercial floorcare robot (CleanBot Mark IV) operating strictly during off-hours (21:00–06:00) with zero on-site staff. It integrates 360° solid-state LiDAR SLAM, automated cyclonic debris pickup (empty coffee cups, paper waste, food scraps), counter-rotating micro-fiber scrubbers with on-the-fly aqueous ozone disinfection, and hands-free auto-docking stations for waste chute emptying, gray water discharge, and inductive recharging.',
  strategicGoals: [
    'Eliminate 100% of unsocial midnight manual cleaning shifts across targeted university wings.',
    'Guarantee 99%+ classroom readiness (Nordic INSTA 800 Level 5 standard) prior to 08:00 AM lectures.',
    'Conserve 85% of cleaning water and eliminate synthetic chemical detergents via closed-loop ozone sanitization.',
    'Establish an active live-lab robotics research platform for Metropolia engineering and health tech degree programs.'
  ],
  contextAndConstraints: 'Strict campus security lockouts between 21:00 and 06:00; noise budget capped under 50 dBA near quiet student residential units; multi-floor transit via automated elevator API; diverse flooring substrates from polished concrete to anti-static lab linoleum.',
  targetBeneficiaries: 'University facilities & janitorial staff (transitioning to daytime supervisory roles), 17,000+ students & staff (sanitized learning spaces), university sustainability committee, and municipal environmental auditors.',
  institution: 'Metropolia University of Applied Sciences (Helsinki, Espoo, Vantaa)',
  authorTeam: 'Smart Campus & Robotics Innovation Project Team (UAS Level)',
  lastUpdated: '2026-10-02',
  isDemoData: true
};

export const DEMO_STAKEHOLDERS: Stakeholder[] = [
  {
    id: 'st_1',
    name: 'Real Estate & Facilities Management Directorate',
    role: 'Primary Budget Holder & Campus Operations Owner',
    influence: 5,
    interest: 5,
    keyConcerns: '5-year Total Cost of Ownership (TCO), contractor service reliability, liability, and campus infrastructure compatibility.',
    customStrategy: 'Engage as project co-sponsor. Provide monthly ROI milestones, safety validation logs, and maintenance dashboards.'
  },
  {
    id: 'st_2',
    name: 'Night Janitorial & Cleaning Staff',
    role: 'Operational Workforce Impacted by Automation',
    influence: 3,
    interest: 5,
    keyConcerns: 'Job displacement fears, retraining opportunities, physical ergonomics, and usability of robot assist functions.',
    customStrategy: 'Consult actively from day one. Reposition roles as "Autonomous Fleet Operators" with daytime schedules, higher technical certifications, and zero night shift duty.'
  },
  {
    id: 'st_3',
    name: 'Campus Security & Access Control Services',
    role: 'Off-Hours Physical Security & Emergency Protocol',
    influence: 4,
    interest: 4,
    keyConcerns: 'PIR motion alarm triggers, electronic access doors, after-hours fire evacuation compliance, and robot tampering.',
    customStrategy: 'Integrate CleanBot telemetry directly into campus central security alarms. Establish geo-fenced safety stops and shared camera feeds.'
  },
  {
    id: 'st_4',
    name: 'Student Union METKA & Student Body',
    role: 'Primary Campus Space Users',
    influence: 2,
    interest: 4,
    keyConcerns: 'Classroom cleanliness at 08:00 AM, noise levels during late-night study sessions in 24/7 lounges, and campus sustainability.',
    customStrategy: 'Keep informed through transparent digital signage. Publicize eco-metrics (liters of water saved) and quiet hours acoustic compliance.'
  },
  {
    id: 'st_5',
    name: 'Metropolia UAS Executive Board & CFO',
    role: 'Strategic Institutional Governance',
    influence: 5,
    interest: 2,
    keyConcerns: 'Institutional ESG reputation, CapEx approval, public procurement rules, and campus innovation branding.',
    customStrategy: 'Keep satisfied with executive summaries on carbon offset, labor reallocation, and university leadership in smart building technology.'
  },
  {
    id: 'st_6',
    name: 'Occupational Health & Fire Safety Inspectorate',
    role: 'Regulatory & Life Safety Oversight',
    influence: 4,
    interest: 2,
    keyConcerns: 'LiFePO4 battery fire suppression, chemical-free ozone exposure limits, and unobstructed emergency egress routes.',
    customStrategy: 'Keep satisfied through proactive compliance dossiers, CE certifications, and fail-safe mechanical e-stop verification.'
  },
  {
    id: 'st_7',
    name: 'Academic Faculty & Degree Program Heads',
    role: 'Educators & Lab Supervisors',
    influence: 3,
    interest: 3,
    keyConcerns: 'Laboratory equipment safety, sensitive wiring preservation, and integration into student robotics coursework.',
    customStrategy: 'Partner to create applied student thesis topics, telemetry data APIs for IoT classes, and zero-interference lab guidelines.'
  },
  {
    id: 'st_8',
    name: 'Contract Cleaning Service Providers',
    role: 'Incumbent Commercial Vendors',
    influence: 2,
    interest: 2,
    keyConcerns: 'Scope reduction of outsourced manual cleaning contracts.',
    customStrategy: 'Monitor contract renewal milestones. Explore vendor maintenance agreements where vendors service the robotic hardware.'
  }
];

export const DEMO_SYSTEM_FACTORS: SystemFactor[] = [
  {
    id: 'f_staff_strain',
    name: 'Night Shift Strain & Turnover',
    category: 'human',
    description: 'Physical exhaustion, ergonomic injury rates, and unsocial hours driving facility employee burnout.',
    x: 120,
    y: 90
  },
  {
    id: 'f_clean_coverage',
    name: 'Off-Hours Autonomous Coverage',
    category: 'operational',
    description: 'Total square meters cleaned and mopped without human labor during the 21:00-06:00 window.',
    x: 400,
    y: 80
  },
  {
    id: 'f_clean_quality',
    name: 'Morning Cleanliness & Hygiene',
    category: 'operational',
    description: 'Surface cleanliness, sanitized desks, and spotless floors ready for 08:00 AM lecture starts.',
    x: 660,
    y: 110
  },
  {
    id: 'f_user_satisfaction',
    name: 'Campus User Satisfaction',
    category: 'human',
    description: 'Student and faculty perception of air quality, hygiene, and modern campus comfort.',
    x: 670,
    y: 280
  },
  {
    id: 'f_fleet_reliability',
    name: 'Robotics Fleet Reliability & SLAM Accuracy',
    category: 'technical',
    description: 'Mean time between navigation stalls, sensor cleanliness, and dock coupling success rate.',
    x: 400,
    y: 220
  },
  {
    id: 'f_winter_slush',
    name: 'Winter Slush & Abrasive Grit',
    category: 'environmental',
    description: 'Snow moisture, street de-icing salts, and gravel tracked indoors during Finnish winter months.',
    x: 640,
    y: 420
  },
  {
    id: 'f_opex',
    name: 'Campus Facility OpEx & Overtime Pay',
    category: 'economic',
    description: 'Recurring expenditure spent on night wage differentials, sick leaves, and replacement hiring.',
    x: 130,
    y: 270
  },
  {
    id: 'f_water_chemical',
    name: 'Water & Chemical Consumption',
    category: 'environmental',
    description: 'Liters of clean municipal water used and volume of synthetic floor cleaning chemical runoff.',
    x: 230,
    y: 410
  }
];

export const DEMO_CAUSAL_RELATIONSHIPS: CausalRelationship[] = [
  {
    id: 'rel_1',
    sourceId: 'f_clean_coverage',
    targetId: 'f_staff_strain',
    polarity: '-',
    description: 'As autonomous robot cleaning coverage increases, manual night-shift physical strain and unsocial hours decrease.'
  },
  {
    id: 'rel_2',
    sourceId: 'f_staff_strain',
    targetId: 'f_opex',
    polarity: '+',
    description: 'Higher employee strain and turnover directly increase night wage premiums, overtime costs, and recruiting expenses.'
  },
  {
    id: 'rel_3',
    sourceId: 'f_clean_coverage',
    targetId: 'f_clean_quality',
    polarity: '+',
    description: 'Consistent autonomous off-hours cleaning increases overall floor and classroom hygiene standard.'
  },
  {
    id: 'rel_4',
    sourceId: 'f_clean_quality',
    targetId: 'f_user_satisfaction',
    polarity: '+',
    description: 'Spotless morning classrooms and fresh air significantly improve student and lecturer satisfaction.'
  },
  {
    id: 'rel_5',
    sourceId: 'f_clean_coverage',
    targetId: 'f_fleet_reliability',
    polarity: '+',
    description: 'More operational hours and active mapping data help refine pathing algorithms and edge-case obstacle avoidance.',
    delay: true
  },
  {
    id: 'rel_6',
    sourceId: 'f_fleet_reliability',
    targetId: 'f_clean_coverage',
    polarity: '+',
    description: 'Higher robotic reliability directly enables broader autonomous deployment across multiple campus wings.'
  },
  {
    id: 'rel_7',
    sourceId: 'f_clean_coverage',
    targetId: 'f_winter_slush',
    polarity: '-',
    description: 'Regular night vacuuming and micro-fiber scrubbing lift abrasive street salt and slush before drying into floor damage.'
  },
  {
    id: 'rel_8',
    sourceId: 'f_clean_coverage',
    targetId: 'f_water_chemical',
    polarity: '-',
    description: 'Autonomous closed-loop micro-filtration and ozone generators reduce fresh water and synthetic chemical usage.'
  },
  {
    id: 'rel_9',
    sourceId: 'f_winter_slush',
    targetId: 'f_clean_quality',
    polarity: '-',
    description: 'Unchecked winter slush and street gravel degrade floor quality and leave slippery residue.'
  }
];

export const DEMO_FEEDBACK_LOOPS: FeedbackLoop[] = [
  {
    id: 'loop_r1',
    code: 'R1',
    name: 'Autonomous Capability & Learning Flywheel',
    type: 'reinforcing',
    factorIds: ['f_clean_coverage', 'f_fleet_reliability'],
    explanation: 'As CleanBot covers more campus area, the fleet accumulates real-world SLAM edge cases, optimizing docking and path planning. Improved reliability unlocks approval for further autonomous coverage.',
    systemImpact: 'Compound gains: Once threshold reliability (>98%) is reached, autonomous operating capability scales across all Metropolia campuses with minimal supervision.'
  },
  {
    id: 'loop_b1',
    code: 'B1',
    name: 'Winter Slush & Floor Wear Counteraction',
    type: 'balancing',
    factorIds: ['f_winter_slush', 'f_clean_quality', 'f_clean_coverage'],
    explanation: 'Seasonal winter slush degrades morning cleanliness; in response, autonomous off-hours scrubbing is intensified, neutralizing the salt and restoring quality to nominal target.',
    systemImpact: 'Stabilizing behavior: Prevents seasonal floor degradation and slipping accidents without demanding frantic manual overtime.'
  },
  {
    id: 'loop_r2',
    code: 'R2',
    name: 'Staff Relief & Operational Re-investment Cycle',
    type: 'reinforcing',
    factorIds: ['f_clean_coverage', 'f_staff_strain', 'f_opex'],
    explanation: 'Higher autonomous coverage reduces night-shift strain, cutting overtime differentials and recruitment churn. Saved OpEx budget can be reinvested into preventive fleet maintenance and staff robotics training.',
    systemImpact: 'Virtuous human & economic cycle: Transforms low-satisfaction night labor expenditure into high-value daytime campus facility management.'
  }
];

export const DEMO_LEVERAGE_POINTS: LeveragePoint[] = [
  {
    id: 'lp_1',
    meadowsLevel: 6,
    levelName: 'Level 6: Structure of Information Flows',
    factorId: 'f_clean_coverage',
    interventionTitle: 'Live Peppi / Tuudo Timetable Integration with Robot Dispatch',
    description: 'Directly interconnect the university room booking database (Peppi) and PIR room occupancy sensors with CleanBot’s dispatch queue, so the robot knows precisely when a classroom empties in real time.',
    whyItHasLeverage: 'Restructuring the information flow eliminates delays. Instead of relying on manual inspection or fixed guessing schedules, the system routes robots dynamically into empty classrooms as soon as the last student departs.',
    potentialResistance: 'IT security concerns regarding API access to campus scheduling databases and student privacy protections.',
    impactScore: 'transformative'
  },
  {
    id: 'lp_2',
    meadowsLevel: 5,
    levelName: 'Level 5: Rules of the System',
    factorId: 'f_staff_strain',
    interventionTitle: 'Elimination of Required Midnight Manual Shift Quotas',
    description: 'Formalize a university policy that transitions facility staff from physical night mopping to daytime "Robotics Fleet Supervisors & Quality Auditors".',
    whyItHasLeverage: 'Changing the foundational rule of the facility employment contract unlocks employee buy-in. When staff view CleanBot as a liberating tool that removes painful night shifts rather than a competitor, adoption friction collapses.',
    potentialResistance: 'Labor union questions regarding wage shift-differential compensations and role reclassification requirements.',
    impactScore: 'transformative'
  },
  {
    id: 'lp_3',
    meadowsLevel: 8,
    levelName: 'Level 8: Negative Feedback Loops (Control Mechanisms)',
    factorId: 'f_fleet_reliability',
    interventionTitle: 'Automated Tri-Dock Station with Self-Purge & Chute Dump',
    description: 'Implement automated docking bays with waste compactor chute coupling, gray water auto-drainage, and inductive charging couplers.',
    whyItHasLeverage: 'Strengthens the self-correcting autonomous loop. If a robot had to wait for a human to empty its bin every morning, the human bottleneck would severely limit system autonomy.',
    potentialResistance: 'Upfront plumbing and electrical modification costs for campus janitorial closets.',
    impactScore: 'high'
  },
  {
    id: 'lp_4',
    meadowsLevel: 3,
    levelName: 'Level 3: Goals of the System',
    factorId: 'f_clean_quality',
    interventionTitle: 'From "Aesthetic Sweep" to "Continuous Data-Driven Hygiene"',
    description: 'Shift the primary facility goal from "visibly tidy" to a verifiable digital index: INSTA 800 certified surface cleanliness, particulate matter monitoring, and verified allergen reduction.',
    whyItHasLeverage: 'Altering the system goal redirects all incentives. Facility management changes from a low-priority cost center into a high-visibility student health and institutional asset-protection driver.',
    potentialResistance: 'Inertia in traditional facilities contracts that rely on subjective visual inspections.',
    impactScore: 'high'
  }
];

export const DEMO_ALTERNATIVES: SolutionAlternative[] = [
  {
    id: 'alt_1',
    code: 'ALT-1',
    title: 'CleanBot Mark IV: Full Autonomous Off-Hours Fleet',
    tagline: 'Multi-task robotic vacuuming, scrubbing, and auto-docking with zero night staff',
    description: 'Custom-configured commercial autonomous mobile robots (AMRs) operating 21:00–06:00. Integrates solid-state LiDAR SLAM, automated trash pickup claw, aqueous ozone scrubbers, and hands-free docking stations.',
    keyStrengths: [
      'Zero night-shift human labor required; complete elimination of unsocial hours.',
      'Consistent 99%+ hygienic standardization (INSTA 800 Level 5).',
      '85% water reduction via closed-loop filtration; 100% chemical-free ozone.',
      'Serves as an ongoing pedagogical and research platform for UAS engineering students.'
    ],
    keyRisks: [
      'Higher initial CapEx hardware investment and dock installation.',
      'Requires reliable Wi-Fi 6 / IoT campus connectivity and elevator integration.',
      'Occasional edge-case obstacles (e.g., tangled power cables) require daytime intervention.'
    ],
    estimatedCost: '€42,000 CapEx (3 robots + 2 docks) · €350/mo maintenance [Simulated Data]',
    timeToDeploy: '3–4 months (fleet staging, building map calibration, staff training)',
    isDemoData: true
  },
  {
    id: 'alt_2',
    code: 'ALT-2',
    title: 'Outsourced Night Contractor Service',
    tagline: 'Expanding external commercial janitorial vendor contracts for midnight deep cleaning',
    description: 'Contracting an external facility management vendor to deploy human cleaning crews between 22:00 and 05:00 to perform manual trash collection and ride-on floor scrubbing.',
    keyStrengths: [
      'Zero upfront hardware CapEx; fully variable operational expenditure.',
      'Human cleaners can easily pick up arbitrary irregular objects, clear chairs, and navigate stairs.',
      'Established market service level agreements (SLAs).'
    ],
    keyRisks: [
      'High recurring OpEx with annual price escalations due to rising Finnish labor wage costs.',
      'High turnover rates leading to fluctuating cleaning quality and security key management issues.',
      'Zero pedagogical value or technical innovation footprint for the university.'
    ],
    estimatedCost: '€0 CapEx · €7,800/month recurring service contract (€93,600/year) [Simulated Data]',
    timeToDeploy: '1 month (procurement contract execution)',
    isDemoData: true
  },
  {
    id: 'alt_3',
    code: 'ALT-3',
    title: 'Hybrid Collaborative Cobot Carts (Daytime Assisted)',
    tagline: 'Equipping daytime cleaning staff with semi-autonomous motorized vacuum carts',
    description: 'Retaining day shifts and equipping cleaners with motorized cobot carts that follow the worker, vacuum hallways automatically, and provide ergonomic lift assists.',
    keyStrengths: [
      'Moderate CapEx and low mechanical complexity.',
      'Staff feel directly empowered by assistive technology without job disruption.',
      'Handles both open corridors and tight room corners flexibly.'
    ],
    keyRisks: [
      'Does not solve daytime lecture hall noise and corridor congestion disruptions.',
      'Cannot perform wet mopping while classes change without slip-and-fall hazards.',
      'Fails to achieve the strategic objective of fully autonomous off-hours campus turnaround.'
    ],
    estimatedCost: '€18,000 CapEx (motorized carts & cobot units) · €4,200/month labor [Simulated Data]',
    timeToDeploy: '2 months (equipment procurement & operational trials)',
    isDemoData: true
  }
];

export const DEMO_CRITERIA: AHPCriterion[] = [
  {
    id: 'c_hygiene',
    name: 'Campus Hygiene & Quality (INSTA 800)',
    description: 'Consistency, dust elimination, virus/bacteria sanitization, and readiness prior to 08:00 AM lectures.'
  },
  {
    id: 'c_ergonomics',
    name: 'Staff Ergonomics & Labor Well-being',
    description: 'Elimination of unsocial night work, reduction in repetitive strain injuries, and career role elevation.'
  },
  {
    id: 'c_tco',
    name: '5-Year Total Cost of Ownership (TCO)',
    description: 'CapEx hardware acquisition, installation, recurring maintenance, energy consumption, and labor offsets.'
  },
  {
    id: 'c_sustainability',
    name: 'Environmental Sustainability',
    description: 'Water conservation, chemical detergent elimination, energy efficiency, and municipal eco-certifications.'
  },
  {
    id: 'c_feasibility',
    name: 'Implementation Feasibility & Risk',
    description: 'Ease of deployment, infrastructure compatibility, safety compliance, and failure mode recovery.'
  }
];

// Pairwise comparisons for Criteria (a_ij)
// c_hygiene, c_ergonomics, c_tco, c_sustainability, c_feasibility
export const DEMO_CRITERIA_PAIRWISE: Record<string, Record<string, number>> = {
  c_hygiene: {
    c_hygiene: 1,
    c_ergonomics: 2,
    c_tco: 3,
    c_sustainability: 4,
    c_feasibility: 2
  },
  c_ergonomics: {
    c_hygiene: 0.5,
    c_ergonomics: 1,
    c_tco: 2,
    c_sustainability: 3,
    c_feasibility: 1
  },
  c_tco: {
    c_hygiene: 0.333,
    c_ergonomics: 0.5,
    c_tco: 1,
    c_sustainability: 2,
    c_feasibility: 0.5
  },
  c_sustainability: {
    c_hygiene: 0.25,
    c_ergonomics: 0.333,
    c_tco: 0.5,
    c_sustainability: 1,
    c_feasibility: 0.333
  },
  c_feasibility: {
    c_hygiene: 0.5,
    c_ergonomics: 1,
    c_tco: 2,
    c_sustainability: 3,
    c_feasibility: 1
  }
};

// Alternative comparisons for each criterion
export const DEMO_ALT_PAIRWISE: Record<string, Record<string, Record<string, number>>> = {
  c_hygiene: {
    alt_1: { alt_1: 1, alt_2: 3, alt_3: 9 },
    alt_2: { alt_1: 1 / 3, alt_2: 1, alt_3: 2 },
    alt_3: { alt_1: 1 / 9, alt_2: 0.5, alt_3: 1 }
  },
  c_ergonomics: {
    alt_1: { alt_1: 1, alt_2: 5, alt_3: 3 },
    alt_2: { alt_1: 0.2, alt_2: 1, alt_3: 1 / 3 },
    alt_3: { alt_1: 1 / 3, alt_2: 3, alt_3: 1 }
  },
  c_tco: {
    alt_1: { alt_1: 1, alt_2: 4, alt_3: 2 },
    alt_2: { alt_1: 0.25, alt_2: 1, alt_3: 0.5 },
    alt_3: { alt_1: 0.5, alt_2: 2, alt_3: 1 }
  },
  c_sustainability: {
    alt_1: { alt_1: 1, alt_2: 5, alt_3: 3 },
    alt_2: { alt_1: 0.2, alt_2: 1, alt_3: 1 / 3 },
    alt_3: { alt_1: 1 / 3, alt_2: 3, alt_3: 1 }
  },
  c_feasibility: {
    alt_1: { alt_1: 1, alt_2: 1 / 3, alt_3: 0.5 },
    alt_2: { alt_1: 3, alt_2: 1, alt_3: 2 },
    alt_3: { alt_1: 2, alt_2: 0.5, alt_3: 1 }
  }
};
