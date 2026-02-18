



export const revenueBars = [65, 45, 80, 55, 92, 70, 88, 60, 75, 50, 84, 66];
export const alerts = [
    {
      titleKey: "dashboard.quickAlerts.monthlyExpiring.title",
      descriptionKey: "dashboard.quickAlerts.monthlyExpiring.description",
      tone: "amber",
    },
    {
      titleKey: "dashboard.quickAlerts.ptRemaining.title",
      descriptionKey: "dashboard.quickAlerts.ptRemaining.description",
      tone: "rose",
    },
    {
      titleKey: "dashboard.quickAlerts.branchPeak.title",
      descriptionKey: "dashboard.quickAlerts.branchPeak.description",
      tone: "sky",
    },
  ];

export const expiringMembers = [
    { name: "سارة أحمد", planKey: "plans.monthly", days: 2 },
    { name: "محمد كمال", planKey: "plans.quarterly", days: 4 },
    { name: "هاني يوسف", planKey: "plans.yearly", days: 6 },
    { name: "مروان عمر", planKey: "plans.special", days: 7 },
  ];
export const checkins = [
    { name: "ريم خالد", time: "08:45 AM", statusKey: "attendance.status.checkedIn" },
    { name: "ياسين طارق", time: "09:10 AM", statusKey: "attendance.status.checkedIn" },
    { name: "نور سمير", time: "09:22 AM", statusKey: "attendance.status.blocked" },
    { name: "علي هشام", time: "10:05 AM", statusKey: "attendance.status.checkedOut" },
  ];
