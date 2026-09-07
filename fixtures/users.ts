/**
 * Seeded credentials from Docx Sec.2 — typed sign-in, all Demo2026! + 123456
 * New student matric is dynamic after TC-08 (Welcome2026! temp).
 */
export type Role = 'applicant' | 'student' | 'lecturer' | 'registrar' | 'bursar' | 'executive' | 'adaeze';

export interface UserCreds {
  role: Role;
  username: string;
  password: string;
  code: string;
  description: string;
}

function env(name: string, fallback: string) {
  return process.env[name] || fallback;
}

export const USERS: Record<Role, UserCreds> = {
  applicant: {
    role: 'applicant',
    username: env('APPLICANT_USER', 'applicant'),
    password: env('APPLICANT_PASS', 'Demo2026!'),
    code: env('APPLICANT_CODE', '123456'),
    description: 'Adaeze Chidinma Okonkwo (JAMB 202611234567AB) — 1st choice B.Sc. Computer Science',
  },
  student: {
    role: 'student',
    username: env('STUDENT_USER', 'DU/CSC/23/0001'),
    password: env('STUDENT_PASS', 'Demo2026!'),
    code: env('STUDENT_CODE', '123456'),
    description: 'Seeded student for pre-matriculation checks',
  },
  adaeze: {
    role: 'adaeze',
    username: env('ADAEZE_MATRIC', ''), // filled after TC-08
    password: 'Welcome2026!',
    code: env('NEW_STUDENT_CODE', '123456'),
    description: 'Adaeze after matriculation — first login with temp password',
  },
  lecturer: {
    role: 'lecturer',
    username: env('LECTURER_USER', 'lecturer'),
    password: env('LECTURER_PASS', 'Demo2026!'),
    code: env('LECTURER_CODE', '123456'),
    description: 'Dr. Chukwuemeka Nwosu (CSC101, CSC103)',
  },
  registrar: {
    role: 'registrar',
    username: env('REGISTRAR_USER', 'registrar'),
    password: env('REGISTRAR_PASS', 'Demo2026!'),
    code: env('REGISTRAR_CODE', '123456'),
    description: 'Registry — acts as HOD (Prof. Ngozi Eze) / Dean (Prof. Tunde Bakare) / Senate',
  },
  bursar: {
    role: 'bursar',
    username: env('BURSAR_USER', 'bursar'),
    password: env('BURSAR_PASS', 'Demo2026!'),
    code: env('BURSAR_CODE', '123456'),
    description: 'Bursary — payment approval queue',
  },
  executive: {
    role: 'executive',
    username: env('EXECUTIVE_USER', 'executive'),
    password: env('EXECUTIVE_PASS', 'Demo2026!'),
    code: env('EXECUTIVE_CODE', '123456'),
    description: 'Vice-Chancellor — Executive Oversight Portal',
  },
};

// Storage state paths per role (matches playwright.config.ts)
export const STORAGE_STATE: Record<string, string> = {
  applicant: '.auth/applicant.json',
  student: '.auth/student.json',
  registrar: '.auth/registrar.json',
  lecturer: '.auth/lecturer.json',
  bursar: '.auth/bursar.json',
  executive: '.auth/executive.json',
};
