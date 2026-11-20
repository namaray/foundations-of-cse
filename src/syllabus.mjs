// The course map for the whole site.
// Each course is a folder under src/content/docs/<slug>/.
// Add a topic note by creating a new .md/.mdx file inside that folder;
// it appears in the sidebar automatically.

export const syllabus = [
	{
		label: 'Mathematics',
		courses: [
			{ slug: 'discrete-mathematics', title: 'Discrete Mathematics' },
			{ slug: 'calculus-and-differential-equations', title: 'Calculus & Differential Equations' },
			{ slug: 'linear-algebra', title: 'Linear Algebra' },
			{ slug: 'probability-and-statistics', title: 'Probability & Statistics' },
			{ slug: 'numerical-methods', title: 'Numerical Methods' },
		],
	},
	{
		label: 'Programming',
		courses: [
			{ slug: 'structured-programming', title: 'Structured Programming (C)' },
			{ slug: 'object-oriented-programming', title: 'Object-Oriented Programming' },
		],
	},
	{
		label: 'Data Structures & Algorithms',
		courses: [
			{ slug: 'data-structures', title: 'Data Structures' },
			{ slug: 'algorithms', title: 'Algorithms' },
		],
	},
	{
		label: 'Theory of Computing',
		courses: [
			{ slug: 'theory-of-computation', title: 'Theory of Computation' },
			{ slug: 'compiler-design', title: 'Compiler Design' },
		],
	},
	{
		label: 'Hardware & Architecture',
		courses: [
			{ slug: 'electrical-circuits-and-electronics', title: 'Electrical Circuits & Electronics' },
			{ slug: 'digital-logic-design', title: 'Digital Logic Design' },
			{ slug: 'computer-architecture', title: 'Computer Architecture' },
			{ slug: 'microprocessors', title: 'Microprocessors & Interfacing' },
		],
	},
	{
		label: 'Systems',
		courses: [
			{ slug: 'operating-systems', title: 'Operating Systems' },
			{ slug: 'computer-networks', title: 'Computer Networks' },
			{ slug: 'database-systems', title: 'Database Systems' },
		],
	},
	{
		label: 'Software & Applications',
		courses: [
			{ slug: 'software-engineering', title: 'Software Engineering' },
			{ slug: 'artificial-intelligence', title: 'Artificial Intelligence' },
			{ slug: 'machine-learning', title: 'Machine Learning' },
			{ slug: 'computer-graphics', title: 'Computer Graphics' },
			{ slug: 'information-security', title: 'Cryptography & Security' },
		],
	},
	{
		label: 'Exam & Interview Prep',
		courses: [{ slug: 'exam-prep', title: 'Exam & Interview Prep' }],
	},
];