export const membersList = [
  {
    id: "1e7a1a2f-1111-4a2b-8c1a-111111111111",
    gymId: "gym-001",
    role:"admin",
    branchId: "branch-001",
    fullName: "أمينة حسين",
    phone: "01012345678",
    email: "amina.hussein@example.com",
    barcode: "MEM-0001",
    photoUrl: "",
    idNumber: "29801011234567",
    dateOfBirth: "1998-01-01",
    gender: "female", // EnumGender
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2e7a1a2f-2222-4a2b-8c1a-222222222222",
    gymId: "gym-001",
    role:"coach",
    branchId: "branch-001",
    fullName: "سامح رأفت",
    phone: "01123456789",
    email: "sameh.raafat@example.com",
    barcode: "MEM-0002",
    photoUrl: "",
    idNumber: "29505051234567",
    dateOfBirth: "1995-05-05",
    gender: "male",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "3e7a1a2f-3333-4a2b-8c1a-333333333333",
    gymId: "gym-001",
    role:"member",
    branchId: "branch-002",
    fullName: "نادين علاء",
    phone: "01234567890",
    email: "nadine.alaa@example.com",
    barcode: "MEM-0003",
    photoUrl: "",
    idNumber: "30007071234567",
    dateOfBirth: "2000-07-07",
    gender: "female",
    isActive: false, // كانت expired
    createdAt: new Date().toISOString(),
  },
  {
    id: "4e7a1a2f-4444-4a2b-8c1a-444444444444",
    gymId: "gym-001",
    role:"member",
    branchId: "branch-002",
    fullName: "حسن السيد",
    phone: "01512345678",
    email: "hassan.elsayed@example.com",
    barcode: "MEM-0004",
    photoUrl: "",
    idNumber: "29203031234567",
    dateOfBirth: "1992-03-03",
    gender: "male",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

export const coachesList = [
  {
    id: "9f2d5a61-1111-4f2a-9b2f-111111111111",
    userId: "5c1c1a2f-1111-4a2b-8c1a-111111111111",
    gymId: "gym-001",
    specialty: "Strength & Conditioning",
    bio: "Certified strength coach focused on safe progressive overload and mobility.",
    commissionRate: 15,
    isActive: true,
  },
  {
    id: "9f2d5a61-2222-4f2a-9b2f-222222222222",
    userId: "5c1c1a2f-2222-4a2b-8c1a-222222222222",
    gymId: "gym-001",
    specialty: "Weight Loss",
    bio: "Nutrition-friendly training plans and sustainable fat loss routines.",
    commissionRate: 12.5,
    isActive: true,
  },
  {
    id: "9f2d5a61-3333-4f2a-9b2f-333333333333",
    userId: "5c1c1a2f-3333-4a2b-8c1a-333333333333",
    gymId: "gym-001",
    specialty: "Rehab & Mobility",
    bio: "Post-injury training, movement screening, and mobility programs.",
    commissionRate: 10,
    isActive: false,
  },
];

export const subscriptionPlans = [
    {
      id:"plan-001",
      gymId: "gym-001",
      name: "Monthly Unlimited",
      durationDays: 30,
      price: 450,
      description: "Unlimited access to all gym facilities for one month.",
      isActive: true,
    },
    {
      id:"plan-002",
      gymId: "gym-001",
      name: "Weekly Unlimited",
      durationDays: 7,
      price: 150,
      description: "Unlimited access to all gym facilities for one week.",
      isActive: true,
    },
    {
      id:"plan-003",
      gymId: "gym-001",
      name: "Quarterly Unlimited",
      durationDays: 90,
      price: 1200,
      description: "Unlimited access to all gym facilities for three months.",
      isActive: true,
    },
    {
      id:"plan-004",
      gymId: "gym-001",
      name: "Yearly Unlimited",
      durationDays: 365,
      price: 4200,
      description: "Unlimited access to all gym facilities for one year.",
      isActive: true,
    },
    {
      id:"plan-005",
      gymId: "gym-001",
      name: "Quarterly Unlimited",
      durationDays: 90,
      price: 1200,
      description: "Unlimited access to all gym facilities for three months.",
      isActive: true,
    }
  ];
export const invoices = [
    { id: "INV-2041", member: "ليلى سالم", amount: "450 EGP", methodKey: "payments.methods.cash" },
    { id: "INV-2042", member: "كريم مجدي", amount: "1,200 EGP", methodKey: "payments.methods.visa" },
    { id: "INV-2043", member: "سمر فؤاد", amount: "4,200 EGP", methodKey: "payments.methods.transfer" },
    { id: "INV-2044", member: "روان حسن", amount: "150 EGP", methodKey: "payments.methods.cash" },
  ];
export const reports = [
    {
      titleKey: "reports.items.attendance.title",
      descriptionKey: "reports.items.attendance.description",
    },
    {
      titleKey: "reports.items.subscriptions.title",
      descriptionKey: "reports.items.subscriptions.description",
    },
    {
      titleKey: "reports.items.revenue.title",
      descriptionKey: "reports.items.revenue.description",
    },
    {
      titleKey: "reports.items.trainers.title",
      descriptionKey: "reports.items.trainers.description",
    },
  ];
export const permissions = [
    { actionKey: "permissions.actions.addMember", admin: true, staff: true, trainer: false },
    { actionKey: "permissions.actions.viewAllMembers", admin: true, staff: false, trainer: false },
    { actionKey: "permissions.actions.barcodeAttendance", admin: true, staff: true, trainer: false },
    { actionKey: "permissions.actions.seeOwnClients", admin: false, staff: false, trainer: true },
    { actionKey: "permissions.actions.logTrainingSession", admin: false, staff: false, trainer: true },
    { actionKey: "permissions.actions.financialReports", admin: true, staff: false, trainer: false },
    { actionKey: "permissions.actions.addNotes", admin: false, staff: false, trainer: true },
  ];
export const trainerClients = [
    { name: "أحمد عادل", focusKey: "trainer.goals.cutting", sessions: 6 },
    { name: "جمال شريف", focusKey: "trainer.goals.bulking", sessions: 2 },
    { name: "آية سالم", focusKey: "trainer.goals.fitness", sessions: 8 },
  ];
export const sessionLog = [
    { name: "أحمد عادل", dateKey: "time.today", noteKey: "trainer.sessionLog.resistanceLogged" },
    { name: "آية سالم", dateKey: "time.yesterday", noteKey: "trainer.sessionLog.weightUpdated" },
    { name: "جمال شريف", dateKey: "time.daysAgo", dateValue: 2, noteKey: "trainer.sessionLog.sessionCanceled" },
  ];

  export const attendanceList = [
  {
    id: "a1f0c9e1-1111-4b1a-9c11-aaaaaaaaaaaa",
    gymId: "gym-001",
    branchId: "branch-001",
    memberId: "1e7a1a2f-1111-4a2b-8c1a-111111111111",
    scannedBy: "staff-001",
    checkIn: "2026-02-14T15:00:00.000Z",
    checkOut: "2026-02-14T16:30:00.000Z",
    deviceId: "GATE-01",
    createdAt: "2026-02-14T15:00:00.000Z",
  },
  {
    id: "b2f0c9e1-2222-4b1a-9c11-bbbbbbbbbbbb",
    gymId: "gym-001",
    branchId: "branch-001",
    memberId: "2e7a1a2f-2222-4a2b-8c1a-222222222222",
    scannedBy: "staff-002",
    checkIn: "2026-02-14T17:10:00.000Z",
    checkOut: null, // لسه جوه الجيم
    deviceId: "GATE-02",
    createdAt: "2026-02-14T17:10:00.000Z",
  },
  {
    id: "c3f0c9e1-3333-4b1a-9c11-cccccccccccc",
    gymId: "gym-001",
    branchId: "branch-002",
    memberId: "3e7a1a2f-3333-4a2b-8c1a-333333333333",
    scannedBy: "staff-001",
    checkIn: "2026-02-12T18:00:00.000Z",
    checkOut: "2026-02-12T19:15:00.000Z",
    deviceId: "GATE-01",
    createdAt: "2026-02-12T18:00:00.000Z",
  },
  {
    id: "d4f0c9e1-4444-4b1a-9c11-dddddddddddd",
    gymId: "gym-001",
    branchId: "branch-002",
    memberId: "4e7a1a2f-4444-4a2b-8c1a-444444444444",
    scannedBy: "staff-003",
    checkIn: "2026-02-13T20:00:00.000Z",
    checkOut: "2026-02-13T21:10:00.000Z",
    deviceId: "GATE-03",
    createdAt: "2026-02-13T20:00:00.000Z",
  },
];
